export const STORAGE_KEY = 'focusflow-data-v1'
export const THEME_KEY = 'focusflow-theme-v1'
export const TIMER_KEY = 'focusflow-timer-v2'

export const CATEGORY_META = {
  Study: { icon: 'book', emoji: '📚', className: 'category-study' },
  Workout: { icon: 'activity', emoji: '🏋️', className: 'category-workout' },
  Work: { icon: 'briefcase', emoji: '💼', className: 'category-work' },
  Personal: { icon: 'leaf', emoji: '🌱', className: 'category-personal' },
  Other: { icon: 'sparkles', emoji: '✨', className: 'category-other' },
}

export const TASK_TEMPLATES = [
  { title: 'Deep study', category: 'Study', targetMinutes: 60, scheduledTime: '07:30', priority: 'high', repeat: 'daily', notes: 'One subject, notifications off.' },
  { title: 'Workout', category: 'Workout', targetMinutes: 45, scheduledTime: '18:00', priority: 'medium', repeat: 'weekdays', notes: 'Warm up before the main session.' },
  { title: 'Read', category: 'Personal', targetMinutes: 30, scheduledTime: '21:00', priority: 'low', repeat: 'daily', notes: '' },
  { title: 'Plan tomorrow', category: 'Personal', targetMinutes: 10, scheduledTime: '21:30', priority: 'low', repeat: 'daily', notes: 'Choose tomorrow’s top three.' },
]

export const DEFAULT_TASKS = [
  {
    id: 'task-study-1',
    title: 'Deep study session',
    category: 'Study',
    targetMinutes: 90,
    scheduledTime: '07:30',
    priority: 'high',
    repeat: 'daily',
    repeatDays: [],
    date: '',
    notes: 'Focus on the most important topic first.',
    pinned: true,
    createdAt: Date.now(),
  },
  {
    id: 'task-workout-1',
    title: 'Strength workout',
    category: 'Workout',
    targetMinutes: 45,
    scheduledTime: '18:00',
    priority: 'medium',
    repeat: 'weekdays',
    repeatDays: [],
    date: '',
    notes: 'Warm up for 5 minutes before starting.',
    pinned: false,
    createdAt: Date.now() + 1,
  },
  {
    id: 'task-review-1',
    title: 'Plan tomorrow',
    category: 'Personal',
    targetMinutes: 15,
    scheduledTime: '21:30',
    priority: 'low',
    repeat: 'daily',
    repeatDays: [],
    date: '',
    notes: '',
    pinned: false,
    createdAt: Date.now() + 2,
  },
]

export const DEFAULT_SETTINGS = {
  dailyFocusGoal: 180,
  showCompleted: true,
}

export const INITIAL_DATA = {
  tasks: DEFAULT_TASKS,
  dayRecords: {},
  sessions: [],
  settings: DEFAULT_SETTINGS,
}

export const INITIAL_TIMER = {
  taskId: '',
  elapsedSeconds: 0,
  running: false,
  startedAt: null,
  dateKey: '',
  goalMinutes: 25,
}
