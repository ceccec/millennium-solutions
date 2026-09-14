---
title: The
description: The src/the/* concepts as VitePress components themselves — each recomputes at page-load.
---

# The

The `src/the/*` concepts, rendered as components themselves — not stored prose. Each card below
runs its module's `report()` at page-load, so the content recomputes every render (deterministic:
pure content-addressing, so SSR and hydration agree). Every card lands on the same floor: ****.

<TheConcepts />

## All theorems — the ledger

Every decidable fact the deposit has discovered, rendered from `src/proof/discovered.json` — the
complete ledger, re-verified by exhaustion on each build. None is a Clay Millennium result; all land
on

<AllTheorems />
