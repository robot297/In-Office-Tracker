import { useCallback } from 'react'
import { useSessions } from './hooks/useSessions'
import { useSettings } from './hooks/useSettings'
import { useAutoClock } from './hooks/useAutoClock'
import ActiveTimer from './components/ActiveTimer'
import ClockButton from './components/ClockButton'
import TodaySummary from './components/TodaySummary'
import MonthlyGoal from './components/MonthlyGoal'
import SessionHistory from './components/SessionHistory'
import AutoClockNotification from './components/AutoClockNotification'
import NetworkSettings from './components/NetworkSettings'

export default function App() {
  const { sessions, activeSession, clockIn, clockOut } = useSessions()
  const {
    networkRules,
    prefs,
    addNetworkRule,
    removeNetworkRule,
    updateNetworkRule,
    updatePrefs,
  } = useSettings()

  const {
    lastAutoEvent,
    recordManualClockIn,
    recordManualClockOut,
  } = useAutoClock({
    enabled: prefs.autoClockEnabled,
    networkRules,
    pollIntervalMs: prefs.pollIntervalMs,
    activeSession,
    clockIn,
    clockOut,
  })

  const handleManualClockIn = useCallback(async () => {
    recordManualClockIn()
    await clockIn()
  }, [clockIn, recordManualClockIn])

  const handleManualClockOut = useCallback(async () => {
    recordManualClockOut()
    await clockOut()
  }, [clockOut, recordManualClockOut])

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center px-4 py-10">
      <AutoClockNotification lastAutoEvent={lastAutoEvent} />

      <div className="w-full max-w-lg space-y-6">

        {/* Header */}
        <h1 className="text-3xl font-bold text-gray-900 text-center">
          Office Time Tracker
        </h1>

        {/* Status card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 flex flex-col items-center gap-6">
          {activeSession && (
            <div className="flex flex-col items-center gap-1">
              <p className="text-sm text-gray-500">Time in office</p>
              <ActiveTimer startTime={activeSession.start} />
            </div>
          )}
          <ClockButton
            isActive={activeSession !== null}
            onClockIn={handleManualClockIn}
            onClockOut={handleManualClockOut}
          />
          <TodaySummary sessions={sessions} />
        </div>

        {/* Monthly attendance goal card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <MonthlyGoal sessions={sessions} />
        </div>

        {/* Network settings card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">Network Settings</h2>
          <NetworkSettings
            networkRules={networkRules}
            prefs={prefs}
            onAddRule={addNetworkRule}
            onRemoveRule={removeNetworkRule}
            onUpdateRule={updateNetworkRule}
            onUpdatePrefs={updatePrefs}
          />
        </div>

        {/* History card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">Session History</h2>
          <SessionHistory sessions={sessions} />
        </div>

      </div>
    </div>
  )
}
