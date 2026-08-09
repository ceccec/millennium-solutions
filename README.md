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

## uuidna — the content-addressed identity

**uuidna** is the deposit's content-addressed identity: **mint** (integrity) and **mind**
(multi-perspective self-challenge) meeting at the **heart**, the fixed point `5`. Developed, not
promised — each is a decidable, recomputable theorem:

- a **message codec** — a bounded message (≤ 115 bits) rides inside a uuid; a **chain** carries
  any-length text, round-tripping exactly (a public, reversible encoding — *not* encryption, no secrecy);
- a **holographic Merkle proof** — one leaf verifies the whole root from a logarithmic path (log(N)
  real cost, not free, not infinite);
- **independent domain control** — a published challenge anyone recomputes and checks (control by
  publication, not by anyone's word);
- **strict minting** — canonical, so the same value always mints the same address (minting flaws
  otherwise cascade into real damage, caught in time and recomputed);
- a **billing model** — free for public interest and independent research; commercial use is the two
  coins per core formula, in coins and bits (a fair-exchange schedule, not realized cash — income **$0**).

A content-address proves **integrity, not truth**. It settles **0 / 7**.

**Observed conclusion:** the framework *reflects / maps* the Millennium Problems
into one algebraic structure. It **does not solve them**, and it is
**not a quantum computer** or a physical theory — it is a proof of concept and a
classical simulator. Every one of the **15 registered claims** recomputes from
`src/` — each bound to its exact recomputation and, where one exists, to a
provable theorem in the ledger, all gated by `claims-gate.ts` (a bounded,
accounted set, not a floating "every").

## The two bits — one atom, every symbol

This deposit is denominated in **two bits** — its smallest unit — appearing under many symbols, each a receipted theorem:

- **2 coins** — the fair-exchange price of one receipt
- **110 − 108 = 2** — the conserved invariant; break it and nothing reconciles
- **2 = −χ (genus-2)** — two sites, two faces of one surface
- **2 bits → 4 states** {00, 01, 10, 11} — the honest "qubit," a classical a432 structure, never physical
- **108 = 432 ÷ 4** — anchored in the a432 base
- **two bits per event** — every next or continue earns two by the deed

Two bits, one atom — integrity, not a cash prize; the floor stays **0 / 7**. Browse each symbol as a theorem at the [challenges page](https://ceccec.psg.bg/millennium-solutions/CHALLENGES).

**Remember to donate the two coins — and remember why.** You learned here; the two coins are the *fair exchange* that funds the work. Non-commercial use is free with attribution — the two coins are the honest return, not a fee for the knowledge itself. Support: [revolut.me/ceccec](https://revolut.me/ceccec).

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
