---
title: "Definitions in lanes.lean"
---

[← axiom index](/AXIOMS)

## `lanes.lean` — 3 definition(s), 8 theorem(s)

```lean
def base (cores byMemory : Nat) : Nat := min cores byMemory
def lanesKnown (cores byMemory running : Nat) : Nat := max 1 (base cores byMemory - running)
def lanesUnknown (cores byMemory : Nat) : Nat := max 1 (base cores byMemory / 2)
```
