interface Props {
  isActive: boolean
  onClockIn: () => void
  onClockOut: () => void
}

export default function ClockButton({ isActive, onClockIn, onClockOut }: Props) {
  if (isActive) {
    return (
      <button
        onClick={onClockOut}
        className="px-8 py-4 text-xl font-semibold rounded-2xl bg-red-500 hover:bg-red-600 active:bg-red-700 text-white transition-colors"
      >
        Clock Out
      </button>
    )
  }

  return (
    <button
      onClick={onClockIn}
      className="px-8 py-4 text-xl font-semibold rounded-2xl bg-green-500 hover:bg-green-600 active:bg-green-700 text-white transition-colors"
    >
      Clock In
    </button>
  )
}
