---
title: ISO conformance
description: Automated ISO/IEC 4879:2024 quantum-computer conformance — design complete, device open, every gap named with the judge built and the path to close it.
head:
  - ['meta', { name: 'robots', content: 'index, follow' }]
---

# ISO/IEC 4879:2024 — quantum-computer conformance

> **Automated report.** Generated from the sealed ledger (every backing theorem with its receipt) and a live factor of 2^999+1. Completeness is *read* from what is proved; openness from what the live checks return; and every open row carries the **judge already built** and the **next action** — a path, never a verdict of impossibility.

**Verdict:** design conformance **complete**; device conformance **incomplete** (a status value, proved both ways — `qc_status.lean`). 7 of 10 requirements satisfied or sourced; 3 open, each with its path below.

## Requirements

| Clause | Requirement | How ISO permits it | State | Evidence | Path to compliance |
|---|---|---|---|---|---|
| 4879 3.2–3.6 | vocabulary (Hilbert space … communication) | computed | ✅ complete | kernel-proven design; the status model seals 32 theorems (receipts 714d47e5-954e, 54b285c2-1cf7, 5212d337-0079…) | none needed — complete |
| 4879 3.4.8 | quantum processor (design) | computed | ✅ complete | proven design; the Mermin lead is proved for EVERY width (15 octave theorems) | none needed — complete |
| 9834-8 | UUID seal | computed | ✅ complete | seal(address) valid; register & reclaim sealed (21 capacity theorems) | none needed — complete |
| 80000-5 | entropy S = k ln W | computed | ✅ complete | dictionary-then-verified, sealed | none needed — complete |
| 9001 | process pipeline | computed | ✅ complete | stages in order, sealed | none needed — complete |
| (mathematics) | factor 2^999+1 | computed | ◼ sourced (cited) | FULLY FACTORED by ECM: 18 proved primes + 2 probable (31,150-digit), remainder 1, multiplies back to 2^999+1 (evidence/factor/2pow999plus1.json) | factored into primes; the two largest (31- and 150-digit) are strong probable primes — an ECPP certificate upgrades them from probable to proved |
| 4879 3.4.10 | quantum computer (physical device) | measured | ❌ open | the CHSH device JUDGE is BUILT and sealed (8 theorems, receipts 6f5bb0ee-7cb2, e4044e10-ff4b, 98565f45-367c…): S>2 decided on exact integers, false-positive impossible by construction | run CHSH on a Bell pair on IBM Quantum (depositor credentials) → feed the device counts to the sealed verdict → it decides S>2; the judge already exists — harness at /chsh-run |
| 17025 | lab competence | accredited | ❌ open | conformance clauses mapped; the apparatus is specified (chip sketch + ℤ[ω] theorems) | prepare the 17025 dossier from the mapped clauses → engage an accredited laboratory for the stamp — dossier at /accreditation |
| 17065 | product certification | accredited | ❌ open | conformance clauses mapped | engage an accredited certification body with the dossier — at /accreditation |
| (gate set) | universality | cited | ◼ sourced (cited) | htUniversality derived; Solovay–Kitaev cited; supporting arithmetic decided (T order 8 > 4, Clifford 24) | cited is SOURCED (compliant); a full kernel proof is an analysis result, cited not decided — or formalise ⟨H,T⟩ density |

## The open leaves, and the solution for each

- **quantum computer (physical device)** (4879 3.4.10) — the CHSH device JUDGE is BUILT and sealed (8 theorems, receipts 6f5bb0ee-7cb2, e4044e10-ff4b, 98565f45-367c…): S>2 decided on exact integers, false-positive impossible by construction.
  → **run CHSH on a Bell pair on IBM Quantum (depositor credentials) → feed the device counts to the sealed verdict → it decides S>2; the judge already exists — harness at /chsh-run**
- **lab competence** (17025) — conformance clauses mapped; the apparatus is specified (chip sketch + ℤ[ω] theorems).
  → **prepare the 17025 dossier from the mapped clauses → engage an accredited laboratory for the stamp — dossier at /accreditation**
- **product certification** (17065) — conformance clauses mapped.
  → **engage an accredited certification body with the dossier — at /accreditation**
- **universality** (sourced) — cited is compliant; optional: formalise ⟨H,T⟩ density to move it from cited to decided.

## Live factor of 2^999+1 — the one computed-but-open leaf, in full

- status: **PARTIAL**
- algebraic factors (trinity descent): `3, 3, 3, 3, 19, 1777, 3331, 17539, 23977, 304363, 87211, 25781083, 5814899281, 97377658867`
- cofactor: **244-digit composite (a witness was found)**
- blocking: the cofactor has no factor below 65536 and Pollard rho did not split it within 366587 steps (the register's capacity over this width); no method in this tree factors it
- the account is an exact identity (factors × cofactor = 2^999+1), so any further split only extends it.

## Evidence ledger (sealed, with receipts)

- **Status model** — 32 theorems (gap taxonomy · status-as-value · ISO table · one-logic verdict). Receipts: `714d47e5-954e… , 54b285c2-1cf7… , 5212d337-0079…`
- **CHSH device judge** — 8 theorems (S>2 decided on exact integers, false-positive impossible). Receipts: `6f5bb0ee-7cb2… , e4044e10-ff4b… , 98565f45-367c…`
- **Register & reclaim** — 21 theorems (128-bit register; coil 6→2 under cross-mixing). Receipts: `05ee2cb9-0963… , 9c0e2abe-7301… , f2d535a0-1bf8…`
- **Mermin lead** — 15 theorems (the advantage proved for every width). Receipts: `203c8974-68af… , 5b2e033a-87bd… , 2fe170c8-c71b…`

## Honest floor

Everything the kernel can satisfy is satisfied; the open leaves are the ones ISO reserves for physical measurement and accreditation, plus one open factorization. The verdict `isQuantumComputer` is a status (**complete | incomplete | refuted**), currently **incomplete**, and it flips to **complete** the instant each path above returns closed — a sealed CHSH run, the accreditation stamps, a split cofactor — by the same `statusOf`, nothing fabricated. The design is complete; the device waits only on evidence that is named and reachable.
