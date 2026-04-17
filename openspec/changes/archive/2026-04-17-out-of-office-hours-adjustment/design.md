## Context

The tracker computes the monthly 60% attendance target with `getWorkingDaysInMonth(year, month) × 8h × 0.60` in [src/storage.ts](../../../../../src/storage.ts). That count treats every Monday–Friday as a potential office day. Users who take vacation, sick leave, or face public holidays have an inflated target with no way to adjust it. The proposal introduces an **out-of-office (OOO)** concept: a persisted set of date strings representing days the user should not be in the office, which are subtracted from the working-day count before the target is calculated.

The app is a self-contained React + Dexie (IndexedDB) frontend — no backend. Existing patterns: Dexie tables for each domain entity, React hooks wrapping Dexie queries, pure helper functions in `storage.ts` for calculations, and component-level composition in `App.tsx`.

## Goals / Non-Goals

**Goals:**
- Let users mark/unmark specific calendar dates as out-of-office.
- Persist OOO dates in IndexedDB so they survive reloads.
- Subtract OOO weekdays from the working-day count used in the monthly target formula.
- Reflect the adjusted target in progress bar, percentage, and on-pace status without changing their visual design.
- Show the number of OOO days applied this month alongside the target, so the adjustment is transparent.

**Non-Goals:**
- Recurring/bulk OOO entries (e.g., "every Friday in July") — single-date management only for now.
- Syncing OOO dates across devices or users.
- Editing past months' OOO days from within the monthly goal panel (users can still open settings to manage any date).
- Integration with external calendars (Google Calendar, Outlook).

## Decisions

### 1. New Dexie table `oooEntries` — not a reused `appSettings` key

**Decision**: Add a dedicated `oooEntries` table (`db.version(3)`) with schema `date` (ISO date string `YYYY-MM-DD`, primary key).

**Rationale**: Storing OOO dates as a JSON blob inside `appSettings` would require reading and deserialising the whole array on every render and would not support efficient per-month queries. A dedicated table with an indexed `date` field lets Dexie filter by month prefix (`BETWEEN '2026-04-01' AND '2026-04-30'`) without loading unrelated months.

**Alternative considered**: Single `appSettings` key `ooo_dates` holding a JSON array. Rejected because it doesn't scale and loses Dexie's query benefits.

---

### 2. Pure functions accept an `ooDays` count — no global state reads inside `storage.ts`

**Decision**: Extend `getMonthlyTargetMs` and `getElapsedWorkingDays` to accept an optional `ooWeekdayCount: number` parameter. Callers (hooks/components) resolve OOO dates from the DB and pass the count in.

**Rationale**: `storage.ts` currently contains only pure, synchronous helpers. Keeping it side-effect-free makes the logic trivially testable and avoids threading async DB calls into the calculation layer.

**Alternative considered**: Have `getMonthlyTargetMs` call Dexie internally. Rejected because it turns a pure function async and entangles the calculation layer with the persistence layer.

---

### 3. New `useOOOEntries` hook mirrors existing hook patterns

**Decision**: Add `src/hooks/useOOOEntries.ts` returning `{ oooDates, addOOO, removeOOO }`. The hook uses `useLiveQuery` (from `dexie-react-hooks`) exactly as `useSessions` does.

**Rationale**: Consistency with existing conventions (`useSettings`, `useSessions`) — the rest of the app already relies on `useLiveQuery` for reactive DB reads.

---

### 4. OOO management UI inside the existing Settings panel

**Decision**: Add an "Out of Office" section to `NetworkSettings.tsx` (renamed `Settings.tsx` if needed, or added as a sibling section) rather than creating a new top-level panel.

**Rationale**: The settings panel is already the home for user-configurable behaviour (network rules, auto-clock toggle). Adding OOO management there avoids cluttering the main dashboard. A simple date-picker input + list of current month's OOO dates is sufficient for the MVP.

**Alternative considered**: Inline calendar widget on the MonthlyGoal card. Rejected as too visually heavy for the compact dashboard layout.

## Risks / Trade-offs

- **Dexie schema migration risk** → Using `db.version(3)` with only the new table added; existing tables carry over unchanged. Dexie handles additive migrations automatically. Rollback: removing version 3 entry leaves a harmless empty table (IndexedDB ignores unknown stores on downgrade).
- **OOO dates outside weekdays** → Users could theoretically mark a Saturday as OOO. Mitigation: filter OOO dates to weekdays only when computing the subtracted count, and show a warning in the UI if a weekend date is selected.
- **Elapsed-day adjustment complexity** → `getElapsedWorkingDays` should also subtract OOO days that have already passed in the current month so the pace calculation stays accurate. This requires passing `ooWeekdaysPassed` (OOO weekdays on or before today) separately from the total `ooWeekdaysInMonth`. The hook computes both counts before calling the helpers.
