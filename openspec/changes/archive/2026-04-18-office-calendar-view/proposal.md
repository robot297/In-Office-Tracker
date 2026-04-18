## Why

Users currently have no visual way to review their attendance history — they can only see raw session logs. A calendar view gives users an at-a-glance picture of which days they were in the office, which days they were out, and how that maps to their 60% compliance goal.

## What Changes

- Add a new Calendar screen accessible from the main navigation
- Render a monthly calendar grid where each day is color-coded: in-office, out-of-office, or no data
- Allow users to navigate between months
- Show a summary bar for the displayed month (days in, days out, compliance %)

## Capabilities

### New Capabilities
- `office-calendar-view`: Monthly calendar UI that visualizes daily attendance status (in-office, out-of-office, no data) with month navigation and a monthly compliance summary

### Modified Capabilities
<!-- None — existing data-persistence and session-history specs are not changing requirements, only being consumed by the new view -->

## Impact

- New React component(s) under `src/components/`
- Reads from existing session history and out-of-office data (no schema changes)
- New route/tab added to `src/App.tsx`
- No API or database schema changes required
