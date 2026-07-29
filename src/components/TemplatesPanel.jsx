import { CATEGORY_META, TASK_TEMPLATES } from '../constants.js'
import Icon from './Icon.jsx'

export default function TemplatesPanel({ onUseTemplate }) {
  return (
    <section className="panel templates-panel">
      <div className="compact-panel-heading">
        <div>
          <span className="eyebrow">Quick templates</span>
          <h2>Add a routine</h2>
        </div>
        <Icon name="sparkles" size={18} />
      </div>
      <div className="template-grid">
        {TASK_TEMPLATES.map((template) => {
          const meta = CATEGORY_META[template.category] || CATEGORY_META.Other
          return (
            <button onClick={() => onUseTemplate(template)} key={`${template.title}-${template.targetMinutes}`}>
              <span className={meta.className}>{meta.emoji}</span>
              <div>
                <strong>{template.title}</strong>
                <small>{template.targetMinutes}m · {template.repeat}</small>
              </div>
              <Icon name="plus" size={15} />
            </button>
          )
        })}
      </div>
    </section>
  )
}
