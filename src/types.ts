export interface Session {
  id: string
  start: string         // ISO-8601 datetime
  end: string | null    // null = session is currently active
  durationMs: number | null
}

export interface NetworkRule {
  id: string
  label: string
  probeUrl: string
  enabled: boolean
}

export interface AppSetting {
  key: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  value: any
}
