import Icon from './Icon.jsx'
import { formatMinutes } from '../utils/date.js'

export default function StatsGrid({ stats, streak }) {
  const items = [
    { label: 'Done', value: `${stats.completed}/${stats.total}`, detail: `${stats.progress}%`, icon: 'checkCircle' },
    { label: 'Focus', value: formatMinutes(stats.actualMinutes), detail: `${formatMinutes(stats.plannedMinutes)} planned`, icon: 'timer' },
    { label: 'Study', value: formatMinutes(stats.studyMinutes), detail: 'today', icon: 'book' },
    { label: 'Streak', value: `${streak.current} day${streak.current === 1 ? '' : 's'}`, detail: `Best ${streak.best}`, icon: 'flame' },
  ]

  return (
    <section className="stats-strip" aria-label="Daily statistics">
      {items.map((item) => (
        <article className="stat-item" key={item.label}>
          <span className="stat-icon"><Icon name={item.icon} size={17} /></span>
          <div>
            <p>{item.label}</p>
            <strong>{item.value}</strong>
            <small>{item.detail}</small>
          </div>
        </article>
      ))}
    </section>
  )
}
