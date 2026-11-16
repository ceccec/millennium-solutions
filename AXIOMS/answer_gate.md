---
title: "Definitions in answer_gate.lean"
---

[← axiom index](/AXIOMS)

## `answer_gate.lean` — 6 definition(s), 7 theorem(s)

```lean
def certOk (f : Flags) : Bool :=
def ok (f : Flags) : Bool := f.checkedBy && certOk f
def allVals : List Val := [Val.TRUE, Val.FALSE, Val.SOURCED, Val.UNKNOWN]
def allCerts : List Cert := [Cert.none, Cert.C1, Cert.C2, Cert.C3, Cert.other]
def allBools : List Bool := [false, true]
def allFlags : List Flags :=
```
