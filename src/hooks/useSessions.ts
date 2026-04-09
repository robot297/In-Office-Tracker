import { useEffect, useState } from 'react'
import type { Session } from '../types'
import { getActiveSession } from '../storage'
import { db } from '../db'

const LEGACY_KEY = 'office-tracker-sessions'

async function migrateFromLocalStorage(): Promise<void> {
  const raw = localStorage.getItem(LEGACY_KEY)
  if (!raw) return
  try {
    const sessions = JSON.parse(raw) as Session[]
    await db.sessions.bulkPut(sessions)
    localStorage.removeItem(LEGACY_KEY)
  } catch (err) {
    console.warn('localStorage migration failed:', err)
  }
}

export function useSessions() {
  const [sessions, setSessions] = useState<Session[]>([])

  useEffect(() => {
    let cancelled = false
    async function load() {
      await migrateFromLocalStorage()
      const all = await db.sessions.toArray()
      if (!cancelled) setSessions(all)
    }
    void load()
    return () => { cancelled = true }
  }, [])

  const activeSession = getActiveSession(sessions)

  async function clockIn() {
    if (getActiveSession(sessions) !== null) return
    const newSession: Session = {
      id: crypto.randomUUID(),
      start: new Date().toISOString(),
      end: null,
      durationMs: null,
    }
    await db.sessions.add(newSession)
    setSessions((prev) => [...prev, newSession])
  }

  async function clockOut() {
    const active = getActiveSession(sessions)
    if (!active) return
    const end = new Date().toISOString()
    const durationMs = new Date(end).getTime() - new Date(active.start).getTime()
    await db.sessions.update(active.id, { end, durationMs })
    setSessions((prev) =>
      prev.map((s) => (s.id === active.id ? { ...s, end, durationMs } : s))
    )
  }

  return { sessions, activeSession, clockIn, clockOut }
}
