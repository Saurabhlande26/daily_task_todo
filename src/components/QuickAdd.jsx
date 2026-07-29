import { useRef, useState } from 'react'
import Icon from './Icon.jsx'

const durationOptions = [15, 30, 45, 60]

export default function QuickAdd({ selectedDate, onAdd }) {
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('Study')
  const [minutes, setMinutes] = useState(30)
  const [repeat, setRepeat] = useState('once')
  const inputRef = useRef(null)

  function submit(event) {
    event.preventDefault()
    const cleanTitle = title.trim()
    if (!cleanTitle) {
      inputRef.current?.focus()
      return
    }
    onAdd({
      title: cleanTitle,
      category,
      targetMinutes: minutes,
      scheduledTime: '',
      priority: 'medium',
      repeat,
      repeatDays: [],
      date: repeat === 'once' ? selectedDate : '',
      notes: '',
      pinned: false,
    })
    setTitle('')
    inputRef.current?.focus()
  }

  return (
    <form className="quick-add" onSubmit={submit}>
      <div className="quick-add-input">
        <Icon name="plus" size={18} />
        <input
          id="quick-task-input"
          ref={inputRef}
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="Quick add a task…"
          aria-label="Task title"
        />
      </div>
      <select value={category} onChange={(event) => setCategory(event.target.value)} aria-label="Task category">
        <option>Study</option>
        <option>Workout</option>
        <option>Work</option>
        <option>Personal</option>
        <option>Other</option>
      </select>
      <div className="duration-pills" aria-label="Planned minutes">
        {durationOptions.map((value) => (
          <button
            className={minutes === value ? 'is-active' : ''}
            type="button"
            onClick={() => setMinutes(value)}
            key={value}
          >
            {value}m
          </button>
        ))}
      </div>
      <select value={repeat} onChange={(event) => setRepeat(event.target.value)} aria-label="Task recurrence">
        <option value="once">This day</option>
        <option value="daily">Daily</option>
        <option value="weekdays">Weekdays</option>
        <option value="weekends">Weekends</option>
      </select>
      <button className="primary-button add-quick-button" type="submit" aria-label="Add task">
        <Icon name="plus" size={18} />
        <span>Add</span>
      </button>
    </form>
  )
}
