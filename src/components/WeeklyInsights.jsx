import Icon from './Icon.jsx'
import { formatMinutes, fromDateKey } from '../utils/date.js'

export default function WeeklyInsights({ days, dailyGoal, onGoalChange }) {
  const maxValue = Math.max(...days.map((day) => Math.max(day.planned, day.actual)), Number(dailyGoal || 0), 1)
  const totalActual = days.reduce((sum, day) => sum + day.actual, 0)
  const totalPlanned = days.reduce((sum, day) => sum + day.planned, 0)

  return (
    <section className="panel weekly-panel">
      <div className="compact-panel-heading">
        <div>
          <span className="eyebrow">7-day overview</span>
          <h2>{formatMinutes(totalActual)} focused</h2>
        </div>
        <Icon name="chart" size={18} />
      </div>

      <div className="weekly-bars" aria-label="Weekly planned and actual focus minutes">
        {days.map((day) => {
          const percentage = Math.round((day.actual / Math.max(day.planned, 1)) * 100)
          return (
            <div className="weekly-day" key={day.key} title={`${day.actual}m actual, ${day.planned}m planned`}>
              <div className="weekly-bar-track">
                <span className="weekly-plan" style={{ height: `${Math.max(day.planned ? 8 : 0, (day.planned / maxValue) * 100)}%` }} />
                <span className="weekly-actual" style={{ height: `${Math.max(day.actual ? 8 : 0, (day.actual / maxValue) * 100)}%` }} />
              </div>
              <strong>{fromDateKey(day.key).toLocaleDateString(undefined, { weekday: 'narrow' })}</strong>
              <small>{percentage || 0}%</small>
            </div>
          )
        })}
      </div>

      <div className="goal-row">
        <div>
          <span>Daily focus goal</span>
          <small>{formatMinutes(Number(dailyGoal || 0))} per day · {formatMinutes(totalPlanned)} planned this week</small>
        </div>
        <select value={dailyGoal} onChange={(event) => onGoalChange(Number(event.target.value))} aria-label="Daily focus goal">
          <option value="60">1h</option>
          <option value="120">2h</option>
          <option value="180">3h</option>
          <option value="240">4h</option>
          <option value="300">5h</option>
        </select>
      </div>
    </section>
  )
}
