---
name: symmetry-sniper
description: Find asymmetric logic in paired smart-contract operations that should mirror each other (deposit/withdraw, mint/burn, stake/unstake, add/remove, open/close, and single-vs-batch variants) where the mismatch breaks an invariant, omits a check present on only one side, or lets an attacker extract value by round-tripping. Use when reviewing contracts that expose paired or inverse state-changing entry points. Trigger whenever reviewing deposit/withdraw, mint/burn, stake/unstake, add/remove, open/close, or single-vs-batch functions, or whenever the user asks whether one side of a paired operation mirrors the other — even phrased casually like "does withdraw undo deposit", "check deposit/withdraw symmetry", or "compare the batch path to the single path".
---
 
Analyze the codebase for symmetry violations: paired operations that should be logical inverses or strict mirrors but differ in ways that break invariants, bypass checks, or create profit and leakage paths.
 
Only report issues that can cause an invariant break, unauthorized state change, value extraction, fund leakage, locked funds, or accounting drift an attacker can force. A difference that is documented and safe, internal-only with no attacker reach, or that does not move security-critical state, is not a finding.
 
## Applicability gates
 
Proceed if either is present:
 
- obvious operation pairs by naming, docs, tests, events, or interfaces (deposit/withdraw, mint/burn, stake/unstake, add/remove, open/close)
- single vs batch variants (doX vs doMany/multicall) operating on the same core state or assets
Otherwise, do not force findings.
 
## High-signal probes
 
### 1) Map the candidate pairs
 
Use naming, events, interfaces, and tests to identify operations that are meant to mirror. Include router and wrapper functions against the underlying core functions they call.
 
Establish the intended symmetry before judging any difference. If no pair is actually meant to mirror, do not report.
 
### 2) Diff state and value across the pair
 
For each pair, compare the two sides directly:
 
- state updates (which mappings, struct fields, and totals change, and by how much)
- asset movements (token/ETH transfers, fee collection, burns, escrow changes)
- edge cases (zero, max, boundary conditions, partial fills, cancellation paths)
Report when the pair fails to conserve or correctly invert the quantity it tracks (shares, totalAssets, balances, debt), and an attacker can gain value or lock redemptions.
 
### 3) Authorization parity
 
Check that every sensitive guard on one side has a counterpart on the other: roles, ownership, allowlists, pausing, limits.
 
Report when a check exists on one side but is missing on its counterpart, enabling an unauthorized exit, withdraw, burn, or close.
 
### 4) Rounding, fees, and round-trips
 
Look at the direction each side rounds and how fees apply across a full cycle.
 
Report when an attacker can round-trip a pair to extract value or skip a fee, or when repeated cycles produce attacker-favorable drift.
 
### 5) Batch versus single parity
 
For batch and multicall operations, the per-item behavior must match the single path:
 
- per-item validation and access control are preserved
- limits and caps apply per-item or per-batch as intended and cannot be bypassed
- failures are handled intentionally (atomic vs partial) without enabling griefing or accounting drift
Report when the batch path skips a check or constraint the single path enforces, and an attacker can exploit it.
 
## Output
 
Emit each finding in this structure so it can be deduplicated and validated against other audit passes:
 
```
### [SYM-NN] <Title naming the pair and the asymmetry>
 
- **Pair**: `functionA()` ↔ `functionB()` (file:line for each side)
- **Probe**: which probe surfaced it (state/value diff, authorization parity, rounding/round-trip, batch parity)
- **Asymmetry**: the exact difference — the check, state update, transfer, or rounding direction present on one side and absent or inverted on the other
- **Attack path**: concrete attacker sequence, including the round-trip cycle if applicable, and what is gained (value extracted, funds locked, check bypassed, accounting drift per cycle)
- **Impact**: High/Critical justification tied to TVL, loss of funds, or locked funds; state the invariant broken
- **PoC sketch**: minimal steps or Foundry test outline demonstrating the drift or bypass
```
 
If no pair fails the gates in a probe, state that explicitly per probe rather than omitting it — a clean parity result is itself signal for the validation pass. Do not emit findings that fail the reporting bar in the opening paragraph; list them under a short **Rejected candidates** section with a one-line reason each, so the false-positive filter has an audit trail.
