## Why

localStorage is a flat string key-value store that will become a bottleneck as the app grows — it has no querying capability, no indexes, and no transaction support. Replacing it with a browser-native NoSQL database (Dexie.js / IndexedDB) provides a proper persistence layer that can support filtering, sorting, and future data models without a backend server.

## What Changes

- **BREAKING**: Remove `office-tracker-sessions` localStorage key; all session data migrates to IndexedDB via Dexie.js
- Replace the `loadSessions` / `saveSessions` functions with a Dexie database instance
- Update the `useSessions` hook to use async Dexie queries instead of synchronous localStorage reads/writes
- Add a one-time migration: read existing localStorage data on first run and import it into IndexedDB, then clear the localStorage key

## Capabilities

### New Capabilities

- `nosql-database`: Dexie.js database setup, schema versioning, and the sessions table definition

### Modified Capabilities

- `data-persistence`: persistence behaviour is unchanged from the user's perspective, but the storage backend changes from localStorage to IndexedDB via Dexie — the `useSessions` hook API stays the same

## Impact

- `src/hooks/useSessions.ts` — async rewrite using Dexie queries
- `src/db.ts` — new file defining the Dexie database instance and schema
- `src/types.ts` — `Session` interface unchanged
- New dependency: `dexie` (~30 kB gzipped)
- One-time migration logic required for any existing localStorage data
