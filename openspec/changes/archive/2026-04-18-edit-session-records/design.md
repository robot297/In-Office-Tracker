## Context

The app stores clock-in/out records as `Session` objects in IndexedDB (via Dexie). The `SessionHistory` component renders these as a read-only table through `SessionRow` components. There is currently no mutation path other than creating new sessions or deleting them. The `useSessions` hook owns all session state and interacts with the Dexie `db.sessions` table.

## Goals / Non-Goals

**Goals:**
- Let users correct the `start` and `end` times of any completed (non-active) session
- Automatically recalculate `durationMs` on save
- Validate that edits don't produce an end-before-start or overlap with an ongoing active session
- Keep the edit UX inline within the existing session row — no modal needed

**Non-Goals:**
- Editing the currently active (open) session — use the existing clock-out flow
- Bulk editing multiple sessions at once
- An audit log / history of edits
- Splitting or merging sessions

## Decisions

### 1. Edit state lives in `SessionHistory`, not a global store

Each `SessionRow` is dumb — it receives `isEditing`, `editValues`, and callbacks as props. `SessionHistory` tracks `editingId: string | null` and the draft `{start, end}` values. This avoids lifting state into the hook and keeps undo/cancel trivial (just clear `editingId`).

**Alternatives considered:** lifting state into `useSessions` — rejected because edit drafts are transient UI state, not persistent data.

### 2. `updateSession` added to `useSessions` hook

A new `updateSession(id, patch)` function updates the Dexie record and refreshes the sessions list in React state. `durationMs` is recalculated inside the hook before writing to DB, so no caller needs to compute it.

**Alternatives considered:** calling `db.sessions.update()` directly from the component — rejected to keep DB access centralized.

### 3. Inline time inputs (datetime-local `<input>`)

HTML `<input type="datetime-local">` gives a native date/time picker without adding a dependency. The value is a local datetime string; it will be converted to/from the ISO-8601 UTC strings stored in the DB using the existing date formatting utilities.

**Alternatives considered:** a third-party date picker — rejected to avoid new dependencies for a simple use case.

### 4. Validation client-side only

Since this is a local-only IndexedDB app with a single user, server-side validation is not applicable. Client-side validation on save is sufficient.

## Risks / Trade-offs

- **Timezone edge case** → `datetime-local` inputs work in local time; converting to/from UTC must be done consistently. Use `new Date(localString).toISOString()` on save and the existing time-formatting util on display. Test around midnight.
- **Only one row editable at a time** → Clicking edit on a second row while one is open will discard unsaved changes silently. Mitigation: cancel the previous edit automatically (or block — chosen: auto-cancel to keep UX simple).
- **No undo after save** → Once saved to IndexedDB the change is permanent. Mitigation: in-row cancel before save covers the common fat-finger case.
