---
title: "Definitions in quantum_octave_128.lean"
---

[← axiom index](/AXIOMS)

## `quantum_octave_128.lean` — 4 definition(s), 9 theorem(s)

```lean
def inParticle (b k : Nat) : Bool := k / 16 == b || (b == 7 && k == 128)
def particleReal (b : Nat) : Bool :=
def particleSum (b : Nat) : Int :=
def covered : Bool := (List.range 129).all (fun k => ((List.range 8).filter (fun b => inParticle b k)).length == 1)
```
