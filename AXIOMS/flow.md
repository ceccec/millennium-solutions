---
title: "Definitions in flow.lean"
---

[← axiom index](/AXIOMS)

## `flow.lean` — 5 definition(s), 16 theorem(s)

```lean
def ringSum (f : Nat → Int) : Nat → Int
def ringNext (N i : Nat) : Nat := (i + 1) % N
def ringPrev (N i : Nat) : Nat := (i + N - 1) % N
def burgersSkew3 (N : Nat) (u : Nat → Int) (i : Nat) : Int :=
def ringLap (N : Nat) (u : Nat → Int) (i : Nat) : Int := u (ringNext N i) - 2 * u i + u (ringPrev N i)
```
