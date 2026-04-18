export type DayStatus = 'in-office' | 'out-of-office' | 'no-data' | 'future' | 'weekend'

const statusStyles: Record<DayStatus, string> = {
  'in-office': 'bg-green-100 text-green-800 font-semibold',
  'out-of-office': 'bg-blue-100 text-blue-700',
  'no-data': 'bg-red-50 text-red-400',
  'future': 'bg-gray-50 text-gray-400',
  'weekend': 'text-gray-300',
}

interface CalendarDayProps {
  date: Date
  status: DayStatus
}

export default function CalendarDay({ date, status }: CalendarDayProps) {
  return (
    <div className={`flex items-center justify-center rounded-lg h-9 w-full text-sm ${statusStyles[status]}`}>
      {date.getDate()}
    </div>
  )
}
