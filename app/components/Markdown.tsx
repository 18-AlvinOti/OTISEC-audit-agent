import ReactMarkdown from 'react-markdown'
import type { Components } from 'react-markdown'

const components: Components = {
  p: ({ children }) => (
    <p style={{ fontSize: 'var(--text-xs)', lineHeight: 'var(--leading-relaxed)', color: 'var(--text-3)', margin: '0 0 8px' }}>
      {children}
    </p>
  ),
  ul: ({ children }) => (
    <ul style={{ margin: '0 0 8px', paddingLeft: 18, display: 'flex', flexDirection: 'column', gap: 4 }}>{children}</ul>
  ),
  ol: ({ children }) => (
    <ol style={{ margin: '0 0 8px', paddingLeft: 18, display: 'flex', flexDirection: 'column', gap: 6 }}>{children}</ol>
  ),
  li: ({ children }) => (
    <li style={{ fontSize: 'var(--text-xs)', lineHeight: 'var(--leading-relaxed)', color: 'var(--text-3)' }}>{children}</li>
  ),
  strong: ({ children }) => <strong style={{ color: 'var(--text-1)', fontWeight: 600 }}>{children}</strong>,
  code: ({ children, className }) => {
    // Fenced code blocks carry a language className; inline `refs` don't.
    if (className) {
      return (
        <code style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-code)', color: 'var(--text-3)' }}>
          {children}
        </code>
      )
    }
    return (
      <code style={{
        fontFamily: 'var(--font-mono)', fontSize: '0.92em',
        color: 'var(--tag-teal-text)', background: 'var(--tag-teal-bg)',
        border: '1px solid var(--tag-teal-border)', borderRadius: 3, padding: '1px 5px',
      }}>
        {children}
      </code>
    )
  },
  pre: ({ children }) => (
    <pre style={{
      fontFamily: 'var(--font-mono)', fontSize: 'var(--text-code)',
      background: 'var(--fill-code)', borderRadius: 'var(--radius-md)', padding: 12,
      lineHeight: 'var(--leading-relaxed)', border: '1px solid var(--border-4)',
      overflowX: 'auto', margin: '0 0 8px',
    }}>
      {children}
    </pre>
  ),
}

/** Renders finding prose with inline `code` references and fenced PoC blocks styled to the design tokens. */
export function Markdown({ content }: { content: unknown }) {
  const safe = typeof content === 'string' ? content : content == null ? '' : String(content)
  return <ReactMarkdown components={components}>{safe}</ReactMarkdown>
}
