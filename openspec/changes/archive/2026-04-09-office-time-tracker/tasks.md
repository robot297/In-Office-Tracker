## 1. Project Scaffold

- [x] 1.1 Initialise Vite + React + TypeScript project (`npm create vite@latest . -- --template react-ts`)
- [x] 1.2 Install and configure Tailwind CSS (`npm install -D tailwindcss postcss autoprefixer && npx tailwindcss init -p`)
- [x] 1.3 Configure `tailwind.config.js` content paths to include `./src/**/*.{ts,tsx}`
- [x] 1.4 Add Tailwind directives to `src/index.css` and import it in `main.tsx`
- [x] 1.5 Strip out Vite boilerplate from `App.tsx` and `index.css`

## 2. Types & Data Layer

- [x] 2.1 Define `Session` interface in `src/types.ts` (`id`, `start`, `end | null`, `durationMs | null`)
- [x] 2.2 Implement `loadSessions(): Session[]` — reads `office-tracker-sessions` from localStorage; returns `[]` if missing or invalid
- [x] 2.3 Implement `saveSessions(sessions: Session[]): void` — serialises and writes to localStorage
- [x] 2.4 Implement `getActiveSession(sessions: Session[]): Session | null` helper
- [x] 2.5 Implement `formatDuration(ms: number): string` — returns human-readable "Xh Ym"
- [x] 2.6 Implement `getTodayTotal(sessions: Session[]): number` — sums `durationMs` of today's completed sessions

## 3. useSessions Hook

- [x] 3.1 Create `src/hooks/useSessions.ts`
- [x] 3.2 Initialise state from `loadSessions()` on mount
- [x] 3.3 Implement `clockIn()` — creates new session, updates state, saves to localStorage
- [x] 3.4 Implement `clockOut()` — finalises active session with `end` + `durationMs`, updates state, saves
- [x] 3.5 Guard `clockIn()` to prevent duplicate active sessions
- [x] 3.6 Return `{ sessions, activeSession, clockIn, clockOut }` from the hook

## 4. ActiveTimer Component

- [x] 4.1 Create `src/components/ActiveTimer.tsx` — accepts `startTime: string` prop
- [x] 4.2 Use `setInterval` (1 s) in a `useEffect` to compute elapsed time from `startTime`
- [x] 4.3 Display elapsed time in HH:MM:SS format using Tailwind classes
- [x] 4.4 Clear interval on unmount

## 5. ClockButton Component

- [x] 5.1 Create `src/components/ClockButton.tsx` — accepts `isActive: boolean`, `onClockIn`, `onClockOut` props
- [x] 5.2 Render "Clock In" button when `isActive` is false
- [x] 5.3 Render "Clock Out" button when `isActive` is true
- [x] 5.4 Style both states clearly with Tailwind (distinct colours)

## 6. TodaySummary Component

- [x] 6.1 Create `src/components/TodaySummary.tsx` — accepts `sessions: Session[]` prop
- [x] 6.2 Compute and display today's total using `getTodayTotal` + `formatDuration`
- [x] 6.3 Show zero-state gracefully ("0h 0m" or equivalent)

## 7. SessionHistory Component

- [x] 7.1 Create `src/components/SessionHistory.tsx` — accepts `sessions: Session[]` prop
- [x] 7.2 Filter to completed sessions only, sort reverse-chronological
- [x] 7.3 Create `src/components/SessionRow.tsx` — displays date, start time, end time, and formatted duration
- [x] 7.4 Show empty-state message when no completed sessions exist

## 8. App Integration

- [x] 8.1 Wire `useSessions` into `App.tsx`
- [x] 8.2 Render `ActiveTimer` conditionally when an active session exists
- [x] 8.3 Compose `ClockButton`, `TodaySummary`, and `SessionHistory` in `App.tsx`
- [x] 8.4 Verify active session timer resumes correctly after page reload
- [x] 8.5 Verify empty-state (no localStorage data) renders without errors
- [x] 8.6 Verify app is usable on a narrow (mobile) screen width using Tailwind responsive classes
