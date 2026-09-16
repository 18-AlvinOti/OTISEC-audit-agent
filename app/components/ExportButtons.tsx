import { useState } from 'react'
import { Icon } from './Icon'
import { downloadMarkdown, downloadPdf, downloadDocx, type ExportPayload } from '@/lib/export'

interface Props {
  payload: ExportPayload
  compact?: boolean
}

/** Download the current audit report as Markdown, PDF, or DOCX — all generated client-side. */
export function ExportButtons({ payload, compact }: Props) {
  const [busy, setBusy] = useState<'pdf' | 'docx' | null>(null)

  const handlePdf = async () => {
    setBusy('pdf')
    try { await downloadPdf(payload) } finally { setBusy(null) }
  }
  const handleDocx = async () => {
    setBusy('docx')
    try { await downloadDocx(payload) } finally { setBusy(null) }
  }

  const btnStyle: React.CSSProperties = {
    display: 'flex', alignItems: 'center', gap: 6,
    padding: compact ? '4px 9px' : '6px 12px',
    borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-2)',
    background: 'var(--fill-1)', color: 'var(--text-2)', cursor: 'pointer',
    fontFamily: 'var(--font-mono)', fontSize: compact ? 'var(--text-nano)' : 'var(--text-micro)',
    transition: 'all 0.15s ease',
  }

  if (payload.findings.length === 0) return null

  return (
    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center' }}>
      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-nano)', color: 'var(--text-faint)', textTransform: 'uppercase', letterSpacing: 'var(--tracking-wider)' }}>
        Download:
      </span>
      <button onClick={() => downloadMarkdown(payload)} style={btnStyle}>
        <Icon name="external-link" size={compact ? 9 : 10} /> MD
      </button>
      <button onClick={handlePdf} disabled={busy === 'pdf'} style={{ ...btnStyle, opacity: busy === 'pdf' ? 0.5 : 1 }}>
        <Icon name="external-link" size={compact ? 9 : 10} /> {busy === 'pdf' ? '...' : 'PDF'}
      </button>
      <button onClick={handleDocx} disabled={busy === 'docx'} style={{ ...btnStyle, opacity: busy === 'docx' ? 0.5 : 1 }}>
        <Icon name="external-link" size={compact ? 9 : 10} /> {busy === 'docx' ? '...' : 'DOCX'}
      </button>
    </div>
  )
}
