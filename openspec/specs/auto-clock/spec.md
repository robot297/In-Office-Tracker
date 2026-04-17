## ADDED Requirements

### Requirement: Auto clock-in when work network is detected
The system SHALL automatically start a new session when a configured network rule becomes reachable and no active session exists, provided the auto-clock feature is enabled and the manual override grace period has expired.

#### Scenario: Auto clock-in on network detection
- **WHEN** auto-clock is enabled AND at least one network rule transitions to reachable AND no active session exists AND the grace period has not been triggered
- **THEN** a new session SHALL be created automatically and an in-app notification SHALL inform the user that auto clock-in occurred

#### Scenario: Auto clock-in suppressed during active session
- **WHEN** a session is already active when the network becomes reachable
- **THEN** the system SHALL NOT create an additional session

#### Scenario: Auto clock-in suppressed during grace period
- **WHEN** the user manually clocked out within the last 5 minutes
- **THEN** the system SHALL NOT auto clock-in even if the network is reachable

### Requirement: Auto clock-out when work network is lost
The system SHALL automatically end the current active session when all configured network rules become unreachable after 2 consecutive probe failures, provided the auto-clock feature is enabled and the manual override grace period has expired.

#### Scenario: Auto clock-out after consecutive failures
- **WHEN** auto-clock is enabled AND all network rules fail 2 consecutive probes AND an active session exists AND the grace period has not been triggered
- **THEN** the active session SHALL be ended and an in-app notification SHALL inform the user that auto clock-out occurred

#### Scenario: Single probe failure does not trigger clock-out
- **WHEN** all network rules fail exactly 1 consecutive probe
- **THEN** the system SHALL NOT end the active session

#### Scenario: Auto clock-out suppressed during grace period
- **WHEN** the user manually clocked in within the last 5 minutes
- **THEN** the system SHALL NOT auto clock-out even if the network becomes unreachable

### Requirement: Auto-clock feature can be toggled
The system SHALL provide a setting to enable or disable the auto clock-in/out feature. The setting SHALL be persisted and default to disabled.

#### Scenario: Enable auto-clock
- **WHEN** the user enables the auto-clock toggle in settings
- **THEN** the system SHALL begin using network reachability to drive clock-in/out events

#### Scenario: Disable auto-clock
- **WHEN** the user disables the auto-clock toggle
- **THEN** the system SHALL stop all automatic clock-in/out actions; clock-in/out reverts to fully manual

### Requirement: In-app notification for auto clock events
The system SHALL display a transient notification whenever an auto clock-in or auto clock-out event occurs, identifying it as automatic.

#### Scenario: Auto clock-in notification
- **WHEN** the system automatically clocks in
- **THEN** a notification SHALL appear stating that the session was started automatically due to network detection, and SHALL dismiss after a few seconds

#### Scenario: Auto clock-out notification
- **WHEN** the system automatically clocks out
- **THEN** a notification SHALL appear stating that the session was ended automatically due to network loss, and SHALL dismiss after a few seconds
