import type { Finding } from '@/lib/data'

const SEV = {
  CRITICAL: { bg: 'var(--sev-critical-bg)', text: 'var(--sev-critical-text)', border: 'var(--sev-critical-border)' },
  HIGH: { bg: 'var(--sev-high-bg)', text: 'var(--sev-high-text)', border: 'var(--sev-high-border)' },
  MEDIUM: { bg: 'var(--sev-medium-bg)', text: 'var(--sev-medium-text)', border: 'var(--sev-medium-border)' },
  LOW: { bg: 'var(--sev-low-bg)', text: 'var(--sev-low-text)', border: 'var(--sev-low-border)' },
  INFO: { bg: 'var(--sev-info-bg)', text: 'var(--sev-info-text)', border: 'var(--sev-info-border)' },
} as const

interface Props {
  sev?: Finding['sev']
  compact?: boolean
  style?: React.CSSProperties
}

/** Severity badge — mono bold chip (CRITICAL/HIGH/MEDIUM/LOW/INFO), or single-letter compact form. */
export function SevBadge({ sev = 'INFO', compact, style = {} }: Props) {
  const c = SEV[sev] || SEV.INFO
  return (
    <span style={{
      fontFamily: 'var(--font-mono)', fontSize: compact ? 'var(--text-nano)' : '10px', fontWeight: 700,
      padding: compact ? '0 6px' : '4px 8px', borderRadius: 'var(--radius-sm)',
      background: c.bg, color: c.text, border: `1px solid ${c.border}`,
      display: 'inline-block', ...style,
    }}>
      {compact ? sev[0] : sev}
    </span>
  )
}
