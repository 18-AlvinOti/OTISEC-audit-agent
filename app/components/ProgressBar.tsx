interface Props {
  progress?: number
  label?: string
  style?: React.CSSProperties
}

/** Shimmering teal progress bar with mono phase label + percent readout. */
export function ProgressBar({ progress = 0, label = '', style = {} }: Props) {
  return (
    <div style={style}>
      <div style={{ height: 4, background: 'rgba(255,255,255,0.1)', borderRadius: 'var(--radius-full)', overflow: 'hidden', marginBottom: 6 }}>
        <div className="progress-shimmer" style={{
          height: '100%', borderRadius: 'var(--radius-full)',
          width: `${progress}%`, transition: 'width 0.5s ease',
        }} />
      </div>
      <div style={{
        display: 'flex', justifyContent: 'space-between',
        fontFamily: 'var(--font-mono)', fontSize: 'var(--text-tiny)', color: 'var(--text-muted)',
      }}>
        <span>{label}</span>
        <span>{progress}%</span>
      </div>
    </div>
  )
}
