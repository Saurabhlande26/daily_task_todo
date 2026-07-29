# FocusFlow Compact — React Daily Checklist

A compact, local-first daily checklist, routine planner, and focus timer built with React and Vite. Tasks, daily completion records, timer state, settings, and activity history are stored in the browser using `localStorage`.

## Highlights

- Compact desktop and mobile dashboard
- Fast one-line task creation
- Daily, weekday, weekend, one-time, and custom-day recurrence
- Study, workout, work, personal, and other categories
- Planned time, scheduled time, priority, notes, and pinned tasks
- Per-day task completion and time history
- Manual `+5m` logging from each task row
- Persistent focus timer that continues after refreshing the browser
- 25, 50, and 90-minute focus presets
- Automatic completion when logged time reaches planned time
- Smart sorting, status tabs, search, and category filters
- Bulk completion for visible tasks
- Task duplication and quick routine templates
- Current and best completion streaks
- Seven-day planned-versus-actual insights
- Editable daily focus goal
- Dark and light themes
- JSON backup export and import
- Keyboard shortcuts: `/` for quick add and `N` for the full task form

## Run locally

```bash
npm install
npm run dev
```

Open the local URL shown by Vite, normally `http://localhost:5173`.

## Production build

```bash
npm run build
npm run preview
```

## Browser storage

The project uses these browser storage keys:

```text
focusflow-data-v1
focusflow-theme-v1
focusflow-timer-v2
```

The original `focusflow-data-v1` key is retained, so records created with the earlier version are migrated automatically when the upgraded app opens.

Clearing site data removes local records. Use the download button in the header to export a JSON backup before clearing browser data or moving to another browser.
