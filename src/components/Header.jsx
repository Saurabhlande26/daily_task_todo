import Icon from './Icon.jsx'

export default function Header({ theme, onThemeToggle, onAddTask, onExport, onImport }) {
  return (
    <header className="app-header">
      <div className="header-inner">
        <div className="brand">
          <div className="brand-mark" aria-hidden="true"><Icon name="check" size={18} /></div>
          <div>
            <h1>FocusFlow</h1>
            <p>Daily checklist</p>
          </div>
        </div>

        <div className="header-actions">
          <button className="icon-button" onClick={onExport} title="Export backup" aria-label="Export backup">
            <Icon name="download" size={17} />
          </button>
          <label className="icon-button" title="Import backup" aria-label="Import backup">
            <Icon name="upload" size={17} />
            <input accept="application/json" hidden onChange={onImport} type="file" />
          </label>
          <button className="icon-button" onClick={onThemeToggle} title="Toggle theme" aria-label="Toggle theme">
            <Icon name={theme === 'dark' ? 'sun' : 'moon'} size={17} />
          </button>
          <button className="primary-button compact-button" onClick={onAddTask}>
            <Icon name="plus" size={17} />
            <span>New task</span>
          </button>
        </div>
      </div>
    </header>
  )
}
