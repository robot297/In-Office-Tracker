## Context

This is a brand new web application with no existing codebase. The user needs a simple, self-contained tool to log time spent in the office. The primary constraint is simplicity — no server infrastructure, no accounts, no database engine. Data must survive page reloads.

## Goals / Non-Goals

**Goals:**
- Single-page web app (HTML + CSS + JavaScript)
- Clock in / clock out with a single button
- Persist all session data in `localStorage` so it survives browser refreshes and restarts
- Display a running timer for the active session
- Show a history list of completed sessions (date, start, end, duration)

**Non-Goals:**
- User accounts or multi-user support
- Backend server or database
- Mobile native app
- Editing or deleting past sessions (v1 scope)
- Export / reporting features (v1 scope)

## Decisions

### 1. React + Vite + TypeScript

**Decision:** Use React with Vite as the build tool and TypeScript throughout.

**Rationale:** The app is expected to grow with additional features. React's component model and TypeScript's type safety will pay off quickly as complexity increases. Vite provides a fast dev server and minimal configuration overhead compared to alternatives.

**Alternatives considered:**
- Vanilla JS — simpler for v1 but poor foundation for future features; no component model or type safety
- Next.js — unnecessary for a client-only personal tool; SSR/routing complexity not needed here
- Create React App — largely abandoned, significantly slower than Vite

### 2. Tailwind CSS for styling

**Decision:** Use Tailwind CSS utility classes for all styling — no separate stylesheet.

**Rationale:** Tailwind's utility-first approach means styles live directly in JSX, making components self-contained and easy to iterate on. No context-switching between files. Works well with Vite and has excellent TypeScript/React support.

**Alternatives considered:**
- Plain CSS / CSS Modules — reasonable, but more verbose for a component-heavy app
- CSS-in-JS (styled-components) — adds runtime overhead; Tailwind is zero-runtime

### 2. localStorage for persistence

**Decision:** Store all session data as JSON in `localStorage` under the key `office-tracker-sessions`.

**Rationale:** localStorage is universally available in browsers, requires no server, and is sufficient for a personal single-user tool. Data persists across page reloads and browser restarts.

**Alternatives considered:**
- IndexedDB — more powerful but significantly more complex API; not needed here
- File download/import — requires manual action; poor UX for daily use
- Simple backend (Node/SQLite) — adds deployment complexity; unnecessary for personal use

### 3. Data model

Each session is a TypeScript interface:
```ts
interface Session {
  id: string            // crypto.randomUUID() or Date.now().toString()
  start: string         // ISO-8601 datetime
  end: string | null    // null = session is currently active
  durationMs: number | null
}
```
A `null` end value means a session is currently active. Only one active session is allowed at a time.

### 4. Component structure

State is owned by `App` via a `useSessions` custom hook. All other components are presentational.

```
App  (owns session state via useSessions hook)
├── ClockButton       idle → "Clock In"; active → "Clock Out"
├── ActiveTimer       live HH:MM:SS, rendered only when clocked in
├── TodaySummary      sum of today's completed sessions
└── SessionHistory
    └── SessionRow    one row per completed session
```

`useSessions` handles all localStorage reads/writes and exposes `clockIn`, `clockOut`, and the sessions array to `App`.

## Risks / Trade-offs

- **localStorage limits (~5 MB)** → Mitigated by the small size of session records; would take years of daily use to approach the limit.
- **Single-device only** → Data lives in the browser; not accessible from other devices. Acceptable for v1; sync can be added later.
- **No data backup** → User could lose data by clearing browser storage. Mitigated in a future version with export-to-JSON.
- **Clock skew on active session** → If the browser is closed mid-session, the timer resumes correctly on next open because start time is persisted.
