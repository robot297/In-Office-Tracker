## 1. Data Layer — OOO persistence

- [x] 1.1 Add `OOOEntry` interface to `src/types.ts` with a single `date: string` field (ISO `YYYY-MM-DD`)
- [x] 1.2 Add `oooEntries` table to `TrackerDB` in `src/db.ts` as version 3, primary key `date`
- [x] 1.3 Create `src/hooks/useOOOEntries.ts` using `useLiveQuery` to return all OOO entries, plus `addOOO(date: string)` and `removeOOO(date: string)` helpers

## 2. Calculation Updates — storage.ts

- [x] 2.1 Update `getMonthlyTargetMs(year, month, ooWeekdayCount?: number)` to subtract `ooWeekdayCount` weekdays before multiplying by `8 × 0.60`
- [x] 2.2 Update `getElapsedWorkingDays(year, month, ooWeekdaysPassed?: number)` to subtract OOO weekdays that fall on or before today
- [x] 2.3 Add a pure helper `countOOOWeekdays(oooDates: string[], year: number, month: number, upToDate?: Date): number` that filters the OOO date list to weekdays within the given month (and optionally on/before `upToDate`)

## 3. UI — OOO Management in Settings

- [x] 3.1 Add an "Out of Office" section to `src/components/NetworkSettings.tsx` (or create `src/components/OOOSettings.tsx` and include it alongside the network settings)
- [x] 3.2 Add a date-picker `<input type="date">` and "Add" button to submit a new OOO date via `addOOO`
- [x] 3.3 Render the list of OOO dates for the current month, each with a "Remove" button wired to `removeOOO`
- [x] 3.4 Show an empty-state message when no OOO dates exist for the current month
- [x] 3.5 Visually indicate (warning/info note) if a selected date falls on a weekend, explaining it won't affect the target

## 4. UI — Monthly Goal Panel Updates

- [x] 4.1 Pass `ooWeekdayCount` and `ooWeekdaysPassed` (derived from `useOOOEntries`) into `MonthlyGoal` component props
- [x] 4.2 Update `MonthlyGoal.tsx` to call the updated `getMonthlyTargetMs` and `getElapsedWorkingDays` with OOO counts
- [x] 4.3 Display an "X day(s) out of office" label near the target figure when `ooWeekdayCount > 0`
- [x] 4.4 Hide the OOO label when no weekday OOO dates exist for the current month

## 5. Wire-up & Integration

- [x] 5.1 Add `useOOOEntries` call in `App.tsx` (or appropriate parent) and thread OOO data down to `MonthlyGoal` and the settings section
- [x] 5.2 Verify the progress bar, percentage, and on-pace status all recalculate correctly with an active OOO day set
- [x] 5.3 Verify OOO dates persist across a hard page reload (open DevTools → Application → IndexedDB to confirm)
