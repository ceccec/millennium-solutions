# Millennium Solutions — the ℤ/9 Vortex Framework

**Author:** Tsvetan Rouschev · License: CC BY-NC 4.0 · a recomputable proof of concept

> This README reflects the site **home** (`index.md`): same abstract, same `0/7`
> conclusion — two faces, one fixed point.

## Abstract

A free, open, **recomputable** framework built on the ring **ℤ/9** (the "vortex")
and the group **(ℤ/7)\*** (the seven-ray Pliska "rosette"), with a **classical
simulator of quantum algorithms** — TypeScript, formalized in Lean 4, documented
in VitePress. Observations, each computed:

- **Division by zero** is a *change of domain* (`n/0 := n⁻¹ mod 9` on units; `0 ↔ ∞`
  on the Riemann sphere).
- **Inversion** and **ten's-complement reflection** (`10−d`) are involutions.
- A **7 = 6 + 1 bijection** maps the rosette onto the Clay set.
- A mechanical **entailment test** reports **0 / 7**.

**Observed conclusion:** the framework *reflects / maps* the Millennium Problems
into one algebraic structure. It **does not solve them**, and it is **not** a
quantum computer or a physical theory — it is a proof of concept and a classical
simulator. Every claim recomputes from `src/`.

## Run it
```bash
npm install
npm run docs:dev        # local site
npm run docs:build      # build every page (all fused compute modules render)
```
Fused TypeScript modules recompute live on `/compute`; per-digit Lean 4 theorems
(`decide` / `norm_num`) form the formal layer (`lake build` to check).

## Read
- **Research** — the full study (§1–§12, incl. the author's perspective)
- **Compute** — results recomputed live from the fused TypeScript modules
- **Proof of Concept** · **Realisations**
- **Sequence decode (ℤ/9)** · **Physics scales** · **Proofs**

## Cite / support
**DOI:** [10.5281/zenodo.21819217](https://doi.org/10.5281/zenodo.21819217) — archived on Zenodo (honest abstract: *entailment 0/7*).

CC BY-NC 4.0 — free for non-commercial use, with attribution to Tsvetan Rouschev.
See [LICENSE](./LICENSE). Commercial use — "the two coins", `110 − 108 = 2 = −χ`
genus-2 — requires the author's permission: ceccec@psg.bg.
Support development (non-obligatory): **https://revolut.me/ceccec**

---
*Personal interpretations (harmony, the Pliska rosette, the trinity matrix as
mind-knowing-itself) are recorded as perspective in `RESEARCH.md §12`, distinct
from the computed results.*
