import type { Session } from '../types'
import SessionRow from './SessionRow'

interface Props {
  sessions: Session[]
}

export default function SessionHistory({ sessions }: Props) {
  const completed = sessions
    .filter((s) => s.end !== null)
    .sort((a, b) => new Date(b.start).getTime() - new Date(a.start).getTime())

  if (completed.length === 0) {
    return (
      <p className="text-center text-gray-400 text-sm py-8">
        No sessions recorded yet. Clock in to get started!
      </p>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left">
        <thead>
          <tr className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
            <th className="py-2 px-3">Date</th>
            <th className="py-2 px-3">In</th>
            <th className="py-2 px-3">Out</th>
            <th className="py-2 px-3">Duration</th>
          </tr>
        </thead>
        <tbody>
          {completed.map((s) => (
            <SessionRow key={s.id} session={s} />
          ))}
        </tbody>
      </table>
    </div>
  )
}
