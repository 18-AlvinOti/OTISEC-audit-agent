const COLORS = {
  critical: 'var(--stat-critical)',
  high: 'var(--stat-high)',
  medium: 'var(--stat-medium)',
  low: 'var(--stat-low)',
  teal: 'var(--teal-200)',
} as const

interface Props {
  label: string
  value?: number | string | null
  color?: keyof typeof COLORS
  style?: React.CSSProperties
}

/** Stat card — micro label over a big mono number ("—" when empty). */
export function StatCard({ label, value, color = 'teal', style = {} }: Props) {
  return (
    <div style={{
      background: 'var(--fill-1)', borderRadius: 'var(--radius-lg)', padding: 12,
      border: '1px solid var(--border-3)', ...style,
    }}>
      <div style={{
        fontFamily: 'var(--font-mono)', fontSize: 'var(--text-micro)',
        color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 'var(--tracking-wider)',
      }}>{label}</div>
      <div style={{
        fontFamily: 'var(--font-mono)', fontSize: 'var(--text-2xl)', fontWeight: 700,
        marginTop: 4, color: COLORS[color] || color,
      }}>{value === undefined || value === null ? '—' : value}</div>
    </div>
  )
}
