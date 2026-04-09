## Context

The office-time-tracker app currently persists session data to `localStorage` as a flat JSON string. This works for v1 but won't scale: localStorage has no query API, no indexing, no transactions, and a 5 MB cap. Replacing it with IndexedDB (via Dexie.js) gives the app a proper database foundation that supports future features (filtering by date range, tags, reporting) without introducing a backend server.

## Goals / Non-Goals

**Goals:**
- Replace localStorage with Dexie.js (IndexedDB) as the persistence layer
- Keep the `useSessions` hook API identical — components are unaffected
- Migrate any existing localStorage data into IndexedDB on first run
- Support TypeScript natively throughout the database layer

**Non-Goals:**
- Backend server or cloud sync (future concern)
- Changing the `Session` data model shape
- Querying features beyond what v1 already uses (full table reads are fine for now)
- Offline-first / CouchDB replication (can be layered on later with PouchDB if needed)

## Decisions

### 1. Dexie.js over raw IndexedDB

**Decision:** Use Dexie.js as the IndexedDB wrapper.

**Rationale:** Raw IndexedDB has a deeply callback-based, verbose API that is painful to use with async/await and TypeScript. Dexie provides a clean, promise-based API, first-class TypeScript generics, schema versioning, and a large community. It adds ~30 kB gzipped — a worthwhile trade for the developer experience and future queryability.

**Alternatives considered:**
- Raw IndexedDB — zero dependencies but extremely verbose; high risk of subtle bugs around transactions and cursor management
- PouchDB — powerful sync capabilities but heavier (~140 kB) and couples the architecture to CouchDB's model prematurely
- sql.js (SQLite in WASM) — interesting but ~1 MB bundle; relational overhead not needed here

### 2. Database structure

One Dexie table: `sessions`, indexed on `id` (primary) and `start` (for future date-range queries).

```ts
// src/db.ts
import Dexie, { type Table } from 'dexie'
import type { Session } from './types'

class TrackerDB extends Dexie {
  sessions!: Table<Session>

  constructor() {
    super('office-tracker')
    this.version(1).stores({
      sessions: 'id, start'   // id = primary key, start = index
    })
  }
}

export const db = new TrackerDB()
```

### 3. useSessions hook becomes async

**Decision:** `useSessions` switches from synchronous localStorage reads to `async` Dexie queries, with a `useEffect` on mount to load initial data.

**Rationale:** IndexedDB is inherently async. The hook initialises state to `[]`, fires a `useEffect` to load from Dexie on mount, and updates React state. The returned `clockIn` / `clockOut` functions become async internally but do not need to expose that to callers — React state updates trigger re-renders as before.

### 4. localStorage migration

**Decision:** On app startup, check for the `office-tracker-sessions` localStorage key. If present, import all records into Dexie using `db.sessions.bulkPut()`, then delete the localStorage key.

**Rationale:** Silent, one-time, non-destructive. User never notices. If the migration has already run (key absent), the check is a no-op.

## Risks / Trade-offs

- **IndexedDB unavailable** → Extremely rare (private browsing in some browsers blocks it). Mitigated by wrapping the Dexie open call in a try/catch with a console warning; app degrades gracefully.
- **Async initialisation flicker** → On first render, sessions array is `[]` until Dexie resolves. Mitigated by showing a loading state or simply letting the empty list flash for one frame (imperceptible in practice).
- **Dexie version upgrades** → Changing the schema in the future requires a new `this.version(N)` block. This is straightforward with Dexie but requires discipline. Document versioning in `db.ts`.

## Migration Plan

1. Install `dexie` dependency
2. Create `src/db.ts` with `TrackerDB` class
3. Add migration logic to `useSessions` mount effect (read localStorage → bulkPut → delete key)
4. Rewrite `useSessions` internals to use Dexie; keep hook return type identical
5. Remove `loadSessions` / `saveSessions` localStorage utilities
6. Test: existing data migrates, new sessions persist, reload restores state
