import { useState } from 'react'
import { Icon } from './Icon'
import { SevBadge } from './SevBadge'
import { Tag } from './Tag'
import { Markdown } from './Markdown'
import type { Finding } from '@/lib/data'

interface Props {
  finding: Finding
  index: number
  isLive: boolean
}

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div style={{
        fontFamily: 'var(--font-mono)', fontSize: 'var(--text-micro)', fontWeight: 700,
        textTransform: 'uppercase', letterSpacing: 'var(--tracking-widest)',
        color: 'var(--text-muted)', marginBottom: 6,
      }}>{label}</div>
      {children}
    </div>
  )
}

/** Handles malformed data defensively — models occasionally return a bare string instead of
 *  an array, and stale localStorage past-reports may predate a schema field. */
function toArray(v: unknown): string[] {
  if (Array.isArray(v)) return v
  if (typeof v === 'string' && v.trim()) return [v]
  return []
}

/** Expandable audit finding card — sev badge, confidence, title; body follows the full report format: summary, root cause, symmetry, preconditions, attack path, impact, PoC, mitigation, tags. */
export default function FindingCard({ finding, index, isLive }: Props) {
  const [open, setOpen] = useState(index === 0)
  const [hover, setHover] = useState(false)
  const sev = finding.sev || 'INFO'
  const prob = toArray(finding.prob)
  const aave = toArray(finding.aave)
  const swc = toArray(finding.swc)
  const immunefi = toArray(finding.immunefi)

  return (
    <div className="fade-in" style={{
      borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-2)',
      overflow: 'hidden', marginBottom: 12, background: 'var(--surface-card)',
    }}>
      <button
        onClick={() => setOpen(!open)}
        onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
        style={{
          width: '100%', display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px',
          background: hover ? 'var(--fill-1)' : 'none', border: 'none', cursor: 'pointer',
          textAlign: 'left', transition: 'background 0.15s ease',
        }}
      >
        <SevBadge sev={sev} style={{ fontSize: '10px' }} />
        {typeof finding.confidence === 'number' && (
          <span title="Gate-validated confidence score" style={{
            fontFamily: 'var(--font-mono)', fontSize: 'var(--text-micro)', padding: '2px 6px',
            borderRadius: 'var(--radius-sm)', background: 'var(--fill-1)',
            color: 'var(--text-muted)', border: '1px solid var(--border-2)', flexShrink: 0,
          }}>{finding.confidence}%</span>
        )}
        {isLive && (
          <span title="Live finding from your contract" style={{
            width: 8, height: 8, borderRadius: '50%', background: 'var(--teal-400)', flexShrink: 0,
          }} />
        )}
        <span style={{ flex: 1, fontSize: 'var(--text-sm)', fontWeight: 500, color: 'var(--text-strong)' }}>
          {finding.id}: {finding.title}
        </span>
        <Icon name={open ? 'chevron-down' : 'chevron-right'} size={14} style={{ color: 'var(--text-muted)' }} />
      </button>

      {open && (
        <div style={{ padding: '12px 16px 16px', borderTop: '1px solid var(--border-2)', display: 'flex', flexDirection: 'column', gap: 12 }}>
          <Section label="Summary"><Markdown content={finding.summary} /></Section>
          <Section label="Root cause"><Markdown content={finding.rootCause} /></Section>
          {finding.symmetry && (
            <Section label="Symmetry"><Markdown content={finding.symmetry} /></Section>
          )}
          <Section label="External pre-conditions"><Markdown content={finding.externalPreconditions} /></Section>
          <Section label="Internal pre-conditions"><Markdown content={finding.internalPreconditions} /></Section>
          <Section label="Attack path"><Markdown content={finding.attackPath} /></Section>
          <Section label="Impact"><Markdown content={finding.impact} /></Section>
          <Section label="Proof of concept"><Markdown content={finding.poc} /></Section>
          <Section label="Mitigation"><Markdown content={finding.mitigation} /></Section>

          {(prob.length > 0 || aave.length > 0 || swc.length > 0 || immunefi.length > 0 || finding.lens) && (
            <div>
              <div style={{
                fontFamily: 'var(--font-mono)', fontSize: 'var(--text-micro)', fontWeight: 700,
                textTransform: 'uppercase', letterSpacing: 'var(--tracking-widest)',
                color: 'var(--text-muted)', marginBottom: 8,
              }}>Tags</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {finding.lens && <Tag>{finding.lens}</Tag>}
                {prob.map(p => (
                  <Tag key={p} tint="teal">{p}</Tag>
                ))}
                {aave.map(a => (
                  <Tag key={a} tint="purple">{a.split(':')[0]}</Tag>
                ))}
                {swc.map(s => (
                  <Tag key={s} tint="amber" href={`https://swcregistry.io/docs/${s}`}>{s}</Tag>
                ))}
                {immunefi.map(i => (
                  <Tag key={i} tint="purple">{i}</Tag>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
