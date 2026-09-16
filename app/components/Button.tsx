import { useState } from 'react'

type Variant = 'primary' | 'ghost' | 'ghost-neutral' | 'ghost-danger'

interface Props {
  variant?: Variant
  children?: React.ReactNode
  icon?: React.ReactNode
  disabled?: boolean
  fullWidth?: boolean
  onClick?: () => void
  style?: React.CSSProperties
  type?: 'button' | 'submit'
}

/** SENTINEL button. Mono 11px bold; teal solid = primary, bordered ghost = everything else. */
export function Button({ variant = 'primary', children, icon, disabled, fullWidth, onClick, style = {}, type = 'button' }: Props) {
  const [hover, setHover] = useState(false)
  const base: React.CSSProperties = {
    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
    padding: '8px 16px', borderRadius: 'var(--radius-md)',
    fontFamily: 'var(--font-mono)', fontSize: 'var(--text-label)',
    cursor: disabled ? 'not-allowed' : 'pointer', opacity: disabled ? 0.4 : 1,
    transition: 'all 0.15s ease', width: fullWidth ? '100%' : undefined,
    background: 'transparent',
  }
  const variants: Record<Variant, React.CSSProperties> = {
    primary: {
      fontWeight: 700,
      background: hover && !disabled ? 'var(--teal-800)' : 'var(--teal-900)',
      color: '#9FE1CB',
      border: '1px solid var(--border-teal-strong)',
    },
    ghost: {
      fontWeight: 400,
      color: hover && !disabled ? 'var(--teal-200)' : 'var(--text-4)',
      border: `1px solid ${hover && !disabled ? 'var(--border-teal)' : 'var(--border-2)'}`,
    },
    'ghost-neutral': {
      fontWeight: 400,
      color: hover && !disabled ? 'var(--text-2)' : 'var(--text-4)',
      border: `1px solid ${hover && !disabled ? 'rgba(255,255,255,0.2)' : 'var(--border-2)'}`,
    },
    'ghost-danger': {
      fontWeight: 400,
      color: hover && !disabled ? '#fca5a5' : 'var(--text-4)',
      border: `1px solid ${hover && !disabled ? 'rgba(239,68,68,0.5)' : 'var(--border-2)'}`,
    },
  }
  return (
    <button
      type={type}
      onClick={disabled ? undefined : onClick}
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{ ...base, ...(variants[variant] || variants.primary), ...style }}
    >
      {icon}{children}
    </button>
  )
}
