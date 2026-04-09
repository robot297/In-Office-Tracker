## 1. Storage Utilities

- [x] 1.1 Add `getWorkingDaysInMonth(year, month): number` to `src/storage.ts` — counts Mon–Fri days in the given month
- [x] 1.2 Add `getMonthlyTargetMs(year, month): number` to `src/storage.ts` — returns `workingDays × 8h × 0.60` in milliseconds
- [x] 1.3 Add `getMonthSessions(sessions, year, month): Session[]` to `src/storage.ts` — filters to completed sessions whose `start` falls in the given month
- [x] 1.4 Add `getMonthlyTotalMs(sessions, year, month): number` to `src/storage.ts` — sums `durationMs` of month sessions

## 2. On-Pace Logic

- [x] 2.1 Add `getElapsedWorkingDays(year, month): number` to `src/storage.ts` — counts Mon–Fri days from the 1st of the month through today (inclusive), capped at total working days
- [x] 2.2 Add `getAttendanceStatus(loggedMs, targetMs, elapsedDays, totalDays): 'on-track' | 'at-risk' | 'behind'` to `src/storage.ts` — returns status based on pace comparison

## 3. MonthlyGoal Component

- [x] 3.1 Create `src/components/MonthlyGoal.tsx` — accepts sessions array as prop
- [x] 3.2 Display target hours for the current month (formatted with `formatDuration`)
- [x] 3.3 Display total logged hours for the current month
- [x] 3.4 Display attendance percentage (logged / target × 100, one decimal place)
- [x] 3.5 Render a progress bar filled to `min(percentage, 100)%` using Tailwind classes
- [x] 3.6 Render the status badge ("On Track" / "At Risk" / "Behind") with green / amber / red Tailwind color treatment

## 4. Integration

- [x] 4.1 Import and render `<MonthlyGoal sessions={sessions} />` in `src/App.tsx`, placed below `<TodaySummary>`

## 5. Verification

- [x] 5.1 Verify target hours are correct for the current month (manually check working-day count)
- [x] 5.2 Verify monthly total updates after clocking out a session
- [x] 5.3 Verify sessions from prior months are excluded from the monthly total
- [x] 5.4 Verify progress bar caps at 100% when logged hours exceed the target
- [x] 5.5 Verify status badge color changes correctly across On Track / At Risk / Behind thresholds
