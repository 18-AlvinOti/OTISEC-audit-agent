import type { Finding, Lead, SoloditRef } from './data'

export interface PastReport {
  id: string
  timestamp: number
  filename: string
  findings: Finding[]
  leads: Lead[]
  soloditRefs: SoloditRef[]
}

const STORAGE_KEY = 'otisec_past_reports'
const MAX_REPORTS = 15

function isBrowser() {
  return typeof window !== 'undefined' && !!window.localStorage
}

/** Live audit results only — never persists demo runs. Client-side only (no backend), capped at 15 most recent. */
export function savePastReport(report: Omit<PastReport, 'id' | 'timestamp'>) {
  if (!isBrowser()) return
  try {
    const existing = getPastReports()
    const record: PastReport = { ...report, id: crypto.randomUUID(), timestamp: Date.now() }
    const updated = [record, ...existing].slice(0, MAX_REPORTS)
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
  } catch {
    // Storage full or unavailable — past reports are a convenience, not critical path.
  }
}

export function getPastReports(): PastReport[] {
  if (!isBrowser()) return []
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export function deletePastReport(id: string) {
  if (!isBrowser()) return
  const updated = getPastReports().filter(r => r.id !== id)
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
}

export function clearPastReports() {
  if (!isBrowser()) return
  window.localStorage.removeItem(STORAGE_KEY)
}
