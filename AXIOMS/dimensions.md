---
title: "Definitions in dimensions.lean"
---

[← axiom index](/AXIOMS)

## `dimensions.lean` — 6 definition(s), 8 theorem(s)

```lean
def massOf (A B D : Int) : Int := A - D
def lengthOf (A B D : Int) : Int := 2 * A + B + 3 * D
def timeOf (A B D : Int) : Int := -A - B - 2 * D
def R : List Int := (List.range 19).map (fun k => Int.ofNat k - 9)
def solves (m l t : Int) (A B D : Int) : Bool :=
def solutions (m l t : Int) : List (Int × Int × Int) :=
```
