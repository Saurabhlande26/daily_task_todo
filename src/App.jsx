import { useEffect, useMemo, useRef, useState } from 'react'
import {
  DEFAULT_SETTINGS,
  INITIAL_DATA,
  INITIAL_TIMER,
  STORAGE_KEY,
  THEME_KEY,
  TIMER_KEY,
} from './constants.js'
import { useLocalStorage } from './hooks/useLocalStorage.js'
import { getWeekKeys, shiftDateKey, taskAppearsOnDate, toDateKey } from './utils/date.js'
import DateNavigator from './components/DateNavigator.jsx'
import Header from './components/Header.jsx'
import QuickAdd from './components/QuickAdd.jsx'
import RecentSessions from './components/RecentSessions.jsx'
import StatsGrid from './components/StatsGrid.jsx'
import TaskList from './components/TaskList.jsx'
import TaskModal from './components/TaskModal.jsx'
import TemplatesPanel from './components/TemplatesPanel.jsx'
import TimerPanel from './components/TimerPanel.jsx'
import WeeklyInsights from './components/WeeklyInsights.jsx'

function createId(prefix) {
  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`
}

function normalizeTask(task) {
  return {
    repeatDays: [],
    pinned: false,
    notes: '',
    priority: 'medium',
    ...task,
    targetMinutes: Math.max(1, Number(task?.targetMinutes || 1)),
  }
}

function normalizeData(value) {
  if (!value || typeof value !== 'object') return INITIAL_DATA
  return {
    tasks: Array.isArray(value.tasks) ? value.tasks.map(normalizeTask) : [],
    dayRecords: value.dayRecords && typeof value.dayRecords === 'object' ? value.dayRecords : {},
    sessions: Array.isArray(value.sessions) ? value.sessions : [],
    settings: { ...DEFAULT_SETTINGS, ...(value.settings || {}) },
  }
}

function normalizeTimer(value) {
  if (!value || typeof value !== 'object') return INITIAL_TIMER
  return {
    ...INITIAL_TIMER,
    ...value,
    elapsedSeconds: Math.max(0, Number(value.elapsedSeconds || 0)),
    goalMinutes: Math.max(1, Number(value.goalMinutes || 25)),
  }
}

function getElapsedSeconds(timer, now = Date.now()) {
  if (!timer.running || !timer.startedAt) return Math.max(0, Number(timer.elapsedSeconds || 0))
  return Math.max(0, Number(timer.elapsedSeconds || 0) + Math.floor((now - timer.startedAt) / 1000))
}

function calculateStreak(tasks, dayRecords) {
  const isPerfectDay = (dateKey) => {
    const dayTasks = tasks.filter((task) => taskAppearsOnDate(task, dateKey))
    if (!dayTasks.length) return false
    const records = dayRecords[dateKey] || {}
    return dayTasks.every((task) => records[task.id]?.completed)
  }

  let current = 0
  let cursor = toDateKey()
  if (!isPerfectDay(cursor)) cursor = shiftDateKey(cursor, -1)
  while (current < 365 && isPerfectDay(cursor)) {
    current += 1
    cursor = shiftDateKey(cursor, -1)
  }

  let best = 0
  let running = 0
  const start = shiftDateKey(toDateKey(), -119)
  for (let index = 0; index < 120; index += 1) {
    const key = shiftDateKey(start, index)
    if (isPerfectDay(key)) {
      running += 1
      best = Math.max(best, running)
    } else {
      running = 0
    }
  }

  return { current, best }
}

export default function App() {
  const [data, setData] = useLocalStorage(STORAGE_KEY, INITIAL_DATA)
  const [theme, setTheme] = useLocalStorage(THEME_KEY, 'dark')
  const [timer, setTimer] = useLocalStorage(TIMER_KEY, INITIAL_TIMER)
  const [selectedDate, setSelectedDate] = useState(toDateKey())
  const [filters, setFilters] = useState({ search: '', category: 'all', status: 'all', sort: 'smart' })
  const [modal, setModal] = useState({ open: false, task: null })
  const [toast, setToast] = useState('')
  const [clockTick, setClockTick] = useState(Date.now())
  const toastTimeout = useRef(null)

  const safeData = useMemo(() => normalizeData(data), [data])
  const safeTimer = useMemo(() => normalizeTimer(timer), [timer])
  const elapsedSeconds = getElapsedSeconds(safeTimer, clockTick)

  useEffect(() => {
    document.documentElement.dataset.theme = theme
  }, [theme])

  useEffect(() => {
    if (!safeTimer.running) return undefined
    const id = window.setInterval(() => setClockTick(Date.now()), 1000)
    return () => window.clearInterval(id)
  }, [safeTimer.running])

  useEffect(() => {
    const handleShortcut = (event) => {
      const tag = event.target?.tagName?.toLowerCase()
      if (['input', 'textarea', 'select'].includes(tag) || event.metaKey || event.ctrlKey || event.altKey) return
      if (event.key.toLowerCase() === 'n') {
        event.preventDefault()
        setModal({ open: true, task: null })
      }
      if (event.key === '/') {
        event.preventDefault()
        document.getElementById('quick-task-input')?.focus()
      }
    }
    window.addEventListener('keydown', handleShortcut)
    return () => window.removeEventListener('keydown', handleShortcut)
  }, [])

  const dayTasks = useMemo(
    () => safeData.tasks.filter((task) => taskAppearsOnDate(task, selectedDate)),
    [safeData.tasks, selectedDate],
  )
  const dayRecords = safeData.dayRecords[selectedDate] || {}
  const focusTasks = useMemo(() => {
    const selectedTask = safeData.tasks.find((task) => task.id === safeTimer.taskId)
    if (!selectedTask || dayTasks.some((task) => task.id === selectedTask.id)) return dayTasks
    return [selectedTask, ...dayTasks]
  }, [dayTasks, safeData.tasks, safeTimer.taskId])

  const visibleTasks = useMemo(() => {
    const query = filters.search.trim().toLowerCase()
    const priorityOrder = { high: 0, medium: 1, low: 2 }

    return dayTasks
      .filter((task) => filters.category === 'all' || task.category === filters.category)
      .filter((task) => {
        const completed = Boolean(dayRecords[task.id]?.completed)
        if (filters.status === 'complete') return completed
        if (filters.status === 'open') return !completed
        return true
      })
      .filter((task) => !query || `${task.title} ${task.notes} ${task.category}`.toLowerCase().includes(query))
      .sort((a, b) => {
        const completedA = Boolean(dayRecords[a.id]?.completed)
        const completedB = Boolean(dayRecords[b.id]?.completed)
        const pinSort = Number(Boolean(b.pinned)) - Number(Boolean(a.pinned))
        const completionSort = Number(completedA) - Number(completedB)
        const timeSort = (a.scheduledTime || '99:99').localeCompare(b.scheduledTime || '99:99')
        const prioritySort = priorityOrder[a.priority] - priorityOrder[b.priority]
        const progressA = (dayRecords[a.id]?.actualMinutes || 0) / Math.max(1, a.targetMinutes)
        const progressB = (dayRecords[b.id]?.actualMinutes || 0) / Math.max(1, b.targetMinutes)

        if (filters.sort === 'time') return pinSort || timeSort || prioritySort
        if (filters.sort === 'priority') return pinSort || prioritySort || timeSort
        if (filters.sort === 'progress') return pinSort || progressB - progressA || timeSort
        return pinSort || completionSort || timeSort || prioritySort || a.createdAt - b.createdAt
      })
  }, [dayTasks, dayRecords, filters])

  const stats = useMemo(() => {
    const completed = dayTasks.filter((task) => dayRecords[task.id]?.completed).length
    const actualMinutes = dayTasks.reduce((sum, task) => sum + Number(dayRecords[task.id]?.actualMinutes || 0), 0)
    const plannedMinutes = dayTasks.reduce((sum, task) => sum + Number(task.targetMinutes || 0), 0)
    const categoryMinutes = (category) => dayTasks
      .filter((task) => task.category === category)
      .reduce((sum, task) => sum + Number(dayRecords[task.id]?.actualMinutes || 0), 0)

    return {
      completed,
      total: dayTasks.length,
      progress: dayTasks.length ? Math.round((completed / dayTasks.length) * 100) : 0,
      actualMinutes,
      plannedMinutes,
      studyMinutes: categoryMinutes('Study'),
      workoutMinutes: categoryMinutes('Workout'),
    }
  }, [dayTasks, dayRecords])

  const streak = useMemo(
    () => calculateStreak(safeData.tasks, safeData.dayRecords),
    [safeData.tasks, safeData.dayRecords],
  )

  const weeklyDays = useMemo(() => getWeekKeys(selectedDate).map((key) => {
    const tasks = safeData.tasks.filter((task) => taskAppearsOnDate(task, key))
    const records = safeData.dayRecords[key] || {}
    return {
      key,
      planned: tasks.reduce((sum, task) => sum + Number(task.targetMinutes || 0), 0),
      actual: tasks.reduce((sum, task) => sum + Number(records[task.id]?.actualMinutes || 0), 0),
      completed: tasks.filter((task) => records[task.id]?.completed).length,
      total: tasks.length,
    }
  }), [safeData, selectedDate])

  function notify(message) {
    setToast(message)
    window.clearTimeout(toastTimeout.current)
    toastTimeout.current = window.setTimeout(() => setToast(''), 2300)
  }

  function closeModal() {
    setModal({ open: false, task: null })
  }

  function updateDayRecord(taskId, updater, dateKey = selectedDate) {
    setData((current) => {
      const normalized = normalizeData(current)
      const currentDay = normalized.dayRecords[dateKey] || {}
      const currentRecord = currentDay[taskId] || { completed: false, actualMinutes: 0 }
      return {
        ...normalized,
        dayRecords: {
          ...normalized.dayRecords,
          [dateKey]: {
            ...currentDay,
            [taskId]: updater(currentRecord),
          },
        },
      }
    })
  }

  function createTask(form, message = 'Task added') {
    setData((current) => {
      const normalized = normalizeData(current)
      return {
        ...normalized,
        tasks: [...normalized.tasks, normalizeTask({ ...form, id: createId('task'), createdAt: Date.now() })],
      }
    })
    notify(message)
  }

  function toggleTask(taskId) {
    updateDayRecord(taskId, (record) => ({ ...record, completed: !record.completed }))
  }

  function addMinutes(taskId, minutes) {
    const task = safeData.tasks.find((item) => item.id === taskId)
    if (!task) return
    updateDayRecord(taskId, (record) => {
      const actualMinutes = Number(record.actualMinutes || 0) + minutes
      return {
        ...record,
        actualMinutes,
        completed: record.completed || actualMinutes >= Number(task.targetMinutes || 0),
      }
    })
    notify(`${minutes} minutes added`)
  }

  function saveTask(form) {
    const editingTask = modal.task
    if (editingTask) {
      setData((current) => {
        const normalized = normalizeData(current)
        return {
          ...normalized,
          tasks: normalized.tasks.map((task) => task.id === editingTask.id ? normalizeTask({ ...task, ...form }) : task),
        }
      })
      notify('Task updated')
    } else {
      createTask(form)
    }
    closeModal()
  }

  function duplicateTask(task) {
    createTask({ ...task, title: `${task.title} copy`, pinned: false }, 'Task duplicated')
  }

  function togglePin(taskId) {
    setData((current) => {
      const normalized = normalizeData(current)
      return {
        ...normalized,
        tasks: normalized.tasks.map((task) => task.id === taskId ? { ...task, pinned: !task.pinned } : task),
      }
    })
  }

  function completeVisible() {
    if (!visibleTasks.length) return
    setData((current) => {
      const normalized = normalizeData(current)
      const currentDay = normalized.dayRecords[selectedDate] || {}
      const updatedDay = { ...currentDay }
      visibleTasks.forEach((task) => {
        const record = updatedDay[task.id] || { actualMinutes: 0 }
        updatedDay[task.id] = { ...record, completed: true }
      })
      return {
        ...normalized,
        dayRecords: { ...normalized.dayRecords, [selectedDate]: updatedDay },
      }
    })
    notify('Visible tasks completed')
  }

  function deleteTask(taskId) {
    const task = safeData.tasks.find((item) => item.id === taskId)
    if (!window.confirm(`Delete “${task?.title || 'this task'}”? Previous time history will remain.`)) return

    setData((current) => {
      const normalized = normalizeData(current)
      return { ...normalized, tasks: normalized.tasks.filter((item) => item.id !== taskId) }
    })
    if (safeTimer.taskId === taskId) setTimer(INITIAL_TIMER)
    notify('Task deleted')
  }

  function selectTimerTask(taskId) {
    if (safeTimer.running && taskId !== safeTimer.taskId) {
      const proceed = window.confirm('Switch tasks and discard the current unsaved timer?')
      if (!proceed) return
    }
    const task = safeData.tasks.find((item) => item.id === taskId)
    setTimer({
      ...INITIAL_TIMER,
      taskId,
      goalMinutes: task ? Number(task.targetMinutes || 25) : 25,
      dateKey: selectedDate,
    })
    setClockTick(Date.now())
  }

  function startTaskTimer(task) {
    if (safeTimer.running && safeTimer.taskId !== task.id) {
      const proceed = window.confirm('Switch tasks and discard the current unsaved timer?')
      if (!proceed) return
    }

    if (safeTimer.taskId === task.id) {
      setTimer((current) => {
        const normalized = normalizeTimer(current)
        if (normalized.running) return normalized
        return { ...normalized, running: true, startedAt: Date.now(), dateKey: normalized.dateKey || selectedDate }
      })
    } else {
      setTimer({
        ...INITIAL_TIMER,
        taskId: task.id,
        goalMinutes: Number(task.targetMinutes || 25),
        dateKey: selectedDate,
        running: true,
        startedAt: Date.now(),
      })
    }
    setClockTick(Date.now())
    window.setTimeout(() => document.querySelector('.focus-panel')?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 0)
  }

  function toggleTimer() {
    setTimer((current) => {
      const normalized = normalizeTimer(current)
      if (!normalized.taskId) return normalized
      if (normalized.running) {
        return {
          ...normalized,
          elapsedSeconds: getElapsedSeconds(normalized),
          running: false,
          startedAt: null,
        }
      }
      return {
        ...normalized,
        running: true,
        startedAt: Date.now(),
        dateKey: normalized.dateKey || selectedDate,
      }
    })
    setClockTick(Date.now())
  }

  function resetTimer() {
    setTimer((current) => ({
      ...normalizeTimer(current),
      elapsedSeconds: 0,
      running: false,
      startedAt: null,
    }))
    setClockTick(Date.now())
  }

  function setTimerGoal(goalMinutes) {
    setTimer((current) => ({ ...normalizeTimer(current), goalMinutes }))
  }

  function saveTimerSession() {
    const task = safeData.tasks.find((item) => item.id === safeTimer.taskId)
    const seconds = getElapsedSeconds(safeTimer)
    if (!task || seconds < 30) return
    const minutes = Math.max(1, Math.round(seconds / 60))
    const sessionDate = safeTimer.dateKey || selectedDate

    setData((current) => {
      const normalized = normalizeData(current)
      const currentDay = normalized.dayRecords[sessionDate] || {}
      const currentRecord = currentDay[task.id] || { completed: false, actualMinutes: 0 }
      const newMinutes = Number(currentRecord.actualMinutes || 0) + minutes
      return {
        ...normalized,
        dayRecords: {
          ...normalized.dayRecords,
          [sessionDate]: {
            ...currentDay,
            [task.id]: {
              ...currentRecord,
              actualMinutes: newMinutes,
              completed: currentRecord.completed || newMinutes >= Number(task.targetMinutes || 0),
            },
          },
        },
        sessions: [
          {
            id: createId('session'),
            taskId: task.id,
            taskTitle: task.title,
            category: task.category,
            dateKey: sessionDate,
            minutes,
            createdAt: Date.now(),
          },
          ...normalized.sessions,
        ].slice(0, 150),
      }
    })

    setTimer((current) => ({
      ...normalizeTimer(current),
      elapsedSeconds: 0,
      running: false,
      startedAt: null,
    }))
    setClockTick(Date.now())
    notify(`${minutes} minute${minutes === 1 ? '' : 's'} saved`)
  }

  function changeDailyGoal(dailyFocusGoal) {
    setData((current) => {
      const normalized = normalizeData(current)
      return { ...normalized, settings: { ...normalized.settings, dailyFocusGoal } }
    })
    notify('Daily goal updated')
  }

  function exportData() {
    const payload = JSON.stringify({ ...safeData, exportedAt: new Date().toISOString() }, null, 2)
    const blob = new Blob([payload], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const anchor = document.createElement('a')
    anchor.href = url
    anchor.download = `focusflow-backup-${toDateKey()}.json`
    anchor.click()
    URL.revokeObjectURL(url)
    notify('Backup exported')
  }

  function importData(event) {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result))
        if (!Array.isArray(parsed.tasks) || !parsed.dayRecords || !Array.isArray(parsed.sessions)) {
          throw new Error('Invalid backup structure')
        }
        setData(normalizeData(parsed))
        setTimer(INITIAL_TIMER)
        notify('Backup imported')
      } catch (error) {
        console.error(error)
        window.alert('That file is not a valid FocusFlow backup.')
      }
    }
    reader.readAsText(file)
  }

  return (
    <div className="app-shell">
      <Header
        theme={theme}
        onThemeToggle={() => setTheme((current) => current === 'dark' ? 'light' : 'dark')}
        onAddTask={() => setModal({ open: true, task: null })}
        onExport={exportData}
        onImport={importData}
      />

      <main className="app-main">
        <div className="top-row">
          <div>
            <span className="eyebrow">Your day</span>
            <h1>Stay consistent.</h1>
            <p>Press <kbd>/</kbd> to quick add or <kbd>N</kbd> for full task details.</p>
          </div>
          <DateNavigator dateKey={selectedDate} onChange={setSelectedDate} />
        </div>

        <QuickAdd selectedDate={selectedDate} onAdd={createTask} />
        <StatsGrid stats={stats} streak={streak} />

        <div className="workspace-grid">
          <TaskList
            tasks={visibleTasks}
            allDayTasks={dayTasks}
            records={dayRecords}
            filters={filters}
            onFiltersChange={setFilters}
            onToggle={toggleTask}
            onEdit={(task) => setModal({ open: true, task })}
            onDelete={deleteTask}
            onStartTimer={startTaskTimer}
            onAddTask={() => setModal({ open: true, task: null })}
            onAddMinutes={addMinutes}
            onTogglePin={togglePin}
            onDuplicate={duplicateTask}
            onCompleteVisible={completeVisible}
          />

          <aside className="sidebar-stack">
            <TimerPanel
              timer={safeTimer}
              elapsedSeconds={elapsedSeconds}
              tasks={focusTasks}
              onSelectTask={selectTimerTask}
              onToggle={toggleTimer}
              onReset={resetTimer}
              onSave={saveTimerSession}
              onSetGoal={setTimerGoal}
            />
            <WeeklyInsights
              days={weeklyDays}
              dailyGoal={safeData.settings.dailyFocusGoal}
              onGoalChange={changeDailyGoal}
            />
            <TemplatesPanel onUseTemplate={(template) => createTask(template, `${template.title} added`)} />
            <RecentSessions sessions={safeData.sessions} tasks={safeData.tasks} />
          </aside>
        </div>
      </main>

      <TaskModal
        open={modal.open}
        task={modal.task}
        selectedDate={selectedDate}
        onClose={closeModal}
        onSave={saveTask}
      />

      {toast && <div className="toast" role="status">{toast}</div>}
    </div>
  )
}
