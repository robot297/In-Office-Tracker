import { useState } from 'react'
import type { Session } from '../types'
import {
  getMonthDayStatuses,
  getWorkingDaysInMonth,
  countOOOWeekdays,
  getMonthSessions,
} from '../storage'
import CalendarDay from './CalendarDay'

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]
const DOW_HEADERS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

interface AttendanceCalendarProps {
  sessions: Session[]
  oooDates: string[]
}

export default function AttendanceCalendar({ sessions, oooDates }: AttendanceCalendarProps) {
  const now = new Date()
  const [displayYear, setDisplayYear] = useState(now.getFullYear())
  const [displayMonth, setDisplayMonth] = useState(now.getMonth())

  function prevMonth() {
    if (displayMonth === 0) {
      setDisplayYear((y) => y - 1)
      setDisplayMonth(11)
    } else {
      setDisplayMonth((m) => m - 1)
    }
  }

  function nextMonth() {
    if (displayMonth === 11) {
      setDisplayYear((y) => y + 1)
      setDisplayMonth(0)
    } else {
      setDisplayMonth((m) => m + 1)
    }
  }

  const dayStatuses = getMonthDayStatuses(sessions, oooDates, displayYear, displayMonth)
  const daysInMonth = new Date(displayYear, displayMonth + 1, 0).getDate()

  // Day-of-week of the 1st (0=Sun … 6=Sat). Convert to Mon-based grid (0=Mon … 6=Sun).
  const firstDow = new Date(displayYear, displayMonth, 1).getDay()
  const leadingBlanks = firstDow === 0 ? 6 : firstDow - 1

  // Summary
  const inOfficeDays = [...dayStatuses.values()].filter((s) => s === 'in-office').length
  const oooWeekdays = countOOOWeekdays(oooDates, displayYear, displayMonth)
  const workingDays = getWorkingDaysInMonth(displayYear, displayMonth)
  const adjustedDays = Math.max(0, workingDays - oooWeekdays)
  const monthSessions = getMonthSessions(sessions, displayYear, displayMonth)
  const loggedMs = monthSessions.reduce((sum, s) => sum + (s.durationMs ?? 0), 0)
  const targetMs = adjustedDays * 8 * 60 * 60 * 1000 * 0.6
  const compliancePct = targetMs > 0 ? Math.round((loggedMs / targetMs) * 100) : 0

  const cells: React.ReactNode[] = []
  for (let i = 0; i < leadingBlanks; i++) {
    cells.push(<div key={`blank-${i}`} />)
  }
  for (let day = 1; day <= daysInMonth; day++) {
    const key = `${displayYear}-${String(displayMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    const status = dayStatuses.get(key) ?? 'future'
    cells.push(
      <CalendarDay key={key} date={new Date(displayYear, displayMonth, day)} status={status} />,
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={prevMonth}
          className="text-gray-500 hover:text-gray-800 px-2 py-1 rounded hover:bg-gray-100"
          aria-label="Previous month"
        >
          ‹
        </button>
        <h2 className="text-base font-semibold text-gray-700">
          {MONTH_NAMES[displayMonth]} {displayYear}
        </h2>
        <button
          onClick={nextMonth}
          className="text-gray-500 hover:text-gray-800 px-2 py-1 rounded hover:bg-gray-100"
          aria-label="Next month"
        >
          ›
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-1">
        {DOW_HEADERS.map((d) => (
          <div key={d} className="text-center text-xs text-gray-400 font-medium py-1">
            {d}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {cells}
      </div>

      <div className="mt-4 flex justify-around text-sm text-gray-600 border-t pt-3">
        <div className="text-center">
          <span className="block font-semibold text-gray-800">{inOfficeDays}</span>
          <span className="text-xs text-gray-500">In-office days</span>
        </div>
        <div className="text-center">
          <span className="block font-semibold text-gray-800">{oooWeekdays}</span>
          <span className="text-xs text-gray-500">OOO days</span>
        </div>
        <div className="text-center">
          <span className={`block font-semibold ${compliancePct >= 60 ? 'text-green-600' : 'text-red-500'}`}>
            {compliancePct}%
          </span>
          <span className="text-xs text-gray-500">Compliance</span>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap gap-3 text-xs text-gray-500">
        <span className="flex items-center gap-1"><span className="inline-block w-3 h-3 rounded bg-green-100"></span> In office</span>
        <span className="flex items-center gap-1"><span className="inline-block w-3 h-3 rounded bg-blue-100"></span> Out of office</span>
        <span className="flex items-center gap-1"><span className="inline-block w-3 h-3 rounded bg-red-50"></span> Missed</span>
        <span className="flex items-center gap-1"><span className="inline-block w-3 h-3 rounded bg-gray-50 border border-gray-200"></span> Future</span>
      </div>
    </div>
  )
}
