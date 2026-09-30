interface Tab {
  key: string
  label: string
  count?: number
}

interface Props {
  tabs: Tab[]
  active: string
  onChange?: (key: string) => void
  style?: React.CSSProperties
}

/** Underlined page-tab strip with optional count pills, on the tab-strip band. */
export function Tabs({ tabs, active, onChange, style = {} }: Props) {
  return (
    <div data-chrome="cream" style={{ display: 'flex', borderBottom: '1px solid var(--cream-border)', background: 'var(--bg-tabs)', overflowX: 'auto', ...style }}>
      {tabs.map(t => {
        const isActive = active === t.key
        return (
          <button
            key={t.key} onClick={() => onChange && onChange(t.key)}
            style={{
              display: 'flex', alignItems: 'center', gap: 6, padding: '10px 16px',
              fontFamily: 'var(--font-mono)', fontSize: 'var(--text-label)', whiteSpace: 'nowrap',
              background: 'none', cursor: 'pointer',
              border: 'none', borderBottom: `2px solid ${isActive ? 'var(--cream-accent)' : 'transparent'}`,
              color: isActive ? 'var(--cream-accent)' : 'var(--ink-muted)',
              fontWeight: isActive ? 700 : 400,
              transition: 'color 0.15s ease',
            }}
          >
            {t.label}
            {t.count !== undefined && (
              <span style={{
                fontSize: 'var(--text-micro)', padding: '2px 6px', borderRadius: 'var(--radius-full)',
                background: 'var(--cream-badge)',
                color: 'var(--ink)',
              }}>{t.count}</span>
            )}
          </button>
        )
      })}
    </div>
  )
}
