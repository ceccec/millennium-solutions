---
title: "Definitions in pauli_paths.lean"
---

[← axiom index](/AXIOMS)

## `pauli_paths.lean` — 38 definition(s), 8 theorem(s)

```lean
abbrev Zw := Int × Int × Int × Int
def zadd (x y : Zw) : Zw := (x.1 + y.1, x.2.1 + y.2.1, x.2.2.1 + y.2.2.1, x.2.2.2 + y.2.2.2)
def zneg (x : Zw) : Zw := (-x.1, -x.2.1, -x.2.2.1, -x.2.2.2)
def zmul (x y : Zw) : Zw :=
def zconj (x : Zw) : Zw := (x.1, -x.2.2.2, -x.2.2.1, -x.2.1)
def z0 : Zw := (0, 0, 0, 0)
def z1 : Zw := (1, 0, 0, 0)
def zi : Zw := (0, 0, 1, 0)        -- i = ω²
def w1 : Zw := (0, 1, 0, 0)        -- ω
def root2 : Zw := (0, 1, 0, -1)    -- √2 = ω − ω³
abbrev M2 := Zw × Zw × Zw × Zw
def mul2 (p q : M2) : M2 :=
def add2 (p q : M2) : M2 := (zadd p.1 q.1, zadd p.2.1 q.2.1, zadd p.2.2.1 q.2.2.1, zadd p.2.2.2 q.2.2.2)
def scale2 (s : Zw) (p : M2) : M2 := (zmul s p.1, zmul s p.2.1, zmul s p.2.2.1, zmul s p.2.2.2)
def neg2 (p : M2) : M2 := scale2 (zneg z1) p
def dag2 (p : M2) : M2 := (zconj p.1, zconj p.2.2.1, zconj p.2.1, zconj p.2.2.2)
def I2 : M2 := (z1, z0, z0, z1)
def X2 : M2 := (z0, z1, z1, z0)
def Y2 : M2 := (z0, zneg zi, zi, z0)
def Z2 : M2 := (z1, z0, z0, zneg z1)
def H2 : M2 := (z1, z1, z1, zneg z1)            -- unnormalised: H2·H2 = 2·I
def S2 : M2 := (z1, z0, z0, zi)
def T2 : M2 := (z1, z0, z0, w1)
def pauli (x z : Nat) : M2 := if x == 0 && z == 0 then I2 else if x == 1 && z == 0 then X2 else if x == 0 then Z2 else Y2
def conj2 (g p : M2) : M2 := mul2 (dag2 g) (mul2 p g)
def ent (p : M2) (r c : Nat) : Zw := if r == 0 then (if c == 0 then p.1 else p.2.1) else (if c == 0 then p.2.2.1 else p.2.2.2)
def kron (a b : M2) (r c : Nat) : Zw := zmul (ent a (r / 2) (c / 2)) (ent b (r % 2) (c % 2))
def mul4 (a b : Nat → Nat → Zw) (r c : Nat) : Zw := (List.range 4).foldl (fun s k => zadd s (zmul (a r k) (b k c))) z0
def eq4 (a b : Nat → Nat → Zw) : Bool := (List.range 4).all (fun r => (List.range 4).all (fun c => a r c == b r c))
def neg4 (a : Nat → Nat → Zw) (r c : Nat) : Zw := zneg (a r c)
def CX4 (r c : Nat) : Zw := if (if c / 2 == 1 then 2 + (1 - c % 2) else c) == r then z1 else z0   -- |a b⟩ ↦ |a, b ⊕ a⟩
def CZ4 (r c : Nat) : Zw := if r == c then (if r == 3 then zneg z1 else z1) else z0
def cxRule (xc zc xt zt : Nat) (r c : Nat) : Zw :=
def czRule (xc zc xt zt : Nat) (r c : Nat) : Zw :=
def bits4 : List (Nat × Nat × Nat × Nat) := (List.range 16).map (fun i => (i % 2, i / 2 % 2, i / 4 % 2, i / 8 % 2))
def terms (m : M2) : Nat := ([I2, X2, Y2, Z2].filter (fun p => let t := mul2 p m; zadd t.1 t.2.2.2 != z0)).length
def wrongTX : M2 := add2 X2 Y2
def wrongTY : M2 := add2 X2 (neg2 Y2)
```
