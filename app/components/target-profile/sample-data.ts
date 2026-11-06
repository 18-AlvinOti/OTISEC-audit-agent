// SAMPLE DATA ONLY — replace with real pipeline output (see README).
import type { SeasonRow, Target } from "./types";

const notes: Record<string, string> = {
  "Oracle Safety": "Spot price read from a single AMM pool with no TWAP or staleness check.",
  "Rounding Direction": "convertToShares rounds up on withdraw, so dust can be extracted per call.",
  "Liquidation Paths": "Partial liquidations skip the health-factor recheck after seizure.",
  "Hook Permissions": "Hook address flag bits allow beforeRemoveLiquidity without an implementation.",
  "Liquidity Lock DoS": "Reverting afterRemoveLiquidity can trap LP positions.",
  "Signature Replay": "Domain separator omits chainId on spoke deployments.",
  "Refund Accounting": "Refund path credits the relayer and the depositor for the same deposit.",
  "Nonce Handling": "Nonces are per-route, not per-sender, so ordering can be front-run.",
};

export const SAMPLE_TARGETS: Record<string, Target> = {
  lending: {
    idx: "01.", name: "LendingPool", nsloc: "1,842 nSLOC", chain: "Solidity 0.8.24 · Ethereum · Base",
    files: "14 contracts · 3 external deps", status: "Scope locked", ptype: "Lending · Isolated Markets",
    stars: 4, threat: "Oracle Manipulation", score: 72, grade: "Grade C · Needs Fix", tvl: "$48.2M",
    topsev: "CRITICAL", pocs: "4 PoCs", agents: "9 / 12", fp: "17 dropped", plat: "Sherlock · Public Contest",
    judging: "Escalations open", pool: "$120,000", ends: "14/11/2026",
    key: ["Oracle Safety", "Liquidation Paths", "Rounding Direction", "Share Inflation"],
    attrs: {
      Technical: { "Access Control": 15, "Reentrancy Guards": 14, "Oracle Safety": 5, "Arithmetic Safety": 13, Upgradeability: 11, "Storage Layout": 16, "External Calls": 12, "Event Coverage": 9 },
      Economic: { "Liquidation Paths": 7, "Rounding Direction": 6, "Share Inflation": 12, "Flash Loan Exposure": 8, "Interest Model": 14, "Bad Debt Handling": 10, "MEV Resistance": 11, "Fee Accounting": 15 },
      Operational: { "Admin Key Risk": 13, Timelock: 16, Pausability: 17, Governance: 12, "Test Coverage": 14, "Invariant Tests": 8, Documentation: 16, "Code Maturity": 13 },
    },
    surf: [
      { x: 30, y: 30, kind: "ok" }, { x: 30, y: 65, kind: "ok" }, { x: 30, y: 100, kind: "ok" },
      { x: 70, y: 45, kind: "crit" }, { x: 70, y: 85, kind: "ok" }, { x: 110, y: 65, kind: "med" },
      { x: 150, y: 40, kind: "crit" }, { x: 150, y: 90, kind: "ok" }, { x: 190, y: 65, kind: "med" },
    ],
    notes,
  },
  dex: {
    idx: "02.", name: "HookedPoolV4", nsloc: "2,410 nSLOC", chain: "Solidity 0.8.26 · Unichain · Arbitrum",
    files: "9 contracts · Uniswap v4 core", status: "Scope locked", ptype: "DEX · Uniswap v4 Hooks",
    stars: 3, threat: "Transient Storage Pollution", score: 58, grade: "Grade B · Minor Fixes", tvl: "$21.7M",
    topsev: "HIGH", pocs: "2 PoCs", agents: "7 / 12", fp: "23 dropped", plat: "Cantina · Competition",
    judging: "Judging in progress", pool: "$85,000", ends: "21/11/2026",
    key: ["Hook Permissions", "Delta Settlement", "Rounding Direction", "MEV Resistance"],
    attrs: {
      Technical: { "Hook Permissions": 6, "Callback Gating": 14, "EIP-1153 Hygiene": 8, "Arithmetic Safety": 16, "CREATE2 Salt Bits": 15, "Storage Layout": 13, "External Calls": 12, "Event Coverage": 11 },
      Economic: { "Delta Settlement": 9, "Rounding Direction": 10, "Fee Accounting": 14, "Flash Accounting": 12, "Liquidity Lock DoS": 7, "Price Impact": 15, "MEV Resistance": 8, "Donation Attacks": 13 },
      Operational: { "Admin Key Risk": 17, Timelock: 12, Pausability: 10, Governance: 14, "Test Coverage": 16, "Invariant Tests": 15, Documentation: 12, "Code Maturity": 14 },
    },
    surf: [
      { x: 30, y: 40, kind: "ok" }, { x: 30, y: 90, kind: "ok" }, { x: 70, y: 65, kind: "ok" },
      { x: 110, y: 30, kind: "crit" }, { x: 110, y: 100, kind: "med" }, { x: 150, y: 65, kind: "ok" },
      { x: 190, y: 40, kind: "ok" }, { x: 190, y: 90, kind: "med" },
    ],
    notes,
  },
  bridge: {
    idx: "03.", name: "CrossChainSpoke", nsloc: "3,105 nSLOC", chain: "Solidity 0.8.23 · Ethereum · 6 L2s",
    files: "21 contracts · LayerZero, CCTP", status: "Awaiting scope", ptype: "Bridge · Hub & Spoke",
    stars: 5, threat: "Message Replay", score: 84, grade: "Grade D · Do Not Ship", tvl: "$112.5M",
    topsev: "CRITICAL", pocs: "6 PoCs", agents: "11 / 12", fp: "9 dropped", plat: "Immunefi · Bug Bounty",
    judging: "Triage pending", pool: "$1,000,000", ends: "Ongoing",
    key: ["Signature Replay", "Message Ordering", "Relayer Trust", "Refund Accounting"],
    attrs: {
      Technical: { "Access Control": 12, "Signature Replay": 4, "Nonce Handling": 6, "Arithmetic Safety": 15, Upgradeability: 9, "Storage Layout": 14, "External Calls": 10, "Event Coverage": 13 },
      Economic: { "Refund Accounting": 5, "Fee Accounting": 12, "Message Ordering": 7, "Relayer Trust": 6, "Rate Limits": 11, "Slippage Bounds": 13, "MEV Resistance": 10, "Token Decimals": 14 },
      Operational: { "Admin Key Risk": 8, Timelock: 11, Pausability: 15, Governance: 9, "Test Coverage": 12, "Invariant Tests": 7, Documentation: 14, "Code Maturity": 11 },
    },
    surf: [
      { x: 30, y: 30, kind: "ok" }, { x: 30, y: 65, kind: "crit" }, { x: 30, y: 100, kind: "ok" },
      { x: 70, y: 40, kind: "med" }, { x: 70, y: 90, kind: "crit" }, { x: 110, y: 65, kind: "crit" },
      { x: 150, y: 30, kind: "ok" }, { x: 150, y: 100, kind: "med" }, { x: 190, y: 50, kind: "ok" },
      { x: 190, y: 85, kind: "crit" },
    ],
    notes,
  },
};

export const SAMPLE_RECORD: SeasonRow[] = [
  { platform: "Sherlock", audits: 11, crit: 2, high: 6, med: 14, payout: "$38,410", status: "won" },
  { platform: "Code4rena", audits: 8, crit: 1, high: 4, med: 9, payout: "$21,950", status: "won" },
  { platform: "Cantina", audits: 5, crit: 0, high: 3, med: 6, payout: "$9,300", status: "live" },
  { platform: "HackenProof", audits: 3, crit: 0, high: 1, med: 2, payout: "$2,100", status: "esc" },
  { platform: "Immunefi", audits: 2, crit: 1, high: 1, med: 0, payout: "$15,000", status: "won" },
];
