## Why

Tracking time spent in the office manually is error-prone and inconvenient. A dedicated web app with persistent storage allows users to clock in/out and review their office attendance history at a glance.

## What Changes

- Introduce a new web application for office time tracking
- Add clock-in / clock-out functionality with timestamps
- Persist session data to local storage (or a lightweight backend) so history survives page refreshes
- Display a history of past office sessions with durations
- Show the current session duration in real time

## Capabilities

### New Capabilities

- `clock-in-out`: Start and stop office sessions by clicking a button; records start/end timestamps
- `session-history`: View a list of all past office sessions with date, duration, and notes
- `data-persistence`: Automatically save and load session data so it survives page reloads

### Modified Capabilities

<!-- None — this is a brand new application -->

## Impact

- New web app (HTML/CSS/JS or lightweight framework such as React/Vue)
- Browser localStorage (or a simple JSON file backend) for persistence
- No external dependencies required beyond a basic frontend stack
