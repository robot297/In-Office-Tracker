## ADDED Requirements

### Requirement: Dexie database is initialised on app load
The system SHALL initialise a Dexie database named `office-tracker` with a `sessions` table on application startup. The database SHALL define `id` as the primary key and `start` as a secondary index.

#### Scenario: Database opens successfully
- **WHEN** the application loads in a browser that supports IndexedDB
- **THEN** the Dexie database SHALL open without errors and the `sessions` table SHALL be accessible

#### Scenario: Database handles unavailable IndexedDB gracefully
- **WHEN** IndexedDB is unavailable (e.g., certain private browsing modes)
- **THEN** the app SHALL log a warning and continue without crashing

### Requirement: Schema versioning is maintained
The database schema SHALL be declared using Dexie's versioning API (`this.version(N).stores(...)`) so that future schema changes can be applied as incremental migrations.

#### Scenario: Version 1 schema is applied on first open
- **WHEN** the database is opened for the first time on a device
- **THEN** Dexie SHALL create the `sessions` object store with `id` as primary key and `start` indexed

### Requirement: localStorage data is migrated on first run
On application startup, if the `office-tracker-sessions` key exists in localStorage, the system SHALL import all session records into IndexedDB using a bulk write, then remove the localStorage key.

#### Scenario: Existing localStorage data is migrated
- **WHEN** the app starts and `office-tracker-sessions` exists in localStorage with one or more sessions
- **THEN** all sessions SHALL be written to the Dexie `sessions` table and the localStorage key SHALL be deleted

#### Scenario: Migration is skipped when no localStorage data exists
- **WHEN** the app starts and `office-tracker-sessions` is absent from localStorage
- **THEN** no migration logic SHALL run and the app SHALL proceed normally
