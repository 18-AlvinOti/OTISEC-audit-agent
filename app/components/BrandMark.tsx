/** OTISEC Closed Loop mark — the loop is the contract, the check is the audit. */
export function BrandMark({ size = 16, loop = '#EFEBDD', check = 'var(--teal-200)' }: {
  size?: number; loop?: string; check?: string
}) {
  return (
    <svg width={size} height={size} viewBox="0 0 220 220" style={{ flexShrink: 0 }} aria-hidden="true">
      <path d="M 158 178 A 84 84 0 1 0 60 178" fill="none" stroke={loop} strokeWidth="24" strokeLinecap="round" />
      <path d="M 78 128 L 106 158 L 172 88" fill="none" stroke={check} strokeWidth="24" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
