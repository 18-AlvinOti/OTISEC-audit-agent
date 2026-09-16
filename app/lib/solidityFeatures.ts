// Deterministic, source-level static-analysis feature extractor.
//
// This is the static-analysis-over-LLM-aligned replacement for the hmmlearn/Slither Python
// scripts: this app runs as a Node/TypeScript serverless function with no Python runtime,
// so instead of asking the LLM to *imagine* the six-feature vector a Gaussian-HMM pipeline
// would compute, this module actually computes it — deterministically, from the uploaded
// source, at request time — and the real numbers get injected into the prompt (see
// buildFeatureReport() and its use in api.audit.ts). The LLM then reasons over real data
// instead of self-reported estimates.
//
// This is intentionally lightweight regex/brace-matching, not a full Solidity AST (that
// would need solc/Slither, which don't run in this environment) — but it is genuine static
// analysis: no execution, source-only, same category of tool as Slither's lighter detectors.

export interface FunctionFeatures {
  name: string
  externalCallRatio: number   // external calls / total statements, 0-1
  stateVarChanges: number     // count of distinct storage-write statements
  etherTransfer: 0 | 1        // payable / .call{value:} / .transfer / .send present
  loopComplexity: number      // loop count × nesting depth
  timestampDepScore: number   // 0-1, reliance on block.timestamp/block.number for logic
  accessControlScore: number  // 0 (tightly guarded) - 1 (no guard found)
  regime: 'Safe' | 'Reentrancy-prone' | 'Arithmetic-risk' | 'Access-control-risk' | 'Complex-multi-effect'
}

const EXTERNAL_CALL_RE = /\.\s*call\s*\{|\.\s*call\s*\(|\.\s*delegatecall\s*\(|\.\s*staticcall\s*\(|\.\s*transfer\s*\(|\.\s*send\s*\(/g
const STATE_WRITE_RE = /\b[a-zA-Z_]\w*(\[[^\]]*\])?\s*(\+=|-=|\*=|\/=|\|=|&=|\^=|=(?!=))/g
const GUARD_RE = /onlyOwner|onlyAdmin|onlyRole|hasRole\(|require\s*\(\s*msg\.sender\s*==|AccessControl|_checkRole|nonReentrant/i
const ETHER_RE = /payable|\.call\s*\{\s*value\s*:|\.transfer\s*\(|\.send\s*\(/
const TIMESTAMP_RE = /block\.timestamp|block\.number|\bnow\b/g
const LOOP_RE = /\bfor\s*\(|\bwhile\s*\(/g

/** Splits top-level `function ... { ... }` blocks out of a Solidity source string via brace
 *  matching. Deliberately conservative — false negatives (missed functions) are safe here
 *  since this is a corroborating signal, not the primary detector. */
function splitFunctions(code: string): { name: string; body: string; signature: string }[] {
  const results: { name: string; body: string; signature: string }[] = []
  const fnStart = /function\s+([a-zA-Z_$][\w$]*)\s*\(/g
  let match: RegExpExecArray | null

  while ((match = fnStart.exec(code))) {
    const name = match[1]
    const sigStart = match.index
    // Find the opening brace of the function body, skipping over the parameter list,
    // modifiers, and return-type clause.
    let i = fnStart.lastIndex
    let depthParen = 1 // we're already past the opening '(' of the param list
    while (i < code.length && depthParen > 0) {
      if (code[i] === '(') depthParen++
      else if (code[i] === ')') depthParen--
      i++
    }
    // Skip forward to either '{' (has a body) or ';' (abstract/interface decl, no body)
    while (i < code.length && code[i] !== '{' && code[i] !== ';') i++
    if (code[i] !== '{') continue // no body — interface/abstract stub, nothing to score

    const bodyStart = i
    let depthBrace = 1
    i++
    while (i < code.length && depthBrace > 0) {
      if (code[i] === '{') depthBrace++
      else if (code[i] === '}') depthBrace--
      i++
    }
    const body = code.slice(bodyStart, i)
    const signature = code.slice(sigStart, bodyStart)
    results.push({ name, body, signature })
    fnStart.lastIndex = i
  }
  return results
}

function classifyRegime(f: Omit<FunctionFeatures, 'name' | 'regime'>): FunctionFeatures['regime'] {
  const riskFeatureCount = [
    f.externalCallRatio > 0.15,
    f.accessControlScore >= 0.75,
    f.etherTransfer === 1,
    f.loopComplexity >= 3,
    f.timestampDepScore > 0.2,
  ].filter(Boolean).length

  if (riskFeatureCount >= 3) return 'Complex-multi-effect'
  if (f.externalCallRatio > 0.1 && f.stateVarChanges > 0 && f.etherTransfer === 1) return 'Reentrancy-prone'
  if (f.accessControlScore >= 0.75 && (f.etherTransfer === 1 || f.stateVarChanges >= 2)) return 'Access-control-risk'
  if (f.loopComplexity >= 2 || f.stateVarChanges >= 3) return 'Arithmetic-risk'
  return 'Safe'
}

export function extractFeatures(code: string): FunctionFeatures[] {
  const functions = splitFunctions(code)
  return functions.map(({ name, body, signature }) => {
    const statements = Math.max(1, (body.match(/;/g) || []).length)
    const externalCalls = (body.match(EXTERNAL_CALL_RE) || []).length
    const stateWrites = (body.match(STATE_WRITE_RE) || []).length
    const loops = (body.match(LOOP_RE) || []).length
    const nestingBoost = /\{\s*[^{}]*\bfor\s*\(|\{\s*[^{}]*\bwhile\s*\(/.test(body) && loops > 1 ? 1.5 : 1
    const timestampHits = (body.match(TIMESTAMP_RE) || []).length
    const hasGuard = GUARD_RE.test(signature) || GUARD_RE.test(body.slice(0, 200))
    const isExternalOrPublic = /\b(external|public)\b/.test(signature)

    const externalCallRatio = Math.min(1, externalCalls / statements)
    const stateVarChanges = stateWrites
    const etherTransfer: 0 | 1 = ETHER_RE.test(signature) || ETHER_RE.test(body) ? 1 : 0
    const loopComplexity = loops * nestingBoost
    const timestampDepScore = Math.min(1, timestampHits / Math.max(1, statements / 3))
    const accessControlScore = hasGuard ? 0.1 : isExternalOrPublic ? 1 : 0.4

    const base = { externalCallRatio, stateVarChanges, etherTransfer, loopComplexity, timestampDepScore, accessControlScore }
    return { name, ...base, regime: classifyRegime(base) }
  })
}

/** File-relative outlier check — the JS-native analog of the percentile-anomaly-scoring
 *  idea: flag functions whose feature vector sits far from the file's own mean, since a
 *  fixed absolute threshold can't know what "normal" looks like for a given codebase. */
export function findOutliers(features: FunctionFeatures[]): string[] {
  if (features.length < 3) return [] // not enough siblings to establish a baseline
  const dims: (keyof Omit<FunctionFeatures, 'name' | 'regime'>)[] = [
    'externalCallRatio', 'stateVarChanges', 'etherTransfer', 'loopComplexity', 'timestampDepScore', 'accessControlScore',
  ]
  const means = dims.map((d) => features.reduce((s, f) => s + (f[d] as number), 0) / features.length)
  const stds = dims.map((d, i) => {
    const variance = features.reduce((s, f) => s + ((f[d] as number) - means[i]) ** 2, 0) / features.length
    return Math.sqrt(variance) || 1e-6
  })

  return features
    .filter((f) => {
      const zScoreSum = dims.reduce((s, d, i) => s + Math.abs(((f[d] as number) - means[i]) / stds[i]), 0)
      return zScoreSum / dims.length > 1.3 // above-average deviation across the feature set
    })
    .map((f) => f.name)
}

/** Risky-regime call-graph transitions: a risky function calling another risky function by
 *  name, detected via a simple substring/identifier scan of each function's body. */
export function findRiskyTransitions(code: string, features: FunctionFeatures[]): [string, string][] {
  const riskyNames = new Set(features.filter((f) => f.regime !== 'Safe').map((f) => f.name))
  const functions = splitFunctions(code)
  const transitions: [string, string][] = []
  for (const fn of functions) {
    if (!riskyNames.has(fn.name)) continue
    for (const other of riskyNames) {
      if (other === fn.name) continue
      const callRe = new RegExp(`\\b${other}\\s*\\(`)
      if (callRe.test(fn.body)) transitions.push([fn.name, other])
    }
  }
  return transitions
}

/** Renders the computed feature table + regime classification + outliers + risky
 *  transitions as markdown, to be injected directly into the LLM prompt as real data. */
export function buildFeatureReport(code: string): string {
  const features = extractFeatures(code)
  if (features.length === 0) return ''

  const outliers = findOutliers(features)
  const transitions = findRiskyTransitions(code, features)

  const rows = features
    .map((f) => `| \`${f.name}\` | ${f.externalCallRatio.toFixed(2)} | ${f.stateVarChanges} | ${f.etherTransfer} | ${f.loopComplexity.toFixed(1)} | ${f.timestampDepScore.toFixed(2)} | ${f.accessControlScore.toFixed(2)} | **${f.regime}**${outliers.includes(f.name) ? ' ⚠ outlier' : ''} |`)
    .join('\n')

  const transitionLines = transitions.length
    ? `\n\nRisky-regime call-graph transitions detected (Part 3B transition weighting — prioritize these): ${transitions.map(([a, b]) => `\`${a}\` → \`${b}\``).join(', ')}.`
    : ''

  return `\n\nStatic feature-extraction pass (computed, not estimated — use these values directly for Part 3B regime classification instead of eyeballing them):\n| Function | ExtCallRatio | StateWrites | EtherXfer | LoopCplx | TimestampDep | AccessCtrl | Regime |\n|---|---|---|---|---|---|---|---|\n${rows}${transitionLines}`
}
