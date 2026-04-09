import type { Session } from './types'

export function getActiveSession(sessions: Session[]): Session | null {
  return sessions.find((s) => s.end === null) ?? null
}

export function formatDuration(ms: number): string {
  const totalMinutes = Math.floor(ms / 60_000)
  const hours = Math.floor(totalMinutes / 60)
  const minutes = totalMinutes % 60
  return `${hours}h ${minutes}m`
}

export function getTodayTotal(sessions: Session[]): number {
  const todayStart = new Date()
  todayStart.setHours(0, 0, 0, 0)
  return sessions
    .filter((s) => s.end !== null && new Date(s.start) >= todayStart)
    .reduce((sum, s) => sum + (s.durationMs ?? 0), 0)
}
