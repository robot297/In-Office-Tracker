import Dexie, { type Table } from 'dexie'
import type { Session } from './types'

class TrackerDB extends Dexie {
  // Version history:
  // v1 — initial schema: sessions table with id (pk) and start (index)
  sessions!: Table<Session>

  constructor() {
    super('office-tracker')
    this.version(1).stores({
      sessions: 'id, start',
    })
  }
}

export const db = new TrackerDB()

db.open().catch((err: unknown) => {
  console.warn('IndexedDB unavailable, session data will not persist:', err)
})
