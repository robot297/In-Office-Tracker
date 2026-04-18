## ADDED Requirements

### Requirement: Calendar displays monthly attendance grid
The system SHALL render a monthly calendar grid showing every day of the selected month. Each day cell SHALL be visually coded by attendance status: in-office, out-of-office, no-data (past weekday with no record), future (today or later with no record), or weekend.

#### Scenario: In-office day is highlighted
- **WHEN** a weekday has at least one completed session whose start date matches that day
- **THEN** the day cell SHALL be rendered with the in-office color/style

#### Scenario: Out-of-office day is highlighted
- **WHEN** a weekday appears in the user's OOO entries
- **THEN** the day cell SHALL be rendered with the out-of-office color/style

#### Scenario: Day in both session and OOO is shown as in-office
- **WHEN** a day has both a completed session and an OOO entry
- **THEN** the day cell SHALL be rendered as in-office

#### Scenario: Past weekday with no data
- **WHEN** a weekday is before today and has no session and no OOO entry
- **THEN** the day cell SHALL be rendered with the no-data style

#### Scenario: Future day
- **WHEN** a day is today or any date after today
- **THEN** the day cell SHALL be rendered with the future/neutral style

#### Scenario: Weekend day
- **WHEN** a day falls on Saturday or Sunday
- **THEN** the day cell SHALL be rendered with the weekend style (visually de-emphasized)

### Requirement: User can navigate between months
The system SHALL provide previous and next month navigation controls. The calendar SHALL initialize to the current calendar month.

#### Scenario: Navigate to previous month
- **WHEN** the user activates the previous-month control
- **THEN** the calendar SHALL display the prior calendar month

#### Scenario: Navigate to next month
- **WHEN** the user activates the next-month control
- **THEN** the calendar SHALL display the following calendar month

#### Scenario: Current month shown on load
- **WHEN** the calendar is first rendered
- **THEN** the displayed month SHALL match the current calendar month

### Requirement: Calendar shows monthly compliance summary
The system SHALL display a summary beneath or above the grid for the displayed month, showing: number of in-office days, number of OOO days, and compliance percentage relative to the 60% target.

#### Scenario: Compliance summary reflects displayed month
- **WHEN** the user navigates to a different month
- **THEN** the summary SHALL update to reflect the in-office days, OOO days, and compliance % for that month

#### Scenario: Compliance percentage calculation
- **WHEN** the summary is rendered for a month
- **THEN** compliance % SHALL equal (in-office days) / (working days − OOO days) × 100, consistent with the existing monthly goal calculation

#### Scenario: Summary for month with no data
- **WHEN** the displayed month has no sessions and no OOO entries
- **THEN** the summary SHALL show 0 in-office days, 0 OOO days, and 0% compliance without error
