---
title: "Definitions in quantum_circuits.lean"
---

[← axiom index](/AXIOMS)

## `quantum_circuits.lean` — 17 definition(s), 8 theorem(s)

```lean
abbrev Zw := Int × Int × Int × Int
def zadd (x y : Zw) : Zw := (x.1 + y.1, x.2.1 + y.2.1, x.2.2.1 + y.2.2.1, x.2.2.2 + y.2.2.2)
def zneg (x : Zw) : Zw := (-x.1, -x.2.1, -x.2.2.1, -x.2.2.2)
def zmul (x y : Zw) : Zw :=
def zconj (x : Zw) : Zw := (x.1, -x.2.2.2, -x.2.2.1, -x.2.1)
def norm (x : Zw) : Zw := zmul x (zconj x)
def wpow (k : Nat) : Zw :=
def P : Zw := (1, 0, 1, 0)   -- 1 + i
def M : Zw := (1, 0, -1, 0)  -- 1 − i
def root2 (n : Int) : Zw := (0, n, 0, -n)
abbrev State := Zw × Zw × Zw × Zw
def step (s : State) : Gate → State
def run (gs : List Gate) : State := gs.foldl step ((1, 0, 0, 0), (0, 0, 0, 0), (0, 0, 0, 0), (0, 0, 0, 0))
def bell : List Gate := [.rz 0 2, .sx 0, .rz 0 2, .rz 1 2, .sx 1, .rz 1 2, .cz, .rz 1 2, .sx 1, .rz 1 2]
def chsh (ka kb : Nat) : List Gate := bell ++ [.rz 0 4, .sx 0, .rz 0 ka, .sx 0, .rz 1 4, .sx 1, .rz 1 kb, .sx 1]
def corr (gs : List Gate) : Zw := let s := run gs; zadd (zadd (norm s.1) (norm s.2.2.2)) (zneg (zadd (norm s.2.1) (norm s.2.2.1)))
def total (gs : List Gate) : Zw := let s := run gs; zadd (zadd (norm s.1) (norm s.2.1)) (zadd (norm s.2.2.1) (norm s.2.2.2))
```
