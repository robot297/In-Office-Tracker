import { useCallback, useEffect, useState } from 'react'
import { db } from '../db'

export function useOOOEntries() {
  const [oooDates, setOooDates] = useState<string[]>([])

  useEffect(() => {
    let cancelled = false
    async function load() {
      const entries = await db.oooEntries.toArray()
      if (!cancelled) setOooDates(entries.map((e) => e.date).sort())
    }
    void load()
    return () => { cancelled = true }
  }, [])

  const addOOO = useCallback(async (date: string) => {
    await db.oooEntries.put({ date })
    setOooDates((prev) => (prev.includes(date) ? prev : [...prev, date].sort()))
  }, [])

  const removeOOO = useCallback(async (date: string) => {
    await db.oooEntries.delete(date)
    setOooDates((prev) => prev.filter((d) => d !== date))
  }, [])

  return { oooDates, addOOO, removeOOO }
}
