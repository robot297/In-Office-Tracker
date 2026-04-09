## ADDED Requirements

### Requirement: History list shows all completed sessions
The system SHALL display a list of all completed (clocked-out) sessions in reverse-chronological order (newest first).

#### Scenario: History list renders completed sessions
- **WHEN** the page loads and completed sessions exist in storage
- **THEN** each session SHALL be displayed with its date, start time, end time, and formatted duration

#### Scenario: Empty state when no sessions exist
- **WHEN** no completed sessions exist
- **THEN** the history area SHALL display a message indicating no sessions have been recorded yet

### Requirement: Today's total is shown
The system SHALL display the total time spent in the office for the current calendar day, summing all completed sessions from today.

#### Scenario: Today's total updates after clock out
- **WHEN** the user clocks out of a session that started today
- **THEN** today's total duration SHALL update to include the just-completed session

#### Scenario: Today's total is zero when no sessions today
- **WHEN** no completed sessions exist for the current calendar day
- **THEN** today's total SHALL display as 0h 0m or equivalent zero state

### Requirement: Session duration is formatted clearly
Each session in the history list SHALL display its duration in a human-readable format (e.g., "2h 34m").

#### Scenario: Duration formatted for display
- **WHEN** a session with a known durationMs is rendered in the history list
- **THEN** the duration SHALL be shown as hours and minutes (e.g., "1h 05m"), not raw milliseconds
