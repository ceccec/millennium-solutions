---
title: "Definitions in priorart.lean"
---

[← axiom index](/AXIOMS)

## `priorart.lean` — 5 definition(s), 9 theorem(s)

```lean
abbrev Source := Nat × Nat × Bool
def idOf (s : Source) : Nat  := s.1
def kindOf (s : Source) : Nat  := s.2.1
def novelty (s : Source) : Bool := s.2.2
def sources : List Source :=
```
