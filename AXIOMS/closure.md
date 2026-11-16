---
title: "Definitions in closure.lean"
---

[← axiom index](/AXIOMS)

## `closure.lean` — 13 definition(s), 8 theorem(s)

```lean
def R : List Nat := List.range 9
def isUnit (d : Nat) : Bool := d % 3 != 0                    -- z9.lean: the six units
def inSpan (d : Nat) : Bool := [1, 2, 4, 8, 7, 5].contains d -- index.lean: the doubling span
def isTriad (d : Nat) : Bool := [3, 6, 0].contains d          -- merkaba.lean: the axis
def isOrigin (d : Nat) : Bool := d == 0                        -- index.lean: the annihilator
def isFixed (d : Nat) : Bool := (9 - d) % 9 == d              -- reflection.lean: fixed by σ
def isEven (d : Nat) : Bool := d % 2 == 0                    -- elementary.lean
def isSquare (d : Nat) : Bool := R.any (fun k => k * k % 9 == d)
def isPrimitive (d : Nat) : Bool := [2, 5].contains d             -- reached.lean: the primitive roots
def isSelfInv (d : Nat) : Bool := d * d % 9 == 1
def named : List (Nat → Bool) := [isUnit, inSpan, isTriad, isOrigin, isFixed, isEven, isSquare, isPrimitive, isSelfInv]
def table (p : Nat → Bool) : List Bool := R.map p
def unnamed (d : Nat) : Bool :=
```
