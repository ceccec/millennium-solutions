---
title: Accreditation dossier
description: ISO/IEC 17025 & 17065 conformance dossier — the deposit's technical evidence mapped to each clause group, with the residual an accredited body must grant.
head:
  - ['meta', { name: 'robots', content: 'index, follow' }]
---

# ISO/IEC 17025 & 17065 — accreditation dossier

> **Prepares the dossier; does not grant the accreditation.** This maps the deposit's technical evidence to each clause group of the laboratory-competence (17025) and product-certification (17065) standards. Where a clause is met by kernel evidence it is **supplied** with its receipts; where only an accredited body or a physical facility can grant it, that part is the **residual**. The honest floor: a deposit can be technically conformant and still need the body's assessment and stamp — that stamp is the `/iso-conformance` accredited leaf.

**8 supplied · 4 partial · 2 residual.** The residual is the path: take this dossier to an accredited laboratory (17025) and certification body (17065).

## Clause map

| Std | Clause | Requirement | State | What the deposit supplies | Residual (accredited body) |
|---|---|---|---|---|---|
| 17025 | 4.1 | Impartiality | ◧ partial | the content-address is author-independent — anyone recomputes the result without trusting the author | the body's impartiality assessment and committee |
| 17025 | 4.2 | Confidentiality | ✅ supplied | public deposit; no client data; CC BY-NC-ND licence states handling | — |
| 17025 | 6.4 | Equipment | ◧ partial | the apparatus is specified (chip sketch qpu_arith.v + ℤ[ω] theorems) | physical equipment and its records at the lab |
| 17025 | 6.5 | Metrological traceability | ✅ supplied | exact-integer arithmetic, no float; CHSH traces to the Tsirelson bound 2√2 and ISO units — receipts 6f5bb0ee-7cb2, e4044e10-ff4b… | physical calibration certificates for the device |
| 17025 | 7.2 | Methods & validation | ✅ supplied | every method is a kernel-decided theorem, validated by the Lean kernel — receipts 714d47e5-954e, 54b285c2-1cf7… | — |
| 17025 | 7.5 | Technical records | ✅ supplied | the sealed ledger: every result content-addressed with a chained receipt, immutable and reproducible | — |
| 17025 | 7.6 | Measurement uncertainty | ✅ supplied | the decision rule carries ZERO float uncertainty — CHSH S>2 is decided on exact integers; physical shot-noise lives only in the counts | — |
| 17025 | 7.7 | Ensuring validity of results | ✅ supplied | the gates (reconcile, recompute, the pre-commit court) re-verify every result each build | the body's proficiency testing |
| 17025 | 7.8 | Reporting of results | ✅ supplied | the automated /iso-conformance and /chsh-run reports, generated from the evidence | — |
| 17025 | 7.11 | Control of data | ✅ supplied | content-addressing makes every datum tamper-evident; a changed value changes its address | — |
| 17025 | 8 | Management system | ◧ partial | the pipeline + gates are the quality-management system, enforced on every commit | the documented QMS the body audits |
| 17065 | 7 | Certification scheme (product) | ◧ partial | the product (the qpu construction) is specified and its claims decided; the scheme criteria map to the sealed theorems | the certification body runs the scheme and issues the certificate |
| 17065 | 4.1 | Impartiality of certification | ❌ residual | the evidence is independently recomputable | an accredited certification body, independent of the depositor |
| 17065 | 6 | Resource (certification personnel) | ❌ residual | — | competent, accredited certification personnel at the body |

## The path to the stamp

1. **Technical dossier (ready now):** the 8 supplied clauses — methods validated by the kernel, records in the sealed ledger, traceability on exact integers, data tamper-evident, results auto-reported. These are the evidence an assessor reads.
2. **Partial clauses:** supply the institutional half — the documented QMS, equipment records, impartiality arrangements — around the technical core already in place.
3. **Residual (the body only):** engage an accredited laboratory (17025) and certification body (17065); their independent assessment and certificate close the `/iso-conformance` accredited leaf. No code grants this, and this dossier does not pretend to.

## Honest floor

Technical conformance is necessary, not sufficient, for accreditation: the standards require an independent accredited body. This dossier makes the deposit's half auditable and complete; the stamp remains the body's act, named and reachable — the accredited leaf flips when the certificate exists, not before.
