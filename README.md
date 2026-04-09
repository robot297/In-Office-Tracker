# Office Time Tracker

A lightweight, browser-based time tracking app for logging office hours. No backend, no accounts — all data is stored locally in your browser using IndexedDB.

## Features

- **Clock In / Clock Out** — one-click time tracking
- **Live Timer** — real-time elapsed time display while clocked in
- **Today's Summary** — total hours tracked for the current day
- **Session History** — full log of past sessions with date, start, end, and duration

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 18 + TypeScript |
| Build tool | Vite |
| Styling | Tailwind CSS |
| Storage | Dexie (IndexedDB wrapper) |

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Install dependencies

```bash
npm install
```

### Start the development server

```bash
npm run dev
```

The app will be available at [http://localhost:5173](http://localhost:5173).

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server with HMR |
| `npm run build` | Type-check and build for production |
| `npm run preview` | Serve the production build locally |

## Project Structure

```
src/
├── components/
│   ├── ActiveTimer.tsx     # Live elapsed-time display
│   ├── ClockButton.tsx     # Clock In / Clock Out button
│   ├── SessionHistory.tsx  # Session table
│   ├── SessionRow.tsx      # Individual row in the session table
│   └── TodaySummary.tsx    # Daily total
├── hooks/
│   └── useSessions.ts      # Core state management
├── App.tsx                 # Root layout
├── db.ts                   # Dexie database setup
├── storage.ts              # Utility functions (formatting, totals)
└── types.ts                # Shared TypeScript interfaces
```

## Data Model

Sessions are stored in IndexedDB under the database name `office-tracker`.

```typescript
interface Session {
  id: string           // UUID
  start: string        // ISO-8601 datetime
  end: string | null   // null = session is active
  durationMs: number | null
}
```

Data stored in the old localStorage format (`office-tracker-sessions`) is automatically migrated on first load.

## Deployment

The app is a fully static site with no server-side requirements. After running `npm run build`, deploy the contents of the `dist/` folder to any static host (Netlify, Vercel, GitHub Pages, etc.).

## Development Container

A VS Code Dev Container is included in [.devcontainer/](.devcontainer/). Open the repo in VS Code and select **Reopen in Container** to get a pre-configured environment with Node.js and all recommended extensions.

## No Tests Yet

There is currently no test suite configured. If you add tests, [Vitest](https://vitest.dev/) integrates well with Vite and is the recommended choice for this stack.
