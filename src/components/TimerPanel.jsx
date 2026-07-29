import Icon from './Icon.jsx'
import { formatSeconds } from '../utils/date.js'

const presets = [25, 50, 90]

export default function TimerPanel({ timer, elapsedSeconds, onToggle, onReset, onSave, onSelectTask, onSetGoal, tasks }) {
  const selectedTask = tasks.find((task) => task.id === timer.taskId)
  const targetSeconds = Math.max(1, Number(timer.goalMinutes || 25) * 60)
  const progress = Math.min(100, Math.round((elapsedSeconds / targetSeconds) * 100))

  return (
    <section className="panel focus-panel">
      <div className="compact-panel-heading">
        <div>
          <span className="eyebrow">Focus timer</span>
          <h2>{selectedTask?.title || 'Choose a task'}</h2>
        </div>
        <span className={`live-dot ${timer.running ? 'is-live' : ''}`} title={timer.running ? 'Timer running' : 'Timer paused'} />
      </div>

      <select className="focus-task-select" value={timer.taskId || ''} onChange={(event) => onSelectTask(event.target.value)}>
        <option value="">Select checklist item</option>
        {tasks.map((task) => <option value={task.id} key={task.id}>{task.title}</option>)}
      </select>

      <div className="timer-ring" style={{ '--timer-progress': `${progress * 3.6}deg` }}>
        <div>
          <strong>{formatSeconds(elapsedSeconds)}</strong>
          <span>{progress}% of {timer.goalMinutes}m</span>
        </div>
      </div>

      <div className="preset-row">
        {presets.map((minutes) => (
          <button className={Number(timer.goalMinutes) === minutes ? 'is-active' : ''} onClick={() => onSetGoal(minutes)} key={minutes}>
            {minutes}m
          </button>
        ))}
      </div>

      <div className="focus-controls">
        <button className="primary-button timer-toggle" onClick={onToggle} disabled={!timer.taskId}>
          <Icon name={timer.running ? 'pause' : 'play'} size={17} />
          {timer.running ? 'Pause' : elapsedSeconds ? 'Resume' : 'Start focus'}
        </button>
        <button className="icon-button" onClick={onReset} disabled={!elapsedSeconds} title="Reset timer"><Icon name="rotate" size={16} /></button>
      </div>

      <button className="secondary-button save-session-button" onClick={onSave} disabled={!timer.taskId || elapsedSeconds < 30}>
        Save {elapsedSeconds >= 30 ? `${Math.max(1, Math.round(elapsedSeconds / 60))}m` : 'session'}
      </button>
      <p className="micro-copy">The running timer continues after a browser refresh.</p>
    </section>
  )
}
