interface Props {
  phases: string[]
  phase?: number
  running?: boolean
  style?: React.CSSProperties
}

/** N-phase pipeline status list — numbered dots turn teal check-marks as phases complete. */
export function Pipeline({ phases, phase = -1, running = false, style = {} }: Props) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 2, ...style }}>
      {phases.map((p, i) => {
        const active = phase === i && running
        const done = phase > i
        return (
          <div key={i} style={{
            display: 'flex', alignItems: 'center', gap: 8, padding: '2px 0',
            fontSize: 'var(--text-tiny)',
            color: active ? 'var(--teal-200)' : done ? 'var(--teal-600)' : 'var(--text-faint)',
          }}>
            <div style={{
              width: 16, height: 16, borderRadius: '50%', flexShrink: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: 'var(--font-mono)', fontSize: 'var(--text-nano)',
              border: `1px solid ${active ? 'var(--teal-400)' : done ? 'var(--teal-800)' : 'var(--border-2)'}`,
              background: active ? 'rgba(4,52,44,0.6)' : done ? 'var(--teal-900)' : 'transparent',
              color: active ? 'var(--teal-200)' : done ? 'var(--teal-400)' : 'inherit',
            }}>
              {done ? '✓' : i + 1}
            </div>
            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {p.split(' ').slice(0, 2).join(' ')}
            </span>
          </div>
        )
      })}
    </div>
  )
}
