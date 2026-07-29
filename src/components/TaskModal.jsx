import { useEffect, useState } from 'react'
import Icon from './Icon.jsx'
import { toDateKey } from '../utils/date.js'

const dayOptions = [
  { value: 1, label: 'M' },
  { value: 2, label: 'T' },
  { value: 3, label: 'W' },
  { value: 4, label: 'T' },
  { value: 5, label: 'F' },
  { value: 6, label: 'S' },
  { value: 0, label: 'S' },
]

const emptyTask = {
  title: '',
  category: 'Study',
  targetMinutes: 30,
  scheduledTime: '',
  priority: 'medium',
  repeat: 'daily',
  repeatDays: [1, 2, 3, 4, 5],
  date: toDateKey(),
  notes: '',
  pinned: false,
}

export default function TaskModal({ open, task, selectedDate, onClose, onSave }) {
  const [form, setForm] = useState(emptyTask)

  useEffect(() => {
    if (open) {
      setForm(task
        ? { ...emptyTask, ...task, repeatDays: Array.isArray(task.repeatDays) ? task.repeatDays : [] }
        : { ...emptyTask, date: selectedDate || toDateKey() })
    }
  }, [open, task, selectedDate])

  useEffect(() => {
    if (!open) return undefined
    const onKeyDown = (event) => {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [open, onClose])

  if (!open) return null

  function update(key, value) {
    setForm((current) => ({ ...current, [key]: value }))
  }

  function toggleDay(day) {
    setForm((current) => ({
      ...current,
      repeatDays: current.repeatDays.includes(day)
        ? current.repeatDays.filter((value) => value !== day)
        : [...current.repeatDays, day],
    }))
  }

  function submit(event) {
    event.preventDefault()
    const trimmedTitle = form.title.trim()
    if (!trimmedTitle) return
    if (form.repeat === 'custom' && !form.repeatDays.length) return

    onSave({
      ...form,
      title: trimmedTitle,
      targetMinutes: Math.max(1, Number(form.targetMinutes) || 1),
      date: form.repeat === 'once' ? form.date : '',
    })
  }

  return (
    <div className="modal-backdrop" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <form className="modal" onSubmit={submit}>
        <div className="modal-header">
          <div>
            <span className="eyebrow">Task details</span>
            <h2>{task ? 'Edit task' : 'Create task'}</h2>
          </div>
          <button className="icon-button" type="button" onClick={onClose} aria-label="Close modal"><Icon name="close" /></button>
        </div>

        <div className="modal-grid">
          <label className="field full-span">
            <span>Task name</span>
            <input autoFocus value={form.title} onChange={(event) => update('title', event.target.value)} placeholder="Example: Revise chapter 4" />
          </label>

          <label className="field">
            <span>Category</span>
            <select value={form.category} onChange={(event) => update('category', event.target.value)}>
              <option>Study</option><option>Workout</option><option>Work</option><option>Personal</option><option>Other</option>
            </select>
          </label>

          <label className="field">
            <span>Priority</span>
            <select value={form.priority} onChange={(event) => update('priority', event.target.value)}>
              <option value="high">High</option><option value="medium">Medium</option><option value="low">Low</option>
            </select>
          </label>

          <label className="field">
            <span>Planned minutes</span>
            <input min="1" max="1440" type="number" value={form.targetMinutes} onChange={(event) => update('targetMinutes', event.target.value)} />
          </label>

          <label className="field">
            <span>Start time</span>
            <input type="time" value={form.scheduledTime} onChange={(event) => update('scheduledTime', event.target.value)} />
          </label>

          <label className="field">
            <span>Repeat</span>
            <select value={form.repeat} onChange={(event) => update('repeat', event.target.value)}>
              <option value="daily">Every day</option>
              <option value="weekdays">Weekdays</option>
              <option value="weekends">Weekends</option>
              <option value="custom">Custom days</option>
              <option value="once">One time</option>
            </select>
          </label>

          {form.repeat === 'once' && (
            <label className="field">
              <span>Date</span>
              <input type="date" value={form.date} onChange={(event) => update('date', event.target.value)} required />
            </label>
          )}

          {form.repeat === 'custom' && (
            <div className="field full-span">
              <span>Repeat on</span>
              <div className="weekday-picker">
                {dayOptions.map((day, index) => (
                  <button
                    key={`${day.value}-${index}`}
                    type="button"
                    className={form.repeatDays.includes(day.value) ? 'is-active' : ''}
                    onClick={() => toggleDay(day.value)}
                  >
                    {day.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          <label className="field full-span">
            <span>Notes</span>
            <textarea rows="3" value={form.notes} onChange={(event) => update('notes', event.target.value)} placeholder="Optional details or focus instructions" />
          </label>

          <label className="pin-checkbox full-span">
            <input type="checkbox" checked={form.pinned} onChange={(event) => update('pinned', event.target.checked)} />
            <span><Icon name="pin" size={15} /> Pin this task to the top</span>
          </label>
        </div>

        <div className="modal-footer">
          <button className="ghost-button" type="button" onClick={onClose}>Cancel</button>
          <button className="primary-button" type="submit">{task ? 'Save changes' : 'Create task'}</button>
        </div>
      </form>
    </div>
  )
}
