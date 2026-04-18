import { useState } from 'react'
import type { Session } from '../types'
import SessionRow, { toDatetimeLocal } from './SessionRow'

interface Props {
  sessions: Session[]
  updateSession: (id: string, start: string, end: string) => Promise<void>
}

export default function SessionHistory({ sessions, updateSession }: Props) {
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editValues, setEditValues] = useState<{ start: string; end: string }>({ start: '', end: '' })
  const [validationError, setValidationError] = useState<string | null>(null)

  const completed = sessions
    .filter((s) => s.end !== null)
    .sort((a, b) => new Date(b.start).getTime() - new Date(a.start).getTime())

  function handleEditStart(id: string) {
    const session = sessions.find((s) => s.id === id)
    if (!session || !session.end) return
    setEditingId(id)
    setEditValues({ start: toDatetimeLocal(session.start), end: toDatetimeLocal(session.end) })
    setValidationError(null)
  }

  function handleEditChange(field: 'start' | 'end', value: string) {
    setEditValues((prev) => ({ ...prev, [field]: value }))
    setValidationError(null)
  }

  async function handleSave(id: string) {
    if (!editValues.end) {
      setValidationError('End time is required.')
      return
    }
    const startMs = new Date(editValues.start).getTime()
    const endMs = new Date(editValues.end).getTime()
    if (endMs <= startMs) {
      setValidationError('End time must be after start time.')
      return
    }
    await updateSession(id, new Date(editValues.start).toISOString(), new Date(editValues.end).toISOString())
    setEditingId(null)
    setValidationError(null)
  }

  function handleCancel() {
    setEditingId(null)
    setValidationError(null)
  }

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
            <th className="py-2 px-3"></th>
          </tr>
        </thead>
        <tbody>
          {completed.map((s) => (
            <SessionRow
              key={s.id}
              session={s}
              isEditing={editingId === s.id}
              editValues={editingId === s.id ? editValues : { start: '', end: '' }}
              onEditStart={handleEditStart}
              onEditChange={handleEditChange}
              onSave={handleSave}
              onCancel={handleCancel}
              validationError={editingId === s.id ? validationError : null}
            />
          ))}
        </tbody>
      </table>
    </div>
  )
}
