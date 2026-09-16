---
name: uniswap-v4-auditor
description: Audit Uniswap v4 core pools, custom lifecycle hooks, flash accounting, and integrations.
---

# Uniswap v4 Audit Guidelines

Use this skill when auditing smart contracts that interact with Uniswap v4 (such as custom hooks, swap routers, liquidity managers, or pools).

## Core Concepts to Verify

### 1. Hook Address & Flags Validation
- **Requirement**: Hook contracts must be mined (using `CREATE2`) to have addresses that match the flag bits of the callbacks they implement.
- **Audit Steps**:
  - Verify that the hook's deployed address matches the expected flags in `PoolManager`.
  - Ensure the contract does not implement callbacks that are not flagged (which would not be called) or vice versa.
  - Review the address mining parameters and salt generation.

### 2. Callback Access Control
- **Requirement**: All hook callbacks (e.g., `beforeSwap`, `afterSwap`, `beforeAddLiquidity`, etc.) must strictly restrict caller access to the canonical `PoolManager`.
- **Audit Steps**:
  - Check that all callback functions have a modifier or check: `require(msg.sender == address(poolManager), "Only PoolManager")`.
  - If access control is missing, mark as high severity (unauthorized state manipulation).

### 3. Flash Accounting & Transient Storage (EIP-1153)
- **Requirement**: Solvency is checked at the end of the transaction by verifying that all token deltas are zero.
- **Audit Steps**:
  - Verify that any contract locking the `PoolManager` settles its outstanding balance before exiting the lock callback.
  - Ensure that transient storage states (e.g., `tstore` or custom EIP-1153 wrappers) are properly initialized and cleared to prevent pollution or stale values in subsequent calls.
  - Watch for read-only reentrancy where external contracts query pool state while the pool is in an intermediate (unsettled) state.

### 4. Custom Accounting & Deltas
- **Requirement**: Hooks using custom accounting must correctly manage hook-returned deltas.
- **Audit Steps**:
  - Ensure custom fee or curve calculations do not result in underflow/overflow.
  - Check for rounding directions: AMM math must round in favor of the pool (against the trader) to prevent LP drainage.
  - Verify that the hook has enough token balance to settle any debits it incurs during the transaction.

### 5. Native ETH & ERC-6909 Integration
- **Requirement**: Uniswap v4 supports native ETH and ERC-6909 tokens.
- **Audit Steps**:
  - Check for native ETH reentrancy vectors: contracts receiving native ETH must handle fallback functions securely.
  - Verify that custom hooks or routers correctly account for both WETH and native ETH trading pairs.
  - Review ERC-6909 balance updates, approvals, and transfer permissions. Ensure self-transfers or approval front-running are not possible.

### 6. Liquidity Lock & Withdrawals
- **Requirement**: LPs must be able to withdraw their liquidity.
- **Audit Steps**:
  - If a hook implements `beforeRemoveLiquidity` or `afterRemoveLiquidity`, verify it cannot permanently block LP withdrawals (e.g., via malicious revert or stuck states).
  - Verify that fees accrued by hooks are correctly accounted for and can be claimed by their rightful owners.
