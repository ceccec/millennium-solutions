---
title: "Definitions in rights.lean"
---

[← axiom index](/AXIOMS)

## `rights.lean` — 7 definition(s), 8 theorem(s)

```lean
abbrev Instrument := Nat × Nat × Bool × Bool
def idOf (r : Instrument) : Nat  := r.1
def kindOf (r : Instrument) : Nat  := r.2.1
def auto (r : Instrument) : Bool := r.2.2.1
def claim (r : Instrument) : Bool := r.2.2.2
def instruments : List Instrument :=
def settledHere : Nat := 8
```
