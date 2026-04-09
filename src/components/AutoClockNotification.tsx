import { useEffect, useState } from 'react'
import type { AutoClockEvent } from '../hooks/useAutoClock'

interface Props {
  lastAutoEvent: AutoClockEvent | null
}

export default function AutoClockNotification({ lastAutoEvent }: Props) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (!lastAutoEvent) return
    setVisible(true)
    const timer = setTimeout(() => setVisible(false), 4000)
    return () => clearTimeout(timer)
  }, [lastAutoEvent])

  if (!visible || !lastAutoEvent) return null

  const isClockIn = lastAutoEvent.type === 'clock-in'

  return (
    <div
      className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 px-4 py-3 rounded-xl shadow-lg text-sm font-medium text-white transition-all ${
        isClockIn ? 'bg-green-600' : 'bg-amber-600'
      }`}
      role="status"
      aria-live="polite"
    >
      <span>{isClockIn ? '🟢' : '🟡'}</span>
      <span>
        {isClockIn
          ? 'Auto clocked in — work network detected'
          : 'Auto clocked out — work network lost'}
      </span>
    </div>
  )
}
