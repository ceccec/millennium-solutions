---
title: "Definitions in trinity.lean"
---

[← axiom index](/AXIOMS)

## `trinity.lean` — 18 definition(s), 24 theorem(s)

```lean
def corners : List Nat := [0, 1, 2]
def turnC (x : Nat) : Nat := (x + 1) % 3   -- ρ: feeling → thought → emotion → feeling
def backC (x : Nat) : Nat := (x + 2) % 3   -- ρ⁻¹: the loop runs backward too (worry tightens the chest)
def flipV (p : Nat) : Nat := (p + 1) % 2
def elems : List Nat := [0, 1, 2, 3, 4, 5]
def cx (e : Nat) : Nat := e / 2
def vp (e : Nat) : Nat := e % 2
def feel (e : Nat) : Nat := vp e
def turn (e : Nat) : Nat := 2 * ((cx e + 1) % 3) + vp e        -- the turn, lifted to the whole group
def flip (e : Nat) : Nat := 2 * cx e + (vp e + 1) % 2          -- the valence flip, lifted
def gop (a b : Nat) : Nat := 2 * ((cx a + cx b) % 3) + (vp a + vp b) % 2   -- the group operation (componentwise)
def gid : Nat := 0
def gpow (g k : Nat) : Nat := (List.range k).foldl (fun acc _ => gop acc g) gid
def withCentre : List Nat := [0, 1, 2, 3]
def turnO (x : Nat) : Nat := if x == 3 then 3 else (x + 1) % 3
def selfModel : List (List Bool) := [[true, false, true], [true, true, false], [false, false, true]]
def diagonal (m : List (List Bool)) : List Bool :=
def settledHere : Nat := 24
```
