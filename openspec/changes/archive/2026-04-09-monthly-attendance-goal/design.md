## Context

The Office Time Tracker already records clock-in/clock-out sessions in IndexedDB via Dexie. It currently shows today's total hours (`TodaySummary`) and a full session history (`SessionHistory`). There is no concept of a goal or target — users have no way to know if their accumulated hours meet any threshold.

The requirement is a **60% in-office attendance rate** against a standard 40 h/week workload. For a given calendar month, the target office hours are:

```
working_days_in_month × 8 h/day × 0.60
```

Working days = Monday–Friday count for the calendar month (no holiday exclusions in scope).

All data is client-side (IndexedDB). No backend or auth system exists.

## Goals / Non-Goals

**Goals:**
- Compute the monthly target hours for the current calendar month
- Aggregate completed session hours for the current calendar month
- Display: hours logged, hours required, percentage toward goal, and a clear on-track/at-risk status
- Update in real time as new sessions are completed

**Non-Goals:**
- Public holiday or PTO exclusions (working days = Mon–Fri only)
- Historical months / month navigation
- Push notifications or reminders
- Configurable attendance % or hours/week target (hardcoded to 60% / 40 h for now)
- Server-side persistence

## Decisions

### 1. Monthly working-hours target computed client-side in `storage.ts`

**Decision**: Add `getMonthlyTargetMs()` and `getMonthlyTotalMs(sessions)` pure functions alongside the existing `getTodayTotal`.

**Rationale**: Keeps all business logic in one place, easily testable, and consistent with the existing pattern. No new files needed for pure utilities.

**Alternative considered**: Compute inside the component — rejected because it mixes display and logic concerns, making future testing harder.

---

### 2. Working-day count via date iteration (no external library)

**Decision**: Count Mon–Fri days in the current month by iterating from the 1st to the last day of the month.

**Rationale**: The project has zero runtime dependencies beyond React and Dexie. Adding a date library (date-fns, dayjs) for a single utility would be overkill. The iteration approach is ~10 lines and trivially correct.

---

### 3. New `MonthlyGoal` component, placed below `TodaySummary`

**Decision**: Create `src/components/MonthlyGoal.tsx`. It reads from `useSessions` (same hook already used by all other components) and renders the monthly progress card.

**Rationale**: Consistent with existing component pattern. The hook already has all sessions; filtering to the current month is a pure transformation — no state changes needed.

---

### 4. Progress bar with color-coded status

**Decision**: Show a Tailwind-styled progress bar. Green when ≥ 60% of the monthly goal is reached (or on pace given elapsed working days), amber when between 40–59%, red when below 40%.

**Rationale**: A numeric percentage alone requires the user to interpret it. A color-coded bar provides instant at-a-glance feedback — the core user need.

**"On pace" definition**: Compare `(hours_logged / hours_elapsed_so_far_this_month)` against the 60% target rate, rather than just raw total vs. full-month target. This avoids showing "behind" on day 1 of the month.

---

### 5. Active session hours are excluded from the monthly total

**Decision**: Only count completed sessions (`end !== null`) toward the monthly total, matching the existing `getTodayTotal` behavior.

**Rationale**: Consistency. An in-progress session's duration is indeterminate until clock-out.

## Risks / Trade-offs

| Risk | Mitigation |
|------|-----------|
| Working-day count ignores public holidays | Documented as a non-goal; acceptable for v1 |
| "On pace" calculation may confuse users if they clock in irregularly (e.g., only afternoons) | UI label clarifies it shows *pace* vs. target, not a guarantee |
| Month boundary edge case: sessions that span midnight at month end | Session `start` determines which month it belongs to — consistent with `getTodayTotal` approach |
