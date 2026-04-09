import { useCallback, useEffect, useRef, useState } from 'react'
import type { NetworkRule } from '../types'

export interface NetworkDetectionResult {
  isWorkNetworkReachable: boolean
  lastChecked: Date | null
}

async function probeUrl(url: string): Promise<boolean> {
  try {
    await fetch(url, { method: 'HEAD', mode: 'no-cors', cache: 'no-store' })
    return true
  } catch {
    return false
  }
}

async function checkReachability(rules: NetworkRule[]): Promise<boolean> {
  const enabledRules = rules.filter((r) => r.enabled)
  if (enabledRules.length === 0) return false
  const results = await Promise.all(enabledRules.map((r) => probeUrl(r.probeUrl)))
  return results.some(Boolean)
}

export function useNetworkDetection(
  rules: NetworkRule[],
  pollIntervalMs: number = 60_000,
): NetworkDetectionResult {
  const [isWorkNetworkReachable, setIsWorkNetworkReachable] = useState(false)
  const [lastChecked, setLastChecked] = useState<Date | null>(null)

  // Track consecutive failures for clock-out debounce (2 required)
  const consecutiveFailuresRef = useRef(0)
  const rulesRef = useRef(rules)
  rulesRef.current = rules

  const runProbe = useCallback(async () => {
    const reachable = await checkReachability(rulesRef.current)
    setLastChecked(new Date())

    if (reachable) {
      consecutiveFailuresRef.current = 0
      setIsWorkNetworkReachable(true)
    } else {
      consecutiveFailuresRef.current += 1
      if (consecutiveFailuresRef.current >= 2) {
        setIsWorkNetworkReachable(false)
      }
    }
  }, [])

  useEffect(() => {
    if (rules.filter((r) => r.enabled).length === 0) return

    let intervalId: ReturnType<typeof setInterval> | null = null
    let hidden = document.hidden

    function startPolling() {
      void runProbe()
      intervalId = setInterval(() => void runProbe(), pollIntervalMs)
    }

    function stopPolling() {
      if (intervalId !== null) {
        clearInterval(intervalId)
        intervalId = null
      }
    }

    function onVisibilityChange() {
      if (document.hidden) {
        hidden = true
        stopPolling()
      } else if (hidden) {
        hidden = false
        startPolling()
      }
    }

    document.addEventListener('visibilitychange', onVisibilityChange)

    if (!document.hidden) {
      startPolling()
    }

    return () => {
      stopPolling()
      document.removeEventListener('visibilitychange', onVisibilityChange)
    }
  }, [rules, pollIntervalMs, runProbe])

  return { isWorkNetworkReachable, lastChecked }
}

// One-shot probe for manual "Test" button
export async function testNetworkRule(probeUrl_: string): Promise<boolean> {
  return probeUrl(probeUrl_)
}
