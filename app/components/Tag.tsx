const TINTS = {
  default: { bg: 'var(--fill-1)', text: 'var(--text-4)', border: 'var(--border-1)' },
  teal: { bg: 'var(--tag-teal-bg)', text: 'var(--tag-teal-text)', border: 'var(--tag-teal-border)' },
  purple: { bg: 'var(--tag-purple-bg)', text: 'var(--tag-purple-text)', border: 'var(--tag-purple-border)' },
  amber: { bg: 'var(--tag-amber-bg)', text: 'var(--tag-amber-text)', border: 'var(--tag-amber-border)' },
} as const

interface Props {
  tint?: keyof typeof TINTS
  children?: React.ReactNode
  href?: string
  style?: React.CSSProperties
}

/** Mono tag chip — lenses, prob models, Aave refs, SWC links. */
export function Tag({ tint = 'default', children, href, style = {} }: Props) {
  const c = TINTS[tint] || TINTS.default
  const s: React.CSSProperties = {
    fontFamily: 'var(--font-mono)', fontSize: 'var(--text-micro)',
    padding: '2px 8px', borderRadius: 'var(--radius-sm)',
    background: c.bg, color: c.text, border: `1px solid ${c.border}`,
    display: 'inline-block', textDecoration: 'none', ...style,
  }
  if (href) {
    return <a href={href} target="_blank" rel="noreferrer" style={s}>{children} ↗</a>
  }
  return <span style={s}>{children}</span>
}
