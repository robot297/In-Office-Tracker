## ADDED Requirements

### Requirement: User can configure network rules
The system SHALL provide a settings panel where the user can add, edit, and remove network rules. Each rule SHALL consist of a human-readable label and a probe URL that is only reachable on the target network (e.g., a VPN or office LAN internal endpoint).

#### Scenario: Add a network rule
- **WHEN** the user enters a label and a probe URL and clicks "Add Rule"
- **THEN** the rule is saved to persistent storage and appears in the list of configured rules

#### Scenario: Remove a network rule
- **WHEN** the user clicks the delete button on an existing rule
- **THEN** the rule is removed from persistent storage and no longer appears in the list

#### Scenario: Test a network rule manually
- **WHEN** the user clicks "Test" on a rule
- **THEN** the system SHALL immediately probe the URL and display either "Reachable" or "Unreachable" as feedback

### Requirement: System periodically probes configured network rules
The system SHALL probe each enabled network rule's URL at a configurable interval (default 60 seconds). A probe SHALL use an HTTP HEAD request with `mode: 'no-cors'` and `cache: 'no-store'`. Any response (including opaque) indicates the network is reachable; a network error indicates it is not.

#### Scenario: Probe succeeds
- **WHEN** a HEAD request to the probe URL resolves (any HTTP status or opaque response)
- **THEN** the system SHALL mark that rule as "reachable"

#### Scenario: Probe fails
- **WHEN** a HEAD request to the probe URL throws a network error
- **THEN** the system SHALL mark that rule as "unreachable"

#### Scenario: Polling pauses when tab is hidden
- **WHEN** the browser tab becomes hidden (Page Visibility API `visibilitychange` event)
- **THEN** the system SHALL pause probing until the tab becomes visible again

### Requirement: System exposes current network reachability state
The system SHALL maintain a reactive boolean indicating whether at least one configured network rule is currently reachable, accessible to other parts of the application.

#### Scenario: At least one rule reachable
- **WHEN** one or more configured rules return a successful probe
- **THEN** the reachability state SHALL be `true`

#### Scenario: No rules reachable
- **WHEN** all configured rules return probe errors (or no rules are configured)
- **THEN** the reachability state SHALL be `false`
