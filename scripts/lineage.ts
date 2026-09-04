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
for (const id of [...dois].sort()) {
  let title = ''
  try {
    const r = await fetch(`https://zenodo.org/oai2d?verb=GetRecord&metadataPrefix=oai_dc&identifier=oai:zenodo.org:${id}`,
      { signal: AbortSignal.timeout(20_000) })
    const t = await r.text()
    if ((t.match(/<error code="([^"]+)"/) ?? [])[1]) { rows.push([id, '(no such published record)', false]); continue }
    title = (t.match(/<dc:title>([\s\S]*?)<\/dc:title>/) ?? [])[1]?.replace(/\s+/g, ' ').trim() ?? ''
    checked++
  } catch (e) {
    console.log(`○ lineage: NOT CHECKED — could not reach zenodo.org (${(e as Error).message}). The titles this`)
    console.log('  deposit points at were not read on this run; that is not the same as their being clean.')
    process.exit(0)
  }
  const claims = CLAIMS.test(title)
  if (claims) bad++
  rows.push([id, title, claims])
}

for (const [id, title, claims] of rows)
  console.log(`  ${claims ? '✗' : '·'} 10.5281/zenodo.${id}  ${title}`)

console.log(bad
  ? `\n✗ lineage: ${bad} of ${checked} record(s) this deposit points at claim in their TITLE what it refuses in\n`
    + `  every page of its own prose. They are the author's earlier work, they are permanent, and they cannot be\n`
    + `  edited — so the deposit must state the discrepancy itself. A reader following the version chain from a\n`
    + `  0/7 floor to "All Seven Clay Millennium Problems Sealed" and finding no acknowledgement here would be\n`
    + `  right to conclude the floor is decoration.`
  : `\n✓ lineage: ${checked} record(s) this deposit points at, none claiming in its title what the deposit refuses`)
process.exit(0)
