## MODIFIED Requirements

### Requirement: Monthly target hours are computed from working days
The system SHALL calculate the required in-office hours for the current calendar month as: `(count(Monday–Friday days in month) − count(OOO weekdays in month)) × 8 × 0.60`. A working day is excluded from the count if it has a matching entry in `oooEntries`.

#### Scenario: Target computed for a standard month with no OOO days
- **WHEN** the user views the app in any calendar month and has marked no OOO dates
- **THEN** the system SHALL display the same target hours as before (`Mon–Fri count × 8 × 0.60`)

#### Scenario: Target reduced by OOO weekday count
- **WHEN** the user has marked N weekdays in the current month as OOO
- **THEN** the monthly target SHALL be `(workingDaysInMonth − N) × 8 × 0.60` hours

#### Scenario: Target updates on month change
- **WHEN** the calendar rolls over to a new month
- **THEN** the displayed target hours SHALL reflect the new month's working-day count minus any OOO weekdays recorded for that month

#### Scenario: Target is zero when all working days are marked OOO
- **WHEN** every Monday–Friday in the month is marked as OOO
- **THEN** the target SHALL be 0 and the progress bar SHALL display as fully complete

### Requirement: On-pace status accounts for OOO days in the elapsed count
The system SHALL compute the on-pace status using elapsed working days minus OOO weekdays that have already passed (on or before today), so that past OOO days do not count as missed office days.

#### Scenario: Elapsed working days exclude past OOO days
- **WHEN** the user has marked M weekdays in the current month as OOO, all of which fall on or before today
- **THEN** the elapsed working-day count used for pace calculation SHALL be reduced by M

#### Scenario: Future OOO days do not affect elapsed count
- **WHEN** the user has marked OOO days that are after today
- **THEN** the elapsed working-day count SHALL NOT be reduced by those future dates

#### Scenario: On Track status when pace is sufficient after OOO adjustment
- **WHEN** the user's logged hours per adjusted elapsed working day is ≥ 60% of the adjusted daily target rate
- **THEN** the status indicator SHALL display "On Track" with a green visual treatment

#### Scenario: At Risk status when pace is moderate after OOO adjustment
- **WHEN** the user's logged hours per adjusted elapsed working day is between 40% and 59% of the adjusted daily target rate
- **THEN** the status indicator SHALL display "At Risk" with an amber visual treatment

#### Scenario: Behind status when pace is insufficient after OOO adjustment
- **WHEN** the user's logged hours per adjusted elapsed working day is below 40% of the adjusted daily target rate
- **THEN** the status indicator SHALL display "Behind" with a red visual treatment

### Requirement: OOO day count is displayed alongside the monthly target
The system SHALL display the number of OOO weekdays applied in the current month next to or below the target figure, so the user can see at a glance that the target has been adjusted.

#### Scenario: OOO count shown when days are marked
- **WHEN** one or more OOO weekdays exist for the current month
- **THEN** the monthly goal panel SHALL show a label such as "X day(s) out of office" adjacent to the target figure

#### Scenario: OOO indicator hidden when no days are marked
- **WHEN** no OOO weekdays are marked for the current month
- **THEN** no OOO label SHALL appear in the monthly goal panel
