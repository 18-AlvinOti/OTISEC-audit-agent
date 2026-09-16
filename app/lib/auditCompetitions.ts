// Distilled from immunefi-team/Past-Audit-Competitions — the real per-finding report
// archive of Immunefi audit competitions (Alchemix, ZeroLend, Puffer Finance, DeGate,
// BadgerDAO eBTC, Immunefi Arbitration). 381 severity-tagged findings were parsed from the
// repo's report filenames ("<id> - [SC - <severity>] <title>.md"), categorized, and reduced to
// a real frequency distribution plus grounded named examples per category.
//
// Same corroboration role as immunefiCases.ts / immunefiReportsIndex.ts / searchSolodit():
// keyword-match the uploaded code, surface real audit-competition precedent as context — never
// as an automatic finding. A match is a lead to chase with the 12-lens sweep.

export interface CompCategoryStat {
  category: string
  count: number
  bySeverity: Record<string, number>
  keywords: RegExp[]
}

export interface CompExample {
  category: string
  protocol: string
  id: string
  sev: string
  title: string
  url: string
}

export const AUDIT_COMP_CATEGORY_STATS: CompCategoryStat[] = [
  { category: 'Reward/bribe accounting theft', count: 94, bySeverity: { low: 9, critical: 35, high: 25, medium: 6, insight: 19 },
    keywords: [/reward|bribe|claim|distribut/i, /emission|accru|checkpoint/i] },
  { category: 'Governance/voting manipulation', count: 54, bySeverity: { high: 8, medium: 12, low: 5, critical: 19, insight: 10 },
    keywords: [/vote|voting|gauge|poke/i, /proposal|quorum|delegate|checkpoint/i] },
  { category: 'Minting/inflation', count: 21, bySeverity: { critical: 13, insight: 4, medium: 3, high: 1 },
    keywords: [/function\s+mint\(|_mint\(/i, /inflat|totalSupply|totalVoting/i] },
  { category: 'Withdrawal/redeem accounting', count: 39, bySeverity: { low: 8, critical: 3, high: 3, insight: 19, medium: 6 },
    keywords: [/function\s+(withdraw|redeem|burn|merge)/i, /lock|unlock|reset/i] },
  { category: 'Direct theft of funds', count: 6, bySeverity: { critical: 4, insight: 2 },
    keywords: [/transferFrom\(|safeTransfer|\.transfer\(/i, /balanceOf\(|ownerOf\(/i] },
  { category: 'DoS / permanent freeze', count: 14, bySeverity: { insight: 8, medium: 2, high: 2, critical: 1, low: 1 },
    keywords: [/for\s*\(|while\s*\(/i, /revert\(|\.push\(/i] },
  { category: 'Precision/rounding', count: 9, bySeverity: { low: 2, high: 4, insight: 3 },
    keywords: [/\/\s*1e\d+|mulDiv|wadDiv|wadMul/i, /basis\s*point|BPS|calculat/i] },
  { category: 'Oracle/price feed', count: 7, bySeverity: { low: 3, medium: 1, insight: 3 },
    keywords: [/latestRoundData|getPrice|oracle/i, /stale|updatedAt|Aggregator/i] },
  { category: 'Tautology / logic error', count: 7, bySeverity: { insight: 3, low: 2, critical: 1, high: 1 },
    keywords: [/require\(|assert\(/i, /==|!=/] },
  { category: 'Slippage protection', count: 2, bySeverity: { critical: 1, insight: 1 },
    keywords: [/slippage|amountOutMin|minAmountOut/i] },
  { category: 'Front-running/MEV', count: 5, bySeverity: { medium: 1, insight: 4 },
    keywords: [/\.call\(|swap\(/i, /deadline|block\.timestamp/i] },
  { category: 'Flash loan', count: 4, bySeverity: { critical: 1, insight: 3 },
    keywords: [/flash\s*loan|flashLoan/i, /receiveFlashLoan|uniswapV2Call/i] },
  { category: 'Input validation', count: 5, bySeverity: { insight: 4, low: 1 },
    keywords: [/require\s*\(|\bvalidat/i, /address\(0\)|== 0/i] },
  { category: 'Signature/replay', count: 5, bySeverity: { medium: 1, insight: 4 },
    keywords: [/ecrecover|permit\(|signature/i, /nonce|EIP712|domainSeparator/i] },
  { category: 'Reentrancy', count: 3, bySeverity: { insight: 3 },
    keywords: [/nonReentrant|reentran/i, /\.call\{value|onERC\d+Received|tokensReceived/i] },
]

export const AUDIT_COMP_EXAMPLES: CompExample[] = [
  { category: 'Reward/bribe accounting theft', protocol: 'Alchemix', id: '30651', sev: 'critical', title: 'Insolvency in RevenueHandlersol because unclaim', url: 'https://github.com/immunefi-team/Past-Audit-Competitions/tree/main/Alchemix' },
  { category: 'Reward/bribe accounting theft', protocol: 'Alchemix', id: '30671', sev: 'critical', title: 'Reward token permanent freeze due to bulk call', url: 'https://github.com/immunefi-team/Past-Audit-Competitions/tree/main/Alchemix' },
  { category: 'Reward/bribe accounting theft', protocol: 'ZeroLend', id: '28955', sev: 'high', title: 'Malicious user can transfer all unclaimed rewar', url: 'https://github.com/immunefi-team/Past-Audit-Competitions/tree/main/ZeroLend' },
  { category: 'Governance/voting manipulation', protocol: 'Alchemix', id: '30814', sev: 'critical', title: 'Wrong calculation of boost amount in Voterpoke', url: 'https://github.com/immunefi-team/Past-Audit-Competitions/tree/main/Alchemix' },
  { category: 'Governance/voting manipulation', protocol: 'Alchemix', id: '30860', sev: 'critical', title: 'Wrong timestamp for totalVoting', url: 'https://github.com/immunefi-team/Past-Audit-Competitions/tree/main/Alchemix' },
  { category: 'Governance/voting manipulation', protocol: 'ZeroLend', id: '28912', sev: 'critical', title: 'Attackers can control the vote result and ampli', url: 'https://github.com/immunefi-team/Past-Audit-Competitions/tree/main/ZeroLend' },
  { category: 'Minting/inflation', protocol: 'Alchemix', id: '30634', sev: 'critical', title: 'Unauthorized minting of unlimited FLUX in  tran', url: 'https://github.com/immunefi-team/Past-Audit-Competitions/tree/main/Alchemix' },
  { category: 'Minting/inflation', protocol: 'Alchemix', id: '30650', sev: 'critical', title: 'Infinite minting of FLUX through voterpoke', url: 'https://github.com/immunefi-team/Past-Audit-Competitions/tree/main/Alchemix' },
  { category: 'Minting/inflation', protocol: 'ZeroLend', id: '29095', sev: 'high', title: 'The lockers supply can be arbitrarily inflated', url: 'https://github.com/immunefi-team/Past-Audit-Competitions/tree/main/ZeroLend' },
  { category: 'Withdrawal/redeem accounting', protocol: 'Alchemix', id: '31481', sev: 'critical', title: 'Undound FLUX accrual through reset and merge', url: 'https://github.com/immunefi-team/Past-Audit-Competitions/tree/main/Alchemix' },
  { category: 'Withdrawal/redeem accounting', protocol: 'Puffer Finance', id: '28788', sev: 'critical', title: 'Slash during a withdrawal from EigenLayer will', url: 'https://github.com/immunefi-team/Past-Audit-Competitions/tree/main/Puffer%20Finance' },
  { category: 'Withdrawal/redeem accounting', protocol: 'ZeroLend', id: '29062', sev: 'critical', title: 'Attacker can steal locked balance of staked nft', url: 'https://github.com/immunefi-team/Past-Audit-Competitions/tree/main/ZeroLend' },
  { category: 'Direct theft of funds', protocol: 'Alchemix', id: '31386', sev: 'critical', title: 'Malicious user can steal FLUX token by abusing', url: 'https://github.com/immunefi-team/Past-Audit-Competitions/tree/main/Alchemix' },
  { category: 'Direct theft of funds', protocol: 'ZeroLend', id: '29031', sev: 'critical', title: 'VestedZeroNFT tokens can be directly stolen thr', url: 'https://github.com/immunefi-team/Past-Audit-Competitions/tree/main/ZeroLend' },
  { category: 'Direct theft of funds', protocol: 'DeGate', id: '26468', sev: 'insight', title: 'Fee-on-transfer tokens can be used to steal oth', url: 'https://github.com/immunefi-team/Past-Audit-Competitions/tree/main/DeGate' },
  { category: 'DoS / permanent freeze', protocol: 'ZeroLend', id: '29103', sev: 'critical', title: 'Omnichain Stakers can permanently lose access t', url: 'https://github.com/immunefi-team/Past-Audit-Competitions/tree/main/ZeroLend' },
  { category: 'DoS / permanent freeze', protocol: 'ZeroLend', id: '29145', sev: 'high', title: 'zeroLendToken is bricked to use for whitelisted', url: 'https://github.com/immunefi-team/Past-Audit-Competitions/tree/main/ZeroLend' },
  { category: 'DoS / permanent freeze', protocol: 'Puffer Finance', id: '28663', sev: 'low', title: 'Deposit of stETH fails due to LIDOs - wei corno', url: 'https://github.com/immunefi-team/Past-Audit-Competitions/tree/main/Puffer%20Finance' },
  { category: 'Precision/rounding', protocol: 'Alchemix', id: '31326', sev: 'high', title: 'Precision loss causes minor loss of FLUX when c', url: 'https://github.com/immunefi-team/Past-Audit-Competitions/tree/main/Alchemix' },
  { category: 'Precision/rounding', protocol: 'Alchemix', id: '31380', sev: 'high', title: 'FluxTokencalculateBPT uses wrong algorithm caus', url: 'https://github.com/immunefi-team/Past-Audit-Competitions/tree/main/Alchemix' },
  { category: 'Precision/rounding', protocol: 'BadgerDAO (eBTC)', id: '28791', sev: 'low', title: 'The system protects from any rounding issues wh', url: 'https://github.com/immunefi-team/Past-Audit-Competitions/tree/main/BadgerDAO%20%28eBTC%29' },
  { category: 'Oracle/price feed', protocol: 'ZeroLend', id: '29068', sev: 'medium', title: 'AaveOracle contract does not verify price stale', url: 'https://github.com/immunefi-team/Past-Audit-Competitions/tree/main/ZeroLend' },
  { category: 'Oracle/price feed', protocol: 'Alchemix', id: '30711', sev: 'low', title: 'The result of the AggregatorVInterface is not v', url: 'https://github.com/immunefi-team/Past-Audit-Competitions/tree/main/Alchemix' },
  { category: 'Oracle/price feed', protocol: 'BadgerDAO (eBTC)', id: '28967', sev: 'insight', title: 'When fallback oracle is frozen fetchPrice can r', url: 'https://github.com/immunefi-team/Past-Audit-Competitions/tree/main/BadgerDAO%20%28eBTC%29' },
  { category: 'Tautology / logic error', protocol: 'Alchemix', id: '30939', sev: 'critical', title: 'Misuse of curve pool calls results for precisio', url: 'https://github.com/immunefi-team/Past-Audit-Competitions/tree/main/Alchemix' },
  { category: 'Tautology / logic error', protocol: 'ZeroLend', id: '29267', sev: 'high', title: 'Wrong implementation causing some functions in', url: 'https://github.com/immunefi-team/Past-Audit-Competitions/tree/main/ZeroLend' },
  { category: 'Tautology / logic error', protocol: 'BadgerDAO (eBTC)', id: '29002', sev: 'insight', title: 'Incorrect implementation of EIP- domain separat', url: 'https://github.com/immunefi-team/Past-Audit-Competitions/tree/main/BadgerDAO%20%28eBTC%29' },
  { category: 'Slippage protection', protocol: 'Alchemix', id: '31309', sev: 'critical', title: 'slippage protection is inaccurate', url: 'https://github.com/immunefi-team/Past-Audit-Competitions/tree/main/Alchemix' },
  { category: 'Slippage protection', protocol: 'Puffer Finance', id: '28833', sev: 'insight', title: 'Missing slippage protection in functions deposi', url: 'https://github.com/immunefi-team/Past-Audit-Competitions/tree/main/Puffer%20Finance' },
  { category: 'Front-running/MEV', protocol: 'Alchemix', id: '30613', sev: 'medium', title: 'malicious user can front run any call to the sw', url: 'https://github.com/immunefi-team/Past-Audit-Competitions/tree/main/Alchemix' },
  { category: 'Front-running/MEV', protocol: 'DeGate', id: '25886', sev: 'insight', title: 'registerToken can be front-run causing token ca', url: 'https://github.com/immunefi-team/Past-Audit-Competitions/tree/main/DeGate' },
  { category: 'Flash loan', protocol: 'Alchemix', id: '31507', sev: 'critical', title: 'Malicious user could flash-loan the veALCX to i', url: 'https://github.com/immunefi-team/Past-Audit-Competitions/tree/main/Alchemix' },
  { category: 'Flash loan', protocol: 'BadgerDAO (eBTC)', id: '28546', sev: 'insight', title: 'FlashLoan can be taken with no fee to be paid', url: 'https://github.com/immunefi-team/Past-Audit-Competitions/tree/main/BadgerDAO%20%28eBTC%29' },
  { category: 'Input validation', protocol: 'Alchemix', id: '30973', sev: 'low', title: 'Incorrect Validation of treasuryPct in the Reve', url: 'https://github.com/immunefi-team/Past-Audit-Competitions/tree/main/Alchemix' },
  { category: 'Input validation', protocol: 'Alchemix', id: '31552', sev: 'insight', title: 'Lack of the validation for a Flash token protec', url: 'https://github.com/immunefi-team/Past-Audit-Competitions/tree/main/Alchemix' },
  { category: 'Input validation', protocol: 'Puffer Finance', id: '28630', sev: 'insight', title: 'Improper Validation for Partial Filling of INCH', url: 'https://github.com/immunefi-team/Past-Audit-Competitions/tree/main/Puffer%20Finance' },
  { category: 'Signature/replay', protocol: 'ZeroLend', id: '28938', sev: 'medium', title: 'Attacker can invalidate users supplyWithPermit', url: 'https://github.com/immunefi-team/Past-Audit-Competitions/tree/main/ZeroLend' },
  { category: 'Signature/replay', protocol: 'DeGate', id: '26286', sev: 'insight', title: 'Potential Signature Validation Bypass', url: 'https://github.com/immunefi-team/Past-Audit-Competitions/tree/main/DeGate' },
  { category: 'Signature/replay', protocol: 'Puffer Finance', id: '29111', sev: 'insight', title: 'Silent Failure of ERC Permit Calls in PufferDep', url: 'https://github.com/immunefi-team/Past-Audit-Competitions/tree/main/Puffer%20Finance' },
  { category: 'Reentrancy', protocol: 'BadgerDAO (eBTC)', id: '28605', sev: 'insight', title: 'Reentrancy on ActivePool allows users to borrow', url: 'https://github.com/immunefi-team/Past-Audit-Competitions/tree/main/BadgerDAO%20%28eBTC%29' },
  { category: 'Reentrancy', protocol: 'BadgerDAO (eBTC)', id: '28713', sev: 'insight', title: 'Reentrancy on BorrowerOperations allows users t', url: 'https://github.com/immunefi-team/Past-Audit-Competitions/tree/main/BadgerDAO%20%28eBTC%29' },
  { category: 'Reentrancy', protocol: 'Immunefi Arbitration', id: '29513', sev: 'insight', title: 'Critical reentrancy vulnerability in executeRew', url: 'https://github.com/immunefi-team/Past-Audit-Competitions/tree/main/Immunefi%20Arbitration' },
]

/** Same keyword-detection corroboration technique as matchReportCategories()/matchImmunefiCases(). */
export function matchAuditCompetitions(code: string, max = 4): (CompCategoryStat & { examples: CompExample[] })[] {
  const scored = AUDIT_COMP_CATEGORY_STATS
    .map((c) => ({ c, hits: c.keywords.filter((re) => re.test(code)).length }))
    .filter((x) => x.hits > 0)
    .sort((a, b) => b.hits - a.hits || b.c.count - a.c.count)

  return scored.slice(0, max).map(({ c }) => ({
    ...c,
    examples: AUDIT_COMP_EXAMPLES.filter((e) => e.category === c.category).slice(0, 3),
  }))
}
