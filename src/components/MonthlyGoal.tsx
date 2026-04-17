import type { Session } from '../types'
import {
  formatDuration,
  getMonthlyTargetMs,
  getMonthlyTotalMs,
  getElapsedWorkingDays,
  getWorkingDaysInMonth,
  getAttendanceStatus,
} from '../storage'

interface Props {
  sessions: Session[]
  ooWeekdayCount?: number
  ooWeekdaysPassed?: number
}

export default function MonthlyGoal({ sessions, ooWeekdayCount = 0, ooWeekdaysPassed = 0 }: Props) {
  const now = new Date()
  const year = now.getFullYear()
  const month = now.getMonth()

  const targetMs = getMonthlyTargetMs(year, month, ooWeekdayCount)
  const loggedMs = getMonthlyTotalMs(sessions, year, month)
  const elapsedDays = getElapsedWorkingDays(year, month, ooWeekdaysPassed)
  const totalDays = Math.max(0, getWorkingDaysInMonth(year, month) - ooWeekdayCount)
  const status = getAttendanceStatus(loggedMs, targetMs, elapsedDays, totalDays)

  const percentage = targetMs > 0 ? (loggedMs / targetMs) * 100 : 0
  const displayPct = Math.min(percentage, 100)

  const statusConfig = {
    'on-track': { label: 'On Track', bar: 'bg-green-500', badge: 'bg-green-100 text-green-800' },
    'at-risk':  { label: 'At Risk',  bar: 'bg-amber-400', badge: 'bg-amber-100 text-amber-800' },
    'behind':   { label: 'Behind',   bar: 'bg-red-500',   badge: 'bg-red-100 text-red-800' },
  }[status]

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-medium text-gray-600">Monthly Attendance (60% goal)</h2>
        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${statusConfig.badge}`}>
          {statusConfig.label}
        </span>
      </div>

      {/* Progress bar */}
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div
          className={`h-2.5 rounded-full transition-all ${statusConfig.bar}`}
          style={{ width: `${displayPct}%` }}
        />
      </div>

      {/* Stats row */}
      <div className="flex justify-between text-sm text-gray-700">
        <span>
          <span className="font-semibold">{formatDuration(loggedMs)}</span>
          <span className="text-gray-400"> logged</span>
        </span>
        <span className="font-semibold text-gray-500">
          {percentage.toFixed(1)}%
        </span>
        <span>
          <span className="text-gray-400">target </span>
          <span className="font-semibold">{formatDuration(targetMs)}</span>
        </span>
      </div>

      {ooWeekdayCount > 0 && (
        <p className="text-xs text-blue-600">
          {ooWeekdayCount} day{ooWeekdayCount !== 1 ? 's' : ''} out of office applied
        </p>
      )}
    </div>
  )
}
