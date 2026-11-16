---
title: "Definitions in resources.lean"
---

[← axiom index](/AXIOMS)

## `resources.lean` — 6 definition(s), 8 theorem(s)

```lean
def chimera (m : Nat) : Nat := 8 * m ^ 2        -- D-Wave Chimera: vertices (8) qubits per cell, m² cells
def pegasus (m : Nat) : Nat := 24 * m * (m - 1) -- D-Wave Pegasus: vertices·n·m·(m−1) = 8·3·m·(m−1)
def qftGates (q : Nat) : Nat := q * (q + 1) / 2  -- controlled-phase gates: the q-th triangular number
def qftSwaps (q : Nat) : Nat := q / 2
def qftDepth (q : Nat) : Nat := 2 * q - 1
def qftStates (q : Nat) : Nat := 2 ^ q
```
