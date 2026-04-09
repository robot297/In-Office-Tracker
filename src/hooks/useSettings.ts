import { useCallback, useEffect, useState } from 'react'
import type { NetworkRule } from '../types'
import { db } from '../db'

export interface AutoClockPrefs {
  autoClockEnabled: boolean
  pollIntervalMs: number
}

const DEFAULT_PREFS: AutoClockPrefs = {
  autoClockEnabled: false,
  pollIntervalMs: 60_000,
}

export function useSettings() {
  const [networkRules, setNetworkRules] = useState<NetworkRule[]>([])
  const [prefs, setPrefs] = useState<AutoClockPrefs>(DEFAULT_PREFS)

  useEffect(() => {
    let cancelled = false
    async function load() {
      const [rules, enabledSetting, intervalSetting] = await Promise.all([
        db.networkRules.toArray(),
        db.appSettings.get('autoClockEnabled'),
        db.appSettings.get('pollIntervalMs'),
      ])
      if (cancelled) return
      setNetworkRules(rules)
      setPrefs({
        autoClockEnabled: enabledSetting?.value ?? DEFAULT_PREFS.autoClockEnabled,
        pollIntervalMs: intervalSetting?.value ?? DEFAULT_PREFS.pollIntervalMs,
      })
    }
    void load()
    return () => { cancelled = true }
  }, [])

  const addNetworkRule = useCallback(async (rule: Omit<NetworkRule, 'id'>) => {
    const newRule: NetworkRule = { ...rule, id: crypto.randomUUID() }
    await db.networkRules.add(newRule)
    setNetworkRules((prev) => [...prev, newRule])
    return newRule
  }, [])

  const removeNetworkRule = useCallback(async (id: string) => {
    await db.networkRules.delete(id)
    setNetworkRules((prev) => prev.filter((r) => r.id !== id))
  }, [])

  const updateNetworkRule = useCallback(async (id: string, changes: Partial<Omit<NetworkRule, 'id'>>) => {
    await db.networkRules.update(id, changes)
    setNetworkRules((prev) => prev.map((r) => (r.id === id ? { ...r, ...changes } : r)))
  }, [])

  const updatePrefs = useCallback(async (changes: Partial<AutoClockPrefs>) => {
    const updates = Object.entries(changes).map(([key, value]) =>
      db.appSettings.put({ key, value })
    )
    await Promise.all(updates)
    setPrefs((prev) => ({ ...prev, ...changes }))
  }, [])

  return {
    networkRules,
    prefs,
    addNetworkRule,
    removeNetworkRule,
    updateNetworkRule,
    updatePrefs,
  }
}
