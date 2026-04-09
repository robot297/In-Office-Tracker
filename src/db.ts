import Dexie, { type Table } from 'dexie'
import type { Session, NetworkRule, AppSetting } from './types'

class TrackerDB extends Dexie {
  // Version history:
  // v1 — initial schema: sessions table with id (pk) and start (index)
  // v2 — added networkRules and appSettings tables for auto-clock feature
  sessions!: Table<Session>
  networkRules!: Table<NetworkRule>
  appSettings!: Table<AppSetting>

  constructor() {
    super('office-tracker')
    this.version(1).stores({
      sessions: 'id, start',
    })
    this.version(2).stores({
      sessions: 'id, start',
      networkRules: 'id',
      appSettings: 'key',
    })
  }
}

export const db = new TrackerDB()

db.open().catch((err: unknown) => {
  console.warn('IndexedDB unavailable, session data will not persist:', err)
})
