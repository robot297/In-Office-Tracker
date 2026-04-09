## ADDED Requirements

### Requirement: User can clock in
The system SHALL allow the user to start an office session by clicking a "Clock In" button. Only one active session SHALL exist at a time.

#### Scenario: Successful clock in
- **WHEN** no active session exists and the user clicks "Clock In"
- **THEN** a new session is created with the current timestamp as `start`, `end` set to `null`, and the UI switches to the active-session view showing a running timer

#### Scenario: Clock in disabled during active session
- **WHEN** an active session already exists
- **THEN** the "Clock In" button SHALL NOT be visible or SHALL be disabled

### Requirement: User can clock out
The system SHALL allow the user to end the current active session by clicking a "Clock Out" button. The session SHALL be finalized with the current timestamp as `end` and `durationMs` calculated.

#### Scenario: Successful clock out
- **WHEN** an active session exists and the user clicks "Clock Out"
- **THEN** the active session's `end` is set to the current timestamp, `durationMs` is computed, the session is saved, and the UI returns to the idle state

#### Scenario: Clock out disabled when not clocked in
- **WHEN** no active session exists
- **THEN** the "Clock Out" button SHALL NOT be visible or SHALL be disabled

### Requirement: Running timer displayed during active session
The system SHALL display a live-updating timer showing how long the current session has been running.

#### Scenario: Timer updates every second
- **WHEN** an active session is in progress
- **THEN** the elapsed time SHALL update once per second in HH:MM:SS format
