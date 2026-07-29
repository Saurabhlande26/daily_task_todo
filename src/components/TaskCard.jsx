import { CATEGORY_META } from '../constants.js'
import { repeatLabel } from '../utils/date.js'
import Icon from './Icon.jsx'

export default function TaskCard({
  task,
  record,
  onToggle,
  onEdit,
  onDelete,
  onStartTimer,
  onAddMinutes,
  onTogglePin,
  onDuplicate,
}) {
  const meta = CATEGORY_META[task.category] || CATEGORY_META.Other
  const completed = Boolean(record?.completed)
  const actualMinutes = Number(record?.actualMinutes || 0)
  const targetMinutes = Math.max(1, Number(task.targetMinutes || 1))
  const progress = Math.min(100, Math.round((actualMinutes / targetMinutes) * 100))

  return (
    <article className={`task-row ${completed ? 'is-complete' : ''}`}>
      <button
        aria-label={completed ? `Mark ${task.title} incomplete` : `Mark ${task.title} complete`}
        className="check-button"
        onClick={onToggle}
      >
        {completed && <Icon name="check" size={15} />}
      </button>

      <span className={`category-dot ${meta.className}`} title={task.category} />

      <div className="task-content">
        <div className="task-title-line">
          <h3>{task.title}</h3>
          {task.pinned && <Icon name="pin" size={13} className="pin-indicator" />}
          <span className={`priority-label priority-${task.priority}`}>{task.priority}</span>
        </div>
        <div className="task-subline">
          <span>{task.category}</span>
          {task.scheduledTime && <span>{task.scheduledTime}</span>}
          <span>{repeatLabel(task)}</span>
          {task.notes && <span className="task-note-inline">{task.notes}</span>}
        </div>
      </div>

      <div className="task-progress" title={`${actualMinutes} of ${targetMinutes} minutes`}>
        <div className="task-progress-copy">
          <strong>{actualMinutes}m</strong>
          <span>/ {targetMinutes}m</span>
        </div>
        <div className="mini-progress"><span style={{ width: `${progress}%` }} /></div>
      </div>

      <div className="task-actions">
        <button className="mini-action" onClick={() => onAddMinutes(5)} title="Add 5 minutes">+5m</button>
        <button className="icon-button small focus-action" onClick={onStartTimer} disabled={completed} title="Start focus timer">
          <Icon name="play" size={15} />
        </button>
        <details className="task-menu">
          <summary className="icon-button small" aria-label={`More options for ${task.title}`}>
            <Icon name="more" size={16} />
          </summary>
          <div className="task-menu-popover">
            <button onClick={onTogglePin}><Icon name="pin" size={15} /> {task.pinned ? 'Unpin' : 'Pin'}</button>
            <button onClick={onDuplicate}><Icon name="copy" size={15} /> Duplicate</button>
            <button onClick={onEdit}><Icon name="edit" size={15} /> Edit</button>
            <button className="danger-text" onClick={onDelete}><Icon name="trash" size={15} /> Delete</button>
          </div>
        </details>
      </div>
    </article>
  )
}
