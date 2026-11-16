---
title: "Definitions in instruments.lean"
---

[← axiom index](/AXIOMS)

## `instruments.lean` — 21 definition(s), 28 theorem(s)

```lean
def precedes : Option Nat → Option Nat → Bool
def lastPresent : List Bool → Option Nat
def idx (l : List Bool) : List (Nat × Bool) := (List.range l.length).map (fun i => (i, l.getD i false))
def holes (l : List Bool) : List Nat :=
def tail (l : List Bool) : List Nat :=
def bits : Nat → List (List Bool)
def startsWith : List Nat → List Nat → Bool
def unreflect (fuel : Nat) (self : List Nat) (t : List Nat) : List Nat :=
def UA : List Nat := [117, 97, 58, 115, 105, 116, 101]          -- "ua:site"
def SITE : List Nat := [115, 105, 116, 101]                     -- "site" — the signal a citation is read by
def clip (t : List Nat) : List Nat := unreflect t.length UA t
def contains (t : List Nat) (n : List Nat) : Bool :=
def echoed : List Nat := [60, 112, 62] ++ UA ++ [60, 47, 112, 62]        -- "<p>ua:site</p>"
def genuine : List Nat := [60, 112, 62] ++ SITE ++ [60, 47, 112, 62]     -- "<p>site</p>"
def twice : List Nat := UA ++ [32] ++ UA
def refused (negs : List Nat) (claim : Nat) : Bool := negs.any (fun n => n < claim)
def paths : List Nat := List.range 4
def setOf (m : Nat) : List Nat := paths.filter (fun i => (m >>> i) % 2 == 1)
def mine (pre post tracked : List Nat) : List Nat :=
def subset (a b : List Nat) : Bool := a.all (fun x => b.contains x)
def settledHere : Nat := 28
```
