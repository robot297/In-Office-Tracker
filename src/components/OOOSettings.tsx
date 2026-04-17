import { useState } from 'react'

interface Props {
  oooDates: string[]
  onAdd: (date: string) => Promise<void>
  onRemove: (date: string) => Promise<void>
}

function isWeekend(dateStr: string): boolean {
  const parts = dateStr.split('-')
  const dow = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10)).getDay()
  return dow === 0 || dow === 6
}

export default function OOOSettings({ oooDates, onAdd, onRemove }: Props) {
  const now = new Date()
  const year = now.getFullYear()
  const month = now.getMonth()

  const [selectedDate, setSelectedDate] = useState('')

  const currentMonthDates = oooDates
    .filter((d) => {
      const parts = d.split('-')
      return parseInt(parts[0], 10) === year && parseInt(parts[1], 10) - 1 === month
    })
    .sort()

  const isSelectedWeekend = selectedDate ? isWeekend(selectedDate) : false

  async function handleAdd() {
    if (!selectedDate) return
    await onAdd(selectedDate)
    setSelectedDate('')
  }

  return (
    <div className="space-y-3">
      <div>
        <p className="font-semibold text-gray-800">Out of Office</p>
        <p className="text-sm text-gray-500">
          Mark dates you were out of office to adjust the monthly attendance target.
        </p>
      </div>

      <div className="flex gap-2">
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <button
          onClick={handleAdd}
          disabled={!selectedDate}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors disabled:opacity-40"
        >
          Add
        </button>
      </div>

      {isSelectedWeekend && (
        <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
          This date falls on a weekend and won't affect the monthly target.
        </p>
      )}

      <div>
        <p className="text-sm font-medium text-gray-700 mb-2">This month</p>
        {currentMonthDates.length === 0 ? (
          <p className="text-sm text-gray-400 italic">No out-of-office days this month.</p>
        ) : (
          <ul className="space-y-1">
            {currentMonthDates.map((date) => (
              <li
                key={date}
                className="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 px-3 py-2"
              >
                <span className="text-sm text-gray-700">{date}</span>
                <button
                  onClick={() => onRemove(date)}
                  aria-label={`Remove ${date}`}
                  className="text-gray-400 hover:text-red-500 transition-colors text-sm"
                >
                  ✕
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
