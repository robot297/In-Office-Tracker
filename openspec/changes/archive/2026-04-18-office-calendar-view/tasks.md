## 1. CalendarDay Component

- [x] 1.1 Create `src/components/CalendarDay.tsx` — pure presentational cell accepting `date: Date`, `status: 'in-office' | 'out-of-office' | 'no-data' | 'future' | 'weekend'`, renders day number with Tailwind color classes per status
- [x] 1.2 Define and export the `DayStatus` type from `CalendarDay.tsx` (or a shared types location)

## 2. Day-Status Computation Utility

- [x] 2.1 Add `getMonthDayStatuses(sessions, oooDates, year, month)` to `storage.ts` — returns a `Map<string, DayStatus>` keyed by `YYYY-MM-DD` for every day of the month, applying the classification rules from the design (in-office > OOO > future > no-data > weekend)

## 3. AttendanceCalendar Component

- [x] 3.1 Create `src/components/AttendanceCalendar.tsx` — owns `displayYear`/`displayMonth` state (initialized to current month)
- [x] 3.2 Implement prev/next month navigation handlers, updating state correctly across year boundaries
- [x] 3.3 Build calendar grid: render a 7-column grid with day-of-week headers (Mon–Sun), fill leading/trailing empty cells for alignment, render a `CalendarDay` for each day of the month
- [x] 3.4 Compute and display the monthly summary: in-office day count, OOO day count, and compliance % using existing `storage.ts` helpers (`getWorkingDaysInMonth`, `countOOOWeekdays`, `getMonthlyTargetMs`, `getMonthlyTotalMs`)

## 4. Wire Into App

- [x] 4.1 Import `AttendanceCalendar` in `App.tsx` and add it as a new card between the Monthly Goal card and the OOO Settings card, passing `sessions` and `oooDates` as props

## 5. Verify

- [x] 5.1 Manually test: current month shows correct in-office/OOO/no-data/future day colors
- [x] 5.2 Manually test: prev/next navigation updates grid and summary correctly
- [x] 5.3 Manually test: a day with both a session and an OOO entry renders as in-office
- [x] 5.4 Manually test: navigating to a future month shows all days as future/neutral
- [x] 5.5 Run `npm run build` (or equivalent) and confirm no TypeScript errors
