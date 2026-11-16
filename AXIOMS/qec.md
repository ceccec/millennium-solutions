---
title: "Definitions in qec.lean"
---

[← axiom index](/AXIOMS)

## `qec.lean` — 3 definition(s), 8 theorem(s)

```lean
def surfacePhysical (d : Nat) : Nat := 2 * d ^ 2 - 2 * d + 1   -- rotated surface code, qpu's coins·d² − coins·d + seed
def corrects (d : Nat) : Nat := (d - 1) / 2             -- a distance-d code corrects ⌊(d − 1)/2⌋ errors
def pauliOrder (nn : Nat) : Nat := 2 ^ (2 * nn + 2)        -- qpu's paulis: order of the n-qubit Pauli group with phases
```
