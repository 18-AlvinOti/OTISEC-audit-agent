import { useState } from 'react'

interface Props {
  icon?: React.ReactNode
  type?: string
  placeholder?: string
  value?: string
  onChange?: React.ChangeEventHandler<HTMLInputElement>
  autoFocus?: boolean
  required?: boolean
  name?: string
  style?: React.CSSProperties
}

/** SENTINEL text input — dark fill, hairline border, teal focus, mono text. Optional leading icon. */
export function Input({ icon, type = 'text', placeholder, value, onChange, autoFocus, required, name, style = {} }: Props) {
  const [focus, setFocus] = useState(false)
  return (
    <div style={{ position: 'relative', width: '100%' }}>
      {icon && (
        <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-faint)', display: 'flex' }}>
          {icon}
        </span>
      )}
      <input
        type={type} placeholder={placeholder} value={value} onChange={onChange} autoFocus={autoFocus}
        required={required} name={name}
        onFocus={() => setFocus(true)} onBlur={() => setFocus(false)}
        style={{
          width: '100%', padding: icon ? '10px 12px 10px 36px' : '8px 12px',
          borderRadius: 'var(--radius-md)', background: 'var(--fill-1)',
          border: `1px solid ${focus ? 'var(--border-teal)' : 'var(--border-2)'}`,
          color: 'var(--text-1)', outline: 'none',
          fontFamily: 'var(--font-mono)', fontSize: 'var(--text-label)',
          ...style,
        }}
      />
    </div>
  )
}
