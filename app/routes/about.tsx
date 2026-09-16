import type { Route } from './+types/about'
import { Icon } from '@/components/Icon'
import { BrandMark } from '@/components/BrandMark'
import { SiteNav } from '@/components/SiteNav'
import { SiteFooter } from '@/components/SiteFooter'

export function meta(_: Route.MetaArgs) {
  return [
    { title: 'About — OTISEC SENTINEL' },
    { name: 'description', content: 'About OTISEC SENTINEL and OTI SEC LTD.' },
  ]
}

const LINKS = [
  { label: 'Email', value: 'otisec@icloud.com', href: 'mailto:otisec@icloud.com', icon: 'external-link' as const },
  { label: 'GitHub', value: 'github.com/18-AlvinOti/OTISEC-audit-agent', href: 'https://github.com/18-AlvinOti/OTISEC-audit-agent', icon: 'git-branch' as const },
  { label: 'HackenProof', value: 'hackenproof.com', href: 'https://hackenproof.com/', icon: 'shield' as const },
  { label: 'LinkedIn', value: 'tr.ee/IfrQjUK6Uk', href: 'https://tr.ee/IfrQjUK6Uk', icon: 'external-link' as const },
]

export default function About() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg-app)', color: 'var(--text-body)' }}>
      <SiteNav />

      <main style={{ flex: 1, maxWidth: 640, margin: '0 auto', padding: '64px 20px', width: '100%' }}>
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div style={{
            width: 64, height: 64, borderRadius: 'var(--radius-lg)', background: 'var(--teal-900)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px',
            border: '1px solid var(--border-teal-strong)',
          }}>
            <BrandMark size={28} />
          </div>
          <h1 style={{ fontSize: 'var(--text-xl)', fontWeight: 700, color: 'var(--text-strong)', marginBottom: 6 }}>Alvin Gilbert</h1>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-tiny)', color: 'var(--teal-400)', textTransform: 'uppercase', letterSpacing: 'var(--tracking-wider)' }}>
            Thragg-oti · OTI SEC LTD.
          </div>
        </div>

        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-2)', lineHeight: 'var(--leading-relaxed)', textAlign: 'center', marginBottom: 40 }}>
          OTISEC SENTINEL is built and maintained by Alvin Gilbert (Thragg-oti) under OTI SEC LTD. —
          "Digital Shield Africa · Secure Tomorrow Now." It's a multi-phase smart contract security
          auditor combining a 12-lens attack-surface sweep, a known-exploit pattern library, and
          real-world precedent from Solodit's audit-contest dataset.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {LINKS.map(l => (
            <a key={l.label} href={l.href} target="_blank" rel="noreferrer" style={{
              display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px',
              borderRadius: 'var(--radius-md)', border: '1px solid var(--border-2)',
              background: 'var(--surface-card)', textDecoration: 'none', transition: 'border-color 0.15s ease',
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.borderColor = 'var(--border-teal)' }}
            onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.borderColor = 'var(--border-2)' }}
            >
              <Icon name={l.icon} size={15} style={{ color: 'var(--teal-400)' }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-micro)', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 'var(--tracking-wider)' }}>{l.label}</div>
                <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-1)' }}>{l.value}</div>
              </div>
              <Icon name="external-link" size={11} style={{ color: 'var(--text-faint)' }} />
            </a>
          ))}
        </div>
      </main>

      <SiteFooter />
    </div>
  )
}
