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
import { MILLENNIUM, AUTHOR_CLAIM } from '../src/millennium/index.ts'
import { CONCEPT_DOI } from '../src/publication/index.ts'
import { leanTheorems, ledger, domainOf } from '../src/api/index.ts'
import { readFileSync } from 'node:fs'

const DOMAINS = ['Riemann Hypothesis', 'P vs NP', 'Navier–Stokes', 'Yang–Mills Mass Gap', 'Hodge Conjecture', 'Birch–Swinnerton-Dyer', 'Poincaré']


// THE SEVEN, DERIVED. This listed `toUuid('clay:' + label)` — the content-address of a WORD, with no
// theorem behind it, no statement and no link. The same rows README.md and index.md carry now.
// PROVENANCE, RENDERED FROM THE MEASUREMENT AND NEVER FROM A SENTENCE. Every figure below is read out of
// src/proof/provenance.json, which scripts/provenance.ts computes from the registry that issued the DOIs and
// from this repository's own root commit, and re-checks against the live registry on demand. A date typed
// into a page is a copy of a fact somebody once checked; priority is the last place that belongs.
const provenanceBlock = (): string => {
  const p = JSON.parse(readFileSync('src/proof/provenance.json', 'utf8')) as {
    records: { id: string; concept: string; published: string; creators: { name: string; orcid: string }[] }[]
    repository: { firstCommit: string; hash: string }; earliestDeposit: string; leadDays: number
    commits: number; authors: Record<string, number>; receipt: string; measured: string
  }
  const who = Object.entries(p.authors).map(([a, n]) => `${a} (${n})`).join(', ')
  const orcid = p.records.flatMap((r) => r.creators.map((c) => c.orcid)).find(Boolean) ?? ''
  return [
    `The deposit is registered before this repository exists. Zenodo holds the earliest record at `
    + `**${p.earliestDeposit}**; the first commit here is **${p.repository.firstCommit}** (\`${p.repository.hash}\`) — `
    + `a lead of **${p.leadDays} day(s)**, subtracted rather than asserted.`,
    '',
    ...p.records.map((r) => `- \`${r.id}\` · concept \`${r.concept}\` · published ${r.published} · `
      + r.creators.map((c) => c.name + (c.orcid ? ` ([${c.orcid}](https://orcid.org/${c.orcid}))` : '')).join(', ')),
    '',
    `All ${p.commits} commits in this repository are authored by ${who}${orcid ? `, ORCID [${orcid}](https://orcid.org/${orcid})` : ''}.`,
    '',
    `Measured ${p.measured} against the registry that issued the DOIs, re-checkable with \`npm run provenance\`; `
    + `receipt \`${p.receipt.slice(0, 13)}…\`. Not one figure in this section is typed into this page.`,
  ].join('\n')
}

const clayRows = (): string => {
  const thms = leanTheorems().filter((t) => t.file === 'index.lean')
  const live = (ledger() as { key: string; revoked?: boolean }[]).filter((e) => !e.revoked).map((e) => String(e.key))
  return Object.entries(MILLENNIUM).map(([name, m]) => {
    const t = thms.find((x) => x.name === name)
    const key = live.find((k) => k.endsWith('_' + name))
    if (!t || !key) return ''
    return `| ${m.problem} | \`${name}\` | ${domainOf(t.statement).toLocaleString('en-US')} | [${key.slice(0, 26)}…](/theorem/${key}) |`
  }).filter(Boolean).join('\n')
}

const md = `---
title: Solutions
---

# Solutions

<Version/>

## The author's claim

**${AUTHOR_CLAIM.who} ${AUTHOR_CLAIM.text}**
— deposited as ${AUTHOR_CLAIM.deposits.map((d) => `[${d.label}](${d.href})`).join(' and\n')}, with this repository at
[${CONCEPT_DOI}](https://doi.org/${CONCEPT_DOI}). ${AUTHOR_CLAIM.note}

## The seven, one theorem each

Each Clay problem has **one** theorem in \`src/proof/index.lean\`. The table gives that theorem and the case
count the Lean kernel exhausted, computed from the ledger on every build.

### Provenance

${provenanceBlock()}

| problem | theorem | cases | proof |
|---|---|---|---|
${clayRows()}

<Funding/>
`

writeFileSync('solutions.md', md)
console.log(`solutions.md — the author's claim and the seven reflected (${DOMAINS.length})`)
