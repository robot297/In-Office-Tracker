### Requirement: User can enter edit mode for a completed session
Each completed (non-active) session row in the history table SHALL display an "Edit" button. Clicking it enters edit mode for that row, replacing the read-only time values with editable inputs pre-populated with the current start and end times. Only one row SHALL be in edit mode at a time; opening a new row's edit mode SHALL automatically cancel any unsaved edits on another row.

#### Scenario: Edit button is visible on completed sessions
- **WHEN** the session history table is displayed
- **THEN** every completed session row shows an "Edit" button

#### Scenario: Clicking Edit enters inline edit mode
- **WHEN** the user clicks "Edit" on a completed session row
- **THEN** the start and end time cells become editable datetime inputs pre-filled with the current values
- **THEN** "Save" and "Cancel" buttons replace the "Edit" button

#### Scenario: Only one row editable at a time
- **WHEN** the user clicks "Edit" on a second session while another is already in edit mode
- **THEN** the first row's unsaved edits are discarded and it returns to read-only
- **THEN** the second row enters edit mode

### Requirement: User can save valid edits to a session
The system SHALL persist the updated `start` and `end` timestamps to the database and recalculate `durationMs` when the user clicks "Save", provided the values pass validation.

#### Scenario: Successful save updates the session
- **WHEN** the user edits start and/or end times with valid values and clicks "Save"
- **THEN** the session record is updated in the database with the new start, end, and recalculated durationMs
- **THEN** the row returns to read-only view showing the updated times and duration

#### Scenario: Duration recalculated automatically
- **WHEN** a session is saved with new start and end times
- **THEN** durationMs equals the difference between the new end and start in milliseconds

### Requirement: Edits are validated before saving
The system SHALL reject saves that would produce an invalid session state and display an inline error message.

#### Scenario: End time before start time is rejected
- **WHEN** the user sets an end time that is before or equal to the start time and clicks "Save"
- **THEN** the save is blocked
- **THEN** an inline error message is shown indicating the end must be after the start

#### Scenario: Null end time is rejected
- **WHEN** the user clears the end time field and clicks "Save"
- **THEN** the save is blocked
- **THEN** an inline error message is shown

### Requirement: User can cancel an edit without saving
Clicking "Cancel" SHALL discard all unsaved changes and return the row to its read-only state with the original values.

#### Scenario: Cancel discards changes
- **WHEN** the user modifies start or end times and then clicks "Cancel"
- **THEN** no changes are written to the database
- **THEN** the row displays the original start, end, and duration values
