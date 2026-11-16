---
title: "Definitions in quantum_octaves.lean"
---

[← axiom index](/AXIOMS)

## `quantum_octaves.lean` — 7 definition(s), 15 theorem(s)

```lean
def row : Nat → List Nat
def re4 (k : Nat) : Int := match k % 4 with | 0 => 1 | 2 => -1 | _ => 0
def phases (k n : Nat) : Zw × Zw :=
def twiceExpect (k n : Nat) : Zw := zadd (phases k n).1 (phases k n).2
def twiceQuantum (n : Nat) : Int :=
def reach : Nat → List Nat
def expectationsReal (n : Nat) : Bool := (List.range (n + 1)).all (fun k => twiceExpect k n == (2 * re4 k, 0, 0, 0))
```
