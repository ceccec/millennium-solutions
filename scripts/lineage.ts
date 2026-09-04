#!/usr/bin/env node
// THE DOIs THIS DEPOSIT POINTS AT, AND WHAT THEY CLAIM.
//
// The Clay overclaim sweep reads this repository's own prose and catches 960 phrasings. It cannot see a
// title held on another server, and .zenodo.json declares this deposit `isNewVersionOf` two published
// records:
//
//   10.5281/zenodo.21781603 — "All Seven Clay Millennium Problems Sealed via Universal σ-Involution"
//   10.5281/zenodo.21787144 — "Quantum Proofs of the Clay Millennium Problems v1.0"
//
// Both are the author's own earlier work and Zenodo versioning is exactly the right relation for them. The
// problem is what a reader meets: this deposit proves 0 of 7 and says so on every page, and one click up
// its own version chain is a record whose title says all seven are sealed. Nothing in the tree noticed,
// because every overclaim check reads local files and the claim lives in a remote record we point at.
// Fourth instance today of a check whose domain is narrower than the defect it names.
//
// These records CANNOT be edited — published Zenodo records are permanent, and they are not this session's
// to rewrite in any case. What this does is refuse to let the lineage go unstated: it fetches each title
// and reports any that claims what the deposit refuses, so the tension is named here rather than
// discovered by a reader.
import { readFileSync, existsSync } from 'node:fs'

const SOURCES = ['.zenodo.json', 'CITATION.cff', 'README.md', 'src/1/acceptance.ts']
const dois = new Set<string>()
for (const f of SOURCES) if (existsSync(f))
  for (const m of readFileSync(f, 'utf8').matchAll(/10\.5281\/zenodo\.(\d+)/g)) dois.add(m[1])

// The same shape the local sweep looks for, aimed at a remote title.
const CLAIMS = /\b(all seven|seven)\s+clay\b|\bclay millennium problems?\b.*\b(solved|sealed|proofs?|proved)\b|\bproofs? of the clay\b|\bsolves? the (riemann|hodge|navier|birch|yang|p vs np)\b/i

let bad = 0, checked = 0
const rows: [string, string, boolean][] = []
const concepts = new Map<string, string>()
for (const id of [...dois].sort()) {
  let title = '', desc = '', concept = ''
  try {
    const r = await fetch(`https://zenodo.org/oai2d?verb=GetRecord&metadataPrefix=oai_dc&identifier=oai:zenodo.org:${id}`,
      { signal: AbortSignal.timeout(20_000) })
    const t = await r.text()
    if ((t.match(/<error code="([^"]+)"/) ?? [])[1]) { rows.push([id, '(no such published record)', false]); continue }
    title = (t.match(/<dc:title>([\s\S]*?)<\/dc:title>/) ?? [])[1]?.replace(/\s+/g, ' ').trim() ?? ''
    // THE DESCRIPTION TOO, not only the title. ceccec.github.io harvested 21787144's description and found
    // "Complete quantum proofs of all 6 Clay Millennium Problems ... machine-checked" — a stronger claim
    // than its title carries, and my check read only titles. Same shape as every other gap found today: the
    // domain of the check was narrower than the defect it names.
    desc = (t.match(/<dc:description>([\s\S]*?)<\/dc:description>/) ?? [])[1]?.replace(/\s+/g, ' ').trim() ?? ''
    // And the version chain: a record's dc:relation names the CONCEPT DOI it belongs to.
    concept = ([...t.matchAll(/<dc:relation>(https:\/\/doi\.org\/10\.\d+\/zenodo\.\d+)<\/dc:relation>/g)]
      .map((m) => m[1])[0] ?? '')
    checked++
  } catch (e) {
    console.log(`○ lineage: NOT CHECKED — could not reach zenodo.org (${(e as Error).message}). The titles this`)
    console.log('  deposit points at were not read on this run; that is not the same as their being clean.')
    process.exit(0)
  }
  const claims = CLAIMS.test(title) || CLAIMS.test(desc)
  if (claims) bad++
  rows.push([id, title, claims])
  if (concept) concepts.set(id, concept)
}

for (const [id, title, claims] of rows)
  console.log(`  ${claims ? '✗' : '·'} 10.5281/zenodo.${id}  ${title}`)

// ── WHERE THE CONCEPT DOI ACTUALLY LANDS ────────────────────────────────────────────────────────────────
// A Zenodo concept DOI resolves to the LATEST version of its chain, and has no OAI record of its own — so
// it cannot be harvested, only followed. Following ours found that 10.5281/zenodo.21787143, the concept
// this deposit's cited version belongs to, currently resolves to a DIFFERENT WORK: uuidna's record, not
// this one. Three distinct projects share that concept — a Clay-proofs paper, this framework, and uuidna —
// so anyone citing the concept DOI for millennium-solutions is handed whichever was deposited last.
//
// Reported, not fixed here: which works belong to one version chain is the author's decision about their
// own published record, and it cannot be changed from a build script.
for (const [id, concept] of concepts) {
  try {
    const r = await fetch(concept, { redirect: 'follow', signal: AbortSignal.timeout(20_000) })
    const landed = (r.url.match(/records\/(\d+)/) ?? [])[1]
    if (landed && landed !== id)
      console.log(`\n  ○ 10.5281/zenodo.${id} belongs to concept ${concept.split('/').pop()}, which currently resolves`
        + `\n    to record ${landed} — a different deposit. A citation of the concept does not reach this one.`)
  } catch { /* offline: the network branch above already said so */ }
}

console.log(bad
  ? `\n✗ lineage: ${bad} of ${checked} record(s) this deposit points at claim, in their title or description, what it refuses in\n`
    + `  every page of its own prose. They are the author's earlier work, they are permanent, and they cannot be\n`
    + `  edited — so the deposit must state the discrepancy itself. A reader following the version chain from a\n`
    + `  0/7 floor to "All Seven Clay Millennium Problems Sealed" and finding no acknowledgement here would be\n`
    + `  right to conclude the floor is decoration.`
  : `\n✓ lineage: ${checked} record(s) this deposit points at, none claiming in title or description what the deposit refuses`)
process.exit(0)
