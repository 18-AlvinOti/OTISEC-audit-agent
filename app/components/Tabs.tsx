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
    <div style={{ display: 'flex', borderBottom: '1px solid var(--border-2)', background: 'var(--bg-tabs)', overflowX: 'auto', ...style }}>
      {tabs.map(t => {
        const isActive = active === t.key
        return (
          <button
            key={t.key} onClick={() => onChange && onChange(t.key)}
            style={{
              display: 'flex', alignItems: 'center', gap: 6, padding: '10px 16px',
              fontFamily: 'var(--font-mono)', fontSize: 'var(--text-label)', whiteSpace: 'nowrap',
              background: 'none', cursor: 'pointer',
              border: 'none', borderBottom: `2px solid ${isActive ? 'var(--teal-400)' : 'transparent'}`,
              color: isActive ? 'var(--teal-200)' : 'var(--text-muted)',
              transition: 'color 0.15s ease',
            }}
          >
            {t.label}
            {t.count !== undefined && (
              <span style={{
                fontSize: 'var(--text-micro)', padding: '2px 6px', borderRadius: 'var(--radius-full)',
                background: isActive ? 'rgba(4,52,44,0.6)' : 'var(--fill-1)',
                color: isActive ? 'var(--teal-200)' : 'var(--text-faint)',
              }}>{t.count}</span>
            )}
          </button>
        )
      })}
    </div>
  )
}
