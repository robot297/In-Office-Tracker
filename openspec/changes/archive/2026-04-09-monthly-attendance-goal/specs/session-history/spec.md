## MODIFIED Requirements

### Requirement: Sessions can be queried by calendar month
The system SHALL support filtering the sessions array to return only those completed sessions whose `start` timestamp falls within a given calendar month (year + month).

#### Scenario: Monthly filter returns only current-month sessions
- **WHEN** `getMonthSessions(sessions, year, month)` is called
- **THEN** it SHALL return only completed sessions with `start` in the specified year/month, excluding active sessions and sessions from other months
