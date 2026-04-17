## 1. Data Model & Persistence

- [x] 1.1 Add a `settings` table to Dexie schema in `db.ts` with a `networkRules` record type (id, label, probeUrl, enabled) and an `autoClockEnabled` boolean setting
- [x] 1.2 Create `src/types.ts` entries for `NetworkRule` and `AutoClockSettings`
- [x] 1.3 Write a `useSettings` hook in `src/hooks/useSettings.ts` that loads/saves settings from the Dexie `settings` table

## 2. Network Detection Hook

- [x] 2.1 Create `src/hooks/useNetworkDetection.ts` implementing periodic probe logic using `fetch` with `mode: 'no-cors'` and `cache: 'no-store'`
- [x] 2.2 Implement consecutive-failure counter (require 2 failures before marking unreachable)
- [x] 2.3 Pause polling using the Page Visibility API (`document.addEventListener('visibilitychange', ...)`)
- [x] 2.4 Expose `isWorkNetworkReachable: boolean` and `lastChecked: Date | null` from the hook
- [x] 2.5 Accept configurable poll interval (default 60 000 ms) from settings

## 3. Auto Clock Logic

- [x] 3.1 Create `src/hooks/useAutoClock.ts` that consumes `useNetworkDetection` and `useSessions`
- [x] 3.2 Implement auto clock-in: call `clockIn()` when `isWorkNetworkReachable` transitions to `true`, no active session exists, and grace period is not active
- [x] 3.3 Implement auto clock-out: call `clockOut()` when `isWorkNetworkReachable` transitions to `false` (after 2 failures), active session exists, and grace period is not active
- [x] 3.4 Implement 5-minute grace period: record timestamp of last manual clock-in/out and suppress auto events within the window
- [x] 3.5 Expose `lastAutoEvent: { type: 'clock-in' | 'clock-out'; at: Date } | null` for notification display

## 4. In-App Notification

- [x] 4.1 Create `src/components/AutoClockNotification.tsx` — a transient banner that shows when an auto event occurs and auto-dismisses after 4 seconds
- [x] 4.2 Wire the notification to `lastAutoEvent` from `useAutoClock`

## 5. Settings UI

- [x] 5.1 Create `src/components/NetworkSettings.tsx` with a toggle to enable/disable auto-clock
- [x] 5.2 Add a list of configured network rules with label, probe URL, enabled checkbox, and delete button
- [x] 5.3 Add an "Add Rule" form (label + URL inputs + submit button)
- [x] 5.4 Add a "Test" button per rule that runs a one-off probe and shows Reachable/Unreachable inline feedback
- [x] 5.5 Add a poll interval input (seconds) that saves to settings

## 6. Integration

- [x] 6.1 Mount `useAutoClock` at the app root in `App.tsx` so it runs for the app's lifetime
- [x] 6.2 Render `<AutoClockNotification />` in `App.tsx` above the main content
- [x] 6.3 Add a "Network Settings" section or tab to the existing UI that renders `<NetworkSettings />`
- [x] 6.4 Pass `onManualClockIn` / `onManualClockOut` callbacks from `useSessions` through `useAutoClock` to record grace-period timestamps on manual actions
