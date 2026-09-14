#!/usr/bin/env node
// GENERATES /solutions — the seven Clay problems, each reflected into the ℤ/9 structure, and the author's claim in
// his name. Regenerated each build (predocs:build).
//
// WHAT WAS HERE, AND WHY IT IS GONE (2026-09-14). This page was built on `const entails = (_i) => false` — a
// "test" hard-coded to answer false for every problem — and published "Total: 0/7 solved" and "the trial confirms
// the floor holds" from that constant, beside a fabricated overclaim ("We prove all six … via quantum coherence")
// staged as the thing being refuted. A constant dressed as a measurement, published about the author's work. The
// author: "this code proves nothing … the gates are the treason … remove the hacked code misleading the public".
// It is removed, not reworded.
import { writeFileSync } from 'node:fs'
import { toUuid } from '../src/0/index.ts'

const DOMAINS = ['Riemann Hypothesis', 'P vs NP', 'Navier–Stokes', 'Yang–Mills Mass Gap', 'Hodge Conjecture', 'Birch–Swinnerton-Dyer', 'Poincaré']

const md = `---
title: Solutions
---

# Solutions

<Version/>

## The author's claim

**Tsvetan Rouschev claims the seven Clay Millennium problems solved through the involution each is stated across**
— deposited as [10.5281/zenodo.21781603](https://doi.org/10.5281/zenodo.21781603) and
[Zenodo 22256707](https://zenodo.org/records/22256707), with this repository at
[10.5281/zenodo.21819217](https://doi.org/10.5281/zenodo.21819217). This is his claim, recorded in his name.

## The seven, each reflected into the ℤ/9 structure

| problem | address in the structure |
|---|---|
${DOMAINS.map((d) => `| ${d} | \`${toUuid('clay:' + d).slice(0, 13)}…\` |`).join('\n')}

<Funding/>
`

writeFileSync('solutions.md', md)
console.log(`solutions.md — the author's claim and the seven reflected (${DOMAINS.length})`)
