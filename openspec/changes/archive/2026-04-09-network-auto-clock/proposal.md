## Why

Users want the app to automatically clock in and out based on their network connection — joining a work VPN or physical office network should trigger a clock-in, and leaving should trigger a clock-out. This removes the manual step of remembering to clock in/out and improves accuracy of tracked time.

## What Changes

- Add a network detection service that monitors the user's active network interfaces and identifies known work networks (by SSID, IP range, or VPN adapter presence)
- Add a settings UI where users can configure which networks trigger automatic clock-in/out
- Auto clock-in when a configured network is detected and no active session exists
- Auto clock-out when the user disconnects from all configured networks and a session is active
- Show a notification/indicator when auto clock-in/out occurs so the user is aware

## Capabilities

### New Capabilities
- `network-detection`: Monitors network connectivity and detects known work networks (VPN or physical)
- `auto-clock`: Automatically starts and stops sessions based on network detection events, with user-configurable network rules

### Modified Capabilities
- `clock-in-out`: Clock-in/out can now be triggered automatically (not just manually); behavior must remain consistent whether triggered manually or by network events

## Impact

- New browser APIs: `navigator.connection`, Network Information API, and periodic polling via `setInterval` (browser environment is limited — full network detection may require a companion native layer or Electron/Tauri context)
- New settings storage keys for configured networks
- `useSessions` hook may need to expose a programmatic clock-in/out interface
- `ClockButton.tsx` and session state must handle concurrent auto/manual triggers gracefully
- Potential dependency on a native bridge if running as a desktop app (Electron/Tauri) for reliable VPN/interface detection
