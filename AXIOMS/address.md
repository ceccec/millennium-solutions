---
title: "Definitions in address.lean"
---

[← axiom index](/AXIOMS)

## `address.lean` — 20 definition(s), 33 theorem(s)

```lean
def andF : Nat → Nat → Nat → Nat
def orF : Nat → Nat → Nat → Nat
def and8 (a b : Nat) : Nat := andF 9 a b
def or8 (a b : Nat) : Nat := orF 9 a b
def SEEDS : List Nat := [0, 2654435769, 608135816, 3084996962]
def wordBytes (w : Nat) : List Nat := [shr w 24 % 256, shr w 16 % 256, shr w 8 % 256, w % 256]
def rawBytes (cs : List Nat) : List Nat := (SEEDS.map (fun s => hash32 s cs)).flatMap wordBytes
def stamp (bs : List Nat) : List Nat :=
def toUuidBytes (cs : List Nat) : List Nat := stamp (rawBytes cs)
def A : List Nat := [97]                                    -- "a"
def UUIDNA : List Nat := [117, 117, 105, 100, 110, 97]      -- "uuidna"
def settledHere : Nat := 28
def kfact : Nat → Nat
def bbpPos (M N : Nat) : Nat := (List.range N).foldl (fun s k => s + 16 ^ (M - k) * 4 / (8 * k + 1)) 0
def bbpNeg (M N : Nat) : Nat :=
def bbp (M N : Nat) : Nat := bbpPos M N - bbpNeg M N
def eSeries (M N : Nat) : Nat := (List.range N).foldl (fun s k => s + 16 ^ M / kfact k) 0
def fnv0 (cs : List Nat) : Nat := cs.foldl (fun h c => xor32 ((h * FNV_PRIME) % M32) c) 0
def SIGNATURE : List Nat :=
def bracketsPhi (w : Nat) : Bool := (2 * w + 2 ^ 32) ^ 2 ≤ 5 * 2 ^ 64 && 5 * 2 ^ 64 < (2 * w + 2 + 2 ^ 32) ^ 2
```
