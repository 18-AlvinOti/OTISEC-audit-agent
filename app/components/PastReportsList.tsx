import { useEffect, useState } from 'react'
import { getPastReports, deletePastReport, clearPastReports, type PastReport } from '@/lib/reports'
import { SevBadge } from './SevBadge'
import { Button } from './Button'
import { Icon } from './Icon'
import { ExportButtons } from './ExportButtons'
import FindingCard from './FindingCard'

/** Browser-local audit history — live runs only, capped at 15 entries. Shared between the /reports page and the in-app History tab. */
export function PastReportsList() {
  const [reports, setReports] = useState<PastReport[]>([])
  const [openId, setOpenId] = useState<string | null>(null)

  useEffect(() => {
    setReports(getPastReports())
  }, [])

  const remove = (id: string) => {
    deletePastReport(id)
    setReports(getPastReports())
    if (openId === id) setOpenId(null)
  }

  const clearAll = () => {
    clearPastReports()
    setReports([])
    setOpenId(null)
  }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 8 }}>
        <h2 style={{ fontSize: 'var(--text-base)', fontWeight: 600, color: 'var(--text-strong)' }}>Past Reports</h2>
        {reports.length > 0 && (
          <Button variant="ghost-danger" onClick={clearAll} style={{ fontSize: 'var(--text-tiny)', padding: '5px 12px' }}>
            Clear all
          </Button>
        )}
      </div>
      <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', marginBottom: 20 }}>
        Stored locally in this browser only — live audit runs are saved here automatically, demo runs are not.
      </p>

      {reports.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '48px 0', color: 'var(--text-faint)' }}>
          <div style={{ fontSize: 32, marginBottom: 10, opacity: 0.3 }}>⬡</div>
          <div style={{ fontSize: 'var(--text-sm)' }}>No past reports yet — run a live audit to see it here.</div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {reports.map(r => {
            const sevCounts = r.findings.reduce((acc, f) => {
              acc[f.sev] = (acc[f.sev] || 0) + 1
              return acc
            }, {} as Record<string, number>)
            const open = openId === r.id
            return (
              <div key={r.id} style={{ borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-2)', overflow: 'hidden', background: 'var(--surface-card)' }}>
                <button
                  onClick={() => setOpenId(open ? null : r.id)}
                  style={{
                    width: '100%', display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px',
                    background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left',
                  }}
                >
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 'var(--text-sm)', fontWeight: 500, color: 'var(--text-strong)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {r.filename}
                    </div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-micro)', color: 'var(--text-muted)', marginTop: 2 }}>
                      {new Date(r.timestamp).toLocaleString()} · {r.findings.length} finding{r.findings.length === 1 ? '' : 's'}
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 4 }}>
                    {(['CRITICAL', 'HIGH', 'MEDIUM', 'LOW', 'INFO'] as const)
                      .filter(s => sevCounts[s])
                      .map(s => <SevBadge key={s} sev={s} compact />)}
                  </div>
                  <button
                    onClick={e => { e.stopPropagation(); remove(r.id) }}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-faint)', display: 'flex' }}
                  >
                    <Icon name="x" size={13} />
                  </button>
                  <Icon name={open ? 'chevron-down' : 'chevron-right'} size={13} style={{ color: 'var(--text-muted)' }} />
                </button>

                {open && (
                  <div style={{ padding: '0 16px 16px', borderTop: '1px solid var(--border-2)' }}>
                    <div style={{ padding: '12px 0' }}>
                      <ExportButtons payload={r} compact />
                    </div>
                    {r.findings.map((f, i) => (
                      <FindingCard key={`${f.id}-${i}`} finding={f} index={i} isLive />
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
