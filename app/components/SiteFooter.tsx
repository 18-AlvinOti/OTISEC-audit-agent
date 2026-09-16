import { Link } from 'react-router'
import { SITE_LINKS } from './SiteNav'

/** Persistent bottom site footer — mirrors SiteNav's links, plus attribution. */
export function SiteFooter() {
  return (
    <footer style={{
      borderTop: '1px solid var(--border-2)', background: 'var(--bg-nav)',
      padding: '20px', marginTop: 'auto',
    }}>
      <div style={{
        maxWidth: 960, margin: '0 auto', display: 'flex', flexDirection: 'column',
        alignItems: 'center', gap: 14, textAlign: 'center',
      }}>
        <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', justifyContent: 'center' }}>
          {SITE_LINKS.map(l => (
            <Link key={l.label} to={l.href} style={{
              fontFamily: 'var(--font-mono)', fontSize: 'var(--text-tiny)', color: 'var(--text-muted)',
              textDecoration: 'none', padding: '5px 10px', borderRadius: 'var(--radius-sm)',
            }}>
              {l.label}
            </Link>
          ))}
        </div>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-micro)', color: 'var(--text-faint)' }}>
          OTISEC SENTINEL · Thragg-oti · OTI SEC LTD. — Digital Shield Africa · Secure Tomorrow Now
        </div>
      </div>
    </footer>
  )
}
