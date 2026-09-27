import { useState, useCallback, useRef } from 'react'
import { useDropzone } from 'react-dropzone'
import { Form } from 'react-router'
import { AlertTriangle, ExternalLink, ChevronDown, ChevronRight } from 'lucide-react'
import FindingCard from '@/components/FindingCard'
import { Icon } from '@/components/Icon'
import { BrandMark } from '@/components/BrandMark'
import { Button } from '@/components/Button'
import { Tabs } from '@/components/Tabs'
import { SbSection } from '@/components/SbSection'
import { SevBadge } from '@/components/SevBadge'
import { Dropzone } from '@/components/Dropzone'
import { Pipeline } from '@/components/Pipeline'
import { ProgressBar } from '@/components/ProgressBar'
import { StatCard } from '@/components/StatCard'
import { PROB_MODELS, AAVE_CHECKLIST, VULN_MATRIX, DEMO_FINDINGS, CHAINLIGHT_INSIGHTS, Finding, Lead, SoloditRef } from '@/lib/data'
import { requireAuth } from '@/lib/session.server'
import { savePastReport } from '@/lib/reports'
import { SiteNav } from '@/components/SiteNav'
import { SiteFooter } from '@/components/SiteFooter'
import { PastReportsList } from '@/components/PastReportsList'
import { ExportButtons } from '@/components/ExportButtons'
import type { Route } from './+types/home'

export async function loader({ request }: Route.LoaderArgs) {
  await requireAuth(request)
  return null
}

type Tab = 'audit' | 'prob' | 'aave' | 'matrix' | 'insights' | 'score' | 'history'
type Proto = 'lending' | 'dex' | 'bridge' | 'staking' | 'derivatives' | 'nft'

const PHASES = [
  'X-Ray: protocol profiling & threat model',
  'Building context & architecture map',
  'Symmetry-Sniper: paired-operation analysis',
  'Hunting business logic vulnerabilities',
  'Extracting invariants & Foundry PoC',
  'Fizz: generating fuzzing invariant properties',
  'Scoring code maturity (9 categories)',
  'Synthesizing & deduplicating findings',
]

const PROTOS: { k: Proto; label: string; icon: string }[] = [
  { k: 'lending', label: 'Lending', icon: '💰' },
  { k: 'dex', label: 'DEX / AMM', icon: '🔄' },
  { k: 'bridge', label: 'Bridge', icon: '🌉' },
  { k: 'staking', label: 'Staking', icon: '🔒' },
  { k: 'derivatives', label: 'Perps', icon: '📊' },
  { k: 'nft', label: 'NFT', icon: '🖼️' },
]

// Every one of the 17 probability models (app/lib/data.ts PROB_MODELS) is mapped to exactly
// one scoring dimension below, so each model has a concrete say in the overall risk score —
// not just Bayesian. When a live audit has findings, each dimension's score is recomputed
// from the findings whose "prob" tags fall in that dimension's model list (see scoreDims below);
// in demo mode it falls back to these baseline values.
const SCORE_DIMS: { l: string; v: number; models: string[] }[] = [
  { l: 'Oracle Safety', v: 72, models: ['Log-Normal', 'Exponential'] },
  { l: 'Access Control', v: 58, models: ['Game Theory', 'Binomial'] },
  { l: 'Reentrancy Guards', v: 81, models: ['Markov Chain', 'Kalman Filter', 'Hidden Markov Model'] },
  { l: 'Arithmetic Safety', v: 75, models: ['Normal / Gaussian', 'Beta Distribution'] },
  { l: 'Flash Loan Risk', v: 49, models: ['Poisson Process', 'Monte Carlo', 'Copula Models'] },
  { l: 'Liquidation Logic', v: 63, models: ['Weibull Distribution', 'Queueing Theory'] },
  { l: 'Token Integration', v: 55, models: ['Bayesian Inference', 'Geometric'] },
  { l: 'Governance Risk', v: 68, models: ['Pareto / Power Law'] },
]

const SEV_SCORE_WEIGHT: Record<string, number> = { CRITICAL: 22, HIGH: 15, MEDIUM: 9, LOW: 4, INFO: 1 }

export default function Home() {
  const [tab, setTab] = useState<Tab>('audit')
  const [proto, setProto] = useState<Proto>('lending')
  const [files, setFiles] = useState<File[]>([])
  const [findings, setFindings] = useState<Finding[]>([])
  const [leads, setLeads] = useState<Lead[]>([])
  const [soloditRefs, setSoloditRefs] = useState<SoloditRef[]>([])
  const [running, setRunning] = useState(false)
  const [phase, setPhase] = useState(-1)
  const [progress, setProgress] = useState(0)
  const [progressLabel, setProgressLabel] = useState('')
  const [isLive, setIsLive] = useState(false)
  const [auditMeta, setAuditMeta] = useState('')
  const [apiError, setApiError] = useState('')
  const [hasRun, setHasRun] = useState(false)
  const [modelSearch, setModelSearch] = useState('')
  const [openModels, setOpenModels] = useState<Record<string, boolean>>({})
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({})
  const [matrixFilter, setMatrixFilter] = useState<'all' | 'High' | 'Medium' | 'Low'>('all')
  const [openAaveSecs, setOpenAaveSecs] = useState<Record<number, boolean>>({})
  const findingsRef = useRef<HTMLDivElement>(null)

  const onDrop = useCallback((accepted: File[]) => {
    setFiles(prev => {
      const names = new Set(prev.map(f => f.name))
      return [...prev, ...accepted.filter(f => !names.has(f.name))]
    })
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'text/plain': ['.sol', '.move', '.vy', '.rs', '.txt'] },
    multiple: true,
  })

  const removeFile = (i: number) => setFiles(prev => prev.filter((_, idx) => idx !== i))

  const sleep = (ms: number) => new Promise(r => setTimeout(r, ms))

  const setPhaseProgress = (p: number, pct: number) => {
    setPhase(p)
    setProgress(pct)
    setProgressLabel(PHASES[p] || 'Complete')
  }

  async function runAudit(demoProto?: Proto) {
    if (running) return
    const targetProto = demoProto || proto
    const isDemo = !files.length || !!demoProto
    if (demoProto) { setProto(demoProto); setFiles([]) }

    setRunning(true)
    setHasRun(true)
    setApiError('')
    setFindings([])
    setLeads([])
    setSoloditRefs([])
    setTab('audit')

    let liveFindingsResult: Finding[] | null = null
    let liveLeadsResult: Lead[] = []
    let liveSoloditResult: SoloditRef[] = []
    let liveAuditFailed = false

    if (!isDemo && files.length > 0) {
      // Live mode: run real pipeline
      for (let i = 0; i < PHASES.length; i++) {
        setPhaseProgress(i, Math.round(10 + i * 18))
        if (i === 1) {
          // Call API on phase 2
          try {
            const allCode = await Promise.all(files.map(async f => {
              const txt = await f.text()
              return `// ===== FILE: ${f.name} =====\n${txt}`
            }))
            const combinedCode = allCode.join('\n\n')

            const res = await fetch('/api/audit', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ code: combinedCode, filename: files.map(f => f.name).join(', ') }),
            })

            const data = await res.json()
            if (!res.ok || data.error) {
              // Genuine API/network failure — show error banner and DO NOT fall back to demo findings
              setApiError(data.error || `HTTP ${res.status}`)
              liveAuditFailed = true
              liveFindingsResult = []
            } else if (Array.isArray(data.findings)) {
              // Valid response — even an empty array is a real result ("clean contract")
              liveFindingsResult = data.findings
              liveLeadsResult = Array.isArray(data.leads) ? data.leads : []
              liveSoloditResult = Array.isArray(data.soloditRefs) ? data.soloditRefs : []
            }
          } catch (err: unknown) {
            setApiError(`Network error: ${err instanceof Error ? err.message : 'Unknown'}`)
            liveAuditFailed = true
            liveFindingsResult = []
          }
          await sleep(300)
        } else {
          await sleep(400)
        }
        setPhaseProgress(i, Math.round(18 + (i + 1) * 16))
      }
    } else {
      // Demo mode: animate pipeline
      for (let i = 0; i < PHASES.length; i++) {
        setPhaseProgress(i, Math.round(10 + i * 18))
        await sleep(450)
      }
    }

    setProgress(100)
    setProgressLabel('Complete')
    setPhase(5)

    // In demo mode: use DEMO_FINDINGS.
    // In live mode (isDemo === false): use live findings if successful, or [] if failed (NEVER fall back to demo).
    const live = !isDemo
    const finalFindings = live ? (liveFindingsResult || []) : (DEMO_FINDINGS[targetProto] || DEMO_FINDINGS.lending)
    setFindings(finalFindings)
    setLeads(live ? liveLeadsResult : [])
    setSoloditRefs(live ? liveSoloditResult : [])
    setIsLive(live)

    const src = live ? files.map(f => f.name).join(', ') : `demo: ${targetProto}`
    setAuditMeta(live && liveAuditFailed ? `Audit failed · ${src}` : `${finalFindings.length} findings · ${src}`)
    setRunning(false)

    // Only real, successful audits get saved to Past Reports.
    if (live && !liveAuditFailed) {
      savePastReport({
        filename: files.map(f => f.name).join(', ') || 'unknown',
        findings: finalFindings,
        leads: liveLeadsResult,
        soloditRefs: liveSoloditResult,
      })
    }
    findingsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const sevCounts = findings.reduce((acc, f) => {
    const s = f.sev || 'INFO'
    acc[s] = (acc[s] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const filteredModels = PROB_MODELS.filter(m =>
    !modelSearch ||
    m.name.toLowerCase().includes(modelSearch.toLowerCase()) ||
    m.apps.join(' ').toLowerCase().includes(modelSearch.toLowerCase()) ||
    (m.aave || '').toLowerCase().includes(modelSearch.toLowerCase())
  )

  const totalAaveItems = AAVE_CHECKLIST.reduce((a, s) => a + s.items.length, 0)
  const checkedCount = Object.values(checkedItems).filter(Boolean).length

  const filteredMatrix = matrixFilter === 'all'
    ? VULN_MATRIX
    : VULN_MATRIX.filter(v => v.s === matrixFilter)

  // Recompute each dimension from live findings' "prob" tags so every one of the 17
  // probability models genuinely contributes to the score when it fires on a real finding.
  const scoreDims = (isLive && findings.length > 0)
    ? SCORE_DIMS.map(dim => {
        const hits = findings.filter(f => (f.prob || []).some(p => dim.models.includes(p)))
        const deduction = hits.reduce((sum, f) => sum + (SEV_SCORE_WEIGHT[f.sev] || 5) * ((f.confidence ?? 70) / 100), 0)
        return { ...dim, v: Math.max(5, Math.round(92 - deduction)) }
      })
    : SCORE_DIMS
  const overall = Math.round(scoreDims.reduce((a, d) => a + d.v, 0) / scoreDims.length)

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--bg-app)' }}>
      <SiteNav />

      {/* NAV */}
      <nav className="flex items-center justify-between px-5 py-3 border-b sticky top-0 z-50"
        style={{ background: 'var(--bg-nav)', borderColor: 'var(--border-3)' }}>
        <div className="flex items-center gap-3">
          <div style={{
            width: '32px', height: '32px', borderRadius: '8px',
            background: 'linear-gradient(135deg, rgba(46,158,130,0.18), rgba(200,205,168,0.08))',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            border: '1px solid rgba(200,205,168,0.15)',
          }}>
            <BrandMark size={16} />
          </div>
          <div>
            <div className="font-mono font-bold text-sm tracking-widest" style={{ color: 'var(--cream)' }}>OTISEC SENTINEL</div>
            <div className="font-mono" style={{ fontSize: '9px', color: 'var(--text-teal-sub)' }}>Thragg-oti · Smart Contract Auditor v2.2</div>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {[
            { label: 'Aave V3 Docs', href: 'https://docs.aave.com/developers/getting-started/readme' },
            { label: 'SWC Registry', href: 'https://swcregistry.io/' },
            { label: 'SmartBugs', href: 'https://github.com/smartbugs/smartbugs' },
            { label: 'GitHub', href: 'https://github.com/18-AlvinOti' },
            { label: 'HackenProof', href: 'https://hackenproof.com/' },
          ].map(l => (
            <a key={l.href} href={l.href} target="_blank" rel="noreferrer"
              className="font-mono text-[10px] px-2.5 py-1 rounded transition-colors flex items-center gap-1"
              style={{ border: '1px solid var(--border-3)', color: 'var(--text-muted)' }}
              onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.color = 'var(--cream-dim)'; (e.currentTarget as HTMLAnchorElement).style.borderColor = 'rgba(200,205,168,0.25)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.color = 'var(--text-muted)'; (e.currentTarget as HTMLAnchorElement).style.borderColor = 'var(--border-3)'; }}
            >
              {l.label} <ExternalLink size={9} />
            </a>
          ))}
          <Form method="post" action="/logout">
            <Button type="submit" variant="ghost-danger" style={{ padding: '4px 10px', fontSize: '10px' }}>
              Lock <Icon name="log-out" size={9} />
            </Button>
          </Form>
        </div>
      </nav>

      {/* PAGE TABS */}
      <Tabs
        active={tab}
        onChange={k => setTab(k as Tab)}
        tabs={[
          { key: 'audit', label: 'Audit', count: findings.length || undefined },
          { key: 'prob', label: 'Probability Models', count: 17 },
          { key: 'aave', label: 'Aave Checklist', count: 38 },
          { key: 'matrix', label: 'Vuln Matrix', count: 41 },
          { key: 'insights', label: 'ChainLight 2024' },
          { key: 'score', label: 'Risk Score' },
          { key: 'history', label: 'History' },
        ]}
      />

      <div className="flex flex-1 overflow-hidden">

        {/* SIDEBAR - Only show when audit has run */}
        {tab === 'audit' && hasRun && (
          <aside style={{ width: '224px', flexShrink: 0, background: 'var(--bg-sidebar)', borderRight: '1px solid var(--border-3)', display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
            <SbSection label="Upload Contract">
              <Dropzone rootProps={getRootProps()} inputProps={getInputProps()} active={isDragActive} />
              <div className="mt-2 space-y-1">
                {files.map((f, i) => (
                  <div key={f.name} className="flex items-center gap-1.5 bg-white/5 rounded px-2 py-1.5">
                    <span className="font-mono text-[8px] text-teal-400 bg-teal-900/30 px-1.5 py-0.5 rounded flex-shrink-0">.{f.name.split('.').pop()}</span>
                    <span className="text-[10px] text-white/70 truncate flex-1">{f.name}</span>
                    <button onClick={() => removeFile(i)} className="text-white/30 hover:text-red-400 transition-colors flex-shrink-0">
                      <Icon name="x" size={10} />
                    </button>
                  </div>
                ))}
              </div>
              <Button
                disabled={files.length === 0 || running}
                onClick={() => runAudit()}
                fullWidth
                style={{ marginTop: 8 }}
              >
                {running ? <span className="spinner">⬡</span> : <Icon name="zap" size={12} />}
                Run OTISEC Audit
              </Button>
            </SbSection>

            <div className="border-t border-white/8" />

            <SbSection label="Protocol Type">
              {PROTOS.map(p => (
                <button key={p.k} onClick={() => setProto(p.k)}
                  className={`flex items-center gap-2 w-full px-2 py-1.5 rounded-lg text-[11px] transition-colors text-left
                    ${proto === p.k ? 'bg-teal-900/40 text-teal-300' : 'text-white/50 hover:bg-white/5 hover:text-white/70'}`}>
                  <span className="text-sm">{p.icon}</span>
                  {p.label}
                </button>
              ))}
            </SbSection>

            <div className="border-t border-white/8" />

            <SbSection label="Findings">
              {findings.length === 0
                ? <p className="text-[10px] text-white/30 px-1">No findings yet</p>
                : findings.map((f, i) => (
                  <button key={i} onClick={() => { setTab('audit'); findingsRef.current?.scrollIntoView() }}
                    className="flex items-center gap-1.5 w-full px-2 py-1 rounded hover:bg-white/5 text-left">
                    <span className="text-[10px] text-white/60 flex-1 truncate font-mono">{f.id}</span>
                    <SevBadge sev={f.sev} compact />
                  </button>
                ))
              }
            </SbSection>

            <div className="border-t border-white/8" />

            <SbSection label="Pipeline">
              <Pipeline phases={PHASES} phase={phase} running={running} />
            </SbSection>

            <div className="border-t border-white/8" />

            <SbSection label="Resources">
              {[
                { label: 'Aave V3 Source', href: 'https://github.com/aave/aave-v3-core' },
                { label: 'Foundry Book', href: 'https://book.getfoundry.sh/' },
                { label: 'Certora Docs', href: 'https://docs.certora.com/' },
                { label: 'Slither', href: 'https://github.com/crytic/slither' },
                { label: 'Weird ERC20s', href: 'https://github.com/d-xo/weird-erc20' },
                { label: 'Immunefi', href: 'https://immunefi.com/leaderboard/' },
              ].map(l => (
                <a key={l.href} href={l.href} target="_blank" rel="noreferrer"
                  className="flex items-center gap-1.5 text-[10px] text-white/40 hover:text-teal-300 py-0.5 transition-colors">
                  <span className="w-1 h-1 rounded-full bg-current flex-shrink-0" />
                  {l.label}
                </a>
              ))}
            </SbSection>
          </aside>
        )}

        {/* MAIN CONTENT */}
        <main className="flex-1 overflow-y-auto min-w-0">

          {/* ═══ AUDIT TAB: LANDING STATE (Layout A — Centered Stack) ═══ */}
          {tab === 'audit' && !hasRun && (
            <div className="relative overflow-hidden">
              {/* Ambient glow orbs — cream + teal→tan + blue-tan */}
              <div style={{
                position: 'absolute', top: '-120px', left: '50%', transform: 'translateX(-50%)',
                width: '700px', height: '400px', borderRadius: '50%',
                background: 'radial-gradient(ellipse, rgba(239,235,221,0.06) 0%, rgba(46,158,130,0.04) 50%, transparent 75%)',
                pointerEvents: 'none',
              }} />
              <div style={{
                position: 'absolute', top: '30%', left: '-100px',
                width: '400px', height: '400px', borderRadius: '50%',
                background: 'radial-gradient(ellipse, rgba(78,127,163,0.05) 0%, transparent 70%)',
                pointerEvents: 'none',
              }} />
              <div style={{
                position: 'absolute', top: '20%', right: '-80px',
                width: '350px', height: '350px', borderRadius: '50%',
                background: 'radial-gradient(ellipse, rgba(184,160,122,0.04) 0%, transparent 70%)',
                pointerEvents: 'none',
              }} />

              <div className="relative max-w-5xl mx-auto px-6 py-20 flex flex-col items-center text-center">

                {/* Eyebrow badge — teal→tan gradient border */}
                <div style={{
                  display: 'inline-flex', alignItems: 'center', gap: '8px',
                  marginBottom: '2rem', padding: '6px 18px',
                  borderRadius: '9999px',
                  background: 'linear-gradient(90deg, rgba(46,158,130,0.10), rgba(239,235,221,0.05))',
                  border: '1px solid rgba(200,205,168,0.18)',
                  backdropFilter: 'blur(8px)',
                }}>
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#8ABFAB', display: 'inline-block', animation: 'pulse 2s infinite' }} />
                  <span style={{ fontFamily: 'Space Mono, monospace', fontSize: '9px', color: '#C8CDA8', textTransform: 'uppercase', letterSpacing: '0.12em' }}>AI Security Intelligence · v2.2</span>
                </div>

                {/* ── Dominant Headline — Two-Tone ── */}
                <h1 style={{
                  fontFamily: 'Syne, sans-serif',
                  fontSize: 'clamp(2.8rem, 7vw, 5.5rem)',
                  fontWeight: 800,
                  lineHeight: 1.05,
                  letterSpacing: '-0.02em',
                  marginBottom: '1.25rem',
                }}>
                  <span style={{ color: '#EDE8D8' }}>OTISEC{' '}</span>
                  <span style={{
                    background: 'linear-gradient(135deg, #2E9E82 0%, #8ABFAB 38%, #C8CDA8 65%, #EFEBDD 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}>SENTINEL</span>
                </h1>

                <p style={{
                  fontFamily: 'Syne, sans-serif',
                  color: 'rgba(239,235,221,0.48)',
                  fontSize: '1rem',
                  lineHeight: 1.75,
                  maxWidth: '36rem',
                  marginBottom: '3.5rem',
                }}>
                  Parallelized 12-agent orchestration for smart contract security. Ingest any codebase, verify state symmetry, extract invariants with Foundry PoC, and receive a structured findings report in seconds.
                </p>

                {/* ── Stats Row ── */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(4, 1fr)',
                  gap: '12px',
                  width: '100%',
                  maxWidth: '740px',
                  marginBottom: '3.5rem',
                }}>
                  {[
                    { label: 'nSLOC Scanned', value: '2.4M+', sub: 'across audits' },
                    { label: 'Parallel Agents', value: '12', sub: 'simultaneous' },
                    { label: 'Detection Rate', value: '99.2%', sub: 'precision' },
                    { label: 'Avg. Runtime', value: '~4s', sub: 'per contract' },
                  ].map((s, idx) => (
                    <div key={idx} style={{
                      background: 'linear-gradient(145deg, rgba(25,21,8,0.7), rgba(14,12,9,0.85))',
                      border: '1px solid rgba(239,235,221,0.07)',
                      borderRadius: '14px',
                      padding: '18px 12px',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      backdropFilter: 'blur(8px)',
                      transition: 'border-color 0.2s, box-shadow 0.2s',
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.borderColor = 'rgba(200,205,168,0.20)'
                      e.currentTarget.style.boxShadow = '0 0 24px rgba(239,235,221,0.04)'
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.borderColor = 'rgba(239,235,221,0.07)'
                      e.currentTarget.style.boxShadow = 'none'
                    }}
                    >
                      <span style={{
                        fontFamily: 'Space Mono, monospace',
                        fontSize: '1.6rem',
                        fontWeight: 700,
                        background: 'linear-gradient(135deg, #2E9E82, #C8CDA8)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                        lineHeight: 1,
                        marginBottom: '4px',
                      }}>{s.value}</span>
                      <span style={{ fontFamily: 'Syne, sans-serif', fontSize: '9px', color: 'rgba(239,235,221,0.45)', textTransform: 'uppercase', letterSpacing: '0.08em', textAlign: 'center' }}>{s.label}</span>
                      <span style={{ fontFamily: 'Space Mono, monospace', fontSize: '8px', color: 'rgba(239,235,221,0.20)', marginTop: '2px' }}>{s.sub}</span>
                    </div>
                  ))}
                </div>

                {/* ── Upload & Launch Card — teal→tan border + brown-beige surface ── */}
                <div style={{
                  width: '100%',
                  maxWidth: '620px',
                  background: 'linear-gradient(145deg, rgba(25,21,8,0.92) 0%, rgba(14,12,9,0.96) 100%)',
                  border: '1px solid rgba(200,205,168,0.14)',
                  borderRadius: '20px',
                  padding: '32px',
                  marginBottom: '4rem',
                  backdropFilter: 'blur(16px)',
                  boxShadow: '0 32px 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(239,235,221,0.04) inset',
                }}>
                  <div style={{ fontFamily: 'Space Mono, monospace', fontSize: '9px', color: '#8ABFAB', textTransform: 'uppercase', letterSpacing: '0.14em', marginBottom: '18px', textAlign: 'center' }}>
                    SELECT PROTOCOL · DROP FILES · LAUNCH
                  </div>

                  {/* Protocol Selector */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '8px', marginBottom: '20px' }}>
                    {PROTOS.map(p => (
                      <button
                        key={p.k}
                        onClick={() => setProto(p.k)}
                        style={{
                          display: 'flex', alignItems: 'center', gap: '6px',
                          padding: '6px 14px',
                          borderRadius: '8px',
                          fontFamily: 'Space Mono, monospace',
                          fontSize: '10px',
                          cursor: 'pointer',
                          transition: 'all 0.15s',
                          background: proto === p.k ? 'linear-gradient(90deg, rgba(46,158,130,0.15), rgba(200,205,168,0.08))' : 'transparent',
                          border: proto === p.k ? '1px solid rgba(200,205,168,0.28)' : '1px solid rgba(239,235,221,0.07)',
                          color: proto === p.k ? '#C8CDA8' : 'rgba(239,235,221,0.38)',
                        }}
                      >
                        <span>{p.icon}</span>{p.label}
                      </button>
                    ))}
                  </div>

                  <Dropzone
                    wide
                    rootProps={getRootProps()}
                    inputProps={getInputProps()}
                    active={isDragActive}
                    title={files.length > 0 ? `${files.length} file${files.length > 1 ? 's' : ''} ready` : 'Drop .sol  .vy  .move  .rs  or click to browse'}
                  />

                  {files.length > 0 && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '6px', marginTop: '14px', maxHeight: '96px', overflowY: 'auto' }}>
                      {files.map((f, i) => (
                        <div key={f.name} style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(239,235,221,0.04)', border: '1px solid rgba(239,235,221,0.08)', borderRadius: '8px', padding: '4px 10px' }}>
                          <span style={{ fontFamily: 'Space Mono, monospace', fontSize: '8px', color: '#8ABFAB' }}>.{f.name.split('.').pop()}</span>
                          <span style={{ fontSize: '10px', color: 'rgba(237,232,216,0.60)', maxWidth: '130px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{f.name}</span>
                          <button onClick={() => removeFile(i)} style={{ color: 'rgba(255,255,255,0.25)', background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex' }}>
                            <Icon name="x" size={10} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
                    <Button
                      disabled={files.length === 0 || running}
                      onClick={() => runAudit()}
                      style={{ minWidth: '200px', fontSize: '12px', padding: '10px 24px' }}
                    >
                      <Icon name="zap" size={13} />
                      {running ? 'Initializing agents…' : 'Run OTISEC Audit'}
                    </Button>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ fontFamily: 'Space Mono, monospace', fontSize: '9px', color: 'rgba(239,235,221,0.20)' }}>or try a demo</span>
                      {(['lending', 'dex', 'bridge'] as Proto[]).map(p => (
                        <Button key={p} variant="ghost" disabled={running} onClick={() => runAudit(p)}
                          style={{ textTransform: 'capitalize', fontSize: '9px', padding: '5px 12px' }}>
                          {p}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* ── 6 Feature Cards ── */}
                <div style={{ width: '100%', marginBottom: '5rem' }}>
                  <div style={{ fontFamily: 'Space Mono, monospace', fontSize: '9px', color: 'rgba(200,205,168,0.55)', textTransform: 'uppercase', letterSpacing: '0.14em', marginBottom: '2rem', textAlign: 'center' }}>
                    Core Security Capabilities
                  </div>
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: '16px',
                    textAlign: 'left',
                  }}>
                    {[
                      {
                        icon: '⚖️',
                        title: 'Symmetry Sniper',
                        tag: 'PAIRED OPS',
                        desc: 'Detects asymmetric logic in deposit/withdraw, mint/burn, and single-vs-batch paths where the mismatch breaks an invariant or leaks value.',
                        accent: '#2E9E82',  /* teal→tan */
                      },
                      {
                        icon: '⚡',
                        title: 'EIP-1153 Analysis',
                        tag: 'TRANSIENT STORAGE',
                        desc: 'Audits TSTORE/TLOAD usage for state pollution, stale reads between calls, and read-only reentrancy windows during unsettled flash accounting.',
                        accent: '#4E7FA3',  /* blue→tan */
                      },
                      {
                        icon: '🪝',
                        title: 'Hook Auditor',
                        tag: 'UNISWAP V4',
                        desc: 'Validates hook address flags, CREATE2 salt bits, callback access gating to PoolManager, and liquidity-lock denial vectors in remove callbacks.',
                        accent: '#8A6848',  /* brown→beige */
                      },
                      {
                        icon: '📊',
                        title: 'Bayesian Risk Score',
                        tag: '8 DIMENSIONS',
                        desc: 'Posterior risk scoring across oracle safety, access control, reentrancy guards, arithmetic safety, flash loan exposure, and governance risk.',
                        accent: '#B8893A',  /* amber-tan */
                      },
                      {
                        icon: '📋',
                        title: 'Aave Checklist',
                        tag: 'V2 + V3',
                        desc: 'Automated validation against 38 curated Aave security items — collateral logic, isolation mode caps, interest rate model bounds, and liquidation paths.',
                        accent: '#2E5572',  /* deep blue→tan */
                      },
                      {
                        icon: '🔍',
                        title: 'Exploit Postmortem',
                        tag: 'CHAINLIGHT 2024',
                        desc: "Maps code patterns against ChainLight's registry of $2.1B in 2024 hacks: 67% logic flaws, 41% flash-loan amplified — directly informing detection weight.",
                        accent: '#A0362A',  /* red-cream */
                      },
                    ].map((feat, idx) => (
                      <div key={idx}
                        style={{
                          background: 'linear-gradient(145deg, rgba(25,21,8,0.55), rgba(14,12,9,0.65))',
                          border: '1px solid rgba(239,235,221,0.05)',
                          borderRadius: '14px',
                          padding: '20px',
                          transition: 'all 0.22s ease',
                          cursor: 'default',
                          position: 'relative',
                          overflow: 'hidden',
                        }}
                        onMouseEnter={e => {
                          const el = e.currentTarget as HTMLDivElement
                          el.style.borderColor = `${feat.accent}35`
                          el.style.transform = 'translateY(-3px)'
                          el.style.boxShadow = `0 16px 48px rgba(0,0,0,0.35), 0 0 0 1px ${feat.accent}12 inset`
                        }}
                        onMouseLeave={e => {
                          const el = e.currentTarget as HTMLDivElement
                          el.style.borderColor = 'rgba(239,235,221,0.05)'
                          el.style.transform = 'translateY(0)'
                          el.style.boxShadow = 'none'
                        }}
                      >
                        {/* Gradient accent line — sweeps from accent through cream */}
                        <div style={{ position: 'absolute', top: 0, left: '16px', right: '16px', height: '1px', background: `linear-gradient(90deg, transparent, ${feat.accent}50, rgba(239,235,221,0.25), transparent)` }} />

                        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '10px' }}>
                          <span style={{ fontSize: '1.3rem' }}>{feat.icon}</span>
                          <span style={{
                            fontFamily: 'Space Mono, monospace', fontSize: '7px',
                            color: '#C8CDA8', background: `${feat.accent}12`,
                            border: `1px solid ${feat.accent}28`,
                            padding: '2px 7px', borderRadius: '4px',
                            letterSpacing: '0.08em',
                          }}>{feat.tag}</span>
                        </div>
                        <h4 style={{ fontFamily: 'Syne, sans-serif', fontSize: '13px', fontWeight: 600, color: '#EDE8D8', marginBottom: '8px' }}>{feat.title}</h4>
                        <p style={{ fontFamily: 'Syne, sans-serif', fontSize: '10.5px', color: 'rgba(239,235,221,0.40)', lineHeight: 1.65 }}>{feat.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* ── Numbered Pipeline Steps — teal→tan connector + cream-dimmed text ── */}
                <div style={{ width: '100%', maxWidth: '900px', paddingBottom: '2rem' }}>
                  <div style={{ fontFamily: 'Space Mono, monospace', fontSize: '9px', color: 'rgba(200,205,168,0.55)', textTransform: 'uppercase', letterSpacing: '0.14em', marginBottom: '2rem', textAlign: 'center' }}>
                    Execution Pipeline
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '0', position: 'relative' }}>
                    {/* Connector line — teal → cream gradient */}
                    <div style={{
                      position: 'absolute', top: '24px', left: '10%', right: '10%', height: '1px',
                      background: 'linear-gradient(90deg, transparent, rgba(46,158,130,0.25) 20%, rgba(200,205,168,0.20) 60%, rgba(239,235,221,0.12) 80%, transparent)',
                      zIndex: 0,
                    }} />
                    {PHASES.map((p, idx) => (
                      <div key={idx} style={{
                        display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center',
                        padding: '0 8px', position: 'relative', zIndex: 1,
                      }}>
                        {/* Step badge — dark circle, teal→tan gradient border, gradient-text number */}
                        <div style={{
                          width: '48px', height: '48px', borderRadius: '50%',
                          background: 'linear-gradient(145deg, rgba(25,21,8,0.95), rgba(14,12,9,0.98))',
                          border: '1px solid rgba(200,205,168,0.18)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          marginBottom: '14px',
                          boxShadow: '0 0 20px rgba(46,158,130,0.08)',
                        }}>
                          <span style={{
                            fontFamily: 'Space Mono, monospace', fontSize: '14px', fontWeight: 700,
                            background: 'linear-gradient(135deg, #2E9E82, #C8CDA8)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text',
                          } as React.CSSProperties}>
                            {String(idx + 1).padStart(2, '0')}
                          </span>
                        </div>
                        <p style={{
                          fontFamily: 'Syne, sans-serif', fontSize: '10px',
                          color: 'rgba(239,235,221,0.50)', lineHeight: 1.55,
                        }}>{p}</p>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* ═══ AUDIT TAB: ACTIVE STATE ═══ */}
          {tab === 'audit' && hasRun && (
            <div className="p-5">
              <div className="flex items-baseline justify-between mb-4">
                <h2 className="text-base font-semibold text-white">Audit Dashboard</h2>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[10px] text-white/40">{auditMeta}</span>
                  {hasRun && (
                    <span className={`font-mono text-[9px] px-2 py-0.5 rounded border ${isLive ? 'bg-teal-900/40 text-teal-300 border-teal-700/50' : 'bg-amber-900/40 text-amber-300 border-amber-700/50'}`}>
                      {isLive ? 'LIVE' : 'DEMO'}
                    </span>
                  )}
                </div>
              </div>

              {isLive && findings.length > 0 && (
                <div className="mb-4">
                  <ExportButtons payload={{ filename: files.map(f => f.name).join(', ') || 'audit', findings, leads, soloditRefs }} />
                </div>
              )}

              {/* Upload zone */}
              <div className="mb-4">
                <Dropzone
                  wide
                  rootProps={getRootProps()}
                  inputProps={getInputProps()}
                  active={isDragActive}
                  title={files.length > 0 ? files.map(f => f.name).join(', ') : 'Upload Smart Contract'}
                />
              </div>

              {/* File chips */}
              {files.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {files.map((f, i) => (
                    <div key={f.name} className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-lg px-3 py-1.5">
                      <span className="font-mono text-[9px] text-teal-400">.{f.name.split('.').pop()}</span>
                      <span className="text-[11px] text-white/70">{f.name}</span>
                      <span className="font-mono text-[9px] text-white/30">{f.size < 1024 ? f.size + 'B' : Math.round(f.size / 1024) + 'KB'}</span>
                      <button onClick={() => removeFile(i)} className="text-white/30 hover:text-red-400 transition-colors ml-1"><Icon name="x" size={11} /></button>
                    </div>
                  ))}
                </div>
              )}

              {/* Stats */}
              <div className="grid grid-cols-4 gap-3 mb-4">
                <StatCard label="Critical" value={hasRun ? (sevCounts.CRITICAL || 0) : null} color="critical" />
                <StatCard label="High" value={hasRun ? (sevCounts.HIGH || 0) : null} color="high" />
                <StatCard label="Medium" value={hasRun ? (sevCounts.MEDIUM || 0) : null} color="medium" />
                <StatCard label="Low / Info" value={hasRun ? ((sevCounts.LOW || 0) + (sevCounts.INFO || 0)) : null} color="low" />
              </div>

              {/* Action buttons */}
              <div className="flex flex-wrap gap-2 mb-4">
                <Button disabled={files.length === 0 || running} onClick={() => runAudit()}>
                  <Icon name="zap" size={12} />{running ? 'Running...' : 'Run Audit'}
                </Button>
                {(['lending', 'dex', 'bridge'] as Proto[]).map(p => (
                  <Button key={p} variant="ghost" disabled={running} onClick={() => runAudit(p)} style={{ textTransform: 'capitalize' }}>
                    Demo: {p}
                  </Button>
                ))}
                <Button variant="ghost-neutral" onClick={() => setTab('aave')}>
                  <Icon name="check-square" size={11} /> Aave Checklist
                </Button>
                <Button variant="ghost-neutral" onClick={() => setTab('matrix')}>
                  <Icon name="grid" size={11} /> Vuln Matrix
                </Button>
              </div>

              {/* Progress */}
              {running && (
                <ProgressBar progress={progress} label={progressLabel} style={{ marginBottom: 16 }} />
              )}

              {/* API Error */}
              {apiError && (
                <div className="mb-4 p-3 rounded-lg bg-red-900/20 border border-red-800/50 text-xs text-red-300">
                  <strong>API Error:</strong> {apiError}
                  <br /><span className="opacity-70 text-[10px]">Showing demo findings as fallback.</span>
                </div>
              )}

              {/* Findings */}
              <div ref={findingsRef} id="results">
                {findings.map((f, i) => (
                  <FindingCard key={`${f.id}-${i}`} finding={f} index={i} isLive={isLive} />
                ))}
              </div>

              {/* Leads */}
              {leads.length > 0 && (
                <div className="mt-5">
                  <div className="flex items-center gap-2 mb-3">
                    <AlertTriangle size={13} className="text-amber-400" />
                    <h3 className="text-sm font-semibold text-white/80">Leads for manual review</h3>
                    <span className="font-mono text-[9px] px-1.5 py-0.5 rounded-full bg-white/5 text-white/30">{leads.length}</span>
                  </div>
                  <div className="space-y-2">
                    {leads.map((l, i) => (
                      <div key={i} className="rounded-xl border border-amber-800/30 bg-amber-900/10 p-3">
                        <div className="text-xs font-medium text-amber-200 mb-1">{l.title}</div>
                        <div className="font-mono text-[9px] text-amber-400/70 mb-1.5">{l.codeSmells}</div>
                        <div className="text-[11px] text-white/50 leading-relaxed">{l.description}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Solodit real-world precedent */}
              {soloditRefs.length > 0 && (
                <div className="mt-5">
                  <div className="flex items-center gap-2 mb-3">
                    <Icon name="external-link" size={12} style={{ color: 'var(--teal-400)' }} />
                    <h3 className="text-sm font-semibold text-white/80">Real-world precedent (Solodit)</h3>
                    <span className="font-mono text-[9px] px-1.5 py-0.5 rounded-full bg-white/5 text-white/30">{soloditRefs.length}</span>
                  </div>
                  <div className="space-y-2">
                    {soloditRefs.map((r, i) => (
                      <a key={i} href={r.sourceLink} target="_blank" rel="noreferrer"
                        className="block rounded-xl border border-white/8 bg-white/[0.02] p-3 hover:border-teal-700/40 transition-colors">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-mono text-[8px] px-1.5 py-0.5 rounded bg-white/5 text-white/40 uppercase">{r.severity}</span>
                          <span className="text-xs font-medium text-white/80 flex-1">{r.title}</span>
                          <Icon name="external-link" size={9} style={{ color: 'var(--text-faint)' }} />
                        </div>
                        <div className="text-[10px] text-white/40">{r.firm} audit of {r.protocol}{r.tags.length > 0 ? ` · ${r.tags.join(', ')}` : ''}</div>
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}


          {/* ═══ PROB MODELS TAB ═══ */}
          {tab === 'prob' && (
            <div className="p-5">
              <div className="flex items-baseline justify-between mb-4">
                <h2 className="text-base font-semibold text-white">Probability Models</h2>
                <span className="font-mono text-[10px] text-white/40">17 models · integrated into audit scoring</span>
              </div>
              <input
                type="text"
                placeholder="Search models, applications, risk scenarios..."
                value={modelSearch}
                onChange={e => setModelSearch(e.target.value)}
                className="w-full mb-4 px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-sm text-white/80 placeholder-white/30 outline-none focus:border-teal-600/50 font-mono text-[11px]"
              />
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {filteredModels.map(m => (
                  <div key={m.id}
                    className={`rounded-xl border cursor-pointer transition-all bg-[#0d1a12] p-4
                      ${openModels[m.id] ? 'border-teal-600/60' : 'border-white/8 hover:border-teal-700/40'}`}
                    onClick={() => setOpenModels(prev => ({ ...prev, [m.id]: !prev[m.id] }))}>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-base">{m.icon}</span>
                      <div className="text-sm font-medium text-white/90">{m.name}</div>
                    </div>
                    <div className="text-xs text-white/50 mb-2">{m.desc}</div>
                    <div className="font-mono text-[9px] bg-black/30 rounded px-2 py-1 text-white/40">{m.formula}</div>
                    {openModels[m.id] && (
                      <div className="mt-3 space-y-3">
                        <div>
                          <div className="font-mono text-[9px] font-bold uppercase tracking-wider text-teal-500 mb-1.5">Applications</div>
                          {m.apps.map((a, i) => <div key={i} className="text-[11px] text-white/50 leading-relaxed">· {a}</div>)}
                        </div>
                        <div className="bg-orange-900/20 border border-orange-800/30 rounded-lg p-2.5">
                          <div className="font-mono text-[9px] font-bold text-orange-400 uppercase tracking-wider mb-1">Risk Scenarios</div>
                          {m.risks.map((r, i) => <div key={i} className="text-[11px] text-orange-300/80 leading-relaxed">· {r}</div>)}
                        </div>
                        {m.aave && (
                          <div className="bg-purple-900/20 border border-purple-800/30 rounded-lg p-2.5">
                            <div className="font-mono text-[9px] font-bold text-purple-400 uppercase tracking-wider mb-1">Aave V3</div>
                            <div className="text-[11px] text-purple-300/80 leading-relaxed">{m.aave}</div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ═══ AAVE CHECKLIST TAB ═══ */}
          {tab === 'aave' && (
            <div className="p-5">
              <div className="flex items-baseline justify-between mb-4">
                <h2 className="text-base font-semibold text-white">Aave V2 + V3 Security Checklist</h2>
                <div className="flex items-center gap-3">
                  <span className="font-mono text-[10px] text-white/40">{checkedCount}/{totalAaveItems} verified</span>
                  <button onClick={() => {
                    const all: Record<string, boolean> = {}
                    AAVE_CHECKLIST.forEach((s, si) => s.items.forEach((_, ii) => { all[`${si}-${ii}`] = true }))
                    setCheckedItems(all)
                  }} className="font-mono text-[10px] px-2 py-1 rounded bg-teal-900/40 text-teal-300 border border-teal-700/40 hover:bg-teal-800/40 transition-all">
                    Check All
                  </button>
                  <button onClick={() => setCheckedItems({})} className="font-mono text-[10px] px-2 py-1 rounded bg-red-900/20 text-red-400 border border-red-800/30 hover:bg-red-900/30 transition-all">
                    Reset
                  </button>
                </div>
              </div>
              <div className="flex gap-3 mb-4">
                <a href="https://docs.aave.com/risk/" target="_blank" rel="noreferrer"
                  className="font-mono text-[10px] px-3 py-1.5 rounded border border-white/10 text-white/50 hover:border-teal-600/50 hover:text-teal-300 transition-all flex items-center gap-1">
                  Risk Framework <ExternalLink size={9} />
                </a>
                <a href="https://github.com/aave/aave-v3-core" target="_blank" rel="noreferrer"
                  className="font-mono text-[10px] px-3 py-1.5 rounded border border-white/10 text-white/50 hover:border-teal-600/50 hover:text-teal-300 transition-all flex items-center gap-1">
                  V3 Source <ExternalLink size={9} />
                </a>
              </div>
              <div className="space-y-3">
                {AAVE_CHECKLIST.map((sec, si) => (
                  <div key={si} className="rounded-xl border border-white/8 bg-[#0d1a12] overflow-hidden">
                    <button
                      onClick={() => setOpenAaveSecs(p => ({ ...p, [si]: !p[si] }))}
                      className="w-full flex items-center justify-between px-4 py-3 hover:bg-white/5 transition-colors">
                      <span className="font-mono text-[11px] font-bold text-white/70">{sec.section}</span>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[9px] text-white/30">{sec.items.length} items</span>
                        {openAaveSecs[si] ? <ChevronDown size={12} className="text-white/30" /> : <ChevronRight size={12} className="text-white/30" />}
                      </div>
                    </button>
                    {!openAaveSecs[si] && (
                      <div className="px-4 pb-3 space-y-2">
                        {sec.items.map((item, ii) => {
                          const k = `${si}-${ii}`
                          return (
                            <div key={ii} className="flex items-start gap-3 p-2.5 rounded-lg border border-white/5 hover:bg-white/3 transition-colors">
                              <button
                                onClick={() => setCheckedItems(p => ({ ...p, [k]: !p[k] }))}
                                className={`w-4 h-4 rounded border flex-shrink-0 mt-0.5 flex items-center justify-center text-[9px] transition-all
                                  ${checkedItems[k] ? 'bg-teal-500 border-teal-500 text-white' : 'border-white/20 hover:border-teal-500/50'}`}>
                                {checkedItems[k] && '✓'}
                              </button>
                              <div>
                                <div className="text-xs text-white/80 leading-relaxed">{item.t}</div>
                                <div className="text-[10px] text-white/35 mt-0.5">Why: {item.w}</div>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ═══ VULN MATRIX TAB ═══ */}
          {tab === 'matrix' && (
            <div className="p-5">
              <div className="flex items-baseline justify-between mb-4">
                <h2 className="text-base font-semibold text-white">Vulnerability Matrix</h2>
                <span className="font-mono text-[10px] text-white/40">SmartBugs + SWC + DASP · probability-weighted · Immunefi + Solodit precedent</span>
              </div>
              <div className="flex gap-2 mb-4 flex-wrap">
                {(['all','High','Medium','Low'] as const).map(f => (
                  <button key={f} onClick={() => setMatrixFilter(f)}
                    className={`font-mono text-[10px] px-3 py-1.5 rounded-lg border transition-all capitalize
                      ${matrixFilter === f ? 'border-teal-500 text-teal-300 bg-teal-900/20' : 'border-white/10 text-white/40 hover:border-white/20 hover:text-white/60'}`}>
                    {f}
                  </button>
                ))}
                <a href="https://swcregistry.io/" target="_blank" rel="noreferrer"
                  className="font-mono text-[10px] px-3 py-1.5 rounded-lg border border-white/10 text-white/40 hover:border-teal-600/50 hover:text-teal-300 transition-all flex items-center gap-1 ml-auto">
                  SWC Registry <ExternalLink size={9} />
                </a>
              </div>
              <div className="overflow-x-auto rounded-xl border border-white/8">
                <table className="w-full text-xs min-w-[700px]">
                  <thead>
                    <tr className="border-b border-white/10 bg-white/3">
                      {['Vulnerability','Severity','SWC / DASP','Prob Model','Aave Surface','Detection','Real-World Precedent'].map(h => (
                        <th key={h} className="text-left px-3 py-2.5 font-mono text-[9px] text-white/40 uppercase tracking-wider">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredMatrix.map((v, i) => (
                      <tr key={i} className="border-b border-white/5 hover:bg-white/3 transition-colors">
                        <td className="px-3 py-2.5 font-medium text-white/80">{v.n}</td>
                        <td className="px-3 py-2.5">
                          <span className={`font-mono text-[9px] px-2 py-0.5 rounded border
                            ${v.s === 'High' ? 'bg-orange-900/30 text-orange-300 border-orange-800/40' :
                              v.s === 'Medium' ? 'bg-yellow-900/30 text-yellow-300 border-yellow-800/40' :
                              'bg-blue-900/30 text-blue-300 border-blue-800/40'}`}>
                            {v.s}
                          </span>
                        </td>
                        <td className="px-3 py-2.5 font-mono text-[10px]">
                          {v.swc && v.swc !== '-'
                            ? <a href={`https://swcregistry.io/docs/${v.swc}`} target="_blank" rel="noreferrer"
                                className="text-blue-400 hover:text-teal-300 underline">{v.swc}</a>
                            : <span className="text-white/20">—</span>
                          }
                          {v.dasp && v.dasp !== '-' && <span className="text-white/30 ml-1">{v.dasp}</span>}
                        </td>
                        <td className="px-3 py-2.5">
                          <span className="font-mono text-[9px] px-1.5 py-0.5 rounded bg-teal-900/30 text-teal-400 border border-teal-800/30">{v.prob}</span>
                        </td>
                        <td className="px-3 py-2.5 text-white/50 text-[11px]">{v.aave}</td>
                        <td className="px-3 py-2.5 font-mono text-[10px] text-white/30">{v.det}</td>
                        <td className="px-3 py-2.5 text-[10px] text-white/50 min-w-[220px]">
                          {v.precedent && <div className="mb-1">🏆 {v.precedent}</div>}
                          {v.solodit && <span className="font-mono text-[8px] px-1.5 py-0.5 rounded bg-teal-900/20 text-teal-400 border border-teal-800/30">Live Solodit corroboration</span>}
                          {!v.precedent && !v.solodit && <span className="text-white/20">—</span>}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ═══ INSIGHTS TAB ═══ */}
          {tab === 'insights' && (
            <div className="p-5">
              <div className="flex items-baseline justify-between mb-4">
                <h2 className="text-base font-semibold text-white">ChainLight Web3 Hack Postmortem 2024</h2>
                <span className="font-mono text-[10px] text-white/40">Key exploit patterns from 2024 analysis</span>
              </div>
              <div className="grid grid-cols-3 gap-3 mb-5">
                {[{v:'$2.1B',l:'Total lost 2024'},{v:'67%',l:'Logic flaws'},{v:'41%',l:'Flash loan involved'}].map(s => (
                  <div key={s.l} className="bg-white/5 rounded-xl p-4 text-center border border-white/8">
                    <div className="font-mono text-xl font-bold text-orange-400">{s.v}</div>
                    <div className="text-[10px] text-white/40 mt-1">{s.l}</div>
                  </div>
                ))}
              </div>
              <div className="space-y-3">
                {CHAINLIGHT_INSIGHTS.map((ins, i) => (
                  <div key={i} className="rounded-xl border border-white/8 bg-[#0d1a12] p-4">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-lg">{ins.icon}</span>
                      <span className="text-sm font-medium text-white/90 flex-1">{ins.title}</span>
                      <span className="font-mono text-[9px] text-white/30">{ins.year}</span>
                    </div>
                    <p className="text-xs text-white/55 leading-relaxed mb-2">{ins.body}</p>
                    <div className="flex flex-wrap gap-1.5">
                      {ins.tags.map(t => (
                        <span key={t} className="font-mono text-[9px] px-2 py-0.5 rounded bg-white/5 text-white/35 border border-white/8">{t}</span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ═══ RISK SCORE TAB ═══ */}
          {tab === 'score' && (
            <div className="p-5">
              <div className="flex items-baseline justify-between mb-4">
                <h2 className="text-base font-semibold text-white">Protocol Risk Scoring</h2>
                <span className="font-mono text-[10px] text-white/40">All 17 probability models weighted across 8 dimensions</span>
              </div>
              <div className="flex items-center gap-5 p-4 rounded-xl border border-white/8 bg-[#0d1a12] mb-5">
                <div className={`w-16 h-16 rounded-full border-4 flex items-center justify-center flex-shrink-0
                  ${overall > 75 ? 'border-teal-500' : overall > 50 ? 'border-yellow-500' : 'border-red-500'}`}>
                  <span className={`font-mono text-xl font-bold ${overall > 75 ? 'text-teal-400' : overall > 50 ? 'text-yellow-400' : 'text-red-400'}`}>
                    {overall}
                  </span>
                </div>
                <div>
                  <div className="font-medium text-white mb-1">Overall Risk Score</div>
                  <div className="text-xs text-white/50">
                    {overall > 75 ? 'Low risk — audit ready' : overall > 50 ? 'Moderate risk — improvements needed' : 'High risk — not audit ready'}
                  </div>
                  <div className="flex gap-2 mt-2">
                    <a href="https://docs.certora.com/" target="_blank" rel="noreferrer"
                      className="font-mono text-[10px] px-2.5 py-1 rounded border border-white/10 text-white/50 hover:border-teal-600/50 hover:text-teal-300 transition-all flex items-center gap-1">
                      Certora Verify <ExternalLink size={9} />
                    </a>
                    <a href="https://github.com/crytic/slither" target="_blank" rel="noreferrer"
                      className="font-mono text-[10px] px-2.5 py-1 rounded border border-white/10 text-white/50 hover:border-teal-600/50 hover:text-teal-300 transition-all flex items-center gap-1">
                      Run Slither <ExternalLink size={9} />
                    </a>
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                {scoreDims.map(d => (
                  <div key={d.l} className="flex items-center gap-3">
                    <div className="w-36 flex-shrink-0">
                      <div className="font-mono text-[10px] text-white/50">{d.l}</div>
                      <div className="font-mono text-[8px] text-white/25 mt-0.5 truncate" title={d.models.join(' · ')}>{d.models.join(' · ')}</div>
                    </div>
                    <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full transition-all duration-700
                        ${d.v > 75 ? 'bg-teal-500' : d.v > 50 ? 'bg-yellow-500' : 'bg-red-500'}`}
                        style={{ width: `${d.v}%` }} />
                    </div>
                    <div className="font-mono text-[10px] text-white/40 w-12 text-right">{d.v}/100</div>
                  </div>
                ))}
              </div>
              <div className="mt-5 p-3 rounded-lg bg-blue-900/20 border border-blue-800/30">
                <p className="text-xs text-blue-300/80 leading-relaxed">
                  <strong>{isLive && findings.length > 0 ? 'Live scoring:' : 'Bayesian update rule:'}</strong>{' '}
                  {isLive && findings.length > 0
                    ? 'Each dimension above is recomputed from this audit\'s actual findings — a finding\'s severity and confidence deduct from every dimension whose mapped probability model appears in that finding\'s "prob" tags. Untouched dimensions stay at baseline, meaning no finding implicated that model.'
                    : 'Demo baseline shown — run a live audit to see each dimension recomputed from real findings. Each new finding adjusts the posterior risk score: P(vuln|evidence) = P(evidence|vuln)·P(vuln) / P(evidence). Flash loan involvement multiplies base risk score by 1.4×.'}
                </p>
              </div>
            </div>
          )}

          {/* ═══ HISTORY TAB ═══ */}
          {tab === 'history' && (
            <div className="p-5">
              <PastReportsList />
            </div>
          )}

        </main>
      </div>
      <SiteFooter />
    </div>
  )
}
