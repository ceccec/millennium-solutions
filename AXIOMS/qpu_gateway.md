---
title: "Definitions in qpu_gateway.lean"
---

[← axiom index](/AXIOMS)

## `qpu_gateway.lean` — 5 definition(s), 8 theorem(s)

```lean
def variant (low : Nat) : Nat := (low % 4) + 8
def gateway (low : Nat) : Nat := variant low / 4
def fromPartsVariant : Nat := 8
def freeField (low : Nat) : Nat := low % 4
def teleportMessages : List Nat := [0, 1, 2, 3]
```
