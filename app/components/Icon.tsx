import {
  Shield, Upload, Zap, X, ChevronDown, ChevronRight, ExternalLink, Lock,
  AlertTriangle, CheckSquare, Grid, LogOut, GitBranch, BarChart2,
} from 'lucide-react'

const ICONS = {
  shield: Shield,
  upload: Upload,
  zap: Zap,
  x: X,
  'chevron-down': ChevronDown,
  'chevron-right': ChevronRight,
  'external-link': ExternalLink,
  lock: Lock,
  'alert-triangle': AlertTriangle,
  'check-square': CheckSquare,
  grid: Grid,
  'log-out': LogOut,
  'git-branch': GitBranch,
  'bar-chart-2': BarChart2,
} as const

interface Props {
  name: keyof typeof ICONS
  size?: number
  className?: string
  style?: React.CSSProperties
}

/** Lucide icon dispatcher — the design system's canonical glyph set, backed by lucide-react. */
export function Icon({ name, size = 14, className = '', style = {} }: Props) {
  const Cmp = ICONS[name]
  if (!Cmp) return null
  return <Cmp size={size} className={className} style={{ flexShrink: 0, ...style }} />
}
