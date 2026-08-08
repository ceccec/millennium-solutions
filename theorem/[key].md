---
aside: false
---

# {{ $params.name }}

<div class="tinfo">

- **theorem key** · `{{ $params.key }}`
- **content-address (receipt)** · `{{ $params.receipt }}`
- **status** · decidable, re-verified on every build — recomputes from `src/`

</div>

This is one leaf of the chained discovery ledger — see [all theorems](/CHALLENGES) and the [computed results](/compute). Its truth is its recomputation: clone the repo and run `npm run lean-claims` to re-verify it, or `npm run forensics` to check its place in the chain. A content-address proves integrity, not truth. `entails → 0/7`.
