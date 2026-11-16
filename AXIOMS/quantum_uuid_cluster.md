---
title: "Definitions in quantum_uuid_cluster.lean"
---

[← axiom index](/AXIOMS)

## `quantum_uuid_cluster.lean` — 11 definition(s), 8 theorem(s)

```lean
def bit (m a : Nat) : Nat := m / 2 ^ a % 2
def flip (m a : Nat) : Nat := if bit m a == 1 then m - 2 ^ a else m + 2 ^ a
def cz (a b : Nat) (p : Nat × Nat × Bool) : Nat × Nat × Bool :=
def chain (n : Nat) (p : Nat × Nat × Bool) : Nat × Nat × Bool := (List.range (n - 1)).foldl (fun q a => cz a (a + 1) q) p
def gen (n j : Nat) : Nat × Nat × Bool := chain n (2 ^ j, 0, false)
def want (n j : Nat) : Nat × Nat × Bool := (2 ^ j, (if j > 0 then 2 ^ (j - 1) else 0) + (if j + 1 < n then 2 ^ (j + 1) else 0), false)
def support (n i : Nat) : List Nat := (if i > 0 then [i - 1] else []) ++ [i] ++ (if i + 1 < n then [i + 1] else [])
def xAt (i k : Nat) : Nat := if k == i then 1 else 0
def zAt (i k : Nat) : Nat := if k + 1 == i || k == i + 1 then 1 else 0
def commutes (n i j : Nat) : Bool :=
def patterned (i : Nat) : Bool := (List.range 124).all (fun k => bit (want 124 i).1 k == xAt i k && bit (want 124 i).2.1 k == zAt i k)
```
