## Why

The monthly attendance target currently assumes every Monday–Friday in the month is a potential office day, but users sometimes have legitimate out-of-office days (vacation, sick leave, travel, public holidays) that should not count against the 60% requirement. Without a way to mark these days, the target is inflated and the progress indicators become misleading.

## What Changes

- Users can mark specific calendar dates as "out of office" (OOO).
- The monthly target hours calculation excludes OOO days from the working-day count, making the 60% goal reflect only the days the user was expected to be in office.
- The on-pace status and progress bar recalculate against the adjusted target.
- OOO days are persisted so they survive page reloads.
- A calendar or date-picker UI lets users add and remove OOO dates for any month.

## Capabilities

### New Capabilities
- `out-of-office`: Allows users to mark specific dates as out-of-office, persisting those dates and exposing them for use in goal calculations.

### Modified Capabilities
- `monthly-attendance-goal`: Target hours formula changes from `workingDaysInMonth × 8 × 0.60` to `(workingDaysInMonth − ooDaysInMonth) × 8 × 0.60`, where `ooDaysInMonth` is the count of OOO-marked weekdays in the current month.

## Impact

- **UI**: New OOO management section (likely in settings or alongside the monthly goal panel) with a date picker to add/remove dates.
- **Data layer**: New IndexedDB store (via Dexie) for OOO dates keyed by ISO date string.
- **Goal calculation logic**: `monthly-attendance-goal` computation must read OOO dates and subtract matching weekdays from the working-day count before computing the target.
- **No breaking API changes** — this is a self-contained frontend feature.
