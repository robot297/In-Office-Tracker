## Context

The app is a single-page React app with no router — all content is stacked vertically in `App.tsx`. Data comes from three sources: `useSessions` (clock-in/out records), `useOOOEntries` (out-of-office dates), and `useSettings` (prefs). Existing utilities in `storage.ts` already handle month-level session aggregation and OOO counting.

The calendar needs to classify each calendar day into one of three states:
- **In office** — at least one completed session starts on that date
- **Out of office** — the date appears in `oooDates`
- **No data** — weekday with neither, or a weekend

## Goals / Non-Goals

**Goals:**
- Render a monthly calendar grid showing per-day attendance status
- Support prev/next month navigation
- Show a monthly compliance summary (days in, OOO days, compliance %)
- Add the calendar as a new card/section in the existing single-page layout
- Work entirely from existing data — no new storage or schema needed

**Non-Goals:**
- Drill-down to individual session detail per day
- Editing sessions or OOO entries from within the calendar
- Weekly or yearly views
- Date range selection

## Decisions

### 1. Inline card vs. separate route
**Decision:** Add as a new card in the existing `App.tsx` scroll layout, consistent with how Session History is handled.  
**Why:** The app has no router and adding one is out of scope. A card follows the established pattern and keeps complexity low.  
**Alternative considered:** Tab-based navigation — would require adding a router or custom tab state; deferred.

### 2. Day classification logic
**Decision:** Derive per-day status by grouping sessions by their `start` date string (`YYYY-MM-DD`) and cross-referencing `oooDates`.  
**Why:** `Session.start` is ISO-8601; slicing to 10 chars gives the date key. Both data sources are already in memory.  
**Rule:** If a day appears in both sessions and OOO, show it as **in-office** (the user was physically present).

### 3. Component structure
- `AttendanceCalendar` — stateful shell: owns `displayYear`/`displayMonth`, handles prev/next navigation, computes the day-status map, renders the grid and summary
- `CalendarDay` — pure presentational cell: receives `date`, `status` (`in-office | out-of-office | no-data | future | weekend`), renders with appropriate color

### 4. Compliance summary calculation
Reuse existing `storage.ts` helpers (`getWorkingDaysInMonth`, `countOOOWeekdays`, `getMonthlyTotalMs`, `getMonthlyTargetMs`) to compute in-office days and compliance % for the displayed month.  
In-office day count = number of distinct weekdays that have at least one session.

## Risks / Trade-offs

- **Sessions spanning midnight** → only the `start` date is used for classification; a rare overnight session would count only on the start day. Acceptable given typical usage.
- **Future months** → days after today are shown as `future` (neutral/grey) rather than "no data" to avoid confusion.
- **Performance** → grouping sessions by date on every render is O(n) over the session list; negligible for typical usage volumes.
