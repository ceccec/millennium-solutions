---
title: "Definitions in extension.lean"
---

[← axiom index](/AXIOMS)

## `extension.lean` — 8 definition(s), 11 theorem(s)

```lean
def grid : List Nat := List.range 12
def ext (f : Nat → Nat) : List Nat := grid.map f
def dr (n : Nat) : Nat := if n = 0 then 0 else 1 + (n - 1) % 9
def perms3 : List (List Nat) :=
def canon (l : List Nat) : List Nat := l.foldl (fun acc x => acc ++ [x]) [] |>.eraseDups
def sum3 (l : List Nat) : Nat := l.foldl (· + ·) 0
def foldSum (l : List Nat) : Nat := l.foldl (· + ·) 0
def chain : Nat → Nat → Nat
```
