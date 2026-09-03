#!/usr/bin/env node
// PRIOR-ART.md — what this deposit restates, whom it credits, and the exact shape of what it claims.
//
// Two things are generated here and neither is written by hand:
//
//   THE REGISTER. Every .lean file declares `prior_art:` in its own frontmatter. Files that restate work
//   with an earlier author declare `named` and carry the attribution; files about this deposit's own
//   construction declare `none-known`. This reads those declarations and renders them.
//
//   THE GUARD. src/proof/priorart.lean holds the same partition as a table the kernel decides over. A table
//   written in one place and the truth living in another is the drift this repository keeps finding, so the
//   two are compared here and the build stops if they disagree — the Lean table cannot quietly describe a
//   set of files that is not the set on disk.
//
// WHAT IS NOT DONE HERE, deliberately: no DOI is asserted for any prior art. The attributions below are
// author and year, which is what can be stated responsibly from the sources themselves; inventing a resolver
// identifier for someone else's paper would be a fabricated citation, and a fabricated citation in a
// document about attribution is the worst possible place for one. Where a reader needs the identifier they
// have the author, the year and the title, which is enough to find it.
import { writeFileSync, readFileSync } from 'node:fs'
import { leanFiles, leanSource, leanTheorems, frontmatter } from '../src/api/index.ts'
import { escapeHtml } from '../src/html/index.ts'
import { toUuid, merkleFold } from '../src/0/index.ts'

const T = leanTheorems()
const files = leanFiles()

type Kind = 'named' | 'unclassified' | 'none-known'
const KIND: Record<Kind, number> = { named: 0, unclassified: 1, 'none-known': 2 }
type Row = { file: string; kind: Kind; note: string; domain: string; search: string; theorems: number }
const rows: Row[] = files.map((f) => {
  const fm = frontmatter(f)
  const kind = fm.prior_art as Kind
  if (!(kind in KIND)) {
    console.error(`✗ prior-art: ${f} declares prior_art: ${JSON.stringify(fm.prior_art ?? '(missing)')} — must be \`named\`, \`unclassified\` or \`none-known\``)
    process.exit(1)
  }
  // A CLAIM REQUIRES A SEARCH THAT WAS ACTUALLY PERFORMED. `none-known` is the only kind that claims
  // novelty, so it must name what was searched, where and when. Without that it is an assertion that
  // nothing earlier exists because nobody looked, which is what this whole file exists to refuse.
  if (kind === 'none-known' && !fm.prior_art_search) {
    console.error(`✗ prior-art: ${f} declares \`none-known\` but names no search — add \`-- prior_art_search:\` saying what was searched, where and when`)
    process.exit(1)
  }
  // A source that restates earlier work must say WHOSE and in WHAT FIELD. An attribution left blank is a
  // credit not given, so it fails rather than rendering an empty cell.
  if (kind === 'named' && (!fm.prior_art_note || !fm.prior_art_domain)) {
    console.error(`✗ prior-art: ${f} declares \`named\` but carries no ${!fm.prior_art_domain ? 'prior_art_domain' : 'prior_art_note'} — restating work without crediting it is the one thing this page exists to prevent`)
    process.exit(1)
  }
  return { file: f, kind, note: fm.prior_art_note ?? '', domain: fm.prior_art_domain ?? '', search: fm.prior_art_search ?? '', theorems: T.filter((t) => t.file === f).length }
})

// ── THE GUARD — the Lean table must describe the files that are actually here ────────────────────────────
// priorart.lean lists one row per file, in the order leanFiles() returns them, with kind 0 = named and
// kind 1 = none-known. If a file is added, removed or re-declared and that table is not updated, the claim
// rendered below would describe a set of sources that does not exist.
const leanTable = [...leanSource('priorart.lean').matchAll(/^\s*[,[]\s*\(\d+,\s*(\d+),\s*(true|false)\s*\)\s*--\s*([A-Za-z_0-9]+\.lean)/gm)]
  .map((m) => ({ kind: Number(m[1]), novelty: m[2] === 'true', file: m[3] }))

const problems: string[] = []
if (leanTable.length !== rows.length)
  problems.push(`priorart.lean lists ${leanTable.length} sources; src/proof holds ${rows.length}`)
for (let i = 0; i < Math.min(leanTable.length, rows.length); i++) {
  const a = leanTable[i], b = rows[i]
  if (a.file !== b.file) { problems.push(`row ${i + 1}: priorart.lean says ${a.file}, the sources in order give ${b.file}`); continue }
  const declared = KIND[b.kind]
  if (a.kind !== declared) problems.push(`${b.file}: priorart.lean has kind ${a.kind}, the file declares ${b.kind} (kind ${declared})`)
  if (a.novelty !== (b.kind === 'none-known')) problems.push(`${b.file}: priorart.lean claims novelty ${a.novelty}, the file declares ${b.kind}`)
}
if (problems.length) {
  console.error('✗ prior-art: the Lean table and the sources disagree — nothing written')
  for (const p of problems.slice(0, 10)) console.error('  · ' + p)
  process.exit(1)
}

// ── the page ─────────────────────────────────────────────────────────────────────────────────────────────
const named = rows.filter((r) => r.kind === 'named')
const own = rows.filter((r) => r.kind !== 'named')
const claimed = rows.filter((r) => r.kind === 'none-known')
const namedThms = named.reduce((n, r) => n + r.theorems, 0)
const ownThms = own.reduce((n, r) => n + r.theorems, 0)
const seal = merkleFold(rows.map((r) => toUuid(r.file + ':' + r.kind)))
const n = (x: number) => x.toLocaleString('en-US')

const namedRow = (r: Row) =>
  `<tr><td><code>${r.file}</code></td><td>${r.theorems}</td><td>${escapeHtml(r.domain)}</td><td>${escapeHtml(r.note)}</td></tr>`
const ownRow = (r: Row) =>
  `<tr><td><code>${r.file}</code></td><td>${r.theorems}</td><td>${r.note ? escapeHtml(r.note) : '—'}</td></tr>`

// The domains, derived from the declarations rather than listed — each is a field this deposit has decided
// something inside, and therefore a place where its finite-domain results meet an existing literature.
const domains = [...new Set(named.map((r) => r.domain))].sort()

// Derived, not typed. The claim that the attributed work predates the DOI system is a claim about the years
// in the attributions, so it is read off them — a sentence carrying a number the derivation could move away
// from is the defect this repository keeps finding.
const DOI_SYSTEM_BEGAN = 2000
const years = [...new Set((named.map((r) => r.note).join(' ').match(/\b(?:[6-9]\d{2}|1\d{3}|20[0-2]\d)\b/g) ?? []).map(Number))].sort((a, b) => a - b)
const preDoi = years.filter((y) => y < DOI_SYSTEM_BEGAN).length

const md = `---
title: Prior art
description: What this deposit restates from named earlier work, what it claims as its own, and why claiming is not the same as establishing novelty.
head:
  - ['meta', { name: 'robots', content: 'index, follow' }]
---
# Prior art — what is restated, what is claimed, and the difference

Of ${n(T.length)} machine-checked theorems, **${n(namedThms)}** restate work that already has an author and
**${n(ownThms)}** are about this deposit's own construction. Each source file declares which it is, in its own
frontmatter; [\`src/proof/priorart.lean\`](https://github.com/ceccec/millennium-solutions/blob/main/src/proof/priorart.lean)
holds the same partition as a table the kernel decides over, and the build fails if the two disagree.

## What is claimed

**Priority, which is evidenced.** A dated, content-addressed publication: the DOI fixes the date, the
append-only receipt chain fixes which statement was published, and anyone can recompute either. Priority says
*this was published, in this form, by this date*.

**Not novelty, which is not.** Nothing here can decide that no earlier work states a result — a kernel decides
propositions over finite domains, it does not search the literature. \`noveltyEstablished = 0\` is a theorem in
\`priorart.lean\` for the same reason \`provenHere = 0\` is one: the boundary is checked on every run rather
than remembered. **No prior art known to the author** is a fact about the author. **No prior art exists** is a
fact about the world, and this deposit does not assert it.

### The partition, which must be read as three numbers and never as one

| | theorems |
|---|---|
| attributed to named earlier work | **${n(namedThms)}** |
| unclassified — no search performed, status unknown | **${n(ownThms)}** |
| claimed as novel | **${claimed.length}** |

**Zero claims is not full attribution.** Stated alone, "this deposit claims no novelty" reads as a concession
that everything here already has an author. It is not that. **${n(ownThms)}** theorems have had no prior-art
search at all, so their status is unknown rather than conceded — and of the ${years.length} distinct years the
attributions carry, **${preDoi}** predate the DOI system (${DOI_SYSTEM_BEGAN}); the earliest is ${years[0]}. "Every
theorem has registered prior art" is therefore not merely unproven here, it is impossible. The zero has exactly one meaning: **nobody has
looked.** It is a statement about work not done, not about work found.

\`zero_claims_is_not_full_attribution\` decides those two facts together in the kernel, so the count and its
caveat cannot be separated by an edit.

A source may claim novelty only if it names a prior-art search that was actually performed — what was
searched, where, and when. An earlier version of this page claimed novelty for ${own.length} sources and
${n(ownThms)} theorems on the strength of their own self-description, with nobody having looked. Asserting
that nothing earlier exists because no one went to check is the same defect as asserting a proof because no
one went to read it.

## Restated from named earlier work — ${named.length} sources, ${n(namedThms)} theorems

No novelty is claimed over any of these. What is done here is to decide each over a stated finite domain,
which is a contribution of verification, not of discovery.

<table><thead><tr><th>source</th><th>theorems</th><th>domain</th><th>whose work</th></tr></thead><tbody>
${named.map(namedRow).join('\n')}
</tbody></table>

### The domains this touches

${domains.map((d) => `- **${escapeHtml(d)}** — ${named.filter((r) => r.domain === d).reduce((a, r) => a + r.theorems, 0)} theorems, in ${named.filter((r) => r.domain === d).map((r) => '`' + r.file + '`').join(', ')}`).join('\n')}

Each is a field with an existing literature, and each is where this deposit's contribution actually sits: not
a new result, but an exhaustive machine-checked decision of a known one over a **stated finite domain**. That
is worth saying precisely, because it is both smaller than a discovery claim and more checkable than one.

Author and year are given rather than a resolver identifier. Asserting a DOI for someone else's paper without
verifying it would be a fabricated citation, and this is the worst document in the deposit to put one in.

## This deposit's own construction — ${own.length} sources, ${n(ownThms)} theorems, none claimed

The ℤ/9 vortex framework, its ledger, its receipts, and the enumeration its own generators proposed. These are
**unclassified**: no prior-art search has been performed for them, so nothing is claimed about them either
way. They are listed because a reader deserves to know which parts of the deposit are its own construction —
not as an assertion that no one has been here before.

To move a source out of this table, add \`-- prior_art_search:\` to it naming the search performed; the build
refuses a \`none-known\` declaration that does not carry one.

<table><thead><tr><th>source</th><th>theorems</th><th>note</th></tr></thead><tbody>
${own.map(ownRow).join('\n')}
</tbody></table>

## Defensive publication

These are decidable mathematical facts, and mathematical methods as such are excluded subject matter under
EPC Art. 52(2)(a) — see [Rights](/rights). Publishing them openly and with a date is **defensive publication**:
it keeps them available to everyone rather than granting anyone a monopoly. That is the purpose of the
priority claim above, and it is the whole of it.

---

Partition seal \`${seal}\` · recompute with \`node scripts/priorart.ts\` · the kernel re-decides
\`priorart.lean\` on every run. A content-address proves integrity, not truth. \`entails → 0/7\`.
`

// THE COUNT AND ITS CAVEAT MOVE TOGETHER. A page that prints "claims: 0" without the unclassified count
// beside it invites exactly the misreading the theorem above refuses, so the render is checked before it
// is written rather than trusted to stay correct through later edits.
if (!md.includes('Zero claims is not full attribution') || !md.includes(n(ownThms))) {
  console.error('✗ prior-art: the rendered page states the claim count without the unclassified count beside it')
  process.exit(1)
}
writeFileSync('PRIOR-ART.md', md)
console.log(`✓ prior-art: ${rows.length} sources — ${named.length} restate named work (${n(namedThms)} theorems), ${own.length} are this deposit's own (${n(ownThms)}); Lean table agrees with every declaration · seal ${seal.slice(0, 13)}…`)
