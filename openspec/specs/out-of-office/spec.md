### Requirement: User can mark a date as out of office
The system SHALL allow the user to select any calendar date and mark it as an out-of-office (OOO) day. Only one entry per date SHALL be stored; marking a date that is already marked SHALL be a no-op.

#### Scenario: Adding a new OOO date
- **WHEN** the user selects a date in the OOO date picker and confirms
- **THEN** the date SHALL be saved to the `oooEntries` IndexedDB table as an ISO date string (`YYYY-MM-DD`) and SHALL appear in the OOO date list

#### Scenario: Adding a duplicate OOO date
- **WHEN** the user attempts to mark a date that is already recorded as OOO
- **THEN** no duplicate entry SHALL be created and no error SHALL be shown

### Requirement: User can remove an out-of-office date
The system SHALL allow the user to remove a previously marked OOO date. After removal, the date SHALL no longer affect the monthly target calculation.

#### Scenario: Removing an existing OOO date
- **WHEN** the user clicks the remove/delete action for a date in the OOO list
- **THEN** the entry SHALL be deleted from `oooEntries` and SHALL no longer appear in the list or affect the attendance target

### Requirement: OOO dates are persisted across page reloads
The system SHALL store OOO dates in IndexedDB so that they survive page reloads, tab closures, and browser restarts.

#### Scenario: OOO dates survive reload
- **WHEN** the user has marked one or more dates as OOO and reloads the page
- **THEN** all previously marked OOO dates SHALL still be present in the list

### Requirement: OOO dates for the current month are surfaced in the settings UI
The system SHALL display a list of OOO dates for the current calendar month in the settings panel, along with a date-picker control to add new dates.

#### Scenario: Current month OOO dates are shown
- **WHEN** the user opens the settings panel and at least one OOO date exists in the current month
- **THEN** each date SHALL be listed with a remove action

#### Scenario: Empty state when no OOO dates exist for the month
- **WHEN** no OOO dates have been marked for the current calendar month
- **THEN** the UI SHALL display an appropriate empty state message

### Requirement: Only weekday OOO dates affect the target calculation
The system SHALL only subtract OOO dates that fall on Monday through Friday from the working-day count. OOO entries on Saturday or Sunday SHALL be accepted in storage but SHALL NOT reduce the target.

#### Scenario: Weekend OOO date does not change target
- **WHEN** a user marks a Saturday or Sunday as OOO
- **THEN** the monthly target hours SHALL remain unchanged

#### Scenario: Weekday OOO date reduces target
- **WHEN** a user marks a Monday–Friday date in the current month as OOO
- **THEN** the monthly target hours SHALL decrease by `8 × 0.60` hours (one working day)
