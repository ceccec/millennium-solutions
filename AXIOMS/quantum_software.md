---
title: "Definitions in quantum_software.lean"
---

[← axiom index](/AXIOMS)

## `quantum_software.lean` — 33 definition(s), 8 theorem(s)

```lean
def bit (i k : Nat) : Nat := i / 2 ^ k % 2
def flip (i k : Nat) : Nat := if bit i k == 1 then i - 2 ^ k else i + 2 ^ k
def at ' (v : List Int) (i : Nat) : Int := v.getD i 0
def gen (v : List Int) (f : Nat → Int) : List Int := (List.range v.length).map f
def X (k : Nat) (v : List Int) : List Int := gen v (fun i => at' v (flip i k))
def Z (k : Nat) (v : List Int) : List Int := gen v (fun i => if bit i k == 1 then -(at' v i) else at' v i)
def H (k : Nat) (v : List Int) : List Int := gen v (fun i => if bit i k == 0 then at' v i + at' v (flip i k) else at' v (flip i k) - at' v i)
def CX (c t : Nat) (v : List Int) : List Int := gen v (fun i => at' v (if bit i c == 1 then flip i t else i))
def CZ (a b : Nat) (v : List Int) : List Int := gen v (fun i => if bit i a == 1 && bit i b == 1 then -(at' v i) else at' v i)
def CCX (a b t : Nat) (v : List Int) : List Int := gen v (fun i => at' v (if bit i a == 1 && bit i b == 1 then flip i t else i))
def swapIdx (i p q : Nat) : Nat := if bit i p == bit i q then i else flip (flip i p) q
def CSWAP (c p q : Nat) (v : List Int) : List Int := gen v (fun i => at' v (if bit i c == 1 then swapIdx i p q else i))
def neg (v : List Int) : List Int := v.map (fun a => -a)
def scale (s : Int) (v : List Int) : List Int := v.map (fun a => s * a)
def basis (n i : Nat) : List Int := (List.range n).map (fun j => if j == i then 1 else 0)
def support (v : List Int) : List Nat := (List.range v.length).filter (fun i => at' v i != 0)
def sq (v : List Int) : List Nat := v.map (fun a => a.natAbs * a.natAbs)
def eig (op : List Int → List Int) (v : List Int) : Int := if op v == v then 1 else if op v == neg v then -1 else 0
def range5 : List Int := [-2, -1, 0, 1, 2]
def bell : List Int := [1, 0, 0, 1]
def encode (m : Nat) (v : List Int) : List Int :=
def decode (v : List Int) : List Int := H 0 (CX 0 1 v)
def bitCode (a b : Int) : List Int := [a, 0, 0, 0, 0, 0, 0, b]
def bitFix (v : List Int) : List Int :=
def bitErr (e : Nat) (v : List Int) : List Int := if e == 0 then v else X (e - 1) v
def plus3 : List Int := (List.range 8).map (fun _ => 1)
def minus3 : List Int := (List.range 8).map (fun i => if (bit i 0 + bit i 1 + bit i 2) % 2 == 1 then -1 else 1)
def phaseCode (a b : Int) : List Int := (List.range 8).map (fun i => a * at' plus3 i + b * at' minus3 i)
def phaseFix (v : List Int) : List Int :=
def phaseErr (e : Nat) (v : List Int) : List Int := if e == 0 then v else Z (e - 1) v
def pair (p0 p1 f0 f1 : Int) : List Int :=
def swapTest (v : List Int) : List Int := H 0 (CSWAP 0 1 2 (H 0 v))
def weight (v : List Int) (o : Nat) : Int := ((List.range 8).filter (fun i => bit i 0 == o)).foldl (fun s i => s + at' v i * at' v i) 0
```
