// Distilled from radcipher/auditvault (private) — exploit-playbooks, audit-tactics, and
// Pattern-Recognition-Drills. Unlike the precedent corpora (immunefiCases / scvList /
// auditCompetitions, which surface "this pattern really lost funds" cases), these are
// DETECTION METHODOLOGY: per-vuln-class grep heuristics plus the auditor's "mental
// checkpoint" question. When the uploaded code trips a playbook's keywords, we hand the LLM
// that class's concrete grep signatures and the checkpoint question to force a targeted look —
// still a lead to confirm with the 12-lens sweep, never an automatic finding.

const VAULT_SRC = 'radcipher/auditvault exploit-playbooks + drills'

export interface VaultPlaybook {
  id: string
  category: string
  keywords: RegExp[]
  // The auditor's mental-checkpoint question — the single thing to verify for this class.
  checkpoint: string
  // Concrete grep/static signatures to chase for this class.
  grepHints: string
}

export const VAULT_PLAYBOOKS: VaultPlaybook[] = [
  {
    id: 'pb1', category: 'Reentrancy (state update after external call)',
    keywords: [/\.call\{value/i, /\.call\(|\.transfer\(|\.send\(/i, /balances?\[msg\.sender\]/i, /nonReentrant|ReentrancyGuard/i],
    checkpoint: 'Is state updated BEFORE every value transfer / external call (checks-effects-interactions)?',
    grepHints: 'External call (.call{value}, .transfer, token.transfer) that precedes the balance/state write; absence of a nonReentrant guard on a fund-moving function.',
  },
  {
    id: 'pb2', category: 'Oracle manipulation (spot price / single source)',
    keywords: [/getReserves|slot0|getAmountsOut|spotPrice|get_virtual_price/i, /oracle|getPrice|latestRoundData/i, /price/i],
    checkpoint: 'Can an attacker move this price for a single block (spot/AMM reserves), and is there a TWAP / staleness / multi-source check?',
    grepHints: 'Price read from getReserves/slot0/getAmountsOut/get_virtual_price used directly; latestRoundData without checking updatedAt/answeredInRound for staleness.',
  },
  {
    id: 'pb3', category: 'Integer overflow / underflow / unchecked math',
    keywords: [/unchecked\s*\{/i, /pragma solidity \^?0\.[0-7]\./i, /SafeMath/i, /\+=|-=|\*=/],
    checkpoint: 'Does any arithmetic run in an unchecked block or pre-0.8 pragma without bounds, and can inputs drive it past a boundary?',
    grepHints: 'unchecked{} blocks around user-influenced arithmetic; solidity <0.8 without SafeMath; subtraction that can underflow a balance.',
  },
  {
    id: 'pb4', category: 'Denial of service (unbounded loop / revert-on-external)',
    keywords: [/for\s*\(|while\s*\(/i, /\.push\(|\.length/i, /\.transfer\(|\.call\(/i, /revert\(/i],
    checkpoint: 'Can any single actor grow an iterated array, or make one external call in a loop revert, and freeze the whole function for everyone?',
    grepHints: 'Loop over a user-growable array (.push then iterate); external call inside a loop whose revert blocks all participants; no try/catch or return-value handling.',
  },
  {
    id: 'pb5', category: 'Unchecked external call return value',
    keywords: [/\.call\(|\.delegatecall\(|\.callcode\(/i, /\.send\(/i, /transfer\(/i],
    checkpoint: 'Is every low-level call / send return value checked (require(ok)) rather than silently ignored?',
    grepHints: 'Low-level call/send whose boolean return is not require-checked; ERC20 transfer/transferFrom without SafeERC20 on non-reverting tokens.',
  },
  {
    id: 'pb6', category: 'Access-control escalation via delegatecall / upgrade',
    keywords: [/delegatecall/i, /setImplementation|upgradeTo|_upgrade/i, /tx\.origin/i, /forward|proxyCall|execute\(/i],
    checkpoint: 'Is delegatecall / setImplementation ever reachable with a variable or user-supplied target, and is upgrade gated by onlyOwner/timelock (not an EOA)?',
    grepHints: 'delegatecall to a non-immutable/param address; setImplementation/upgradeTo without onlyRole/onlyTimelock; tx.origin used for auth.',
  },
  {
    id: 'pb7', category: 'Reward accrual drift / epoch misalignment',
    keywords: [/rewardPerToken|userRewardPerTokenPaid|rewardDebt|accRewardPer/i, /lastUpdate(Time|Block)/i, /claim|stake|withdraw|exit/i],
    checkpoint: 'Is the reward checkpoint (userRewardPerTokenPaid) synced on EVERY balance-changing path — stake, withdraw, transfer, claim, exit — via one shared modifier?',
    grepHints: 'updateReward/updateGlobal called on some entrypoints but not withdraw/transfer/emergencyWithdraw; block.timestamp vs block.number mixed across reward math.',
  },
  {
    id: 'pb8', category: 'Front-running / MEV / block-time assumptions',
    keywords: [/block\.timestamp|block\.number/i, /deadline|minReturn|amountOutMin|minOut/i, /swap\(|auction|bid\(/i],
    checkpoint: 'Does a high-value action rely on block.timestamp/order without slippage bounds or commit-reveal, so it can be front-run/sandwiched?',
    grepHints: 'block.timestamp enforcing tight windows for high-value ops; swap/withdraw without minOut/amountOutMin; no deadline on user trades.',
  },
  {
    id: 'pb9', category: 'Economic / fee-share incentive exploit',
    keywords: [/totalShares|totalAssets|totalDistributed|feeShare|weight/i, /distribut|payout|accru/i, /snapshot|epoch/i],
    checkpoint: 'Can an attacker pump/drain fee-bearing activity or game share weights to extract value without a code bug (invariant: totalPaid <= totalRevenue)?',
    grepHints: 'Payout computed over totalShares without a time-weighted snapshot or lock; totalShares/totalAssets not updated atomically with fee accrual.',
  },
  {
    id: 'pb10', category: 'State-machine / phase-transition bug',
    keywords: [/enum\s+\w*Phase|enum\s+\w*State|Status\b/i, /require\s*\(\s*\w*(phase|state|status)/i, /oracle|external call/i],
    checkpoint: 'Is the phase flipped BEFORE any external call, and does every phase-sensitive function guard on require(state == X)?',
    grepHints: 'External call before a phase/enum assignment (reenter into an earlier phase); public state-changing function with no require(state == ...) guard.',
  },
  {
    id: 'pb11', category: 'Timelock / governance bypass',
    keywords: [/setDelay|updateDelay|timelock|Timelock/i, /execute\(|queue\(|schedule\(/i, /onlyGovernance|onlyTimelock|admin/i],
    checkpoint: 'Can the delay be set to zero or execute() be reached without a prior queued proposal id (or is the timelock admin an EOA)?',
    grepHints: 'setDelay/updateDelay not restricted to the timelock itself; execute() checking msg.sender==admin (EOA) instead of a queued proposal; sensitive calls (upgradeTo/sweep/setMinter) not onlyTimelock.',
  },
  {
    id: 'pb12', category: 'Under-restricted withdraw / rescue / sweep',
    keywords: [/sweep|rescue|recoverERC20|emergencyWithdraw|withdrawToken|recoverFunds|skim/i, /onlyOwner|onlyRole|onlyTimelock/i, /transfer\(|safeTransfer/i],
    checkpoint: 'Can a rescue/sweep function move the protocol token or user funds, and is it gated by a strong role and blocked from protocol-owned assets?',
    grepHints: 'sweep*/rescue*/emergencyWithdraw with weak/missing access modifier; arbitrary token/to params; rescue transfer that skips accounting (totalAssets/user balances).',
  },
  // Drill-reinforced extras (distinct signal from the playbooks above)
  {
    id: 'd4', category: 'Auth via tx.origin',
    keywords: [/tx\.origin/i],
    checkpoint: 'Is tx.origin used for authorization anywhere (phishable — should be msg.sender)?',
    grepHints: 'require(tx.origin == ...) / tx.origin == owner used for access control.',
  },
  {
    id: 'd11', category: 'Rounding exploit on share minting (first-depositor)',
    keywords: [/totalSupply\(\)\s*==\s*0|totalShares?\s*==\s*0/i, /shares?\s*=\s*.*\*/i, /\bmint\(|_mint\(/i, /balanceOf\(\s*address\(this\)/i],
    checkpoint: 'On the first deposit, can shares round to zero or be inflated by a direct token donation to the vault (ERC4626 first-depositor attack)?',
    grepHints: 'shares = amount * totalSupply / totalAssets with no minimum-shares / dead-shares guard; totalSupply==0 branch that trusts attacker-set ratio.',
  },
]

/** Same keyword-detection technique as matchImmunefiCases()/matchScvList(), but returns
 *  targeted detection heuristics (grep signatures + checkpoint) rather than precedent cases. */
export function matchAuditVault(code: string, max = 5): (VaultPlaybook & { source: string })[] {
  const scored = VAULT_PLAYBOOKS
    .map((p) => ({ p, hits: p.keywords.filter((re) => re.test(code)).length }))
    .filter((x) => x.hits > 0)
    .sort((a, b) => b.hits - a.hits)

  return scored.slice(0, max).map(({ p }) => ({ ...p, source: VAULT_SRC }))
}
