import type { Session } from '../types'
import { formatDuration } from '../storage'

interface Props {
  session: Session
}

function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' })
}

export default function SessionRow({ session }: Props) {
  return (
    <tr className="border-t border-gray-100 hover:bg-gray-50">
      <td className="py-2 px-3 text-sm text-gray-600">{formatDate(session.start)}</td>
      <td className="py-2 px-3 text-sm text-gray-600">{formatTime(session.start)}</td>
      <td className="py-2 px-3 text-sm text-gray-600">
        {session.end ? formatTime(session.end) : '—'}
      </td>
      <td className="py-2 px-3 text-sm font-medium text-gray-800">
        {session.durationMs != null ? formatDuration(session.durationMs) : '—'}
      </td>
    </tr>
  )
}
