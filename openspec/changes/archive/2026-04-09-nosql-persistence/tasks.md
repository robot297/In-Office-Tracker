## 1. Install Dependency

- [x] 1.1 Install `dexie` package (`npm install dexie`)

## 2. Database Setup

- [x] 2.1 Create `src/db.ts` defining the `TrackerDB` class extending `Dexie`
- [x] 2.2 Declare version 1 schema: `sessions` table with `id` as primary key and `start` as secondary index
- [x] 2.3 Export a singleton `db` instance from `src/db.ts`
- [x] 2.4 Wrap the Dexie `open()` call in a try/catch and log a warning if IndexedDB is unavailable

## 3. localStorage Migration

- [x] 3.1 Add migration function to `useSessions` mount effect: read `office-tracker-sessions` from localStorage
- [x] 3.2 If the key exists, call `db.sessions.bulkPut()` with the parsed session array
- [x] 3.3 After successful bulk write, delete the `office-tracker-sessions` localStorage key
- [x] 3.4 Ensure migration runs before the initial Dexie read so migrated data is included on first load

## 4. Rewrite useSessions Hook

- [x] 4.1 Remove `loadSessions` and `saveSessions` localStorage utility functions
- [x] 4.2 Replace synchronous initial state load with `useEffect` that calls `db.sessions.toArray()` on mount
- [x] 4.3 Update `clockIn()` to call `db.sessions.add(newSession)` instead of writing to localStorage
- [x] 4.4 Update `clockOut()` to call `db.sessions.update(id, { end, durationMs })` instead of writing to localStorage
- [x] 4.5 Ensure hook return type (`sessions`, `activeSession`, `clockIn`, `clockOut`) is unchanged

## 5. Verification

- [x] 5.1 Verify sessions persist correctly after a hard page reload
- [x] 5.2 Verify an active session (clocked in) resumes its timer correctly after reload
- [x] 5.3 Verify empty-state renders without errors when the Dexie table is empty
- [x] 5.4 Verify localStorage migration: seed `office-tracker-sessions` manually, reload, confirm data appears and localStorage key is gone
