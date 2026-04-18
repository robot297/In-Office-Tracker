import type { Session } from '../types'
import { formatDuration } from '../storage'

interface EditValues {
  start: string
  end: string
}

interface Props {
  session: Session
  isEditing: boolean
  editValues: EditValues
  onEditStart: (id: string) => void
  onEditChange: (field: 'start' | 'end', value: string) => void
  onSave: (id: string) => void
  onCancel: () => void
  validationError: string | null
}

function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' })
}

function toDatetimeLocal(iso: string): string {
  const d = new Date(iso)
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
}

export default function SessionRow({
  session,
  isEditing,
  editValues,
  onEditStart,
  onEditChange,
  onSave,
  onCancel,
  validationError,
}: Props) {
  if (isEditing) {
    return (
      <>
        <tr className="border-t border-gray-100 bg-blue-50">
          <td className="py-2 px-3 text-sm text-gray-600">{formatDate(session.start)}</td>
          <td className="py-2 px-3">
            <input
              type="datetime-local"
              value={editValues.start}
              onChange={(e) => onEditChange('start', e.target.value)}
              className="text-sm border border-gray-300 rounded px-2 py-1 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </td>
          <td className="py-2 px-3">
            <input
              type="datetime-local"
              value={editValues.end}
              onChange={(e) => onEditChange('end', e.target.value)}
              className="text-sm border border-gray-300 rounded px-2 py-1 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </td>
          <td className="py-2 px-3 text-sm text-gray-400">—</td>
          <td className="py-2 px-3">
            <div className="flex gap-2">
              <button
                onClick={() => onSave(session.id)}
                className="text-xs px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Save
              </button>
              <button
                onClick={onCancel}
                className="text-xs px-3 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
              >
                Cancel
              </button>
            </div>
          </td>
        </tr>
        {validationError && (
          <tr className="bg-blue-50">
            <td colSpan={5} className="px-3 pb-2 text-xs text-red-600">
              {validationError}
            </td>
          </tr>
        )}
      </>
    )
  }

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
      <td className="py-2 px-3">
        <button
          onClick={() => onEditStart(session.id)}
          className="text-xs px-2 py-1 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded"
        >
          Edit
        </button>
      </td>
    </tr>
  )
}

export { toDatetimeLocal }
