export function toDateKey(date = new Date()) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function fromDateKey(key) {
  const [year, month, day] = String(key).split('-').map(Number)
  return new Date(year, month - 1, day)
}

export function shiftDateKey(key, amount) {
  const date = fromDateKey(key)
  date.setDate(date.getDate() + amount)
  return toDateKey(date)
}

export function formatDate(key, options = {}) {
  return fromDateKey(key).toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    ...options,
  })
}

export function isToday(key) {
  return key === toDateKey()
}

export function getWeekKeys(endingAt = toDateKey()) {
  return Array.from({ length: 7 }, (_, index) => shiftDateKey(endingAt, index - 6))
}

export function taskAppearsOnDate(task, dateKey) {
  const date = fromDateKey(dateKey)
  const weekday = date.getDay()

  if (task.repeat === 'once') return task.date === dateKey
  if (task.repeat === 'weekdays') return weekday >= 1 && weekday <= 5
  if (task.repeat === 'weekends') return weekday === 0 || weekday === 6
  if (task.repeat === 'custom') return Array.isArray(task.repeatDays) && task.repeatDays.includes(weekday)
  return true
}

export function formatSeconds(seconds) {
  const safeSeconds = Math.max(0, Math.floor(seconds || 0))
  const hours = Math.floor(safeSeconds / 3600)
  const minutes = Math.floor((safeSeconds % 3600) / 60)
  const secs = safeSeconds % 60

  if (hours > 0) {
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
  }

  return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
}

export function formatMinutes(minutes) {
  const value = Math.max(0, Number(minutes) || 0)
  const hours = Math.floor(value / 60)
  const mins = value % 60
  if (!hours) return `${mins}m`
  return mins ? `${hours}h ${mins}m` : `${hours}h`
}

export function repeatLabel(task) {
  if (task.repeat === 'once') return 'One time'
  if (task.repeat === 'weekdays') return 'Weekdays'
  if (task.repeat === 'weekends') return 'Weekends'
  if (task.repeat === 'custom') {
    const labels = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']
    return (task.repeatDays || []).map((day) => labels[day]).join(' · ') || 'Custom'
  }
  return 'Daily'
}
