---
title: "Definitions in quantum_textbooks.lean"
---

[← axiom index](/AXIOMS)

## `quantum_textbooks.lean` — 6 definition(s), 8 theorem(s)

```lean
def closeUnder (gens : List Mat) (acc : List Mat) : List Mat :=
def generated (gens : List Mat) : Nat → List Mat
def tgate : Mat := (one, zero, zero, wpow 1)
def mpow (m : Mat) : Nat → Mat
def dot (s x : Nat) : Nat := ((s % 2) * (x % 2) + (s / 2 % 2) * (x / 2 % 2) + (s / 4 % 2) * (x / 4 % 2)) % 2
def sign (b : Nat) : Int := if b == 0 then 1 else -1
```
