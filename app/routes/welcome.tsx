import { Link } from 'react-router'
import type { Route } from './+types/welcome'
import { Icon } from '@/components/Icon'
import { Button } from '@/components/Button'
import { SiteNav } from '@/components/SiteNav'
import { SiteFooter } from '@/components/SiteFooter'

export function meta(_: Route.MetaArgs) {
  return [
    { title: 'OTISEC SENTINEL — Smart Contract Security Auditor' },
    { name: 'description', content: 'Multi-phase smart contract security auditor. 12-lens attack surface sweep, 4-gate validation, Aave V2+V3 checklist, SmartBugs/SWC vulnerability matrix.' },
  ]
}

const STATS = [
  { v: '12', l: 'Attack-surface lenses' },
  { v: '4', l: 'Validation gates' },
  { v: '$2.1B', l: 'Lost to exploits, 2024' },
  { v: '67%', l: 'Were business-logic flaws' },
]

const FEATURES = [
  { icon: 'zap' as const, title: 'Live Audit Engine', desc: 'Upload .sol/.move/.vy/.rs — get gate-validated findings with confidence scores, not generic pattern matches.' },
  { icon: 'bar-chart-2' as const, title: 'Probability Models', desc: '17 quantitative models — Markov, Bayesian, Kalman Filter, Hidden Markov Model — scoring exploit likelihood, not just presence.' },
  { icon: 'check-square' as const, title: 'Aave V2+V3 Checklist', desc: '38-item checklist covering E-Mode, isolation mode, variable close factor, and oracle sentinel.' },
  { icon: 'grid' as const, title: 'Vulnerability Matrix', desc: '41 vulnerability classes cross-referenced against SWC, DASP, detection method, and real precedent from Immunefi bounties and 2,148 triaged Bounty Boost reports.' },
  { icon: 'alert-triangle' as const, title: 'ChainLight Insights', desc: '2024 exploit postmortems — access control, oracle manipulation, reentrancy, bridge failures.' },
  { icon: 'shield' as const, title: 'Risk Scoring', desc: 'Bayesian-weighted risk score across 8 protocol dimensions, updated as findings accrue.' },
]

const PIPELINE = [
  { t: 'Building context & architecture map', d: 'Parse contract structure, inheritance, and external dependencies.' },
  { t: 'Hunting business logic vulnerabilities', d: '12-lens sweep — access control, economics, invariants, and cross-lens seams.' },
  { t: 'Extracting invariants & Foundry PoC', d: 'Derive conservation laws and state couplings the code must preserve.' },
  { t: 'Scoring code maturity', d: '9-category maturity score across oracle safety, access control, and arithmetic.' },
  { t: 'Synthesizing & deduplicating findings', d: 'Four-gate validation — execution, reachability, trigger, impact — before anything ships.' },
]

export default function Welcome() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg-app)', color: 'var(--text-body)' }}>
      <SiteNav />

      {/* HERO — full-viewport video background */}
      <section style={{
        position: 'relative', width: '100%', minHeight: '100vh',
        display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden',
      }}>
        <video
          src="/otisec-logo-intro.mp4"
          autoPlay
          muted
          loop
          playsInline
          style={{
            position: 'absolute', inset: 0, width: '100%', height: '100%',
            objectFit: 'cover', zIndex: 0,
          }}
        />
        <div style={{
          position: 'absolute', inset: 0, zIndex: 1,
          background: 'linear-gradient(180deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.35) 40%, rgba(0,0,0,0.75) 100%)',
        }} />

        <Link to="/" aria-label="Go to home" style={{
          position: 'absolute', inset: 0, zIndex: 2, display: 'block',
        }} />

        <div style={{ position: 'relative', zIndex: 3, textAlign: 'center', padding: '0 20px', maxWidth: 840, margin: '0 auto', pointerEvents: 'none' }}>
          <div style={{
            display: 'inline-block', fontFamily: 'var(--font-mono)', fontSize: 'var(--text-micro)',
            letterSpacing: 'var(--tracking-widest)', textTransform: 'uppercase', color: 'var(--teal-400)',
            border: '1px solid var(--border-teal)', borderRadius: 'var(--radius-full)', padding: '4px 12px', marginBottom: 24,
            background: 'rgba(0,0,0,0.3)',
          }}>
            Thragg-oti · OTI SEC LTD.
          </div>

          <h1 style={{ fontSize: 48, fontWeight: 800, lineHeight: 1.1, margin: '0 0 20px' }}>
            <span style={{ color: '#fff' }}>Audit smart contracts</span>
            <br />
            <span style={{ color: 'var(--teal-400)' }}>like an attacker.</span>
          </h1>

          <p style={{ fontSize: 'var(--text-base)', color: 'rgba(255,255,255,0.8)', lineHeight: 'var(--leading-relaxed)', maxWidth: 560, margin: '0 auto 32px' }}>
            A 12-lens business-logic vulnerability sweep with mandatory four-gate validation —
            every finding survives an attack-execution, reachability, trigger, and impact check
            before it's ever shown to you.
          </p>

          <Link to="/login" style={{ textDecoration: 'none', pointerEvents: 'auto', position: 'relative', zIndex: 4, display: 'inline-block' }}>
            <Button icon={<Icon name="zap" size={13} />}>
              Run an Audit
            </Button>
          </Link>

          {/* STATS ROW */}
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 1,
            marginTop: 64, borderRadius: 'var(--radius-lg)', overflow: 'hidden',
            border: '1px solid rgba(255,255,255,0.15)', background: 'rgba(255,255,255,0.08)',
            backdropFilter: 'blur(6px)',
          }}>
            {STATS.map(s => (
              <div key={s.l} style={{ background: 'rgba(0,0,0,0.35)', padding: '20px 12px' }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 28, fontWeight: 700, color: 'var(--teal-200)' }}>{s.v}</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-micro)', color: 'rgba(255,255,255,0.65)', marginTop: 4, textTransform: 'uppercase', letterSpacing: 'var(--tracking-wider)' }}>
                  {s.l}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURE GRID — 6 cards */}
      <section style={{ maxWidth: 1040, margin: '0 auto', padding: '32px 20px 80px' }}>
        <h2 style={{ textAlign: 'center', fontSize: 'var(--text-base)', fontWeight: 600, color: 'var(--text-strong)', marginBottom: 8 }}>
          One tool, six lenses on your protocol
        </h2>
        <p style={{ textAlign: 'center', fontSize: 'var(--text-xs)', color: 'var(--text-muted)', marginBottom: 40 }}>
          Everything in the audit dashboard, unlocked after you sign in
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16 }}>
          {FEATURES.map(f => (
            <div key={f.title} style={{
              background: 'var(--surface-card)', border: '1px solid var(--border-3)',
              borderRadius: 'var(--radius-lg)', padding: 20, textAlign: 'center',
            }}>
              <div style={{
                width: 40, height: 40, borderRadius: 'var(--radius-md)', background: 'var(--fill-teal)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px',
                border: '1px solid rgba(8,80,65,0.3)',
              }}>
                <Icon name={f.icon} size={18} style={{ color: 'var(--teal-400)' }} />
              </div>
              <div style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--text-strong)', marginBottom: 8 }}>{f.title}</div>
              <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-3)', lineHeight: 'var(--leading-relaxed)' }}>{f.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* PIPELINE — numbered steps, centered */}
      <section id="how-it-works" style={{ maxWidth: 640, margin: '0 auto', padding: '0 20px 96px', scrollMarginTop: 80 }}>
        <h2 style={{ textAlign: 'center', fontSize: 'var(--text-base)', fontWeight: 600, color: 'var(--text-strong)', marginBottom: 40 }}>
          Five phases, every audit
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          {PIPELINE.map((p, i) => (
            <div key={p.t} style={{ display: 'flex', gap: 16 }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
                <div style={{
                  width: 32, height: 32, borderRadius: '50%', flexShrink: 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: 'var(--font-mono)', fontSize: 'var(--text-label)', fontWeight: 700,
                  border: '1px solid var(--teal-800)', background: 'var(--teal-900)', color: 'var(--teal-200)',
                }}>
                  {i + 1}
                </div>
                {i < PIPELINE.length - 1 && (
                  <div style={{ width: 1, flex: 1, minHeight: 32, background: 'var(--border-2)' }} />
                )}
              </div>
              <div style={{ paddingBottom: 28, textAlign: 'left' }}>
                <div style={{ fontSize: 'var(--text-sm)', fontWeight: 500, color: 'var(--text-strong)', marginBottom: 4 }}>{p.t}</div>
                <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', lineHeight: 'var(--leading-relaxed)' }}>{p.d}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FOOTER CTA */}
      <section style={{ textAlign: 'center', padding: '0 20px 80px' }}>
        <Link to="/login" style={{ textDecoration: 'none' }}>
          <Button icon={<Icon name="zap" size={13} />}>
            Run an Audit
          </Button>
        </Link>
      </section>

      <SiteFooter />
    </div>
  )
}
