import { useState } from 'react'
import { Icon } from './Icon'

const EXTS = ['.sol', '.move', '.vy', '.rs']

interface Props {
  wide?: boolean
  active?: boolean
  title?: string
  subtitle?: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  rootProps?: any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  inputProps?: any
}

/** Dashed drop target for contract files — compact (sidebar) or wide (dashboard) form. */
export function Dropzone({ wide = false, active = false, title = 'Upload Smart Contract', subtitle, rootProps = {}, inputProps = {} }: Props) {
  const [hover, setHover] = useState(false)
  const border = active ? 'var(--teal-100)' : hover ? 'var(--border-teal)' : (wide ? 'var(--border-2)' : 'var(--border-1)')

  if (wide) {
    return (
      <div
        {...rootProps}
        className={active ? 'drop-active' : undefined}
        onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
        style={{
          border: `1px dashed ${border}`, borderRadius: 'var(--radius-lg)', padding: 16,
          cursor: 'pointer', transition: 'all 0.15s ease',
          background: active ? 'rgba(4,52,44,0.1)' : hover ? 'rgba(255,255,255,0.02)' : 'transparent',
          display: 'flex', alignItems: 'center', gap: 16,
        }}
      >
        <input {...inputProps} />
        <div style={{
          width: 40, height: 40, borderRadius: 'var(--radius-md)', background: 'var(--fill-teal)',
          border: '1px solid rgba(8,80,65,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        }}>
          <Icon name="upload" size={18} style={{ color: 'var(--teal-400)' }} />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 'var(--text-sm)', fontWeight: 500, color: 'var(--text-1)' }}>{title}</div>
          <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', marginTop: 2 }}>
            {subtitle || (active ? 'Drop to add files' : 'Drag & drop .sol / .move / .vy / .rs — or click to browse')}
          </div>
        </div>
        <div style={{ display: 'flex', gap: 4 }}>
          {EXTS.map(e => (
            <span key={e} style={{
              fontFamily: 'var(--font-mono)', fontSize: 'var(--text-micro)', padding: '2px 6px',
              border: '1px solid var(--border-2)', borderRadius: 'var(--radius-sm)', color: 'var(--text-faint)',
            }}>{e}</span>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div
      {...rootProps}
      className={active ? 'drop-active' : undefined}
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{
        border: `1px dashed ${border}`, borderRadius: 'var(--radius-md)', padding: 12,
        textAlign: 'center', cursor: 'pointer', transition: 'all 0.15s ease',
        background: active ? 'rgba(4,52,44,0.2)' : 'transparent',
      }}
    >
      <input {...inputProps} />
      <Icon name="upload" size={16} style={{ color: 'var(--teal-600)', margin: '0 auto 6px', display: 'block' }} />
      <div style={{ fontSize: 'var(--text-label)', color: 'var(--text-2)', fontWeight: 500 }}>Drop files or click</div>
      <div style={{ display: 'flex', gap: 4, justifyContent: 'center', marginTop: 6, flexWrap: 'wrap' }}>
        {EXTS.map(e => (
          <span key={e} style={{
            fontFamily: 'var(--font-mono)', fontSize: 'var(--text-nano)', padding: '2px 6px',
            border: '1px solid var(--border-2)', borderRadius: 'var(--radius-sm)', color: 'var(--text-faint)',
          }}>{e}</span>
        ))}
      </div>
    </div>
  )
}
