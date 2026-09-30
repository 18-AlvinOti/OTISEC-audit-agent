// Shared audit-scope filter — used by BOTH the sidebar file list and the pipeline input,
// so the model stops receiving test/mock/tooling/vendor junk from large repos (e.g. an
// uploaded `agave-master` monorepo). One source of truth: classifyPath().

export type ScopeCategory = 'source' | 'interface' | 'excluded'

// Audit-relevant source extensions.
const SOURCE_EXT = /\.(sol|vy|move|rs|cairo|go|fc|tact)$/i
// .ts counts as source ONLY under contracts/ or programs/ (on-chain TS), never elsewhere.
const TS_EXT = /\.ts$/i
const TS_ONCHAIN_DIR = /(^|\/)(contracts|programs)\//i

// Interfaces: kept in scope but de-prioritized into their own group.
const INTERFACE_DIR = /(^|\/)interfaces?\//i

// Path fragments that mark a file as out of audit scope.
const EXCLUDE_PATTERNS: RegExp[] = [
  /(^|\/)(test|tests|testing|__tests__)\//i,
  /_test\.[^/]+$/i, /\.t\.sol$/i, /\.spec\.[^/]+$/i, /\.test\.[^/]+$/i,
  /(^|\/)(bench|benches|benchmark)\//i,
  /(^|\/)mocks?\//i, /(^|\/)[^/]*mock[^/]*\.sol$/i,
  /(^|\/)(script|scripts|deploy|migrations)\//i,
  /(^|\/)(examples?|docs?)\//i,
  /(^|\/)lib\/forge-std\//i, /(^|\/)lib\/openzeppelin[^/]*\//i,
  /(^|\/)(node_modules|vendor|target|out|cache|artifacts)\//i,
  /(^|\/)typechain[^/]*\//i,
  /(^|\/)build\.rs$/i, /\.config\.[^/]+$/i, /\.d\.ts$/i,
  /\.(json|toml|lock|md)$/i,
]

// Off-chain Rust tooling crates in large monorepos — dropped unless the user pins them.
const RUST_TOOLING_DIR = /(^|\/)[^/]*(-bench|bench-[^/]*|-cli|\bcli|ledger-tool|validator)[^/]*\//i

/** Classify a single relative path into source (in-scope), interface, or excluded. */
export function classifyPath(path: string): ScopeCategory {
  if (EXCLUDE_PATTERNS.some((re) => re.test(path))) return 'excluded'
  if (RUST_TOOLING_DIR.test(path) && /\.rs$/i.test(path)) return 'excluded'
  if (INTERFACE_DIR.test(path)) return 'interface'
  if (SOURCE_EXT.test(path)) return 'source'
  if (TS_EXT.test(path) && TS_ONCHAIN_DIR.test(path)) return 'source'
  return 'excluded'
}

export interface HasName { name: string }

export interface ScopeResult<T extends HasName> {
  source: T[]
  interfaces: T[]
  excluded: T[]
  /** In-scope = source + interfaces (what the pipeline sends). */
  inScope: T[]
  /** Extension -> count, over in-scope files only, sorted desc. */
  langBreakdown: { ext: string; count: number }[]
  /** In-scope files grouped by top-level folder, for the sidebar. */
  byFolder: { folder: string; files: T[] }[]
}

const ext = (name: string) => {
  const m = name.toLowerCase().match(/\.([a-z0-9]+)$/)
  return m ? `.${m[1]}` : '(none)'
}

const topFolder = (name: string) => {
  const parts = name.split('/')
  return parts.length > 1 ? parts[0] : '(root)'
}

/**
 * Classify a list of files. `forceInclude` (a set of paths the user toggled on from the
 * Excluded group) overrides the auto-exclusion so those files re-enter scope.
 */
export function classifyFiles<T extends HasName>(files: T[], forceInclude?: Set<string>): ScopeResult<T> {
  const source: T[] = []
  const interfaces: T[] = []
  const excluded: T[] = []

  for (const f of files) {
    const forced = forceInclude?.has(f.name)
    const cat = classifyPath(f.name)
    if (cat === 'source') source.push(f)
    else if (cat === 'interface') interfaces.push(f)
    else if (forced) source.push(f) // user pinned an otherwise-excluded file
    else excluded.push(f)
  }

  const inScope = [...source, ...interfaces]

  const counts = new Map<string, number>()
  for (const f of inScope) counts.set(ext(f.name), (counts.get(ext(f.name)) || 0) + 1)
  const langBreakdown = [...counts.entries()]
    .map(([e, count]) => ({ ext: e, count }))
    .sort((a, b) => b.count - a.count)

  const folders = new Map<string, T[]>()
  for (const f of inScope) {
    const key = topFolder(f.name)
    if (!folders.has(key)) folders.set(key, [])
    folders.get(key)!.push(f)
  }
  const byFolder = [...folders.entries()]
    .map(([folder, fs]) => ({ folder, files: fs }))
    .sort((a, b) => b.files.length - a.files.length)

  return { source, interfaces, excluded, inScope, langBreakdown, byFolder }
}

/** Strip the top-level folder prefix for display when everything shares one root. */
export function relativeName(name: string, folder: string): string {
  if (folder !== '(root)' && name.startsWith(folder + '/')) return name.slice(folder.length + 1)
  return name
}
