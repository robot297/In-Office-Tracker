## Context

The tracker is a browser-based React/TypeScript app (Vite) that uses Dexie/IndexedDB for persistence. Clock-in/out is currently fully manual via `useSessions` hook exposing `clockIn()` and `clockOut()` functions.

Browsers have very limited network introspection — there is no API to read SSIDs, VPN adapter names, or IP ranges from a web page due to sandboxing. Reliable network-based detection therefore requires one of:
1. A periodic HTTP probe to a known internal endpoint (works for VPN/office networks that expose an internal URL)
2. A native desktop wrapper (Electron/Tauri) that can read interface metadata
3. A user-installed browser extension with `webRequest` permissions

This design targets **option 1 (HTTP probe)** as the lowest-friction path that works without native code, while leaving the door open for native extension later.

## Goals / Non-Goals

**Goals:**
- Let users configure one or more "network rules" — each rule is a probe URL that is reachable only on the target network (VPN or office LAN)
- Periodically probe configured URLs; clock in when a probe succeeds and no session is active; clock out when all probes fail and a session is active
- Provide a settings panel to add/remove/test network rules and set the probe interval
- Show an in-app indicator whenever auto clock-in or clock-out occurs
- Gracefully co-exist with manual clock-in/out (auto events don't override explicit manual actions within a grace period)

**Non-Goals:**
- SSID or network interface detection (requires native layer, deferred)
- VPN adapter name detection from the browser
- Automatic clock-out when the machine sleeps/locks (separate concern)
- Multi-profile support or per-network work categories

## Decisions

### D1: Probe-based detection over native APIs
**Decision:** Use periodic `fetch` to a user-configured internal URL to infer network presence.  
**Rationale:** Browser sandbox blocks SSID/interface reading. An internal URL (e.g., `http://internal.corp/ping`) is only reachable when on VPN or office network — a successful response means the network is available.  
**Alternative considered:** Browser extension — rejected because it requires a separate install step and publishing to extension stores.

### D2: Polling interval with `setInterval` in a React hook
**Decision:** Implement network detection as a `useNetworkDetection` hook that runs `setInterval` polling.  
**Rationale:** Keeps detection logic in React's lifecycle; cleans up automatically on unmount. The interval is user-configurable (default 60s).  
**Alternative considered:** Service Worker — more complex lifecycle, harder to debug, overkill for this use case.

### D3: Settings persisted in IndexedDB alongside sessions
**Decision:** Store network rules (probe URL, label, enabled flag) and the auto-clock preference in a new `settings` Dexie table.  
**Rationale:** Consistent with existing persistence layer (db.ts/Dexie). Avoids mixing storage backends.  
**Alternative considered:** `localStorage` — simpler but inconsistent with existing architecture.

### D4: Grace period for manual override
**Decision:** After a manual clock-in or clock-out, suppress auto events for 5 minutes.  
**Rationale:** Prevents the auto system from immediately undoing an intentional manual action (e.g., user manually clocks out to take a lunch break while still on VPN).

### D5: CORS-friendly probe with `no-cors` mode
**Decision:** Probes use `fetch(url, { method: 'HEAD', mode: 'no-cors', cache: 'no-store' })`. A network error means unreachable; any response (even opaque) means reachable.  
**Rationale:** Internal endpoints typically won't have CORS headers. `no-cors` lets the request succeed at the network level; we only care whether it resolves, not the response body.

## Risks / Trade-offs

- **False positives on cached DNS** → Mitigation: use `cache: 'no-store'` on probes; short TTL.
- **Probe URL becomes a security consideration** — users must not enter external URLs they don't control → Mitigation: warn in settings UI that the URL should be an internal endpoint; no credentials are sent.
- **Battery/performance impact of frequent polling** → Mitigation: default interval is 60s; Page Visibility API pauses polling when tab is hidden.
- **HTTPS mixed-content issues** — if the app is served over HTTPS, probing an `http://` internal URL will be blocked by the browser → Mitigation: document this; suggest users run the app locally (already a dev-mode app) or use an HTTPS internal endpoint.
- **Probe URL going down for reasons unrelated to network** → Mitigation: require 2 consecutive failures before triggering clock-out to avoid false negatives from transient server hiccups.

## Migration Plan

1. Add `settings` table to Dexie schema (additive, no migration of existing data needed)
2. Ship feature behind a settings toggle (off by default) — no behavior change for existing users until they opt in
3. No rollback needed; disabling the toggle restores fully manual behavior
