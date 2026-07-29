import Icon from './Icon.jsx'
import TaskCard from './TaskCard.jsx'

export default function TaskList({
  tasks,
  allDayTasks,
  records,
  filters,
  onFiltersChange,
  onToggle,
  onEdit,
  onDelete,
  onStartTimer,
  onAddTask,
  onAddMinutes,
  onTogglePin,
  onDuplicate,
  onCompleteVisible,
}) {
  const openCount = allDayTasks.filter((task) => !records[task.id]?.completed).length

  return (
    <section className="panel task-panel">
      <div className="task-toolbar">
        <div className="task-heading">
          <div>
            <span className="eyebrow">Checklist</span>
            <h2>Today’s plan <small>{openCount} open</small></h2>
          </div>
          <button className="ghost-button bulk-button" onClick={onCompleteVisible} disabled={!tasks.length}>
            <Icon name="checkCircle" size={15} /> Complete visible
          </button>
        </div>

        <div className="filter-row">
          <label className="search-box">
            <Icon name="search" size={16} />
            <input
              value={filters.search}
              onChange={(event) => onFiltersChange({ ...filters, search: event.target.value })}
              placeholder="Search"
            />
          </label>

          <div className="status-tabs" role="tablist" aria-label="Task status">
            {[
              ['all', 'All'],
              ['open', 'Open'],
              ['complete', 'Done'],
            ].map(([value, label]) => (
              <button
                type="button"
                className={filters.status === value ? 'is-active' : ''}
                onClick={() => onFiltersChange({ ...filters, status: value })}
                key={value}
              >
                {label}
              </button>
            ))}
          </div>

          <select
            value={filters.category}
            onChange={(event) => onFiltersChange({ ...filters, category: event.target.value })}
            aria-label="Filter by category"
          >
            <option value="all">All categories</option>
            <option value="Study">Study</option>
            <option value="Workout">Workout</option>
            <option value="Work">Work</option>
            <option value="Personal">Personal</option>
            <option value="Other">Other</option>
          </select>

          <select
            value={filters.sort}
            onChange={(event) => onFiltersChange({ ...filters, sort: event.target.value })}
            aria-label="Sort tasks"
          >
            <option value="smart">Smart sort</option>
            <option value="time">By time</option>
            <option value="priority">By priority</option>
            <option value="progress">By progress</option>
          </select>
        </div>
      </div>

      <div className="task-list">
        {tasks.length > 0 ? (
          tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              record={records[task.id]}
              onToggle={() => onToggle(task.id)}
              onEdit={() => onEdit(task)}
              onDelete={() => onDelete(task.id)}
              onStartTimer={() => onStartTimer(task)}
              onAddMinutes={(minutes) => onAddMinutes(task.id, minutes)}
              onTogglePin={() => onTogglePin(task.id)}
              onDuplicate={() => onDuplicate(task)}
            />
          ))
        ) : (
          <div className="empty-state">
            <span><Icon name="checkCircle" size={26} /></span>
            <h3>Nothing here</h3>
            <p>Add a task or adjust the current filters.</p>
            <button className="secondary-button" onClick={onAddTask}>
              <Icon name="plus" size={16} /> Add task
            </button>
          </div>
        )}
      </div>
    </section>
  )
}
