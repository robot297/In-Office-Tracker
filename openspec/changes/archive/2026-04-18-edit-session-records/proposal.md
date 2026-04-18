## Why

Users occasionally clock in or out at the wrong time and have no way to correct it, leading to inaccurate time records and skewed monthly compliance calculations. Providing an edit capability lets users maintain accurate attendance data without needing to delete and recreate sessions.

## What Changes

- Add an inline edit mode to each row in the `SessionHistory` table
- Allow editing the `start` and `end` timestamps of any completed session
- Recalculate and persist `durationMs` automatically after an edit
- Prevent edits that would create invalid sessions (end before start, overlap with active session)

## Capabilities

### New Capabilities

- `session-editing`: Inline editing of clock-in and clock-out timestamps for past sessions, with validation and automatic duration recalculation

### Modified Capabilities

- (none)

## Impact

- `src/components/SessionRow.tsx` — add edit/save/cancel controls and editable time inputs
- `src/components/SessionHistory.tsx` — manage which row (if any) is in edit mode
- `src/hooks/useSessions.ts` — add `updateSession` mutation that writes to Dexie and refreshes state
- `src/db.ts` — expose an `updateSession` method on the Dexie database instance
- `src/types.ts` — no schema changes needed; `Session` fields are already sufficient
