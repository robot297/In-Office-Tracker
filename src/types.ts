export interface Session {
  id: string
  start: string         // ISO-8601 datetime
  end: string | null    // null = session is currently active
  durationMs: number | null
}
