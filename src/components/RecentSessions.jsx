import { CATEGORY_META } from '../constants.js'
import { formatDate } from '../utils/date.js'

export default function RecentSessions({ sessions, tasks }) {
  const recent = sessions.slice(0, 4)

  return (
    <section className="panel sessions-panel">
      <div className="compact-panel-heading">
        <div>
          <span className="eyebrow">Activity</span>
          <h2>Recent sessions</h2>
        </div>
      </div>

      {recent.length ? (
        <div className="session-list">
          {recent.map((session) => {
            const task = tasks.find((item) => item.id === session.taskId)
            const category = task?.category || session.category || 'Other'
            const meta = CATEGORY_META[category] || CATEGORY_META.Other
            return (
              <div className="session-row" key={session.id}>
                <span className={`session-icon ${meta.className}`}>{meta.emoji}</span>
                <div>
                  <strong>{task?.title || session.taskTitle || 'Deleted task'}</strong>
                  <span>{formatDate(session.dateKey, { weekday: 'short', month: 'short', day: 'numeric' })}</span>
                </div>
                <b>{session.minutes}m</b>
              </div>
            )
          })}
        </div>
      ) : (
        <p className="muted-copy">Saved focus sessions will show here.</p>
      )}
    </section>
  )
}
