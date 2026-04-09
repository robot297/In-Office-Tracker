import { useState } from 'react'
import type { AutoClockPrefs } from '../hooks/useSettings'
import type { NetworkRule } from '../types'
import { testNetworkRule } from '../hooks/useNetworkDetection'

interface Props {
  networkRules: NetworkRule[]
  prefs: AutoClockPrefs
  onAddRule: (rule: Omit<NetworkRule, 'id'>) => Promise<NetworkRule>
  onRemoveRule: (id: string) => Promise<void>
  onUpdateRule: (id: string, changes: Partial<Omit<NetworkRule, 'id'>>) => Promise<void>
  onUpdatePrefs: (changes: Partial<AutoClockPrefs>) => Promise<void>
}

interface TestState {
  [ruleId: string]: 'idle' | 'testing' | 'reachable' | 'unreachable'
}

export default function NetworkSettings({
  networkRules,
  prefs,
  onAddRule,
  onRemoveRule,
  onUpdateRule,
  onUpdatePrefs,
}: Props) {
  const [newLabel, setNewLabel] = useState('')
  const [newUrl, setNewUrl] = useState('')
  const [addError, setAddError] = useState('')
  const [testStates, setTestStates] = useState<TestState>({})
  const [intervalInput, setIntervalInput] = useState(String(prefs.pollIntervalMs / 1000))

  async function handleAddRule() {
    const label = newLabel.trim()
    const probeUrl = newUrl.trim()
    if (!label || !probeUrl) {
      setAddError('Both label and URL are required.')
      return
    }
    try {
      new URL(probeUrl)
    } catch {
      setAddError('Please enter a valid URL.')
      return
    }
    setAddError('')
    await onAddRule({ label, probeUrl, enabled: true })
    setNewLabel('')
    setNewUrl('')
  }

  async function handleTest(rule: NetworkRule) {
    setTestStates((prev) => ({ ...prev, [rule.id]: 'testing' }))
    const reachable = await testNetworkRule(rule.probeUrl)
    setTestStates((prev) => ({ ...prev, [rule.id]: reachable ? 'reachable' : 'unreachable' }))
  }

  async function handleIntervalBlur() {
    const secs = parseInt(intervalInput, 10)
    if (!isNaN(secs) && secs >= 5) {
      await onUpdatePrefs({ pollIntervalMs: secs * 1000 })
    } else {
      setIntervalInput(String(prefs.pollIntervalMs / 1000))
    }
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="font-semibold text-gray-800">Auto Clock-In / Clock-Out</p>
          <p className="text-sm text-gray-500">
            Automatically track time based on your network connection
          </p>
        </div>
        <button
          role="switch"
          aria-checked={prefs.autoClockEnabled}
          onClick={() => onUpdatePrefs({ autoClockEnabled: !prefs.autoClockEnabled })}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            prefs.autoClockEnabled ? 'bg-blue-600' : 'bg-gray-300'
          }`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
              prefs.autoClockEnabled ? 'translate-x-6' : 'translate-x-1'
            }`}
          />
        </button>
      </div>

      {prefs.autoClockEnabled && (
        <>
          <div className="flex items-center gap-3">
            <label className="text-sm text-gray-700 whitespace-nowrap" htmlFor="poll-interval">
              Check every
            </label>
            <input
              id="poll-interval"
              type="number"
              min={5}
              className="w-20 rounded-lg border border-gray-300 px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={intervalInput}
              onChange={(e) => setIntervalInput(e.target.value)}
              onBlur={handleIntervalBlur}
            />
            <span className="text-sm text-gray-500">seconds</span>
          </div>

          <div>
            <p className="text-sm font-medium text-gray-700 mb-2">Network Rules</p>
            {networkRules.length === 0 && (
              <p className="text-sm text-gray-400 italic">No rules configured. Add one below.</p>
            )}
            <ul className="space-y-2">
              {networkRules.map((rule) => {
                const testState = testStates[rule.id] ?? 'idle'
                return (
                  <li
                    key={rule.id}
                    className="flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2"
                  >
                    <input
                      type="checkbox"
                      aria-label={`Enable rule: ${rule.label}`}
                      checked={rule.enabled}
                      onChange={(e) => onUpdateRule(rule.id, { enabled: e.target.checked })}
                      className="h-4 w-4 accent-blue-600"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-800 truncate">{rule.label}</p>
                      <p className="text-xs text-gray-400 truncate">{rule.probeUrl}</p>
                    </div>
                    {testState === 'testing' && (
                      <span className="text-xs text-gray-400">Testing…</span>
                    )}
                    {testState === 'reachable' && (
                      <span className="text-xs font-medium text-green-600">Reachable</span>
                    )}
                    {testState === 'unreachable' && (
                      <span className="text-xs font-medium text-red-500">Unreachable</span>
                    )}
                    <button
                      onClick={() => handleTest(rule)}
                      disabled={testState === 'testing'}
                      className="text-xs text-blue-600 hover:underline disabled:opacity-40"
                    >
                      Test
                    </button>
                    <button
                      onClick={() => onRemoveRule(rule.id)}
                      aria-label={`Remove rule: ${rule.label}`}
                      className="text-gray-400 hover:text-red-500 transition-colors text-sm"
                    >
                      ✕
                    </button>
                  </li>
                )
              })}
            </ul>
          </div>

          <div className="border-t border-gray-100 pt-4 space-y-2">
            <p className="text-sm font-medium text-gray-700">Add Network Rule</p>
            <p className="text-xs text-gray-400">
              Enter a URL that is only reachable on your work network (e.g., an internal site or ping endpoint).
            </p>
            <input
              type="text"
              placeholder="Label (e.g., Office VPN)"
              value={newLabel}
              onChange={(e) => setNewLabel(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <input
              type="url"
              placeholder="Probe URL (e.g., http://internal.corp/ping)"
              value={newUrl}
              onChange={(e) => setNewUrl(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            {addError && <p className="text-xs text-red-500">{addError}</p>}
            <button
              onClick={handleAddRule}
              className="w-full rounded-lg bg-blue-600 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
            >
              Add Rule
            </button>
          </div>
        </>
      )}
    </div>
  )
}
