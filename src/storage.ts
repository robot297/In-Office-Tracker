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

// Returns the number of Monday–Friday days in the given month.
export function getWorkingDaysInMonth(year: number, month: number): number {
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  let count = 0
  for (let day = 1; day <= daysInMonth; day++) {
    const dow = new Date(year, month, day).getDay()
    if (dow !== 0 && dow !== 6) count++
  }
  return count
}

// Returns the monthly in-office target in milliseconds: (workingDays − ooWeekdayCount) × 8h × 60%.
export function getMonthlyTargetMs(year: number, month: number, ooWeekdayCount = 0): number {
  const adjustedDays = Math.max(0, getWorkingDaysInMonth(year, month) - ooWeekdayCount)
  return adjustedDays * 8 * 60 * 60 * 1000 * 0.6
}

// Returns completed sessions whose start falls in the given month.
export function getMonthSessions(sessions: Session[], year: number, month: number): Session[] {
  return sessions.filter((s) => {
    if (s.end === null) return false
    const d = new Date(s.start)
    return d.getFullYear() === year && d.getMonth() === month
  })
}

// Returns the total logged milliseconds for the given month.
export function getMonthlyTotalMs(sessions: Session[], year: number, month: number): number {
  return getMonthSessions(sessions, year, month).reduce((sum, s) => sum + (s.durationMs ?? 0), 0)
}

// Returns the number of Mon–Fri days from the 1st through today, minus OOO weekdays already passed.
export function getElapsedWorkingDays(year: number, month: number, ooWeekdaysPassed = 0): number {
  const today = new Date()
  const lastDay = today.getFullYear() === year && today.getMonth() === month
    ? today.getDate()
    : new Date(year, month + 1, 0).getDate()
  let count = 0
  for (let day = 1; day <= lastDay; day++) {
    const dow = new Date(year, month, day).getDay()
    if (dow !== 0 && dow !== 6) count++
  }
  return Math.max(0, Math.min(count, getWorkingDaysInMonth(year, month)) - ooWeekdaysPassed)
}

// Counts OOO dates that are weekdays within the given month, optionally capped at upToDate.
export function countOOOWeekdays(oooDates: string[], year: number, month: number, upToDate?: Date): number {
  return oooDates.filter((dateStr) => {
    const parts = dateStr.split('-')
    const y = parseInt(parts[0], 10)
    const m = parseInt(parts[1], 10) - 1
    const d = parseInt(parts[2], 10)
    if (y !== year || m !== month) return false
    const date = new Date(y, m, d)
    const dow = date.getDay()
    if (dow === 0 || dow === 6) return false
    if (upToDate) {
      const upToNorm = new Date(upToDate.getFullYear(), upToDate.getMonth(), upToDate.getDate())
      if (date > upToNorm) return false
    }
    return true
  }).length
}

// Returns attendance status based on pace vs. target.
export function getAttendanceStatus(
  loggedMs: number,
  targetMs: number,
  elapsedDays: number,
  totalDays: number,
): 'on-track' | 'at-risk' | 'behind' {
  if (totalDays === 0 || elapsedDays === 0) return 'on-track'
  const dailyTarget = targetMs / totalDays
  const loggedPerDay = loggedMs / elapsedDays
  const pace = loggedPerDay / dailyTarget
  if (pace >= 0.6) return 'on-track'
  if (pace >= 0.4) return 'at-risk'
  return 'behind'
}
