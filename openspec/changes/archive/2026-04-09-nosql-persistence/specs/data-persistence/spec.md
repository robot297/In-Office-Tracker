## MODIFIED Requirements

### Requirement: Sessions are saved to the database automatically
The system SHALL save all session data to IndexedDB via Dexie automatically on every state change (clock in, clock out). Sessions SHALL be stored individually by `id`, not as a serialised array.

#### Scenario: Data persists after page reload
- **WHEN** the user has one or more sessions and reloads the page
- **THEN** all sessions SHALL be present in the history list and any active session SHALL resume displaying its running timer

#### Scenario: Data saved on clock in
- **WHEN** the user clicks "Clock In"
- **THEN** the new active session SHALL immediately be written to the Dexie `sessions` table

#### Scenario: Data saved on clock out
- **WHEN** the user clicks "Clock Out"
- **THEN** the completed session SHALL be updated in the Dexie `sessions` table with `end` and `durationMs` populated

### Requirement: App loads saved data on startup
The system SHALL read all sessions from IndexedDB on page load and restore them (including any in-progress session) before rendering the UI.

#### Scenario: Active session restored on reload
- **WHEN** the user was clocked in and reloads the page
- **THEN** the app SHALL detect the session with `end: null`, resume the running timer from the original start time, and show the active-session UI

#### Scenario: No data in storage is handled gracefully
- **WHEN** the Dexie `sessions` table is empty
- **THEN** the app SHALL start with an empty session list and idle clock-in state without errors

## REMOVED Requirements

### Requirement: Sessions are saved to localStorage automatically
**Reason**: localStorage replaced by IndexedDB (Dexie.js) for better queryability and scalability.
**Migration**: All existing localStorage data is automatically imported into IndexedDB on first app load after this change is deployed.
