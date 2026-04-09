import { useEffect, useState } from 'react'

interface Props {
  startTime: string
}

function formatElapsed(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000)
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60
  return [hours, minutes, seconds]
    .map((n) => String(n).padStart(2, '0'))
    .join(':')
}

export default function ActiveTimer({ startTime }: Props) {
  const [elapsed, setElapsed] = useState(() => Date.now() - new Date(startTime).getTime())

  useEffect(() => {
    const id = setInterval(() => {
      setElapsed(Date.now() - new Date(startTime).getTime())
    }, 1000)
    return () => clearInterval(id)
  }, [startTime])

  return (
    <p className="text-5xl font-mono font-semibold text-green-600 tracking-widest">
      {formatElapsed(elapsed)}
    </p>
  )
}
