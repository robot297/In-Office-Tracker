import { useCallback, useEffect, useRef, useState } from 'react'
import { useNetworkDetection } from './useNetworkDetection'
import type { NetworkRule } from '../types'

export interface AutoClockEvent {
  type: 'clock-in' | 'clock-out'
  at: Date
}

interface UseAutoClockOptions {
  enabled: boolean
  networkRules: NetworkRule[]
  pollIntervalMs: number
  activeSession: { id: string } | null
  clockIn: () => Promise<void>
  clockOut: () => Promise<void>
}

const GRACE_PERIOD_MS = 5 * 60 * 1000 // 5 minutes

export function useAutoClock({
  enabled,
  networkRules,
  pollIntervalMs,
  activeSession,
  clockIn,
  clockOut,
}: UseAutoClockOptions) {
  const [lastAutoEvent, setLastAutoEvent] = useState<AutoClockEvent | null>(null)

  // Grace period: track when user last performed a manual action
  const manualActionAtRef = useRef<number | null>(null)

  const { isWorkNetworkReachable } = useNetworkDetection(
    enabled ? networkRules : [],
    pollIntervalMs,
  )

  const prevReachableRef = useRef<boolean>(isWorkNetworkReachable)
  const activeSessionRef = useRef(activeSession)
  activeSessionRef.current = activeSession

  const isInGracePeriod = useCallback(() => {
    if (manualActionAtRef.current === null) return false
    return Date.now() - manualActionAtRef.current < GRACE_PERIOD_MS
  }, [])

  // Respond to reachability transitions
  useEffect(() => {
    if (!enabled) return

    const wasReachable = prevReachableRef.current
    prevReachableRef.current = isWorkNetworkReachable

    if (isWorkNetworkReachable && !wasReachable) {
      // Network came up — auto clock-in if no active session and not in grace period
      if (!activeSessionRef.current && !isInGracePeriod()) {
        void clockIn().then(() => {
          setLastAutoEvent({ type: 'clock-in', at: new Date() })
        })
      }
    } else if (!isWorkNetworkReachable && wasReachable) {
      // Network went down — auto clock-out if active session and not in grace period
      if (activeSessionRef.current && !isInGracePeriod()) {
        void clockOut().then(() => {
          setLastAutoEvent({ type: 'clock-out', at: new Date() })
        })
      }
    }
  }, [isWorkNetworkReachable, enabled, clockIn, clockOut, isInGracePeriod])

  // Call these from manual button handlers to start grace period
  const recordManualClockIn = useCallback(() => {
    manualActionAtRef.current = Date.now()
  }, [])

  const recordManualClockOut = useCallback(() => {
    manualActionAtRef.current = Date.now()
  }, [])

  return {
    isWorkNetworkReachable,
    lastAutoEvent,
    recordManualClockIn,
    recordManualClockOut,
  }
}
