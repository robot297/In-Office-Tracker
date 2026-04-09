## ADDED Requirements

### Requirement: Monthly target hours are computed from working days
The system SHALL calculate the required in-office hours for the current calendar month as: `count(Monday–Friday days in month) × 8 × 0.60`.

#### Scenario: Target computed for a standard month
- **WHEN** the user views the app in any calendar month
- **THEN** the system SHALL display the correct target hours based on the number of Mon–Fri days in that month

#### Scenario: Target updates on month change
- **WHEN** the calendar rolls over to a new month
- **THEN** the displayed target hours SHALL reflect the new month's working-day count

### Requirement: Monthly logged hours are aggregated from completed sessions
The system SHALL sum the `durationMs` of all completed sessions (where `end !== null`) whose `start` falls within the current calendar month, and display the result as hours and minutes.

#### Scenario: Sessions from current month are included
- **WHEN** completed sessions exist with a `start` timestamp in the current calendar month
- **THEN** their durations SHALL be summed and displayed as the monthly total

#### Scenario: Sessions from prior months are excluded
- **WHEN** completed sessions exist with a `start` timestamp before the current calendar month
- **THEN** those sessions SHALL NOT contribute to the monthly total

#### Scenario: Active (in-progress) sessions are excluded
- **WHEN** a session is currently active (end === null)
- **THEN** it SHALL NOT be counted toward the monthly total

### Requirement: Monthly attendance percentage is displayed
The system SHALL display the percentage of the monthly target achieved: `(monthly_logged_ms / monthly_target_ms) × 100`, rounded to one decimal place.

#### Scenario: Percentage shown when hours are logged
- **WHEN** the user has logged hours this month
- **THEN** the system SHALL display the attendance percentage

#### Scenario: Zero percentage shown at month start
- **WHEN** no completed sessions exist for the current month
- **THEN** the system SHALL display 0% or equivalent zero state

### Requirement: On-pace status is shown based on elapsed working days
The system SHALL compare the user's logged rate (hours per elapsed working day so far) against the required rate (target hours / total working days in month) and display one of three statuses: On Track (≥ 60% pace), At Risk (40–59% pace), or Behind (< 40% pace).

#### Scenario: On Track status when pace is sufficient
- **WHEN** the user's logged hours per elapsed working day is ≥ 60% of the daily target rate
- **THEN** the status indicator SHALL display "On Track" with a green visual treatment

#### Scenario: At Risk status when pace is moderate
- **WHEN** the user's logged hours per elapsed working day is between 40% and 59% of the daily target rate
- **THEN** the status indicator SHALL display "At Risk" with an amber visual treatment

#### Scenario: Behind status when pace is insufficient
- **WHEN** the user's logged hours per elapsed working day is below 40% of the daily target rate
- **THEN** the status indicator SHALL display "Behind" with a red visual treatment

### Requirement: A progress bar visualizes completion toward the monthly goal
The system SHALL display a horizontal progress bar that fills proportionally to `monthly_logged_ms / monthly_target_ms`, capped at 100%.

#### Scenario: Progress bar reflects logged percentage
- **WHEN** the user has logged 30% of the monthly target
- **THEN** the progress bar SHALL be approximately 30% filled

#### Scenario: Progress bar is capped at 100%
- **WHEN** the user has exceeded the monthly target
- **THEN** the progress bar SHALL display as fully filled (100%) without overflow
