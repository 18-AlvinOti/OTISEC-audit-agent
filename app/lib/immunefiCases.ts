// Curated, real-world bug-bounty precedent, distilled from:
// https://github.com/sayan011/Immunefi-bug-bounty-writeups-list
//
// 147 paid and credibly disclosed real vulnerabilities covering Critical & High impact
// vectors across leading EVM, DeFi, Bridge, and ZK protocols.
// Corroboration only: a keyword match is a lead to chase with the 12-lens sweep, never an automatic finding.

export interface ImmunefiCase {
  protocol: string
  bounty: string
  severity: string
  category: string
  pattern: string
  url: string
  keywords: RegExp[]
}

export const IMMUNEFI_CASES: ImmunefiCase[] = [
  {
    protocol: "Wormhole",
    bounty: "10M",
    severity: "Critical",
    category: "Uninitialized proxy / Initializer hijack",
    pattern: "Upgradeable proxy left uninitialized post-deploy; attacker calls initialize() directly and seizes a privileged role.",
    url: "https://medium.com/immunefi/wormhole-uninitialized-proxy-bugfix-review-90250c41a43a",
    keywords: [/initialize\(/i, /Initializable/i, /_disableInitializers/i, /proxy/i]
  },
  {
    protocol: "Aurora",
    bounty: "6M",
    severity: "Critical",
    category: "Infinite mint / spend",
    pattern: "Accounting bug in balance updates let an attacker spend/withdraw funds without a corresponding balance decrement.",
    url: "https://medium.com/immunefi/aurora-infinite-spend-bugfix-review-6m-payout-e635d24273d",
    keywords: [/balances?\[.*\]\s*-=/i, /unchecked\s*{/i]
  },
  {
    protocol: "Optimism",
    bounty: "2M",
    severity: "Critical",
    category: "Infinite mint / spend",
    pattern: "Bridge deposit/mint path allowed duplicated minting of the same deposit — money duplication across L1/L2.",
    url: "https://medium.com/immunefi/optimism-infinite-money-duplication-bugfix-review-daa6597146a0",
    keywords: [/mint\(/i, /bridge/i, /deposit\(/i, /nonce/i]
  },
  {
    protocol: "Moonbeam",
    bounty: "1M+50k",
    severity: "Critical",
    category: "Cross-chain / Precompile execution",
    pattern: "EVM precompile vulnerability allowed caller to trigger unintended state execution or fund transfer across parachains.",
    url: "https://pwning.mirror.xyz/okyEG4lahAuR81IMabYL5aUdvAsZ8cRCbYBXh8RHFuE",
    keywords: [/precompile/i, /delegatecall/i, /call\(/i]
  },
  {
    protocol: "Polkadot Frontier EVM",
    bounty: "1M",
    severity: "Critical",
    category: "EVM execution environment flaw",
    pattern: "Flaw in EVM interpreter / precompile boundary allowed unexpected state mutation.",
    url: "https://pwning.mirror.xyz/RFNTSouIIlHVNmTNDThUVb1obIeN5c1LAiQuN9Ve-ok",
    keywords: [/delegatecall/i, /staticcall/i, /precompile/i]
  },
  {
    protocol: "Interlay",
    bounty: "200k",
    severity: "Critical",
    category: "Bridge / Vault collateral accounting",
    pattern: "Collateral release allowed without verifying underlying vault backing or debt clearance.",
    url: "https://pwning.mirror.xyz/jlT8OgtwN3mQf3KdYmXdcSXbE4s95JzT3eR3wxiLmpw",
    keywords: [/vault/i, /collateral/i, /redeem/i, /burn/i]
  },
  {
    protocol: "Sherlock Yield Strategy",
    bounty: "250k",
    severity: "Critical",
    category: "Yield strategy accounting / Slippage bypass",
    pattern: "Yield strategy shares calculation allowed extracting disproportionate underlying assets during harvest/rebalance.",
    url: "https://mirror.xyz/0xE400820f3D60d77a3EC8018d44366ed0d334f93C/LOZF1YBcH1eBdxlC6HP223cAMeTpNgQ-Kc4EjQuxmGA",
    keywords: [/harvest\(/i, /strategy/i, /shares/i, /balanceOf/i]
  },
  {
    protocol: "Belt",
    bounty: "1M+50K",
    severity: "Critical",
    category: "Logic error / Share calculation",
    pattern: "Strategy accounting logic error let an attacker mint disproportionate shares relative to deposited value.",
    url: "https://medium.com/immunefi/belt-finance-logic-error-bug-fix-postmortem-39308a158291",
    keywords: [/totalShares|totalSupply/i, /deposit\(/i, /convertToShares/i]
  },
  {
    protocol: "Fei",
    bounty: "800K",
    severity: "Critical",
    category: "Flash loan / Oracle manipulation",
    pattern: "Flash-loan-atomic manipulation of an internal price/accounting reference exploited within one tx.",
    url: "https://medium.com/immunefi/fei-protocol-flashloan-vulnerability-postmortem-7c5dc001affb",
    keywords: [/flash\s*loan|flashLoan/i, /reweight|rebase/i]
  },
  {
    protocol: "Arbitrum",
    bounty: "400 ETH",
    severity: "Critical",
    category: "Cross-chain bridge / Sequencer inbox",
    pattern: "L1-to-L2 inbox message processing allowed spoofing or unauthorized retryable ticket execution.",
    url: "https://medium.com/@0xriptide/hackers-in-arbitrums-inbox-ca23272641a2",
    keywords: [/createRetryableTicket/i, /inbox/i, /bridge/i]
  },
  {
    protocol: "Balancer",
    bounty: "50 ETH",
    severity: "Critical",
    category: "Business logic / Invariant breakdown",
    pattern: "Protocol Balancer business logic flaw breaking state invariants or allowing unauthorized fund extraction (Critical, bounty: 50 ETH).",
    url: "https://mirror.xyz/0x2719F6Dfb85086F87319079cC2f7EeFD0e40994D/NWDf5uW1Ve7-TrcPKwmM86xp8ploMSCRGC58A-NSoFY",
    keywords: [/require\(/i, /transfer|transferFrom/i, /balanceOf|balances/i, /total/i]
  },
  {
    protocol: "LEVEL Finance",
    bounty: "Not Paid(out of scope)",
    severity: "-",
    category: "Referral / Incentive accounting",
    pattern: "Referral/fee claim logic allowed claiming rewards repeatedly without decrementing eligible volume.",
    url: "https://twitter.com/0xriptide/status/1658708383535333380",
    keywords: [/claim/i, /reward/i, /referral/i]
  },
  {
    protocol: "BeanStalk",
    bounty: "~182K",
    severity: "Critical",
    category: "Logic error / Settlement convert",
    pattern: "Logic error in a settlement/convert path let an attacker extract more value than deposited.",
    url: "https://medium.com/immunefi/beanstalk-logic-error-bugfix-review-4fea17478716",
    keywords: [/convert\(/i, /silo/i, /deposit/i]
  },
  {
    protocol: "Sense",
    bounty: "50K",
    severity: "Critical",
    category: "Access control",
    pattern: "Missing/weak access-control guard on a privileged settlement function.",
    url: "https://medium.com/immunefi/sense-finance-access-control-issue-bugfix-review-32e0c806b1a0",
    keywords: [/onlyOwner|onlyAdmin|AccessControl/i]
  },
  {
    protocol: "Fluidity",
    bounty: "50k",
    severity: "Critical",
    category: "Reward distribution / Token wrap",
    pattern: "Wrapped asset reward mechanism allowed extracting rewards without staking risk via rapid wrap/unwrap cycles.",
    url: "https://www.trust-security.xyz/post/breaking-fluidity-for-glory-and-50k",
    keywords: [/reward/i, /wrap|unwrap/i, /transfer/i]
  },
  {
    protocol: "Oasis",
    bounty: "20k",
    severity: "Critical",
    category: "Emergency shutdown / Access control",
    pattern: "Platform emergency shutdown or pause procedure could be triggered or manipulated by unauthorized actor.",
    url: "https://www.trust-security.xyz/post/taking-home-a-20k-bounty-with-oasis-platform-shutdown-vulnerability",
    keywords: [/shutdown|pause|unpause/i, /onlyAdmin/i]
  },
  {
    protocol: "Fringe.fi",
    bounty: "2k",
    severity: "Critical",
    category: "Lending insolvency / Collateral valuation",
    pattern: "Collateral valuation formula allowed borrowing against illiquid or manipulated tokens leading to protocol bad debt.",
    url: "https://www.trust-security.xyz/post/diving-deep-into-a-critical-protocol-insolvency-bug-in-fringe-fi-lending-platform",
    keywords: [/borrow\(/i, /collateral/i, /liquidat/i, /oracle/i]
  },
  {
    protocol: "O3",
    bounty: "5K",
    severity: "Critical",
    category: "Cross-chain bridge / Arbitrary call",
    pattern: "Bridge swap/relayer contract allowed passing arbitrary target address or calldata, draining approved tokens.",
    url: "https://www.trust-security.xyz/post/critical-finding-stealing-tokens-from-o3-bridge-users",
    keywords: [/call\(/i, /swap/i, /bridge/i, /target/i]
  },
  {
    protocol: "Morpho",
    bounty: "Not Paid",
    severity: "Medium",
    category: "Delegatecall / Storage destruction",
    pattern: "Controlled delegatecall in logic contract allowed an attacker to execute selfdestruct or overwrite critical storage slots.",
    url: "https://www.trust-security.xyz/post/med-morpho-finance-logic-contract-can-be-destroyed-via-controlled-delegatecall",
    keywords: [/delegatecall/i, /selfdestruct/i, /address\(this\)/i]
  },
  {
    protocol: "Compound",
    bounty: "Not Paid",
    severity: "Critical",
    category: "Liquidation seizure",
    pattern: "Liquidators could seize collateral assets the borrower never actually held due to missing membership check.",
    url: "https://www.trust-security.xyz/post/crit-compound-liquidators-may-seize-assets-not-held-as-collateral-closed-as-known-issue",
    keywords: [/seize\(/i, /liquidat/i, /collateral/i]
  },
  {
    protocol: "ANKR/Stader",
    bounty: "-",
    severity: "High",
    category: "MEV / Reward sandwiching",
    pattern: "Reward distribution transaction could be front-run / sandwiched by flash-depositing immediately before distribution.",
    url: "https://www.trust-security.xyz/post/high-ankr-stader-reward-distribution-is-vulnerable-to-mev-leading-to-theft-of-reward-won-t-fix",
    keywords: [/reward/i, /distribute/i, /epoch/i]
  },
  {
    protocol: "Iron Bank",
    bounty: "Not Paid",
    severity: "High",
    category: "Lending cap / Collateral enforcement",
    pattern: "Collateral cap was not properly enforced during account initialization or liquidation, allowing excessive borrowing.",
    url: "https://www.trust-security.xyz/post/high-iron-bank-liquidator-is-not-credited-with-correct-collateral-amount",
    keywords: [/collateralCap/i, /borrow/i, /liquidat/i]
  },
  {
    protocol: "Iron Bank",
    bounty: "Not Paid",
    severity: "High",
    category: "Lending cap / Collateral enforcement",
    pattern: "Collateral cap was not properly enforced during account initialization or liquidation, allowing excessive borrowing.",
    url: "https://www.trust-security.xyz/post/high-iron-bank-collateral-cap-is-not-enforced-at-account-initialization",
    keywords: [/collateralCap/i, /borrow/i, /liquidat/i]
  },
  {
    protocol: "ANKR",
    bounty: "-",
    severity: "Low",
    category: "Business logic / Invariant breakdown",
    pattern: "Protocol ANKR business logic flaw breaking state invariants or allowing unauthorized fund extraction (Low, bounty: -).",
    url: "https://www.trust-security.xyz/post/low-ankr-user-gets-more-gas-than-supposed-to-when-distributing-rewards",
    keywords: [/require\(/i, /transfer|transferFrom/i, /balanceOf|balances/i, /total/i]
  },
  {
    protocol: "Brahma",
    bounty: "Not Paid",
    severity: "Critical",
    category: "Vault fee / Curve calculation",
    pattern: "Fee collection ignored previous losses or miscalculated position value via skewed Curve LP pricing.",
    url: "https://www.trust-security.xyz/post/crit-brahma-fi-fee-collection-does-not-take-previous-losses-into-account",
    keywords: [/fee/i, /virtualPrice/i, /withdraw/i, /position/i]
  },
  {
    protocol: "Brahma",
    bounty: "Not Paid",
    severity: "Critical",
    category: "Vault fee / Curve calculation",
    pattern: "Fee collection ignored previous losses or miscalculated position value via skewed Curve LP pricing.",
    url: "https://www.trust-security.xyz/post/crit-brahma-fi-l2-position-handler-miscalculates-position-value-leading-to-severe-risks",
    keywords: [/fee/i, /virtualPrice/i, /withdraw/i, /position/i]
  },
  {
    protocol: "Brahma",
    bounty: "Not Paid",
    severity: "Medium",
    category: "Vault fee / Curve calculation",
    pattern: "Fee collection ignored previous losses or miscalculated position value via skewed Curve LP pricing.",
    url: "https://www.trust-security.xyz/post/med-brahma-fi-curve-miscalculations-may-cause-user-withdraws-to-fail",
    keywords: [/fee/i, /virtualPrice/i, /withdraw/i, /position/i]
  },
  {
    protocol: "Oasis",
    bounty: "Not Paid",
    severity: "Critical",
    category: "Business logic / Invariant breakdown",
    pattern: "Protocol Oasis business logic flaw breaking state invariants or allowing unauthorized fund extraction (Critical, bounty: Not Paid).",
    url: "https://www.trust-security.xyz/post/the-story-of-the-0-day-crit-that-wasn-t",
    keywords: [/require\(/i, /transfer|transferFrom/i, /balanceOf|balances/i, /total/i]
  },
  {
    protocol: "Tokemak",
    bounty: "Not Paid",
    severity: "-",
    category: "Business logic / Invariant breakdown",
    pattern: "Protocol Tokemak business logic flaw breaking state invariants or allowing unauthorized fund extraction (-, bounty: Not Paid).",
    url: "https://www.trust-security.xyz/post/tokemak-liquidity-operator-can-steal-funds",
    keywords: [/require\(/i, /transfer|transferFrom/i, /balanceOf|balances/i, /total/i]
  },
  {
    protocol: "Thena",
    bounty: "20k",
    severity: "High",
    category: "AMM invariant / Fee deduction",
    pattern: "Solidly-style AMM pair fee accounting discrepancy allowed draining pool reserves or stealing gauge incentives.",
    url: "https://zzykxx.com/2023/02/02/the-bug-that-codearena-missed-,-twice/",
    keywords: [/kLast/i, /reserve0|reserve1/i, /claim_rewards/i]
  },
  {
    protocol: "Alchemist",
    bounty: "28k",
    severity: "Critical",
    category: "Forced revert / Admin DoS",
    pattern: "Admin function bricked by force-feeding ETH/tokens or triggering an unhandled revert condition.",
    url: "https://dacian.me/28k-bounty-admin-brick-forced-revert",
    keywords: [/revert\(/i, /admin/i, /balance/i]
  },
  {
    protocol: "Warden Swap",
    bounty: "1k",
    severity: "Low",
    category: "Business logic / Invariant breakdown",
    pattern: "Protocol Warden Swap business logic flaw breaking state invariants or allowing unauthorized fund extraction (Low, bounty: 1k).",
    url: "https://github.com/TradMod/Security-Audits/blob/main/Bug%20Bounty/WardenSwapBugReport.md",
    keywords: [/require\(/i, /transfer|transferFrom/i, /balanceOf|balances/i, /total/i]
  },
  {
    protocol: "Hourglass (old) ",
    bounty: "Not Paid",
    severity: "Critical",
    category: "Business logic / Invariant breakdown",
    pattern: "Protocol Hourglass (old)  business logic flaw breaking state invariants or allowing unauthorized fund extraction (Critical, bounty: Not Paid).",
    url: "https://github.com/TradMod/Security-Audits/blob/main/Bug%20Bounty/HourglassBugReport.md",
    keywords: [/require\(/i, /transfer|transferFrom/i, /balanceOf|balances/i, /total/i]
  },
  {
    protocol: "Thena",
    bounty: "20K",
    severity: "High",
    category: "AMM invariant / Fee deduction",
    pattern: "Solidly-style AMM pair fee accounting discrepancy allowed draining pool reserves or stealing gauge incentives.",
    url: "https://zzykxx.com/2023/02/27/a-very-helpful-sign/",
    keywords: [/kLast/i, /reserve0|reserve1/i, /claim_rewards/i]
  },
  {
    protocol: "Angle",
    bounty: "Not Paid",
    severity: "Critical",
    category: "AgEUR settlement / Oracle divergence",
    pattern: "Discrepancy between oracle price feed and redemption pool exchange rate allowed riskless arbitrage against the protocol.",
    url: "https://medium.com/@deliriusz/stealing-in-motion-immunefi-bounty-hunting-from-different-angle-5eb03602f5c1",
    keywords: [/oracle/i, /redeem\(/i, /exchangeRate/i]
  },
  {
    protocol: "Tranchess",
    bounty: "44.8 ETH",
    severity: "Critical",
    category: "First-run / Share inflation",
    pattern: "Liquid staking deposit first-run flaw allowed attacker to manipulate initial exchange rate and dilute future depositors.",
    url: "https://www.kalos.xyz/blog/tranchess-liquid-staking-deposit-firstrun-vulnerability-analysis",
    keywords: [/deposit\(/i, /shares/i, /firstRun|initialize/i]
  },
  {
    protocol: "Hyperlane",
    bounty: "2.5k",
    severity: "Low",
    category: "Business logic / Invariant breakdown",
    pattern: "Protocol Hyperlane business logic flaw breaking state invariants or allowing unauthorized fund extraction (Low, bounty: 2.5k).",
    url: "https://github.com/0xRajkumar/audits/blob/main/Immunefi/README.md#wrong-use-of-assembly-builtin-function",
    keywords: [/require\(/i, /transfer|transferFrom/i, /balanceOf|balances/i, /total/i]
  },
  {
    protocol: "Ocean",
    bounty: "5k",
    severity: "Medium",
    category: "Business logic / Invariant breakdown",
    pattern: "Protocol Ocean business logic flaw breaking state invariants or allowing unauthorized fund extraction (Medium, bounty: 5k).",
    url: "https://mirror.xyz/chiefdestroyer.eth/Xd08Mseb33gbyo-9py9old7ejYz6sVxOsle6v-1RRmc",
    keywords: [/require\(/i, /transfer|transferFrom/i, /balanceOf|balances/i, /total/i]
  },
  {
    protocol: "Betverse",
    bounty: "1K",
    severity: "Critical",
    category: "Business logic / Invariant breakdown",
    pattern: "Protocol Betverse business logic flaw breaking state invariants or allowing unauthorized fund extraction (Critical, bounty: 1K).",
    url: "https://mirror.xyz/chiefdestroyer.eth/iB31aKROKdXZG1MiZjoOdbAq-jzEz_PgVrUKUnA_ILg",
    keywords: [/require\(/i, /transfer|transferFrom/i, /balanceOf|balances/i, /total/i]
  },
  {
    protocol: "Cronos",
    bounty: "40K",
    severity: "High",
    category: "Fee abstraction / Native token handling",
    pattern: "Transaction fee handling logic allowed refunding or stealing unspent transaction execution fees.",
    url: "https://medium.com/immunefi/cronos-theft-of-transactions-fees-bugfix-postmortem-b33f941b9570",
    keywords: [/fee/i, /msg\.value/i, /refund/i]
  },
  {
    protocol: "Port",
    bounty: "180K+450K",
    severity: "Critical",
    category: "Business logic / Invariant breakdown",
    pattern: "Protocol Port business logic flaw breaking state invariants or allowing unauthorized fund extraction (Critical, bounty: 180K+450K).",
    url: "https://medium.com/immunefi/port-finance-logic-error-bugfix-review-29767aced446",
    keywords: [/require\(/i, /transfer|transferFrom/i, /balanceOf|balances/i, /total/i]
  },
  {
    protocol: "88mph",
    bounty: "42K",
    severity: "Critical",
    category: "Uninitialized proxy",
    pattern: "Initializer function callable more than once / by anyone post-deploy, letting an attacker re-init privileged state.",
    url: "https://medium.com/immunefi/88mph-function-initialization-bug-fix-postmortem-c3a2282894d3",
    keywords: [/initialize\(/i, /Initializable/i]
  },
  {
    protocol: "Ondo",
    bounty: "25k",
    severity: "High",
    category: "Business logic / Invariant breakdown",
    pattern: "Protocol Ondo business logic flaw breaking state invariants or allowing unauthorized fund extraction (High, bounty: 25k).",
    url: "https://iosiro.com/blog/high-risk-vulnerability-disclosed-to-ondo-finance",
    keywords: [/require\(/i, /transfer|transferFrom/i, /balanceOf|balances/i, /total/i]
  },
  {
    protocol: "Alchemix",
    bounty: "7.5K",
    severity: "High",
    category: "Business logic / Invariant breakdown",
    pattern: "Protocol Alchemix business logic flaw breaking state invariants or allowing unauthorized fund extraction (High, bounty: 7.5K).",
    url: "https://medium.com/immunefi/alchemix-access-control-bug-fix-debrief-a13d39b9f2e0",
    keywords: [/require\(/i, /transfer|transferFrom/i, /balanceOf|balances/i, /total/i]
  },
  {
    protocol: "pxMythics",
    bounty: "-",
    severity: "Critical",
    category: "Business logic / Invariant breakdown",
    pattern: "Protocol pxMythics business logic flaw breaking state invariants or allowing unauthorized fund extraction (Critical, bounty: -).",
    url: "https://ashiq.co.za/tabs/research/#-critical-vulnerability-disclosed-to-pxmythics",
    keywords: [/require\(/i, /transfer|transferFrom/i, /balanceOf|balances/i, /total/i]
  },
  {
    protocol: "abwagmi",
    bounty: "-",
    severity: "Critical",
    category: "Business logic / Invariant breakdown",
    pattern: "Protocol abwagmi business logic flaw breaking state invariants or allowing unauthorized fund extraction (Critical, bounty: -).",
    url: "https://ashiq.co.za/tabs/research/#-critical-vulnerability-disclosed-to-abwagmi",
    keywords: [/require\(/i, /transfer|transferFrom/i, /balanceOf|balances/i, /total/i]
  },
  {
    protocol: "Polygon",
    bounty: "-",
    severity: "Critical",
    category: "Business logic / Invariant breakdown",
    pattern: "Protocol Polygon business logic flaw breaking state invariants or allowing unauthorized fund extraction (Critical, bounty: -).",
    url: "https://ashiq.co.za/tabs/research/#-critical-vulnerability-disclosed-to-polygon",
    keywords: [/require\(/i, /transfer|transferFrom/i, /balanceOf|balances/i, /total/i]
  },
  {
    protocol: "OpenZeppelin",
    bounty: "-",
    severity: "Critical",
    category: "Business logic / Invariant breakdown",
    pattern: "Protocol OpenZeppelin business logic flaw breaking state invariants or allowing unauthorized fund extraction (Critical, bounty: -).",
    url: "https://ashiq.co.za/tabs/research/#%EF%B8%8F-critical-vulnerability-disclosed-to-four-definft-projects-and-escalated-to-openzeppelin",
    keywords: [/require\(/i, /transfer|transferFrom/i, /balanceOf|balances/i, /total/i]
  },
  {
    protocol: "Charged Particles",
    bounty: "5K",
    severity: "High",
    category: "Business logic / Invariant breakdown",
    pattern: "Protocol Charged Particles business logic flaw breaking state invariants or allowing unauthorized fund extraction (High, bounty: 5K).",
    url: "https://medium.com/immunefi/charged-particles-griefing-bug-fix-postmortem-d2791e49a66b",
    keywords: [/require\(/i, /transfer|transferFrom/i, /balanceOf|balances/i, /total/i]
  },
  {
    protocol: "Mt Pelerin",
    bounty: "10K",
    severity: "Critical",
    category: "Business logic / Invariant breakdown",
    pattern: "Protocol Mt Pelerin business logic flaw breaking state invariants or allowing unauthorized fund extraction (Critical, bounty: 10K).",
    url: "https://medium.com/immunefi/mt-pelerin-double-transaction-bugfix-review-503838db3d70",
    keywords: [/require\(/i, /transfer|transferFrom/i, /balanceOf|balances/i, /total/i]
  },
  {
    protocol: "Synthetix",
    bounty: "150K",
    severity: "Critical",
    category: "Debt settlement logic error",
    pattern: "Debt/settlement logic error in a synth exchange path miscalculated issuance ratio.",
    url: "https://medium.com/immunefi/synthetix-logic-error-bugfix-review-40da0ead5f4f",
    keywords: [/debt/i, /exchange\(/i, /synth/i]
  },
  {
    protocol: "Redacted Cartel",
    bounty: "560k",
    severity: "Critical",
    category: "Custom approval logic error",
    pattern: "Custom approval verification logic allowed unauthorized token transfers without user signature.",
    url: "https://medium.com/immunefi/redacted-cartel-custom-approval-logic-bugfix-review-9b2d039ca2c5",
    keywords: [/approve/i, /permit/i, /transferFrom/i]
  },
  {
    protocol: "APWine",
    bounty: "100K",
    severity: "Critical",
    category: "Delegation check error",
    pattern: "Delegation/allowance check used the wrong account reference, letting an attacker act on behalf of another user.",
    url: "https://medium.com/immunefi/apwine-incorrect-check-of-delegations-bugfix-review-7e401a49c04f",
    keywords: [/delegate/i, /allowance\[/i]
  },
  {
    protocol: "Enzyme",
    bounty: "19K",
    severity: "Critical",
    category: "Oracle manipulation",
    pattern: "Price oracle read was manipulable within a single transaction, mispricing a fund position.",
    url: "https://medium.com/immunefi/enzyme-finance-price-oracle-manipulation-bug-fix-postmortem-4e1f3d4201b5",
    keywords: [/getPrice|latestRoundData|slot0/i, /oracle/i]
  },
  {
    protocol: "Notional",
    bounty: "1M+100k NOTE",
    severity: "Critical",
    category: "Double counting / Collateral inflation",
    pattern: "Free collateral was double-counted across two accounting paths, allowing over-borrowing.",
    url: "https://medium.com/immunefi/notional-double-counting-free-collateral-bugfix-review-28b634903934",
    keywords: [/freeCollateral|collateralRatio/i, /borrow\(/i]
  },
  {
    protocol: "Bitswift",
    bounty: "4.5K",
    severity: "Critical",
    category: "Infinite mint",
    pattern: "Unrestricted mint() reachable by a non-privileged caller.",
    url: "https://medium.com/immunefi/bitswift-unlimited-mint-bugfix-postmortem-147a1e57dca9",
    keywords: [/function\s+mint\(/i]
  },
  {
    protocol: "Polygon",
    bounty: "75K",
    severity: "High",
    category: "Business logic / Invariant breakdown",
    pattern: "Protocol Polygon business logic flaw breaking state invariants or allowing unauthorized fund extraction (High, bounty: 75K).",
    url: "https://medium.com/immunefi/polygon-consensus-bypass-bugfix-review-7076ce5047fe",
    keywords: [/require\(/i, /transfer|transferFrom/i, /balanceOf|balances/i, /total/i]
  },
  {
    protocol: "dHEDGE",
    bounty: "500",
    severity: "Critical",
    category: "Business logic / Invariant breakdown",
    pattern: "Protocol dHEDGE business logic flaw breaking state invariants or allowing unauthorized fund extraction (Critical, bounty: 500).",
    url: "https://mirror.xyz/0x6746Cae57DA75D77137f7749582f511B4d9f866c/fU6YVrXulTL5z5qMraVTDJmnUiPP8NH17XGzDJLvq1k",
    keywords: [/require\(/i, /transfer|transferFrom/i, /balanceOf|balances/i, /total/i]
  },
  {
    protocol: "Multichain (Previously Anyswap)",
    bounty: "-",
    severity: "Critical",
    category: "Business logic / Invariant breakdown",
    pattern: "Protocol Multichain (Previously Anyswap) business logic flaw breaking state invariants or allowing unauthorized fund extraction (Critical, bounty: -).",
    url: "https://medium.com/@gr_gred/how-i-found-2-bugs-after-2-audits-on-smart-contracts-with-20-mil-3a23209b463d",
    keywords: [/require\(/i, /transfer|transferFrom/i, /balanceOf|balances/i, /total/i]
  },
  {
    protocol: "Mushrooms",
    bounty: "60K",
    severity: "Critical",
    category: "Business logic / Invariant breakdown",
    pattern: "Protocol Mushrooms business logic flaw breaking state invariants or allowing unauthorized fund extraction (Critical, bounty: 60K).",
    url: "https://medium.com/immunefi/mushrooms-finance-logic-error-bug-fix-postmortem-780122821621",
    keywords: [/require\(/i, /transfer|transferFrom/i, /balanceOf|balances/i, /total/i]
  },
  {
    protocol: "Zapper",
    bounty: "25K",
    severity: "Critical",
    category: "Arbitrary call",
    pattern: "User-supplied calldata was forwarded to an arbitrary external target without validation, draining approvals.",
    url: "https://medium.com/immunefi/zapper-arbitrary-call-data-bug-fix-postmortem-d75a4a076ae9",
    keywords: [/\.call\(/i, /calldata\s+target/i]
  },
  {
    protocol: "Tidal",
    bounty: "25K",
    severity: "Critical",
    category: "Business logic / Invariant breakdown",
    pattern: "Protocol Tidal business logic flaw breaking state invariants or allowing unauthorized fund extraction (Critical, bounty: 25K).",
    url: "https://medium.com/immunefi/tidal-finance-logic-error-bug-fix-postmortem-3607d8b7ed1f",
    keywords: [/require\(/i, /transfer|transferFrom/i, /balanceOf|balances/i, /total/i]
  },
  {
    protocol: "xDai",
    bounty: "5K",
    severity: "Medium",
    category: "Business logic / Invariant breakdown",
    pattern: "Protocol xDai business logic flaw breaking state invariants or allowing unauthorized fund extraction (Medium, bounty: 5K).",
    url: "https://medium.com/immunefi/xdai-stake-arbitrary-call-method-bug-postmortem-f80a90ac56e3",
    keywords: [/require\(/i, /transfer|transferFrom/i, /balanceOf|balances/i, /total/i]
  },
  {
    protocol: "IPOR",
    bounty: "1k",
    severity: "Low",
    category: "Business logic / Invariant breakdown",
    pattern: "Protocol IPOR business logic flaw breaking state invariants or allowing unauthorized fund extraction (Low, bounty: 1k).",
    url: "https://twitter.com/HollaWaldfee100/status/1656992468867465222",
    keywords: [/require\(/i, /transfer|transferFrom/i, /balanceOf|balances/i, /total/i]
  },
  {
    protocol: "Enzyme",
    bounty: "400K",
    severity: "Critical",
    category: "Missing privilege check",
    pattern: "A sensitive external-facing function was missing the privilege check present on its sibling function.",
    url: "https://medium.com/immunefi/enzyme-finance-missing-privilege-check-bugfix-review-ddb5e87b8058",
    keywords: [/function\s+\w+\([^)]*\)\s+external/i, /onlyOwner/i]
  },
  {
    protocol: "Polygon zkEVM",
    bounty: "-",
    severity: "Medium",
    category: "Business logic / Invariant breakdown",
    pattern: "Protocol Polygon zkEVM business logic flaw breaking state invariants or allowing unauthorized fund extraction (Medium, bounty: -).",
    url: "https://twitter.com/0xiczc/status/1662090451493740545",
    keywords: [/require\(/i, /transfer|transferFrom/i, /balanceOf|balances/i, /total/i]
  },
  {
    protocol: "Lybra Finance",
    bounty: "800+800",
    severity: "-",
    category: "Business logic / Invariant breakdown",
    pattern: "Protocol Lybra Finance business logic flaw breaking state invariants or allowing unauthorized fund extraction (-, bounty: 800+800).",
    url: "https://medium.com/@smaul_1/enhancing-protocol-integrity-addressing-bugs-in-the-lybra-finance-contract-21c1e4b68387",
    keywords: [/require\(/i, /transfer|transferFrom/i, /balanceOf|balances/i, /total/i]
  },
  {
    protocol: "Spartan",
    bounty: "-",
    severity: "Critical",
    category: "Business logic / Invariant breakdown",
    pattern: "Protocol Spartan business logic flaw breaking state invariants or allowing unauthorized fund extraction (Critical, bounty: -).",
    url: "https://github.com/gogotheauditor/audits/blob/main/reports/Spartan-Immunefi-Bug-Bounty.md",
    keywords: [/require\(/i, /transfer|transferFrom/i, /balanceOf|balances/i, /total/i]
  },
  {
    protocol: "DFX Finance",
    bounty: "100k",
    severity: "Critical",
    category: "Rounding error",
    pattern: "Rounding direction in a curve/swap formula favored the attacker instead of the protocol.",
    url: "https://medium.com/immunefi/dfx-finance-rounding-error-bugfix-review-17ba5ffb4114",
    keywords: [/\/\s*1e\d+/i, /mulDiv|wadDiv|wadMul/i]
  },
  {
    protocol: "Perennial",
    bounty: "-",
    severity: "-",
    category: "Business logic / Invariant breakdown",
    pattern: "Protocol Perennial business logic flaw breaking state invariants or allowing unauthorized fund extraction (-, bounty: -).",
    url: "https://mirror.xyz/0x9D6b7f5e8d1b9dFea8dDD29c0DbD81687e721601/mm_D_HrqfntAkGM1DvVQvy1WuPbj99pKYfRp-xDbs8U",
    keywords: [/require\(/i, /transfer|transferFrom/i, /balanceOf|balances/i, /total/i]
  },
  {
    protocol: "Silo",
    bounty: "100k",
    severity: "Critical",
    category: "Business logic / Invariant breakdown",
    pattern: "Protocol Silo business logic flaw breaking state invariants or allowing unauthorized fund extraction (Critical, bounty: 100k).",
    url: "https://twitter.com/kankodu/status/1669833829203476480",
    keywords: [/require\(/i, /transfer|transferFrom/i, /balanceOf|balances/i, /total/i]
  },
  {
    protocol: "Q Blockchain",
    bounty: "50K",
    severity: "Critical",
    category: "Business logic / Invariant breakdown",
    pattern: "Protocol Q Blockchain business logic flaw breaking state invariants or allowing unauthorized fund extraction (Critical, bounty: 50K).",
    url: "https://medium.com/@blockian/striking-gold-at-30-000-feet-uncovering-a-critical-vulnerability-in-q-blockchain-for-50-000-ab335042147b",
    keywords: [/require\(/i, /transfer|transferFrom/i, /balanceOf|balances/i, /total/i]
  },
  {
    protocol: "Astroport",
    bounty: "-",
    severity: "-",
    category: "Business logic / Invariant breakdown",
    pattern: "Protocol Astroport business logic flaw breaking state invariants or allowing unauthorized fund extraction (-, bounty: -).",
    url: "https://defihacklabs.substack.com/p/chainlight-patch-thursday-astroports?utm_source=profile&utm_medium=reader2",
    keywords: [/require\(/i, /transfer|transferFrom/i, /balanceOf|balances/i, /total/i]
  },
  {
    protocol: "BendDAO",
    bounty: "50K",
    severity: "Critical",
    category: "Business logic / Invariant breakdown",
    pattern: "Protocol BendDAO business logic flaw breaking state invariants or allowing unauthorized fund extraction (Critical, bounty: 50K).",
    url: "https://medium.com/@BendDAO/sewer-pass-flash-claim-vulnerability-9d2b0b1e09ef",
    keywords: [/require\(/i, /transfer|transferFrom/i, /balanceOf|balances/i, /total/i]
  },
  {
    protocol: "OpenZeppelin",
    bounty: "-",
    severity: "Medium",
    category: "Business logic / Invariant breakdown",
    pattern: "Protocol OpenZeppelin business logic flaw breaking state invariants or allowing unauthorized fund extraction (Medium, bounty: -).",
    url: "https://twitter.com/0xDACA/status/1669846430528286722",
    keywords: [/require\(/i, /transfer|transferFrom/i, /balanceOf|balances/i, /total/i]
  },
  {
    protocol: "Eco",
    bounty: "-",
    severity: "Critical",
    category: "Business logic / Invariant breakdown",
    pattern: "Protocol Eco business logic flaw breaking state invariants or allowing unauthorized fund extraction (Critical, bounty: -).",
    url: "https://mirror.xyz/0x333247F2e126954ed6428e9135Ae9dE06A76BA32/Hhs0AGFqqemCljNa49AnYVUTrLPCvdyPtd23k4iwQ_M",
    keywords: [/require\(/i, /transfer|transferFrom/i, /balanceOf|balances/i, /total/i]
  },
  {
    protocol: "Bifrost Finance",
    bounty: "-",
    severity: "-",
    category: "Business logic / Invariant breakdown",
    pattern: "Protocol Bifrost Finance business logic flaw breaking state invariants or allowing unauthorized fund extraction (-, bounty: -).",
    url: "https://medium.com/@thiagoweb3/arrays-as-input-in-smart-contracts-things-you-should-know-b1eed7a2d17d",
    keywords: [/require\(/i, /transfer|transferFrom/i, /balanceOf|balances/i, /total/i]
  },
  {
    protocol: "-",
    bounty: "2k",
    severity: "-",
    category: "Business logic / Invariant breakdown",
    pattern: "Protocol - business logic flaw breaking state invariants or allowing unauthorized fund extraction (-, bounty: 2k).",
    url: "https://medium.com/@sudout92/exploiting-signature-verification-vulnerabilities-in-smart-contracts-f4eb64cd3b23",
    keywords: [/require\(/i, /transfer|transferFrom/i, /balanceOf|balances/i, /total/i]
  },
  {
    protocol: "-",
    bounty: "Not Paid(dup)",
    severity: "Critical",
    category: "Cross-chain / Bridge messaging vulnerability",
    pattern: "Protocol - bridge endpoint failed to enforce strict replay, sender, or payload validity checks.",
    url: "https://medium.com/@Heuss/critical-nft-bridge-vulnerability-potential-theft-of-deposited-nfts-f5b26a7776eb",
    keywords: [/bridge/i, /relay/i, /crossChain/i, /nonce/i]
  },
  {
    protocol: "Yield Protocol",
    bounty: "95K",
    severity: "Critical",
    category: "Business logic / Invariant breakdown",
    pattern: "Protocol Yield Protocol business logic flaw breaking state invariants or allowing unauthorized fund extraction (Critical, bounty: 95K).",
    url: "https://medium.com/immunefi/yield-protocol-logic-error-bugfix-review-7b86741e6f50",
    keywords: [/require\(/i, /transfer|transferFrom/i, /balanceOf|balances/i, /total/i]
  },
  {
    protocol: "O3 Swap",
    bounty: "500",
    severity: "Critical",
    category: "Reentrancy",
    pattern: "ERC-777 hook re-entered an unprotected swap function before settlement finalized.",
    url: "https://medium.com/@Heuss/unprotected-swap-function-a-erc777-reentrancy-vulnerability-81aaeaa75a2a",
    keywords: [/tokensReceived|_beforeTokenTransfer/i, /swap\(/i]
  },
  {
    protocol: "-",
    bounty: "20K",
    severity: "High",
    category: "Business logic / Invariant breakdown",
    pattern: "Protocol - business logic flaw breaking state invariants or allowing unauthorized fund extraction (High, bounty: 20K).",
    url: "https://mirror.xyz/0xa270bb1241FF428927406e5Fde47e7EA8592aFb1/cf1QndLvVDnaSU38EtyFppYKMgF5ZDi0E6Olcsh-GSI",
    keywords: [/require\(/i, /transfer|transferFrom/i, /balanceOf|balances/i, /total/i]
  },
  {
    protocol: "DFX Finance",
    bounty: "10k",
    severity: "2 x Medium",
    category: "Business logic / Invariant breakdown",
    pattern: "Protocol DFX Finance business logic flaw breaking state invariants or allowing unauthorized fund extraction (2 x Medium, bounty: 10k).",
    url: "https://www.beirao.xyz/blog/BB1-DFX",
    keywords: [/require\(/i, /transfer|transferFrom/i, /balanceOf|balances/i, /total/i]
  },
  {
    protocol: "Beluga Protocol",
    bounty: "-",
    severity: "Critical",
    category: "Business logic / Invariant breakdown",
    pattern: "Protocol Beluga Protocol business logic flaw breaking state invariants or allowing unauthorized fund extraction (Critical, bounty: -).",
    url: "https://github.com/MiloTruck/audits/blob/main/immunefi/beluga-C-01.md",
    keywords: [/require\(/i, /transfer|transferFrom/i, /balanceOf|balances/i, /total/i]
  },
  {
    protocol: "GYSR",
    bounty: "-",
    severity: "Informational",
    category: "Business logic / Invariant breakdown",
    pattern: "Protocol GYSR business logic flaw breaking state invariants or allowing unauthorized fund extraction (Informational, bounty: -).",
    url: "https://github.com/MiloTruck/audits/blob/main/immunefi/gysr-I-01.md",
    keywords: [/require\(/i, /transfer|transferFrom/i, /balanceOf|balances/i, /total/i]
  },
  {
    protocol: "Optimism",
    bounty: "20K",
    severity: "Critical",
    category: "Business logic / Invariant breakdown",
    pattern: "Protocol Optimism business logic flaw breaking state invariants or allowing unauthorized fund extraction (Critical, bounty: 20K).",
    url: "https://www.iosiro.com/blog/optimism-censorship-bug-disclosure",
    keywords: [/require\(/i, /transfer|transferFrom/i, /balanceOf|balances/i, /total/i]
  },
  {
    protocol: "Threshold Network",
    bounty: "-",
    severity: "Critical",
    category: "Business logic / Invariant breakdown",
    pattern: "Protocol Threshold Network business logic flaw breaking state invariants or allowing unauthorized fund extraction (Critical, bounty: -).",
    url: "https://blog.threshold.network/retro-l2-wormholegateway-crit/",
    keywords: [/require\(/i, /transfer|transferFrom/i, /balanceOf|balances/i, /total/i]
  },
  {
    protocol: "Balancer",
    bounty: "1M",
    severity: "Critical",
    category: "Rounding error / Precision loss",
    pattern: "Rounding error in pool math allowed systematic value extraction over repeated swaps.",
    url: "https://medium.com/immunefi/balancer-rounding-error-bugfix-review-cbf69482ee3d",
    keywords: [/mulDiv|wadDiv|wadMul/i, /pool/i, /swap/i]
  },
  {
    protocol: "RAI",
    bounty: "-",
    severity: "-",
    category: "Business logic / Invariant breakdown",
    pattern: "Protocol RAI business logic flaw breaking state invariants or allowing unauthorized fund extraction (-, bounty: -).",
    url: "https://mirror.xyz/vnmrtz.eth/WXm4QJFInoB992czPniFbQyAkGUkdoaSd5zEjK5uRIo",
    keywords: [/require\(/i, /transfer|transferFrom/i, /balanceOf|balances/i, /total/i]
  },
  {
    protocol: "Lybra Finance",
    bounty: "5k",
    severity: "Critical",
    category: "Business logic / Invariant breakdown",
    pattern: "Protocol Lybra Finance business logic flaw breaking state invariants or allowing unauthorized fund extraction (Critical, bounty: 5k).",
    url: "https://twitter.com/Guhu95/status/1722533559943287251",
    keywords: [/require\(/i, /transfer|transferFrom/i, /balanceOf|balances/i, /total/i]
  },
  {
    protocol: "Perpetual Protocol",
    bounty: "30k",
    severity: "Critical",
    category: "Liquidation / Debt accounting error",
    pattern: "Protocol Perpetual Protocol debt settlement or liquidation calculation vulnerability enabling bad debt or asset theft.",
    url: "https://securitybandit.com/2023/02/07/bad-debt-attack-for-perpetual-protocol/",
    keywords: [/liquidat/i, /debt/i, /collateral/i, /healthFactor/i]
  },
  {
    protocol: "Ocean Protocol",
    bounty: "-",
    severity: "None",
    category: "Business logic / Invariant breakdown",
    pattern: "Protocol Ocean Protocol business logic flaw breaking state invariants or allowing unauthorized fund extraction (None, bounty: -).",
    url: "https://mirror.xyz/0x333247F2e126954ed6428e9135Ae9dE06A76BA32/GgAUn8pLDqMdM4s0FWZTd5XPHJWrRmLBqbLFxbPOdbo",
    keywords: [/require\(/i, /transfer|transferFrom/i, /balanceOf|balances/i, /total/i]
  },
  {
    protocol: "Ocean Protocol",
    bounty: "-",
    severity: "Critical",
    category: "Business logic / Invariant breakdown",
    pattern: "Protocol Ocean Protocol business logic flaw breaking state invariants or allowing unauthorized fund extraction (Critical, bounty: -).",
    url: "https://mirror.xyz/0x333247F2e126954ed6428e9135Ae9dE06A76BA32/pZBMxr2Kd2YYUO9lpgN8Xf0Lc_HM7q5G5iIwa7GrUhM",
    keywords: [/require\(/i, /transfer|transferFrom/i, /balanceOf|balances/i, /total/i]
  },
  {
    protocol: "Talent Protocol",
    bounty: "-",
    severity: "Critical",
    category: "Business logic / Invariant breakdown",
    pattern: "Protocol Talent Protocol business logic flaw breaking state invariants or allowing unauthorized fund extraction (Critical, bounty: -).",
    url: "https://mirror.xyz/0xCf39521413F8De389771e35bB4C77b4bb827b7B3/HdSq7TVvk-s7DzQgN3u0pV8UFiVkaDft18HgmePTag4",
    keywords: [/require\(/i, /transfer|transferFrom/i, /balanceOf|balances/i, /total/i]
  },
  {
    protocol: "zkSync Era",
    bounty: "50K",
    severity: "Critical",
    category: "Business logic / Invariant breakdown",
    pattern: "Protocol zkSync Era business logic flaw breaking state invariants or allowing unauthorized fund extraction (Critical, bounty: 50K).",
    url: "https://medium.com/chainlight/uncovering-a-zk-evm-soundness-bug-in-zksync-era-f3bc1b2a66d8",
    keywords: [/require\(/i, /transfer|transferFrom/i, /balanceOf|balances/i, /total/i]
  },
  {
    protocol: "Tranchess",
    bounty: "200K",
    severity: "Critical",
    category: "First-run / Share inflation",
    pattern: "Liquid staking deposit first-run flaw allowed attacker to manipulate initial exchange rate and dilute future depositors.",
    url: "https://github.com/floranguyen0/tranchess-vulnerability-disclosure",
    keywords: [/deposit\(/i, /shares/i, /firstRun|initialize/i]
  },
  {
    protocol: "Retro+Thena+`unknown protocol` ",
    bounty: "-",
    severity: "High",
    category: "AMM invariant / Fee deduction",
    pattern: "Solidly-style AMM pair fee accounting discrepancy allowed draining pool reserves or stealing gauge incentives.",
    url: "https://github.com/deadrosesxyz/BugWriteups/blob/main/RetroThenaX.md",
    keywords: [/kLast/i, /reserve0|reserve1/i, /claim_rewards/i]
  },
  {
    protocol: "Astar",
    bounty: "50K",
    severity: "Critical",
    category: "Business logic / Invariant breakdown",
    pattern: "Protocol Astar business logic flaw breaking state invariants or allowing unauthorized fund extraction (Critical, bounty: 50K).",
    url: "https://www.zellic.io/blog/finding-a-critical-vulnerability-in-astar/",
    keywords: [/require\(/i, /transfer|transferFrom/i, /balanceOf|balances/i, /total/i]
  },
  {
    protocol: "Cronos Gravity Bridge",
    bounty: "-",
    severity: "2 x Medium",
    category: "Cross-chain / Bridge messaging vulnerability",
    pattern: "Protocol Cronos Gravity Bridge bridge endpoint failed to enforce strict replay, sender, or payload validity checks.",
    url: "https://faith2dxy.xyz/2023-12-12/cronos-gravity-bridge-bugs/",
    keywords: [/bridge/i, /relay/i, /crossChain/i, /nonce/i]
  },
  {
    protocol: "Nomad",
    bounty: "-",
    severity: "Low",
    category: "Business logic / Invariant breakdown",
    pattern: "Protocol Nomad business logic flaw breaking state invariants or allowing unauthorized fund extraction (Low, bounty: -).",
    url: "https://nikitastupin.com/blog/2023/04/15/not-is-not-iszero.html",
    keywords: [/require\(/i, /transfer|transferFrom/i, /balanceOf|balances/i, /total/i]
  },
  {
    protocol: "Beanstalk",
    bounty: "1.1M",
    severity: "Critical",
    category: "Insufficient input validation",
    pattern: "Missing validation on a user-supplied array/index let an attacker reference unintended state or hijack accounting.",
    url: "https://medium.com/immunefi/beanstalk-insufficient-input-validation-bugfix-review-fc3fdbaab15b",
    keywords: [/\[\s*msg\.sender\s*\]/i, /calldata\s*\[/i, /uint256\[\]\s+calldata/i]
  },
  {
    protocol: "100+ projects",
    bounty: "50k(total)",
    severity: "Medium",
    category: "Business logic / Invariant breakdown",
    pattern: "Protocol 100+ projects business logic flaw breaking state invariants or allowing unauthorized fund extraction (Medium, bounty: 50k(total)).",
    url: "https://www.trust-security.xyz/post/permission-denied",
    keywords: [/require\(/i, /transfer|transferFrom/i, /balanceOf|balances/i, /total/i]
  },
  {
    protocol: "Oasys",
    bounty: "200k",
    severity: "Critical",
    category: "Business logic / Invariant breakdown",
    pattern: "Protocol Oasys business logic flaw breaking state invariants or allowing unauthorized fund extraction (Critical, bounty: 200k).",
    url: "https://mirror.xyz/0x333247F2e126954ed6428e9135Ae9dE06A76BA32/a6HqOCOjJ10Bosyi0cGz6Lxff8t68Uo4YvFsVg2tHaw",
    keywords: [/require\(/i, /transfer|transferFrom/i, /balanceOf|balances/i, /total/i]
  },
  {
    protocol: "15+ projects",
    bounty: "-",
    severity: "High/Medium",
    category: "Business logic / Invariant breakdown",
    pattern: "Protocol 15+ projects business logic flaw breaking state invariants or allowing unauthorized fund extraction (High/Medium, bounty: -).",
    url: "https://mirror.xyz/curiousapple.eth/pFqAdW2LiJ-6S4sg_u1z08k4vK6BCJ33LcyXpnNb8yU",
    keywords: [/require\(/i, /transfer|transferFrom/i, /balanceOf|balances/i, /total/i]
  },
  {
    protocol: "zkSync Lite",
    bounty: "200k",
    severity: "Critical",
    category: "Insufficient ZK proof verification",
    pattern: "A ZK proof/verification path accepted an insufficiently validated proof.",
    url: "https://medium.com/immunefi/zksync-insufficient-proof-verification-bugfix-review-dcd57944d0e2",
    keywords: [/verifyProof|verify\(/i]
  },
  {
    protocol: "Polygon PoS",
    bounty: "-",
    severity: "Critical",
    category: "Business logic / Invariant breakdown",
    pattern: "Protocol Polygon PoS business logic flaw breaking state invariants or allowing unauthorized fund extraction (Critical, bounty: -).",
    url: "https://www.asymmetric.re/blog/polygon-log-confusion",
    keywords: [/require\(/i, /transfer|transferFrom/i, /balanceOf|balances/i, /total/i]
  },
  {
    protocol: "Stacks",
    bounty: "~76K",
    severity: "Critical",
    category: "Denial of service",
    pattern: "Unbounded loop / unchecked failure path allowed a single attacker to lock a shared resource for everyone.",
    url: "https://medium.com/immunefi/stacks-dos-bugfix-review-dc0f2a75b276",
    keywords: [/for\s*\(/i, /while\s*\(/i]
  },
  {
    protocol: "Stargate",
    bounty: "Not Paid",
    severity: "2 x High",
    category: "Cross-chain trust assumption",
    pattern: "Cross-chain messaging trusted an unvalidated relayer/oracle combination, breaking the intended trust model.",
    url: "https://www.trust-security.xyz/post/learning-by-breaking-a-layerzero-case-study-part-2",
    keywords: [/lzReceive|relayer|ultraLightNode/i]
  },
  {
    protocol: "LayerZero",
    bounty: "5K",
    severity: "Low",
    category: "Cross-chain trust assumption",
    pattern: "Cross-chain messaging trusted an unvalidated relayer/oracle combination, breaking the intended trust model.",
    url: "https://www.trust-security.xyz/post/learning-by-breaking-a-layerzero-case-study-part-3",
    keywords: [/lzReceive|relayer|ultraLightNode/i]
  },
  {
    protocol: "Deri",
    bounty: "-",
    severity: "Critical",
    category: "Business logic / Invariant breakdown",
    pattern: "Protocol Deri business logic flaw breaking state invariants or allowing unauthorized fund extraction (Critical, bounty: -).",
    url: "https://mirror.xyz/0x2719F6Dfb85086F87319079cC2f7EeFD0e40994D/HVfC1Q3ZnOhMpMir1dDMW_e0aXDkcOKsUf30dNbAumA",
    keywords: [/require\(/i, /transfer|transferFrom/i, /balanceOf|balances/i, /total/i]
  },
  {
    protocol: "Polygon zkEVM",
    bounty: "-",
    severity: "Critical",
    category: "Business logic / Invariant breakdown",
    pattern: "Protocol Polygon zkEVM business logic flaw breaking state invariants or allowing unauthorized fund extraction (Critical, bounty: -).",
    url: "https://blog.verichains.io/p/discovering-and-fixing-a-critical",
    keywords: [/require\(/i, /transfer|transferFrom/i, /balanceOf|balances/i, /total/i]
  },
  {
    protocol: "Cronos",
    bounty: "1.6K",
    severity: "Critical",
    category: "Business logic / Invariant breakdown",
    pattern: "Protocol Cronos business logic flaw breaking state invariants or allowing unauthorized fund extraction (Critical, bounty: 1.6K).",
    url: "https://gist.github.com/fatherGoose1/690fa2d8245488b6750b67a0fdeb34bc",
    keywords: [/require\(/i, /transfer|transferFrom/i, /balanceOf|balances/i, /total/i]
  },
  {
    protocol: "The Graph",
    bounty: "290,497",
    severity: "High + Critical",
    category: "Precision loss / Rounding exploitation",
    pattern: "Protocol The Graph math formula truncated to zero or rounded in favor of the caller, siphoning protocol funds.",
    url: "https://medium.com/immunefi/the-graph-rounding-error-bugfix-review-c946ff470f65",
    keywords: [/mulDiv/i, /\/\s*1e\d+/i, /wad/i, /ray/i]
  },
  {
    protocol: "Sei Network",
    bounty: "2M+75k",
    severity: "2 x Critical",
    category: "Business logic / Invariant breakdown",
    pattern: "Protocol Sei Network business logic flaw breaking state invariants or allowing unauthorized fund extraction (2 x Critical, bounty: 2M+75k).",
    url: "https://usmannkhan.com/bug%20reports/2024/06/17/sei-bug-report.html",
    keywords: [/require\(/i, /transfer|transferFrom/i, /balanceOf|balances/i, /total/i]
  },
  {
    protocol: "Sovryn",
    bounty: "15k",
    severity: "Medium",
    category: "Business logic / Invariant breakdown",
    pattern: "Protocol Sovryn business logic flaw breaking state invariants or allowing unauthorized fund extraction (Medium, bounty: 15k).",
    url: "https://x.com/gandu_whitehat/status/1803794103248806223",
    keywords: [/require\(/i, /transfer|transferFrom/i, /balanceOf|balances/i, /total/i]
  },
  {
    protocol: "Raydium",
    bounty: "505k",
    severity: "Critical",
    category: "Tick / price manipulation",
    pattern: "Concentrated-liquidity tick math could be manipulated to misprice a position.",
    url: "https://medium.com/immunefi/raydium-tick-manipulation-bugfix-review-c6aae4527ed6",
    keywords: [/tick/i, /sqrtPrice/i]
  },
  {
    protocol: "Sei Network",
    bounty: "75k",
    severity: "Critical",
    category: "Business logic / Invariant breakdown",
    pattern: "Protocol Sei Network business logic flaw breaking state invariants or allowing unauthorized fund extraction (Critical, bounty: 75k).",
    url: "https://exvul.com/share-the-details-sei-protocol-vulnerability-worth-75k/",
    keywords: [/require\(/i, /transfer|transferFrom/i, /balanceOf|balances/i, /total/i]
  },
  {
    protocol: "-",
    bounty: "-",
    severity: "Misc.",
    category: "Business logic / Invariant breakdown",
    pattern: "Protocol - business logic flaw breaking state invariants or allowing unauthorized fund extraction (Misc., bounty: -).",
    url: "https://github.com/devNamedKiki/Audits?tab=readme-ov-file#bug-bounties",
    keywords: [/require\(/i, /transfer|transferFrom/i, /balanceOf|balances/i, /total/i]
  },
  {
    protocol: "Evmos",
    bounty: "150k",
    severity: "Critical",
    category: "Business logic / Invariant breakdown",
    pattern: "Protocol Evmos business logic flaw breaking state invariants or allowing unauthorized fund extraction (Critical, bounty: 150k).",
    url: "https://medium.com/@jjordanjjordan/150-000-evmos-vulnerability-through-reading-documentation-d26328590a7a",
    keywords: [/require\(/i, /transfer|transferFrom/i, /balanceOf|balances/i, /total/i]
  },
  {
    protocol: "Wormhole",
    bounty: "50k",
    severity: "High",
    category: "Business logic / Invariant breakdown",
    pattern: "Protocol Wormhole business logic flaw breaking state invariants or allowing unauthorized fund extraction (High, bounty: 50k).",
    url: "https://x.com/marcotnunes/status/1889707212450234629",
    keywords: [/require\(/i, /transfer|transferFrom/i, /balanceOf|balances/i, /total/i]
  },
  {
    protocol: "Balancer V2",
    bounty: "250k",
    severity: "Critical",
    category: "Business logic / Invariant breakdown",
    pattern: "Protocol Balancer V2 business logic flaw breaking state invariants or allowing unauthorized fund extraction (Critical, bounty: 250k).",
    url: "https://mirror.xyz/0x38F1416B9Ed3a5DA9C12c56cb4F74D9564844728/iv9_q74rSlK7gbvbJAECuDIbzfUtrSCO6mSWIHPskKI",
    keywords: [/require\(/i, /transfer|transferFrom/i, /balanceOf|balances/i, /total/i]
  },
  {
    protocol: "Axelar Network",
    bounty: "50k",
    severity: "Critical",
    category: "Cross-chain / Bridge messaging vulnerability",
    pattern: "Protocol Axelar Network bridge endpoint failed to enforce strict replay, sender, or payload validity checks.",
    url: "https://marcotnunes.com/axelar-network-cross-chain-halt-vulnerability/",
    keywords: [/bridge/i, /relay/i, /crossChain/i, /nonce/i]
  },
  {
    protocol: "Vesu",
    bounty: "-",
    severity: "High",
    category: "Business logic / Invariant breakdown",
    pattern: "Protocol Vesu business logic flaw breaking state invariants or allowing unauthorized fund extraction (High, bounty: -).",
    url: "https://x.com/kankodu/status/1904821401510699389",
    keywords: [/require\(/i, /transfer|transferFrom/i, /balanceOf|balances/i, /total/i]
  },
  {
    protocol: "Acala",
    bounty: "70k",
    severity: "Critical",
    category: "Denial of service / Resource exhaustion",
    pattern: "Protocol Acala shared queue or critical function subject to DoS via gas exhaustion, revert injection, or lock.",
    url: "https://immunefi.com/blog/all/acala-block-production-shutdown-bug-fix-review/",
    keywords: [/for\s*\(/i, /revert\(/i, /require\(/i]
  },
  {
    protocol: "Scroll",
    bounty: "1k",
    severity: "Critical",
    category: "Business logic / Invariant breakdown",
    pattern: "Protocol Scroll business logic flaw breaking state invariants or allowing unauthorized fund extraction (Critical, bounty: 1k).",
    url: "https://x.com/shabarkin/status/1917483039195816213",
    keywords: [/require\(/i, /transfer|transferFrom/i, /balanceOf|balances/i, /total/i]
  },
  {
    protocol: "Scroll",
    bounty: "1M",
    severity: "Critical",
    category: "Cross-chain message spoofing",
    pattern: "Cross-chain bridge message verification gap allowed a spoofed message to be accepted as legitimate.",
    url: "https://forum.scroll.io/t/report-scroll-mainnet-emergency-upgrade-on-2025-04-25/666#p-1404-issue-2-message-spoofing-in-the-bridge-4",
    keywords: [/bridge/i, /relayMessage|xDomainMessage/i]
  },
  {
    protocol: "Vesu",
    bounty: "-",
    severity: "Critical",
    category: "Rounding convention error",
    pattern: "Rounding direction convention discrepancy in debt shares vs collateral assets favored borrower over protocol.",
    url: "https://docs.vesu.xyz/security/disclosures-report/rounding-convention-bug-disclosure",
    keywords: [/roundUp|roundDown/i, /shares|assets/i, /mulDiv/i]
  },
  {
    protocol: "Across V3",
    bounty: "-",
    severity: "High",
    category: "Business logic / Invariant breakdown",
    pattern: "Protocol Across V3 business logic flaw breaking state invariants or allowing unauthorized fund extraction (High, bounty: -).",
    url: "https://mirror.xyz/0x9D6b7f5e8d1b9dFea8dDD29c0DbD81687e721601/mrt70ckjaZymv9keUy_TzHVIzjBOQr-Hx_KI1ydFeoQ",
    keywords: [/require\(/i, /transfer|transferFrom/i, /balanceOf|balances/i, /total/i]
  },
  {
    protocol: "VeChainThor",
    bounty: "50k",
    severity: "Critical",
    category: "Business logic / Invariant breakdown",
    pattern: "Protocol VeChainThor business logic flaw breaking state invariants or allowing unauthorized fund extraction (Critical, bounty: 50k).",
    url: "https://immunefi.com/blog/all/vechainthor-vtho-accrual-bypass-bug-fix-review/",
    keywords: [/require\(/i, /transfer|transferFrom/i, /balanceOf|balances/i, /total/i]
  },
  {
    protocol: "Fraxlend",
    bounty: "-",
    severity: "High",
    category: "Business logic / Invariant breakdown",
    pattern: "Protocol Fraxlend business logic flaw breaking state invariants or allowing unauthorized fund extraction (High, bounty: -).",
    url: "https://mirror.xyz/0x22ce3c4ce1EC532437209efA79d05CD294651ec3/M6vD6XshTuZc53DFm0chQwYD15fxQ29G1mbxNi9ZLwU",
    keywords: [/require\(/i, /transfer|transferFrom/i, /balanceOf|balances/i, /total/i]
  },
  {
    protocol: "Story",
    bounty: "100k",
    severity: "Critical",
    category: "Consensus / EVM state transition",
    pattern: "State transition consensus logic divergence between execution clients allowed chain halt.",
    url: "https://www.story.foundation/blog/story-network-postmortem",
    keywords: [/state/i, /transition/i, /consensus/i]
  },
  {
    protocol: "Story",
    bounty: "-",
    severity: "Critical",
    category: "Consensus / EVM state transition",
    pattern: "State transition consensus logic divergence between execution clients allowed chain halt.",
    url: "https://www.story.foundation/blog/story-network-postmortem",
    keywords: [/state/i, /transition/i, /consensus/i]
  },
  {
    protocol: "Movement Labs",
    bounty: "6.71k",
    severity: "Critical",
    category: "Business logic / Invariant breakdown",
    pattern: "Protocol Movement Labs business logic flaw breaking state invariants or allowing unauthorized fund extraction (Critical, bounty: 6.71k).",
    url: "https://medium.com/@yemresaritoprak/permanent-chain-split-in-movement-full-node-anatomy-of-a-6-710-critical-vulnerability-that-fa75fe66a0c7",
    keywords: [/require\(/i, /transfer|transferFrom/i, /balanceOf|balances/i, /total/i]
  },
  {
    protocol: "Lido",
    bounty: "-",
    severity: "High",
    category: "Business logic / Invariant breakdown",
    pattern: "Protocol Lido business logic flaw breaking state invariants or allowing unauthorized fund extraction (High, bounty: -).",
    url: "https://research.lido.fi/t/security-disclosure-dg-weakness-reported-through-immunefi-funds-not-at-risk/10393",
    keywords: [/require\(/i, /transfer|transferFrom/i, /balanceOf|balances/i, /total/i]
  },
  {
    protocol: "Sui",
    bounty: "50k",
    severity: "High",
    category: "Denial of service / Resource exhaustion",
    pattern: "Protocol Sui shared queue or critical function subject to DoS via gas exhaustion, revert injection, or lock.",
    url: "https://immunefi.com/blog/bug-fix-reviews/sui-network-shutdown/",
    keywords: [/for\s*\(/i, /revert\(/i, /require\(/i]
  },
  {
    protocol: "marginfi",
    bounty: "-",
    severity: "Critical",
    category: "Flash loan / Collateral valuation",
    pattern: "Flash-loan path let an attacker manipulate collateral valuation atomically before liquidation checks ran.",
    url: "https://blog.asymmetric.re/threat-contained-marginfi-flash-loan-vulnerability/",
    keywords: [/flash\s*loan|flashLoan/i, /health\s*factor|healthFactor/i]
  },
  {
    protocol: "RAI",
    bounty: "Not Paid",
    severity: "Critical",
    category: "Return-data bombing DoS",
    pattern: "Liquidation engine trusted the size of returned calldata from an external call, allowing a griefing DoS via an oversized return payload.",
    url: "https://www.trust-security.xyz/post/returndata-bombing-rai-s-liquidation-engine-a-critical-bug-worth-0",
    keywords: [/\.call\(/i, /returndatasize|returndatacopy/i]
  },
  {
    protocol: "dHEDGE",
    bounty: "-",
    severity: "High",
    category: "Business logic / Invariant breakdown",
    pattern: "Protocol dHEDGE business logic flaw breaking state invariants or allowing unauthorized fund extraction (High, bounty: -).",
    url: "https://x.com/s4muraii77/status/2012140371938070888",
    keywords: [/require\(/i, /transfer|transferFrom/i, /balanceOf|balances/i, /total/i]
  },
  {
    protocol: "zkSync Lite",
    bounty: "200k",
    severity: "Critical",
    category: "Business logic / Invariant breakdown",
    pattern: "Protocol zkSync Lite business logic flaw breaking state invariants or allowing unauthorized fund extraction (Critical, bounty: 200k).",
    url: "https://x.com/Ehsan1579/status/2013482485175226811",
    keywords: [/require\(/i, /transfer|transferFrom/i, /balanceOf|balances/i, /total/i]
  },
  {
    protocol: "Gnosis",
    bounty: "-",
    severity: "Critical",
    category: "Multi-sig / Safe execution bypass",
    pattern: "Safe execution path or module hook permitted executing unauthorized state changes or re-entrancy.",
    url: "https://x.com/therealgregoAI/status/2030923482159059433",
    keywords: [/execTransaction/i, /module/i, /signature/i]
  },
  {
    protocol: "Gnosis",
    bounty: "-",
    severity: "Critical",
    category: "Multi-sig / Safe execution bypass",
    pattern: "Safe execution path or module hook permitted executing unauthorized state changes or re-entrancy.",
    url: "https://x.com/therealgregoAI/status/2029144265800970664",
    keywords: [/execTransaction/i, /module/i, /signature/i]
  },
  {
    protocol: "Uniswap",
    bounty: "-",
    severity: "Low",
    category: "Business logic / Invariant breakdown",
    pattern: "Protocol Uniswap business logic flaw breaking state invariants or allowing unauthorized fund extraction (Low, bounty: -).",
    url: "https://x.com/therealgregoAI/status/2044063044032995489",
    keywords: [/require\(/i, /transfer|transferFrom/i, /balanceOf|balances/i, /total/i]
  },
  {
    protocol: "Yearn",
    bounty: "-",
    severity: "Critical",
    category: "Vault strategy / Price per share",
    pattern: "Strategy debt payment / withdrawal miscalculated loss reporting, allowing attacker to extract unearned yield.",
    url: "https://x.com/therealgregoAI/status/2028445384461205770",
    keywords: [/pricePerShare/i, /reportLoss/i, /debtPayment/i]
  },
  {
    protocol: "Reserve",
    bounty: "-",
    severity: "Critical",
    category: "Business logic / Invariant breakdown",
    pattern: "Protocol Reserve business logic flaw breaking state invariants or allowing unauthorized fund extraction (Critical, bounty: -).",
    url: "https://x.com/reserveprotocol/status/2027121090343174359",
    keywords: [/require\(/i, /transfer|transferFrom/i, /balanceOf|balances/i, /total/i]
  },
  {
    protocol: "Uniswap",
    bounty: "-",
    severity: "Low",
    category: "Business logic / Invariant breakdown",
    pattern: "Protocol Uniswap business logic flaw breaking state invariants or allowing unauthorized fund extraction (Low, bounty: -).",
    url: "https://x.com/therealgregoAI/status/2025848523724312609",
    keywords: [/require\(/i, /transfer|transferFrom/i, /balanceOf|balances/i, /total/i]
  },
  {
    protocol: "Balancer",
    bounty: "-",
    severity: "Critical",
    category: "Business logic / Invariant breakdown",
    pattern: "Protocol Balancer business logic flaw breaking state invariants or allowing unauthorized fund extraction (Critical, bounty: -).",
    url: "https://x.com/therealgregoAI/status/2013922384219177085",
    keywords: [/require\(/i, /transfer|transferFrom/i, /balanceOf|balances/i, /total/i]
  },
  {
    protocol: "Injective",
    bounty: "50K",
    severity: "Critical",
    category: "Business logic / Invariant breakdown",
    pattern: "Protocol Injective business logic flaw breaking state invariants or allowing unauthorized fund extraction (Critical, bounty: 50K).",
    url: "https://x.com/al_f4lc0n/status/2033110168045568434",
    keywords: [/require\(/i, /transfer|transferFrom/i, /balanceOf|balances/i, /total/i]
  },
]

// Keyword-detection corroboration technique —
// heuristically match code patterns to real bounty precedent instead of an ungrounded hallucination.
export function matchImmunefiCases(code: string, max = 6): ImmunefiCase[] {
  const scored = IMMUNEFI_CASES
    .map((c) => ({ c, hits: c.keywords.filter((re) => re.test(code)).length }))
    .filter((x) => x.hits > 0)
    .sort((a, b) => b.hits - a.hits)
  return scored.slice(0, max).map((x) => x.c)
}
