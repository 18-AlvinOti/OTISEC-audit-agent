// Distilled from https://reports.immunefi.com/ (Immunefi Bounty Boost triaged report
// archive) — 2,148 severity-tagged reports parsed from the site's own sitemap
// (protocol/id-sc-severity-title slugs), giving a REAL frequency distribution of what
// professional triagers actually see, plus grounded named examples per category.
//
// This corroborates the same way Solodit and the curated Immunefi writeups do (see
// searchSolodit / matchImmunefiCases in api.audit.ts and immunefiCases.ts) — keyword-match
// the uploaded code, surface real precedent as context, never as an automatic finding.

export interface ReportCategoryStat {
  category: string
  count: number                          // out of 2,148 parsed reports
  bySeverity: Record<string, number>
  keywords: RegExp[]
}

export interface ReportExample {
  category: string
  protocol: string
  id: string
  sev: string
  title: string
  url: string
}

// Real frequency distribution across the full corpus (severity split shown so low-frequency-
// but-high-severity categories, like access control, aren't under-prioritized just because
// they're numerically rare).
export const REPORT_CATEGORY_STATS: ReportCategoryStat[] = [
  { category: 'Input validation', count: 149, bySeverity: { low: 35, insight: 33, medium: 14, high: 64, critical: 3 },
    keywords: [/require\s*\(/i, /\bvalidat/i] },
  { category: 'DoS / permanent freeze', count: 147, bySeverity: { medium: 52, critical: 13, high: 36, insight: 24, low: 22 },
    keywords: [/for\s*\(|while\s*\(/i, /revert\(/i] },
  { category: 'Withdrawal/redeem accounting', count: 121, bySeverity: { high: 19, critical: 20, low: 30, medium: 25, insight: 27 },
    keywords: [/function\s+withdraw|function\s+redeem/i] },
  { category: 'Minting/inflation', count: 113, bySeverity: { insight: 25, critical: 17, low: 20, medium: 29, high: 22 },
    keywords: [/function\s+mint\(/i, /_mint\(/i] },
  { category: 'Liquidation logic', count: 104, bySeverity: { insight: 15, critical: 16, medium: 8, high: 64, low: 1 },
    keywords: [/liquidat/i] },
  { category: 'Signature/replay', count: 91, bySeverity: { insight: 10, medium: 37, low: 44 },
    keywords: [/ecrecover|permit\(|signature/i] },
  { category: 'Insolvency/accounting drift', count: 84, bySeverity: { critical: 13, low: 8, insight: 5, medium: 6, high: 52 },
    keywords: [/totalSupply|totalShares|totalVoting|totalAssets/i] },
  { category: 'Timestamp/time-lock', count: 75, bySeverity: { insight: 23, critical: 4, low: 41, medium: 3, high: 4 },
    keywords: [/block\.timestamp|block\.number/i] },
  { category: 'Front-running/MEV', count: 57, bySeverity: { medium: 31, critical: 3, insight: 9, high: 8, low: 6 },
    keywords: [/\.call\(|swap\(/i] },
  { category: 'Governance/voting', count: 43, bySeverity: { low: 7, critical: 16, medium: 5, insight: 10, high: 5 },
    keywords: [/vote|proposal|quorum|delegate/i] },
  { category: 'Access control', count: 42, bySeverity: { low: 21, critical: 3, medium: 12, insight: 4, high: 2 },
    keywords: [/onlyOwner|onlyAdmin|AccessControl/i] },
  { category: 'Overflow/underflow', count: 38, bySeverity: { low: 18, high: 13, medium: 4, insight: 2, critical: 1 },
    keywords: [/unchecked\s*\{/i, /-=|\+=/] },
  { category: 'Precision/rounding', count: 33, bySeverity: { low: 7, high: 15, insight: 4, critical: 4, medium: 3 },
    keywords: [/\/\s*1e\d+|mulDiv|wadDiv|wadMul/i] },
  { category: 'Slippage protection', count: 24, bySeverity: { critical: 2, insight: 5, low: 1, high: 14, medium: 2 },
    keywords: [/slippage|amountOutMin|minAmountOut/i] },
  { category: 'Unbounded array/loop DoS', count: 23, bySeverity: { insight: 7, high: 5, medium: 10, critical: 1 },
    keywords: [/\.push\(/i, /for\s*\(\s*uint/i] },
  { category: 'Delegatecall/uninitialized proxy', count: 18, bySeverity: { insight: 8, medium: 2, low: 8 },
    keywords: [/delegatecall/i, /initialize\(/i] },
  { category: 'Oracle/price feed', count: 12, bySeverity: { low: 4, insight: 4, medium: 1, critical: 1, high: 2 },
    keywords: [/latestRoundData|getPrice|oracle/i] },
  { category: 'Bridge/cross-chain', count: 11, bySeverity: { insight: 4, medium: 5, low: 2 },
    keywords: [/bridge|relay|crossChain/i] },
  { category: 'Reentrancy', count: 8, bySeverity: { insight: 7, low: 1 },
    keywords: [/nonReentrant|reentranc/i] },
  { category: 'Flash loan', count: 4, bySeverity: { critical: 1, insight: 3 },
    keywords: [/flash\s*loan|flashLoan/i] },
]

// A handful of real, named examples per category (protocol/id/title/url all pulled directly
// from the sitemap — nothing fabricated). Kept short; this is corroboration, not a database dump.
export const REPORT_EXAMPLES: ReportExample[] = [
  { category: 'Access control', protocol: 'Alchemix', id: '30634', sev: 'critical', title: 'Unauthorized minting of unlimited FLUX in transmuter', url: 'https://reports.immunefi.com/alchemix/30634-sc-critical-unauthorized-minting-of-unlimited-flux-in-tran' },
  { category: 'Access control', protocol: 'Alchemix', id: '31375', sev: 'critical', title: 'Lack of access control in poke() function', url: 'https://reports.immunefi.com/alchemix/31375-sc-critical-lack-of-access-control-in-poke-function-allows-' },
  { category: 'Access control', protocol: 'iop-paradex', id: '47198', sev: 'critical', title: 'Operator can perform unauthorized fund transfers', url: 'https://reports.immunefi.com/iop-paradex/47198-sc-critical-the-operator-can-perform-unauthorized-fund-transfers' },
  { category: 'Minting/inflation', protocol: 'Alchemix', id: '30650', sev: 'critical', title: 'Infinite minting of FLUX through voterPoke', url: 'https://reports.immunefi.com/alchemix/30650-sc-critical-infinite-minting-of-flux-through-voterpoke' },
  { category: 'Minting/inflation', protocol: 'Alchemix', id: '30999', sev: 'critical', title: 'An edge case mints multiples times more FLUX than it should', url: 'https://reports.immunefi.com/alchemix/30999-sc-critical-an-edge-case-mints-times-more-flux-than-it-should' },
  { category: 'Governance/voting', protocol: 'Alchemix', id: '30814', sev: 'critical', title: 'Wrong calculation of boost amount in voterPoke', url: 'https://reports.immunefi.com/alchemix/30814-sc-critical-wrong-calculation-of-boost-amount-in-voterpoke' },
  { category: 'Governance/voting', protocol: 'Alchemix', id: '30906', sev: 'critical', title: 'voterPoke can be called at will leading to a user DoS', url: 'https://reports.immunefi.com/alchemix/30906-sc-critical-voterpoke-can-be-called-at-will-leading-to-a-us' },
  { category: 'Insolvency/accounting drift', protocol: 'Alchemix', id: '30651', sev: 'critical', title: 'Insolvency in RevenueHandler.sol due to unclaimed rewards accounting gap', url: 'https://reports.immunefi.com/alchemix/30651-sc-critical-insolvency-in-revenuehandlersol-because-unclaim' },
  { category: 'Insolvency/accounting drift', protocol: 'Alchemix', id: '31520', sev: 'critical', title: 'Incorrect accounting of totalVoting leads to permanent drift', url: 'https://reports.immunefi.com/alchemix/31520-sc-critical-incorrect-accounting-of-totalvoting-leads-to-pe' },
  { category: 'DoS / permanent freeze', protocol: 'Alchemix', id: '30671', sev: 'critical', title: 'Reward token permanent freeze due to bulk call revert', url: 'https://reports.immunefi.com/alchemix/30671-sc-critical-reward-token-permanent-freeze-due-to-bulk-call-' },
  { category: 'DoS / permanent freeze', protocol: 'Alchemix', id: '30922', sev: 'high', title: 'DoS of withdrawals through filling the userPoints array', url: 'https://reports.immunefi.com/alchemix/30922-sc-high-dos-of-withdrawals-through-filling-the-userpoin' },
  { category: 'Slippage protection', protocol: 'Alchemix', id: '30682', sev: 'critical', title: 'Insufficient slippage control in RevenueHandler', url: 'https://reports.immunefi.com/alchemix/30682-sc-critical-insufficient-slippage-control-in-revenuehandler' },
  { category: 'Slippage protection', protocol: 'Alchemix', id: '31309', sev: 'critical', title: 'Slippage protection is inaccurate', url: 'https://reports.immunefi.com/alchemix/31309-sc-critical-slippage-protection-is-inaccurate' },
  { category: 'Front-running/MEV', protocol: 'Alchemix', id: '30919', sev: 'critical', title: 'Front-running of pokeTokens could lead to loss of rewards', url: 'https://reports.immunefi.com/alchemix/30919-sc-critical-front-running-of-poketokens-could-lead-to-loss-' },
  { category: 'Front-running/MEV', protocol: 'jito-restaking', id: '36903', sev: 'high', title: 'Vault reward mechanism can be sandwiched by MEV', url: 'https://reports.immunefi.com/jito-restaking/36903-sc-high-the-vault-reward-mechanism-can-be-sandwiched-by-mev' },
  { category: 'Withdrawal/redeem accounting', protocol: 'Alchemix', id: '31112', sev: 'critical', title: 'BribeSOL withdraw() doesn\'t update totalVoting, corrupting downstream accounting', url: 'https://reports.immunefi.com/alchemix/31112-sc-critical-bribesolwithdraw-doesnt-update-the-totalvotings' },
  { category: 'Precision/rounding', protocol: 'Alchemix', id: '31390', sev: 'high', title: 'Precision loss in FluxToken.getClaimableFlux', url: 'https://reports.immunefi.com/alchemix/31390-sc-high-precision-loss-in-fluxtokensolgetclaimableflux' },
  { category: 'Overflow/underflow', protocol: 'folks-liquid-staking', id: '37889', sev: 'high', title: 'Underflow in burn() causes user funds to be partially frozen', url: 'https://reports.immunefi.com/folks-liquid-staking/37889-sc-high-underflow-in-burn-function-will-cause-user-funds-to-partially-frozen' },
  { category: 'Oracle/price feed', protocol: 'swaylend_iop', id: '35684', sev: 'critical', title: 'Incorrect Pyth oracle price feed processing leads to wrong collateral valuation', url: 'https://reports.immunefi.com/swaylend_iop/35684-sc-critical-incorrect-pyth-oracle-price-feed-process-leads-to-wrong-collateral-value-calculati' },
  { category: 'Liquidation logic', protocol: 'term-structure-institutional_iop', id: '46819', sev: 'critical', title: 'Direct theft of user funds when an expired loan gets liquidated', url: 'https://reports.immunefi.com/term-structure-institutional_iop/46819-sc-critical-direct-theft-of-users-funds-when-expired-loan-get-liquidated' },
  { category: 'Input validation', protocol: 'circuitdaoiop', id: '43705', sev: 'critical', title: 'Lack of validation in BYC coin issuance lets attacker issue arbitrary amounts', url: 'https://reports.immunefi.com/circuitdaoiop/43705-sc-critical-attackers-can-exploit-lack-of-validation-in-byc-coin-issuance-process-to-issue-arb' },
  { category: 'Flash loan', protocol: 'Alchemix', id: '31507', sev: 'critical', title: 'Malicious user could flash-loan veALCX to inflate voting power', url: 'https://reports.immunefi.com/alchemix/31507-sc-critical-malicious-user-could-flash-loan-the-vealcx-to-i' },
]

/** Same keyword-detection corroboration technique as matchImmunefiCases()/searchSolodit(). */
export function matchReportCategories(code: string, max = 4): (ReportCategoryStat & { examples: ReportExample[] })[] {
  const scored = REPORT_CATEGORY_STATS
    .map((c) => ({ c, hits: c.keywords.filter((re) => re.test(code)).length }))
    .filter((x) => x.hits > 0)
    .sort((a, b) => b.hits - a.hits || b.c.count - a.c.count)

  return scored.slice(0, max).map(({ c }) => ({
    ...c,
    examples: REPORT_EXAMPLES.filter((e) => e.category === c.category).slice(0, 2),
  }))
}
