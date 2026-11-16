---
title: "Definitions in width.lean"
---

[← axiom index](/AXIOMS)

## `width.lean` — 4 definition(s), 8 theorem(s)

```lean
def reg (w : Nat) : Nat := 32 * w - w - 2   -- qpu's uuidQubits: the free register at hexbit width w (also the state-vector cost exponent: 2^(reg w) amplitudes)
def grover (w : Nat) : Nat := reg w / 2        -- the square-root (Grover / birthday) exponent on that register
def isoFloor : Nat := 128                       -- the ISO post-quantum floor
def widths : List Nat := [4, 8, 16, 32]         -- qpu's four hexbit widths; width 4 is the 128-bit UUID
```
