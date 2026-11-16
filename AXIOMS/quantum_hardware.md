---
title: "Definitions in quantum_hardware.lean"
---

[← axiom index](/AXIOMS)

## `quantum_hardware.lean` — 3 definition(s), 8 theorem(s)

```lean
def lhs (d0 n0 d1 n1 d2 n2 d3 n3 : Int) : Int := d0 * n1 * n2 * n3 + d1 * n0 * n2 * n3 + d2 * n0 * n1 * n3 - d3 * n0 * n1 * n2
def rhs (n0 n1 n2 n3 : Int) : Int := 2 * n0 * n1 * n2 * n3
def aboveClassical (d0 n0 d1 n1 d2 n2 d3 n3 : Int) : Bool := decide (lhs d0 n0 d1 n1 d2 n2 d3 n3 > rhs n0 n1 n2 n3)
```
