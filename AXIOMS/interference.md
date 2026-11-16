---
title: "Definitions in interference.lean"
---

[← axiom index](/AXIOMS)

## `interference.lean` — 6 definition(s), 2 theorem(s)

```lean
def bit (n i : Nat) : Nat := n / (2 ^ i) % 2
def par3 (n : Nat) : Nat := (bit n 0 + bit n 1 + bit n 2) % 2
def dot (x s : Nat) : Nat := (bit x 0 * bit s 0 + bit x 1 * bit s 1 + bit x 2 * bit s 2) % 2
def plus (x s : Nat) : Bool := dot x s == 0
def ghzPlus (s : Nat) : Nat := (plus 0 s).toNat + (plus 7 s).toNat
def ghzCancels (s : Nat) : Bool := ghzPlus s == 1
```
