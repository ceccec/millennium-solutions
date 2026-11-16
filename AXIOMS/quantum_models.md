---
title: "Definitions in quantum_models.lean"
---

[← axiom index](/AXIOMS)

## `quantum_models.lean` — 26 definition(s), 8 theorem(s)

```lean
def sgn (m : Nat) (x : Zw) : Zw := if m == 0 then x else zneg x
def psi0 : Zw := (1, 0, 0, 0)
def psi1 : Zw := (0, 1, 0, 0)
def oneWay (cz : Bool) (k m : Nat) : Zw × Zw :=
def gateOut (k m : Nat) : Zw × Zw :=
abbrev Mat := Zw × Zw × Zw × Zw
def mmul (a b : Mat) : Mat :=
def zero : Zw := (0, 0, 0, 0)
def one : Zw := (1, 0, 0, 0)
def prop (a b : Mat) : Bool :=
def sigma1 : Mat := (one, zero, zero, wpow 2)
def hs : Mat := (one, one, one, zneg one)
def sigma2 : Mat := mmul hs (mmul sigma1 hs)
def ident : Mat := (one, zero, zero, one)
def addIfNew (acc : List Mat) (m : Mat) : List Mat := if acc.any (fun a => prop a m) then acc else acc ++ [m]
def grow (acc : List Mat) : List Mat := acc.foldl (fun r a => addIfNew (addIfNew r (mmul a sigma1)) (mmul a sigma2)) acc
def braidGroup : Nat → List Mat
def u00 : Zw := one
def u01 : Zw := wpow 2
def u10 : Zw := wpow 2
def u11 : Zw := one
def perm : Zw := zadd (zmul u00 u11) (zmul u01 u10)
def splitter (a b : Nat) : Mat := (one, wpow a, wpow b, zneg (wpow (a + b)))
def permOf (u : Mat) : Zw := zadd (zmul u.1 u.2.2.2) (zmul u.2.1 u.2.2.1)
def unitary2 (u : Mat) : Bool :=
def triangle : List Int :=
```
