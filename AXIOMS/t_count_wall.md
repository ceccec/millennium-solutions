---
title: "Definitions in t_count_wall.lean"
---

[← axiom index](/AXIOMS)

## `t_count_wall.lean` — 22 definition(s), 8 theorem(s)

```lean
abbrev Zw := Int × Int × Int × Int
def zadd (x y : Zw) : Zw := (x.1 + y.1, x.2.1 + y.2.1, x.2.2.1 + y.2.2.1, x.2.2.2 + y.2.2.2)
def zneg (x : Zw) : Zw := (-x.1, -x.2.1, -x.2.2.1, -x.2.2.2)
def zmul (x y : Zw) : Zw :=
def w1 : Zw := (0, 1, 0, 0)          -- ω
def w7 : Zw := (0, 0, 0, -1)         -- ω⁷ = ω̄ = −ω³
def bit (i k : Nat) : Nat := i / 2 ^ k % 2
def flip (i k : Nat) : Nat := if bit i k == 1 then i - 2 ^ k else i + 2 ^ k
def at ' (v : List Zw) (i : Nat) : Zw := v.getD i (0, 0, 0, 0)
def gen (f : Nat → Zw) : List Zw := (List.range 8).map f
def step (v : List Zw) : G → List Zw
def run (gs : List G) (v : List Zw) : List Zw := gs.foldl step v
def basis (i : Nat) : List Zw := gen (fun j => if j == i then (1, 0, 0, 0) else (0, 0, 0, 0))
def toffoliOf (i : Nat) : Nat := if bit i 0 == 1 && bit i 1 == 1 then flip i 2 else i
def sevenT : List G :=
def tGates (gs : List G) : Nat := (gs.filter (fun g => match g with | .t _ => true | .tdg _ => true | _ => false)).length
def adderToffolis (n : Nat) : Nat := 2 * n
def shorToffolis (n : Nat) : Nat := (2 * n) * n * adderToffolis n
def shorT (n : Nat) : Nat := 7 * shorToffolis n
def shorQubits (n : Nat) : Nat := 2 * n + 3
def worstTerms (t : Nat) : Nat := 2 ^ t
def cost (t _width : Nat) : Nat := worstTerms t
```
