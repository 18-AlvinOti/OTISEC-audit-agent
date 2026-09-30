interface Props {
  label: string
  children?: React.ReactNode
  style?: React.CSSProperties
}

/** Sidebar section: mono micro-label header + stacked children. */
export function SbSection({ label, children, style = {} }: Props) {
  return (
    <div style={{ padding: 12, display: 'flex', flexDirection: 'column', gap: 6, ...style }}>
      <div style={{
        fontFamily: 'var(--font-mono)', fontSize: 'var(--text-micro)', fontWeight: 700,
        textTransform: 'uppercase', letterSpacing: 'var(--tracking-widest)',
        color: 'var(--ink-muted)', marginBottom: 2,
      }}>{label}</div>
      {children}
    </div>
  )
}
