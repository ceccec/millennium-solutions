---
title: "Definitions in qc_status.lean"
---

[← axiom index](/AXIOMS)

## `qc_status.lean` — 15 definition(s), 40 theorem(s)

```lean
def gaps : List (Bool × Bool) :=
def isWorld (g : Bool × Bool) : Bool := g.1
def isClosed (g : Bool × Bool) : Bool := g.2
def verdict : Bool := gaps.all isClosed
def statusOf (disproven allClosed : Bool) : Status :=
def toBool : Status → Bool
def kindIsComputed : Kind → Bool | .computed => true | _ => false
def kindIsMeasured : Kind → Bool | .measured => true | _ => false
def kindIsAccredited : Kind → Bool | .accredited => true | _ => false
def iso : List (Kind × Bool) :=
def isoSatisfied : (Kind × Bool) → Bool := fun r => r.2
def current : List Bool := [true, true, true, true, true, false, false, false, false, false]
def full : List Bool := [true, true, true, true, true, true, true, true, true, true]
def isQuantumComputation : Bool := (gaps.filter (fun g => !isWorld g)).all isClosed   -- the computed dimension
def isQuantumComputer : Bool := gaps.all isClosed                                   -- the device dimension (incl. world)
```
