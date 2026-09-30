// Distilled from sirhashalot/SCV-List (https://github.com/sirhashalot/SCV-List) — a
// CVE-like database of ~155 REAL, mainnet-exploited-or-disclosed smart-contract
// vulnerabilities (Immunefi postmortems, samczsun research, Yearn disclosures, Blockthreat).
// Its inclusion rule is strict: the bug had to be found on mainnet (most audit-only findings
// excluded). That makes it high-signal precedent for "this pattern really lost/risked funds."
//
// Same corroboration role as immunefiCases.ts / immunefiReportsIndex.ts / auditCompetitions.ts:
// keyword-match the uploaded code, surface real mainnet precedent as context — never as an
// automatic finding. A match is a lead to chase with the 12-lens sweep.

const SCV_URL = 'https://github.com/sirhashalot/SCV-List'

export interface ScvCategoryStat {
  category: string
  count: number
  keywords: RegExp[]
}

export interface ScvExample {
  category: string
  protocol: string
  pattern: string
}

// Categories are grouped from the SCV-List "Vulnerability Description" column; `count` is the
// approximate number of distinct mainnet entries in that class across the list.
export const SCV_CATEGORY_STATS: ScvCategoryStat[] = [
  { category: 'Donation / first-deposit share inflation', count: 6,
    keywords: [/balanceOf\(\s*address\(this\)/i, /totalSupply\(\)\s*==\s*0|totalShares?\s*==\s*0/i, /donat/i, /first\s*deposit|_mint\(\s*.*shares/i] },
  { category: 'Read-only / cross-protocol reentrancy', count: 5,
    keywords: [/get_virtual_price|getVirtualPrice/i, /view\b.*price|price.*view/i, /remove_liquidity|removeLiquidity/i, /\.call\{value|onERC\d+Received|tokensReceived/i] },
  { category: 'Callback reentrancy (ERC721/1155/ETH)', count: 8,
    keywords: [/onERC721Received|onERC1155Received|_safeMint|safeTransferFrom/i, /nonReentrant|ReentrancyGuard/i, /\.call\{value|\.transfer\(|\.send\(/i] },
  { category: 'Uninitialized proxy / initializer hijack', count: 6,
    keywords: [/function\s+initialize\s*\(/i, /Initializable|_disableInitializers/i, /proxy|implementation|UUPS|delegatecall/i] },
  { category: 'Missing / broken access control', count: 16,
    keywords: [/function\s+set[A-Z]\w*\s*\(/i, /onlyOwner|onlyRole|onlyAdmin|_checkRole/i, /require\s*\(\s*msg\.sender/i, /public\b|external\b/i] },
  { category: 'Oracle / spot-price / flash-loan manipulation', count: 14,
    keywords: [/getReserves|slot0|spotPrice|getPrice/i, /flash\s*loan|flashLoan|uniswapV2Call|receiveFlashLoan/i, /oracle|latestRoundData|Aggregator/i] },
  { category: 'Signature / ecrecover / permit replay', count: 8,
    keywords: [/ecrecover/i, /permit\s*\(|DOMAIN_SEPARATOR|EIP712|domainSeparator/i, /signature|nonce|address\(0\)/i] },
  { category: 'Rounding / precision / integer truncation', count: 6,
    keywords: [/\buint(8|16|32|64|128)\b|SafeCast|toUint/i, /\/\s*1e\d+|\*\s*10\s*\*\*|mulDiv|div\(/i, /decimals\(\)|truncat|remainder/i] },
  { category: 'Precompile / delegatecall / selfdestruct', count: 6,
    keywords: [/delegatecall/i, /precompile/i, /selfdestruct|suicide/i] },
  { category: 'Bridge double-spend / infinite mint', count: 8,
    keywords: [/bridge|crossChain|relayer|deposit\(/i, /_mint\(|mint\(/i, /nonce|processed|claimed|spent/i] },
  { category: 'Deposit / validator-credential front-running', count: 4,
    keywords: [/deposit\s*\(|stake\s*\(/i, /credential|withdrawal_credential|pubkey|frontrun/i, /block\.timestamp|deadline/i] },
  { category: 'Internal accounting / share-price error', count: 9,
    keywords: [/balances?\[|shares?\[|rewardDebt|pricePerShare|sharePrice/i, /\+=|-=/, /totalAssets|totalSupply|getPricePerFullShare/i] },
  { category: 'Arbitrary low-level call() with user input', count: 6,
    keywords: [/\.call\s*\(|\.delegatecall\s*\(|functionCall/i, /address\s+\w+\s*,|address\s+target|to\.call/i] },
  { category: 'Double-entry-point / phantom token / sweep', count: 4,
    keywords: [/sweep|rescue|recoverERC20|skim/i, /fallback\s*\(|receive\s*\(/i, /balanceOf|transferFrom/i] },
  { category: 'Duplicate input / merkle double-claim', count: 5,
    keywords: [/merkle|MerkleProof|claimed|hasClaimed/i, /for\s*\(|duplicate|unique/i, /require\s*\(/i] },
  { category: 'NFT redeem / mint-reuse / approval abuse', count: 5,
    keywords: [/tokenId|_safeMint|redeem|ownerOf/i, /approve\(|setApprovalForAll|allowance/i, /nft|ERC721|ERC1155/i] },
]

export const SCV_EXAMPLES: ScvExample[] = [
  { category: 'Donation / first-deposit share inflation', protocol: 'Yield Protocol', pattern: 'pool balanceOf inflated with a donation attack alongside burning shares to inflate shares minted' },
  { category: 'Donation / first-deposit share inflation', protocol: 'Silo', pattern: 'empty silo manipulated with a donation attack to reach very high interest, then borrowed against' },
  { category: 'Donation / first-deposit share inflation', protocol: 'Bunni', pattern: 'first deposit into a new pool front-run (1 wei + direct LP transfer) so the second depositor gets no shares' },
  { category: 'Read-only / cross-protocol reentrancy', protocol: 'Curve', pattern: 'read-only reentrancy manipulates get_virtual_price; other protocols trusted it blindly as a price feed' },
  { category: 'Read-only / cross-protocol reentrancy', protocol: 'Mai Finance (QiDao)', pattern: 'same get_virtual_price read-only reentrancy in a Curve vault integration → bad debt' },
  { category: 'Read-only / cross-protocol reentrancy', protocol: 'Sherlock', pattern: '1inch swap callback enables cross-protocol reentrancy into Euler, changing Sherlock redemption amount' },
  { category: 'Callback reentrancy (ERC721/1155/ETH)', protocol: 'Uniswap', pattern: 'UniversalRouter reentrancy via ERC721 callback sweeps funds left in the router from a prior tx' },
  { category: 'Callback reentrancy (ERC721/1155/ETH)', protocol: 'Hashmasks', pattern: 'ERC721 _safeMint callback reentrancy mints more NFTs than expected' },
  { category: 'Callback reentrancy (ERC721/1155/ETH)', protocol: 'OpenZeppelin', pattern: 'reentrancy in the TimelockController contract' },
  { category: 'Uninitialized proxy / initializer hijack', protocol: 'Arbitrum Nitro', pattern: 'proxy initialized but values wiped; sequencerInbox never rewritten — initialize() could steal bridge funds' },
  { category: 'Uninitialized proxy / initializer hijack', protocol: 'Aave V2 / Agave', pattern: 'uninitialized LendingPool proxy (Agave inherited it via forked code)' },
  { category: 'Uninitialized proxy / initializer hijack', protocol: 'Ondo Finance', pattern: 'uninitialized logic contract let any user initialize and call destroy() to selfdestruct it' },
  { category: 'Missing / broken access control', protocol: 'Sense Finance', pattern: 'a function that set oracle data values could be called by anyone' },
  { category: 'Missing / broken access control', protocol: 'Aave', pattern: 'fallback oracle setPrice had no access control — arbitrary price if the fallback was ever used' },
  { category: 'Missing / broken access control', protocol: 'Curve', pattern: 'missing access control let anyone set the fee receiver of pools paired with the base pool' },
  { category: 'Oracle / spot-price / flash-loan manipulation', protocol: 'Rari Capital', pattern: 'Uniswap V3 oracle manipulation possible because a pool with only $1k liquidity was used' },
  { category: 'Oracle / spot-price / flash-loan manipulation', protocol: 'Sturdy', pattern: 'weak fallback oracle used the pool spot price, manipulable to profit from price manipulation' },
  { category: 'Oracle / spot-price / flash-loan manipulation', protocol: 'Fei Protocol', pattern: 'flash-loan price manipulation of a Uniswap pool' },
  { category: 'Signature / ecrecover / permit replay', protocol: 'Tokenlon', pattern: 'signature verification did not properly handle the zero address' },
  { category: 'Signature / ecrecover / permit replay', protocol: 'Yearn Finance', pattern: 'DOMAIN_SEPARATOR fixed at deploy → replay attacks across ETH-PoW forks sharing chainId' },
  { category: 'Signature / ecrecover / permit replay', protocol: 'Multichain', pattern: 'phantom permit(): ERC20 fallback lets permit not revert, enabling unauthorized transfer where allowance is non-zero' },
  { category: 'Rounding / precision / integer truncation', protocol: 'DFX Finance', pattern: 'rounding error let a user receive LP tokens without depositing; low-decimal (EURS=2) sped up extraction' },
  { category: 'Rounding / precision / integer truncation', protocol: 'Moonbeam', pattern: 'improper truncation during type conversion → different interpretations of a single value' },
  { category: 'Rounding / precision / integer truncation', protocol: 'OpenSea', pattern: 'using the quotient instead of the remainder let a loop overwrite a word at the end of an array' },
  { category: 'Precompile / delegatecall / selfdestruct', protocol: 'Moonbeam', pattern: 'precompiles did not differentiate call vs delegatecall → malicious contract drains incoming callers' },
  { category: 'Precompile / delegatecall / selfdestruct', protocol: 'Oasis DAO', pattern: 'a specific call flow allowed delegatecall to reach selfdestruct, shutting down Oasis Earn' },
  { category: 'Precompile / delegatecall / selfdestruct', protocol: 'Optimism', pattern: 'selfdestruct created new tokens out of thin air while the destroyed contract retained its balance' },
  { category: 'Bridge double-spend / infinite mint', protocol: 'Aurora', pattern: 'infinite spend in the ETH↔NEAR bridge; separately, crafted payloads deserialized to spoof token burns' },
  { category: 'Bridge double-spend / infinite mint', protocol: 'Across', pattern: 'bridge double spend possible due to an off-chain relayer bug' },
  { category: 'Bridge double-spend / infinite mint', protocol: 'Polygon', pattern: 'double-spend bridge vulnerability' },
  { category: 'Deposit / validator-credential front-running', protocol: 'RocketPool / Lido', pattern: 'a malicious node front-runs an ETH deposit to take ETH from the protocol’s deposit' },
  { category: 'Deposit / validator-credential front-running', protocol: 'Tranchess', pattern: 'operator front-runs a deposit with credentials replaced to steal value meant for LSD users' },
  { category: 'Deposit / validator-credential front-running', protocol: 'PoolTogether', pattern: 'deposit could be front-run so the later-deposited amount is taken by the front-runner' },
  { category: 'Internal accounting / share-price error', protocol: 'Yearn Finance', pattern: 'internal accounting error produced an incorrect share-price calculation' },
  { category: 'Internal accounting / share-price error', protocol: 'Tidal Finance', pattern: 'uninitialized rewardDebt defaults to zero, allowing free unearned rewards' },
  { category: 'Internal accounting / share-price error', protocol: 'ArmorFi', pattern: 'internal accounting error caused by an extra 10**18 multiplier' },
  { category: 'Arbitrary low-level call() with user input', protocol: 'dYdX', pattern: 'low-level call() with arbitrary inputs could be performed by untrusted parties' },
  { category: 'Arbitrary low-level call() with user input', protocol: 'Zapper', pattern: 'low-level call() with user-provided inputs could steal LP tokens' },
  { category: 'Arbitrary low-level call() with user input', protocol: 'MCDEX', pattern: 'contract did not validate a user-provided contract address, allowing a crafted malicious contract' },
  { category: 'Double-entry-point / phantom token / sweep', protocol: 'Compound', pattern: 'TUSD dual entry-point + access-less sweep changed the exchange rate, letting the attacker profit' },
  { category: 'Double-entry-point / phantom token / sweep', protocol: 'Balancer', pattern: 'double-entry-point tokens (SNX/sBTC) cause DoS — pool thinks it holds more tokens than it does' },
  { category: 'Double-entry-point / phantom token / sweep', protocol: 'Belt Finance', pattern: 'internal balance calc bypassed by sending tokens directly to the contract' },
  { category: 'Duplicate input / merkle double-claim', protocol: 'Balancer', pattern: 'duplicate claims accepted by the merkle-tree logic, allowing draining of assets' },
  { category: 'Duplicate input / merkle double-claim', protocol: 'Mt Pelerin', pattern: 'function did not check for duplicate array entries → an action performed multiple times' },
  { category: 'Duplicate input / merkle double-claim', protocol: 'Tron', pattern: 'no duplicate-signer check let a single multisig user supply multiple valid signatures' },
  { category: 'NFT redeem / mint-reuse / approval abuse', protocol: 'PancakeSwap', pattern: 'lottery ticket NFT redeemable multiple times because first redemption did not invalidate it' },
  { category: 'NFT redeem / mint-reuse / approval abuse', protocol: 'ZORA', pattern: 'infinite approval during NFT purchase; a bid front-run by raising price steals 100% of the bidder’s tokens' },
  { category: 'NFT redeem / mint-reuse / approval abuse', protocol: 'Charged Particles', pattern: 'a user could sell an NFT yet keep possession of it after the sale via a malicious contract' },
]

/** Same keyword-detection corroboration technique as matchAuditCompetitions()/matchImmunefiCases(). */
export function matchScvList(code: string, max = 4): (ScvCategoryStat & { url: string; examples: ScvExample[] })[] {
  const scored = SCV_CATEGORY_STATS
    .map((c) => ({ c, hits: c.keywords.filter((re) => re.test(code)).length }))
    .filter((x) => x.hits > 0)
    .sort((a, b) => b.hits - a.hits || b.c.count - a.c.count)

  return scored.slice(0, max).map(({ c }) => ({
    ...c,
    url: SCV_URL,
    examples: SCV_EXAMPLES.filter((e) => e.category === c.category).slice(0, 3),
  }))
}
