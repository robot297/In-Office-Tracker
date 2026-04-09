## Why

Users need to know whether they are on track to meet a 60% in-office attendance requirement for the month. Without a clear, at-a-glance indicator, employees must manually count days and do mental math — which is error-prone and time-consuming.

## What Changes

- Add a **Monthly Attendance Goal** panel to the app that shows:
  - The required number of in-office hours for the current month (based on 40 h/week × 60%)
  - Total hours already logged this month
  - Percentage of the monthly goal achieved
  - A clear pass/fail / on-track status indicator
- Calculate working days per month dynamically (Monday–Friday, excluding the current month's weekend days)
- Display a progress bar or visual indicator showing completion toward the 60% threshold

## Capabilities

### New Capabilities

- `monthly-attendance-goal`: Tracks whether the user has met or is on track to meet 60% in-office attendance for the current month, based on a 40 h/week office job expectation.

### Modified Capabilities

- `session-history`: Needs to support querying sessions scoped to the current calendar month (not just today) to supply data to the attendance goal calculation.

## Impact

- **UI**: New panel/card added to `App.tsx` or as a new component alongside `TodaySummary`
- **Logic**: New utility functions in `storage.ts` (or a dedicated file) to compute monthly working hours target and aggregate monthly session data
- **Hooks**: `useSessions.ts` may need to expose month-scoped session data
- **No backend or dependency changes required** — all calculations are client-side
