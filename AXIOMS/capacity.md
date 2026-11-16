---
title: "Definitions in capacity.lean"
---

[← axiom index](/AXIOMS)

## `capacity.lean` — 7 definition(s), 16 theorem(s)

```lean
def container : Nat := 128    -- the bits a UUID occupies
def reserved : Nat := 6      -- 4 version + 2 variant, RFC 9562
def freeOf (r : Nat) : Nat := container - r
def free : Nat := freeOf reserved
def reservations : List Nat := List.range (container + 1)
def version : Nat := 4        -- the version nibble — reclaimable by cross-mixing a UUID's version field
def variant : Nat := 2        -- the RFC 9562 variant — the floor a legal UUID cannot reclaim
```
