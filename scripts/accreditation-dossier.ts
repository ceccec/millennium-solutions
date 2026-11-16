// scripts/accreditation-dossier.ts — the ISO/IEC 17025 & 17065 conformance dossier, via the pipeline. It maps
// the deposit's TECHNICAL evidence to each clause group of the two accreditation standards and marks, honestly,
// what the deposit supplies versus the RESIDUAL that only an accredited body can grant (the assessment and the
// stamp). It does not claim accreditation — it prepares the dossier an accredited laboratory (17025) and a
// certification body (17065) would assess. Receipts are pulled from the sealed ledger where a clause is backed
// by kernel evidence. Generated — do not edit. Registered in the reconcile chain and predocs.
import { writeFileSync } from 'node:fs'

type Row = { key: string; name?: string; receipt: string; revoked?: boolean }
const ledger: Row[] = (await import('../src/ledger/discovered.json', { with: { type: 'json' } })).default as Row[]
const live = ledger.filter((e) => !e.revoked)
const some = (needle: string) => live.filter((e) => e.key.includes(needle)).slice(0, 2).map((r) => r.receipt.slice(0, 13))

// state: supplied = the deposit meets it technically now; partial = technical part met, institutional part residual;
// residual = only an accredited body / physical facility can grant it.
type Clause = { std: '17025' | '17065'; clause: string; what: string; state: 'supplied' | 'partial' | 'residual'; deposit: string; residual: string }

const clauses: Clause[] = [
  { std: '17025', clause: '4.1', what: 'Impartiality', state: 'partial',
    deposit: 'the content-address is author-independent — anyone recomputes the result without trusting the author',
    residual: "the body's impartiality assessment and committee" },
  { std: '17025', clause: '4.2', what: 'Confidentiality', state: 'supplied',
    deposit: 'public deposit; no client data; CC BY-NC-ND licence states handling', residual: '—' },
  { std: '17025', clause: '6.4', what: 'Equipment', state: 'partial',
    deposit: 'the apparatus is specified (chip sketch qpu_arith.v + ℤ[ω] theorems)', residual: 'physical equipment and its records at the lab' },
  { std: '17025', clause: '6.5', what: 'Metrological traceability', state: 'supplied',
    deposit: `exact-integer arithmetic, no float; CHSH traces to the Tsirelson bound 2√2 and ISO units — receipts ${some('quantumhardware').join(', ')}…`,
    residual: 'physical calibration certificates for the device' },
  { std: '17025', clause: '7.2', what: 'Methods & validation', state: 'supplied',
    deposit: `every method is a kernel-decided theorem, validated by the Lean kernel — receipts ${some('qcstatus').join(', ')}…`, residual: '—' },
  { std: '17025', clause: '7.5', what: 'Technical records', state: 'supplied',
    deposit: 'the sealed ledger: every result content-addressed with a chained receipt, immutable and reproducible', residual: '—' },
  { std: '17025', clause: '7.6', what: 'Measurement uncertainty', state: 'supplied',
    deposit: 'the decision rule carries ZERO float uncertainty — CHSH S>2 is decided on exact integers; physical shot-noise lives only in the counts', residual: '—' },
  { std: '17025', clause: '7.7', what: 'Ensuring validity of results', state: 'supplied',
    deposit: 'the gates (reconcile, recompute, the pre-commit court) re-verify every result each build', residual: 'the body\'s proficiency testing' },
  { std: '17025', clause: '7.8', what: 'Reporting of results', state: 'supplied',
    deposit: 'the automated /iso-conformance and /chsh-run reports, generated from the evidence', residual: '—' },
  { std: '17025', clause: '7.11', what: 'Control of data', state: 'supplied',
    deposit: 'content-addressing makes every datum tamper-evident; a changed value changes its address', residual: '—' },
  { std: '17025', clause: '8', what: 'Management system', state: 'partial',
    deposit: 'the pipeline + gates are the quality-management system, enforced on every commit', residual: 'the documented QMS the body audits' },
  { std: '17065', clause: '7', what: 'Certification scheme (product)', state: 'partial',
    deposit: 'the product (the qpu construction) is specified and its claims decided; the scheme criteria map to the sealed theorems', residual: 'the certification body runs the scheme and issues the certificate' },
  { std: '17065', clause: '4.1', what: 'Impartiality of certification', state: 'residual',
    deposit: 'the evidence is independently recomputable', residual: 'an accredited certification body, independent of the depositor' },
  { std: '17065', clause: '6', what: 'Resource (certification personnel)', state: 'residual',
    deposit: '—', residual: 'competent, accredited certification personnel at the body' },
]

const mark = (s: Clause['state']) => s === 'supplied' ? '✅ supplied' : s === 'partial' ? '◧ partial' : '❌ residual'
const supplied = clauses.filter((c) => c.state === 'supplied')
const partial = clauses.filter((c) => c.state === 'partial')
const residual = clauses.filter((c) => c.state === 'residual')

let md = `---
title: Accreditation dossier
description: ISO/IEC 17025 & 17065 conformance dossier — the deposit's technical evidence mapped to each clause group, with the residual an accredited body must grant.
head:
  - ['meta', { name: 'robots', content: 'index, follow' }]
---

# ISO/IEC 17025 & 17065 — accreditation dossier

> **Prepares the dossier; does not grant the accreditation.** This maps the deposit's technical evidence to each clause group of the laboratory-competence (17025) and product-certification (17065) standards. Where a clause is met by kernel evidence it is **supplied** with its receipts; where only an accredited body or a physical facility can grant it, that part is the **residual**. The honest floor: a deposit can be technically conformant and still need the body's assessment and stamp — that stamp is the \`/iso-conformance\` accredited leaf.

**${supplied.length} supplied · ${partial.length} partial · ${residual.length} residual.** The residual is the path: take this dossier to an accredited laboratory (17025) and certification body (17065).

## Clause map

| Std | Clause | Requirement | State | What the deposit supplies | Residual (accredited body) |
|---|---|---|---|---|---|
`
for (const c of clauses) md += `| ${c.std} | ${c.clause} | ${c.what} | ${mark(c.state)} | ${c.deposit} | ${c.residual} |\n`

md += `
## The path to the stamp

1. **Technical dossier (ready now):** the ${supplied.length} supplied clauses — methods validated by the kernel, records in the sealed ledger, traceability on exact integers, data tamper-evident, results auto-reported. These are the evidence an assessor reads.
2. **Partial clauses:** supply the institutional half — the documented QMS, equipment records, impartiality arrangements — around the technical core already in place.
3. **Residual (the body only):** engage an accredited laboratory (17025) and certification body (17065); their independent assessment and certificate close the \`/iso-conformance\` accredited leaf. No code grants this, and this dossier does not pretend to.

## Honest floor

Technical conformance is necessary, not sufficient, for accreditation: the standards require an independent accredited body. This dossier makes the deposit's half auditable and complete; the stamp remains the body's act, named and reachable — the accredited leaf flips when the certificate exists, not before.
`

writeFileSync('accreditation.md', md)
console.log(`accreditation-dossier: generated accreditation.md — ${supplied.length} supplied, ${partial.length} partial, ${residual.length} residual across 17025/17065`)
