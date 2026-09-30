import { Link } from 'react-router'
import { BrandMark } from './BrandMark'

export const SITE_LINKS = [
  { label: 'Home', href: '/welcome' },
  { label: 'How It Works', href: '/welcome#how-it-works' },
  { label: 'New Audit', href: '/' },
  { label: 'Results', href: '/#results' },
  { label: 'Past Reports', href: '/reports' },
  { label: 'About Us', href: '/about' },
]

/** Persistent top site nav — sits above the app/product chrome, links across the whole site. */
export function SiteNav() {
  return (
    <nav style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '10px 20px', borderBottom: '1px solid var(--cream-border)', background: 'var(--cream-bg)',
      backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)',
      flexWrap: 'wrap', gap: 8,
    }}>
      <Link to="/welcome" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
        <div style={{
          width: 26, height: 26, borderRadius: 'var(--radius-sm)', background: 'var(--teal-900)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--border-teal-strong)', flexShrink: 0,
        }}>
          <BrandMark size={15} />
        </div>
        <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: 'var(--text-tiny)', letterSpacing: 'var(--tracking-widest)', color: 'var(--ink)' }}>
          OTISEC SENTINEL
        </span>
      </Link>
      <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
        {SITE_LINKS.map(l => (
          <Link key={l.label} to={l.href} style={{
            fontFamily: 'var(--font-mono)', fontSize: 'var(--text-tiny)', color: 'var(--ink-muted)',
            textDecoration: 'none', padding: '5px 10px', borderRadius: 'var(--radius-sm)',
            transition: 'color 0.15s ease, background 0.15s ease',
          }}
          onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.color = 'var(--cream-accent)'; (e.currentTarget as HTMLAnchorElement).style.background = 'var(--cream-hover)' }}
          onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.color = 'var(--ink-muted)'; (e.currentTarget as HTMLAnchorElement).style.background = 'transparent' }}
          >
            {l.label}
          </Link>
        ))}
      </div>
    </nav>
  )
}
