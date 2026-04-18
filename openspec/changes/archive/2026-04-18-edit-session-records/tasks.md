## 1. Data Layer

- [x] 1.1 Add `updateSession(id: string, patch: { start: string; end: string; durationMs: number }) => Promise<void>` method to `src/db.ts`
- [x] 1.2 Add `updateSession` function to `src/hooks/useSessions.ts` that recalculates `durationMs` from the new start/end and calls `db.updateSession`, then refreshes sessions state

## 2. SessionRow Component

- [x] 2.1 Add `isEditing`, `editValues`, `onEditChange`, `onSave`, `onCancel`, and `onEditStart` props to `SessionRow` in `src/components/SessionRow.tsx`
- [x] 2.2 Render read-only view with an "Edit" button when `isEditing` is false
- [x] 2.3 Render inline `<input type="datetime-local">` fields for start and end when `isEditing` is true
- [x] 2.4 Show "Save" and "Cancel" buttons in edit mode
- [x] 2.5 Display an inline validation error message when save is attempted with invalid values (end ≤ start or missing end)

## 3. SessionHistory Component

- [x] 3.1 Add `editingId: string | null` and `editValues: { start: string; end: string }` state to `src/components/SessionHistory.tsx`
- [x] 3.2 Implement `handleEditStart(id)` — sets `editingId` and pre-populates `editValues` from the session, auto-cancelling any previously open edit
- [x] 3.3 Implement `handleEditChange(field, value)` — updates draft `editValues`
- [x] 3.4 Implement `handleSave(id)` — validates, calls `useSessions.updateSession`, and clears edit state
- [x] 3.5 Implement `handleCancel()` — clears edit state without saving
- [x] 3.6 Pass edit props to each `SessionRow`

## 4. Validation & Edge Cases

- [x] 4.1 Ensure "Edit" button is not shown for the currently active (open) session
- [x] 4.2 Verify that saving a session with a corrected start/end correctly updates the `TodaySummary` and `MonthlyGoal` totals (they re-derive from sessions state, so this should be automatic — confirm with a quick smoke test)
