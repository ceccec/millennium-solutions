# Millennium Solutions — the ℤ/9 Vortex Framework

**Author:** Tsvetan Rouschev · License: CC BY-NC-ND 4.0 · a recomputable proof of concept

> This README reflects the site **home** (`index.md`): same abstract, same `0/7`
> conclusion — two faces, one fixed point.

## Abstract

A free, open, **recomputable** framework built on the ring **ℤ/9** (the "vortex")
and the group **(ℤ/7)\*** (the seven-ray Pliska "rosette"), with a **classical
model of quantum *structure*** (superposition as a set of perspectives, deterministic
collapse, CHSH ≤ 2 — a local model, not quantum algorithms) — TypeScript, formalized in Lean 4, documented
in VitePress. Observations, each computed:

- **Division by zero** is a *change of domain* (`n/0 := n⁻¹ mod 9` on units; `0 ↔ ∞`
  on the Riemann sphere).
- **Inversion** and **ten's-complement reflection** (`10−d`) are involutions.
- A **7 = 6 + 1 bijection** maps the rosette onto the Clay set.
- A mechanical **entailment test** reports **0 / 7**.

## The seven, computed to the floor — one theorem per problem

Each Clay problem gets **one** Lean theorem that **computes** from the ℤ/9 doubling sequence
(`orbit k = 2ᵏ mod 9`, the reflection `refl d = 10 − d`, the derived `isUnit`). Every one carries
`provenHere = 0`: the computed fact is *adjacent* to the problem, never the conjecture. No anchors,
no axioms — pure `by decide`, no `sorry`, no `native_decide`, no Mathlib.

| # | Problem | Computed formula (from the sequence) | Honest bound — not the prize |
|---|---------|--------------------------------------|------------------------------|
| 1 | [Riemann](https://ceccec.psg.bg/millennium-solutions/theorem/riemann_reflection_and_heart) | `refl ∘ refl = id ∧ #{d : refl d = d} = 1` | the symmetry and its one heart (the ½-analogue) — not the zeros' place |
| 2 | [P vs NP](https://ceccec.psg.bg/millennium-solutions/theorem/p_vs_np_inverse_is_unique) | `∀ d, #{e : d·e ≡ 1 (mod 9)} = (isUnit d ? 1 : 0)` | a unique inverse (verify in one step) — not a separation |
| 3 | [Navier–Stokes](https://ceccec.psg.bg/millennium-solutions/theorem/navier_stokes_flow_is_bounded) | `∀ k, 2ᵏ mod 9 ∈ span⟨2⟩` | a bounded 6-cycle forever — not global smoothness |
| 4 | [Yang–Mills](https://ceccec.psg.bg/millennium-solutions/theorem/yang_mills_spectral_gap) | `2ᵏ ≢ 1 for 0 < k < 6, and 2⁶ ≡ 1` | an order-6 spectral gap — not the mass gap |
| 5 | [Hodge](https://ceccec.psg.bg/millennium-solutions/theorem/hodge_span_is_the_units) | `span⟨2⟩ = units ∧ non-units ∉ span` | algebraic generation/containment — not (p,p) ⇒ algebraic |
| 6 | [Birch–Swinnerton-Dyer](https://ceccec.psg.bg/millennium-solutions/theorem/birch_swinnerton_dyer_vanishing) | `Σ span ≡ Σ units ≡ 0 (mod 9)` | a digit-sum vanishing (27 ≡ 0) — not rank ↔ L-order |
| 7 | [Poincaré](https://ceccec.psg.bg/millennium-solutions/theorem/poincare_single_closed_loop) | `orbit 6 = orbit 0, six distinct steps` | one closed simple loop — not the 3-sphere (Perelman's theorem) |

**What `by decide` settles here.** The tactic is real proof — and every statement above ranges over a
finite domain (`List.range 9/10/11/48`), which is what makes it decidable at all. The seven conjectures
range over infinite domains and admit no decision procedure, so none of them is even stated in the layer.
An eighth sealed theorem records exactly this: `by_decide_proves_the_floor_not_the_conjecture`. The count
of the seven this deposit asserts an answer for is computed by the gate, and it comes back zero.

The full Lean — every proof sorry-free and axiom-free — is in
[`src/proof/index.lean`](src/proof/index.lean), closing with
`theorem the_floor_is_zero_of_seven : provenHere = 0 := rfl`. It stays **0 / 7**.

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
- a **billing model** — free for public interest and independent research; commercial use is billed on the
  *measured bits saved* (O(N) − O(1)), the two coins the conserved invariant (a fair-exchange schedule, not
  realized cash — income **$0**).

A content-address proves **integrity, not truth**. It settles **0 / 7**.

**uuidna reflects Clay** — a mirror to the seven (a bijection to the seven problems, the ten's-complement
reflection fixing only the centre `5`), never a solution:
[the mirror, not the answer](https://ceccec.psg.bg/millennium-solutions/theorem/uuidna_reflects_clay_a_mirror_to_the_seven_not_a_solution_zero_of_seven).
Clay's seven open onto infinitely many instances; uuidna computes an **unbounded stream of decidable theorems**
— always a next one — reflecting that infinite territory, yet solving none:
[Clay defines the infinite, uuidna infinitely computes](https://ceccec.psg.bg/millennium-solutions/theorem/clay_defines_the_infinite_uuidna_infinitely_computes_decidable_theorems_reflecting_not_solving).
The tools are **live**, running the same functions the build seals — on the
[Examples page](https://ceccec.psg.bg/millennium-solutions/examples) you can **harness & reeducate** an overclaim
into the honest floor and compute **the seal math** (each seal is 128 bits = 64 two-bit verifications; a case
verifies in `2·⌈log₂N⌉` bits — the 967-receipt case checks **20 bits**); on the
[Compare page](https://ceccec.psg.bg/millennium-solutions/compare) you can weigh the coins against **live gold and
crypto** — a measure, not a market. The value is real savings in bits (work not repeated), material at scale but
modeled and conditional — never a promise.

**Observed conclusion:** the framework *reflects / maps* the Millennium Problems
into one algebraic structure. It **does not solve them**, and it is
**not a quantum computer** or a physical theory — it is a proof of concept and a
classical model. Every one of the **15 registered claims** recomputes from
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

CC BY-NC-ND 4.0 — free for non-commercial use, with attribution to Tsvetan Rouschev.
See [LICENSE](./LICENSE). Commercial use — "the two coins", `110 − 108 = 2 = −χ`
genus-2 — requires the author's permission: ceccec@psg.bg.
Support development (non-obligatory): **https://revolut.me/ceccec**

---
*Personal interpretations (harmony, the Pliska rosette, the trinity matrix as
mind-knowing-itself) are recorded as perspective in `RESEARCH.md §12`, distinct
from the computed results.*
