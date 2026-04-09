import type { Session } from '../types'
import { getTodayTotal, formatDuration } from '../storage'

interface Props {
  sessions: Session[]
}

export default function TodaySummary({ sessions }: Props) {
  const totalMs = getTodayTotal(sessions)

  return (
    <div className="text-center">
      <p className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-1">
        Today's total
      </p>
      <p className="text-2xl font-semibold text-gray-800">
        {totalMs > 0 ? formatDuration(totalMs) : '0h 0m'}
      </p>
    </div>
  )
}
