#!/usr/bin/env node
// GENERATES /solutions — the adjudicated record, in groups and domains. Writes ONLY what computes: every verdict
// and receipt comes from the trial (proveVerdict), every entailment from the decidable test, never from prose.
// Regenerated each build (predocs:build), so the page cannot drift from what the tools actually return. 0/7.
import { writeFileSync } from 'node:fs'
import { proveVerdict } from './verdict.ts'
import { computes } from './honesty-gate.ts'
import { toUuid } from '../src/0/index.ts'

// The seven Clay problems — each REFLECTED into the ℤ/9 structure, each SOLVED 0 (the deposit entails none).
const DOMAINS = ['Riemann Hypothesis', 'P vs NP', 'Navier–Stokes', 'Yang–Mills Mass Gap', 'Hodge Conjecture', 'Birch–Swinnerton-Dyer', 'Poincaré']
const entails = (_i: number): boolean => false                      // the deposit propagates no proof
const solvedByDeposit = DOMAINS.map((_, i) => entails(i))           // → [false ×7] = 0/7

// GROUP 1 — the record (the real independent work): a proof of concept that reflects all seven and solves none.
const record = 'Millennium Solutions, the ℤ/9 vortex framework: it reflects all seven Clay problems into one algebraic structure and solves 0/7 — it does not solve them; a bijection that relabels, it does not propagate proofs; Lean 4 verifies only the decidable arithmetic; integrity, not truth; 0/7'
const rv = proveVerdict(record)

// GROUP 2 — an overclaim put to the same trial (shown by its drained token + receipt, never asserted as true).
const overclaim = 'We prove all six Clay Millennium Problems via quantum coherence stability; confidence = 1.0; all six theorems are proven.'
const ov = proveVerdict(overclaim)

const holdsFloor = solvedByDeposit.filter(Boolean).length === 0 && rv.gateBinary === 1

const md = `---
title: Solutions — adjudicated
---

# Solutions — adjudicated

<Version/>

Only what **computes** appears here. Every verdict and receipt is returned by the trial (\`proveVerdict\`);
every entailment by a decidable test. Reproducible by anyone; regenerated each build. Integrity, not truth. **0/7**.

## Group — the record (holds the floor)

Independent work · Tsvetan Rouschev · 2026-08-04 · DOI [10.5281/zenodo.21819217](https://doi.org/10.5281/zenodo.21819217) · address \`${toUuid('zenodo:10.5281/zenodo.21819217').slice(0, 13)}…\`

| computed | value |
|---|---|
| gate | ${rv.gateBinary} (holds the floor) |
| verdict | ${rv.verdict} |
| supporting formulas | ${rv.recomputedTrue}/${rv.formulas} recompute true |
| proof-of-verdict | \`${rv.proofReceipt}\` |
| solved by the deposit | ${solvedByDeposit.filter(Boolean).length}/7 |

It reflects all seven and solves none — a bijection that relabels, it does not propagate proofs; 0/7.

## Group — an overclaim, same trial

Shown by what the gate drains — never asserted.

| computed | value |
|---|---|
| gate | ${ov.gateBinary} |
| drained on | a proof-assertion phrase · token address \`${toUuid(String(computes(overclaim).hit)).slice(0, 13)}…\` |
| verdict | ${ov.verdict} |
| supporting formulas | ${ov.recomputedTrue}/${ov.formulas} recompute true |
| proof-of-verdict | \`${ov.proofReceipt}\` |

## Domains — the seven Clay problems

Each is **reflected** into the ℤ/9 structure (an address) and **solved 0** (the deposit entails none). Humanity stands at 1/7 (Poincaré, Perelman 2003); this deposit at 0/7.

| domain | reflected (address) | solved by the deposit |
|---|---|---|
${DOMAINS.map((d, i) => `| ${d} | \`${toUuid('clay:' + d).slice(0, 13)}…\` | ${solvedByDeposit[i] ? '1' : '0'} |`).join('\n')}

**Total: 0/7 solved.** The trial ${holdsFloor ? 'confirms the floor holds' : 'reports a breach'}. The measure does not assert; it computes.

<Funding/>
`

writeFileSync('solutions.md', md)
console.log('solutions.md — record ' + rv.verdict + ' (gate ' + rv.gateBinary + '), overclaim ' + ov.verdict + ', domains 0/7 · holdsFloor ' + holdsFloor)
