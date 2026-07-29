import Icon from './Icon.jsx'
import { formatDate, isToday, shiftDateKey, toDateKey } from '../utils/date.js'

export default function DateNavigator({ dateKey, onChange }) {
  return (
    <div className="date-navigator" aria-label="Selected day">
      <button className="icon-button small" onClick={() => onChange(shiftDateKey(dateKey, -1))} aria-label="Previous day">
        <Icon name="chevronLeft" size={17} />
      </button>
      <button className="date-display" onClick={() => onChange(toDateKey())} title="Go to today">
        <span>{isToday(dateKey) ? 'Today' : formatDate(dateKey, { weekday: 'short' })}</span>
        <strong>{formatDate(dateKey, { weekday: undefined })}</strong>
      </button>
      <button className="icon-button small" onClick={() => onChange(shiftDateKey(dateKey, 1))} aria-label="Next day">
        <Icon name="chevronRight" size={17} />
      </button>
    </div>
  )
}
