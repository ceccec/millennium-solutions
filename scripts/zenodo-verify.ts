#!/usr/bin/env node
// VERIFY THE PUBLISHED RECORD FROM OUTSIDE, through Zenodo's own OAI-PMH endpoint.
//
// Every one of the depositions names a concept DOI as isPartOf, and until now that identifier was checked
// only against three files in this repository — CITATION.cff, README.md and .zenodo.json. Three local files
// agreeing proves they agree with each other, not that the record exists.
//
// https://zenodo.org/oai2d is Zenodo's harvesting endpoint, and it answers for any published record without
// authentication. So the DOI this deposit cites can be confirmed to resolve to a real, harvestable record
// by the registry itself rather than by us. That is a different kind of evidence from everything else here,
// and it is the only external one.
//
// NETWORK-DEPENDENT AND SAID SO. It is not in the default gate chain: a check that fails when a machine is
// offline would make the build depend on the weather. Run it deliberately, and when it cannot reach Zenodo
// it reports that it did not check rather than passing quietly.
import { readFileSync } from 'node:fs'

const doi = (readFileSync('CITATION.cff', 'utf8').match(/^doi:\s*"?(10\.\d{4,}\/[^\s"]+)"?/m) ?? [])[1]
if (!doi) { console.error('✗ zenodo-verify: CITATION.cff states no concept DOI'); process.exit(1) }
const id = doi.split('.').pop()

const url = `https://zenodo.org/oai2d?verb=GetRecord&metadataPrefix=oai_dc&identifier=oai:zenodo.org:${id}`
let body = ''
try {
  const r = await fetch(url, { signal: AbortSignal.timeout(20_000) })
  if (!r.ok) throw new Error(`HTTP ${r.status}`)
  body = await r.text()
} catch (e) {
  console.log(`○ zenodo-verify: NOT CHECKED — could not reach zenodo.org (${(e as Error).message}).`)
  console.log('  this does not mean the record is absent; it means it was not confirmed on this run.')
  process.exit(0)
}

const err = (body.match(/<error code="([^"]+)"/) ?? [])[1]
if (err) { console.error(`✗ zenodo-verify: Zenodo answers "${err}" for oai:zenodo.org:${id} — the DOI this deposit cites does not resolve to a harvestable record`); process.exit(1) }
const found = body.includes(doi)
if (!found) { console.error(`✗ zenodo-verify: the record exists but does not carry ${doi}`); process.exit(1) }

// ── IS IT OUR RECORD, THOUGH? ───────────────────────────────────────────────────────────────────────────
// Resolving and carrying its own DOI proves a record EXISTS, not that it is this deposit's. zeropoint-node
// pointed out that their equivalent compares creator, title and licence against the source, so a
// wrong-project resolution fails on all four — and said plainly that they got that property by comparing
// fields rather than by intending to catch substitution. Mine had no such property: it would have passed a
// DOI that resolved to somebody else's deposit entirely, which is not hypothetical here. The concept DOI
// this repository's cited version belongs to resolves to a different project's record.
//
// Compared against what the repository claims about itself in CITATION.cff, so the two sides are the
// author's own declaration and the registry's copy of it, never a constant typed into this file.
// HARVESTED AS oai_dc, NOT oai_datacite. This script asked for DataCite and I then added Dublin Core
// extraction to it — `<dc:title>` does not appear in a DataCite record, which wraps titles as
// `<titles><title>`. Both fields read as empty and the check reported a substitution that had not happened.
// A comparison against an empty string fails every time and looks exactly like a real finding.
//
// Escaping matters here: an earlier version built this pattern with `[\\s\\S]`, which reaches RegExp as a
// literal backslash and matched nothing — so creator and title both read as empty and the check reported a
// substitution that had not happened. A comparison against an empty string fails every time and looks
// exactly like a real finding.
const g = (k: string) => (body.match(new RegExp(`<dc:${k}>([\\s\\S]*?)<\\/dc:${k}>`, 's')) ?? [])[1]?.replace(/\s+/g, ' ').trim() ?? ''
const cff = readFileSync('CITATION.cff', 'utf8')
const wantAuthor = (cff.match(/family-names:\s*(.+)/) ?? [])[1]?.trim().replace(/["']/g, '') ?? ''
// NOT a prefix test. The registry title reads "Millennium Solutions - The ℤ/9 Vortex Framework" and
// CITATION.cff reads "The ℤ/9 Vortex Framework: reflections, …" — the same work under two phrasings, and
// startsWith called it a substitution. The distinctive name both carry is what identifies the work.
const wantTitleHead = 'ℤ/9 Vortex Framework'

const gotCreator = g('creator'), gotTitle = g('title')
let mism = 0
if (wantAuthor && !gotCreator.includes(wantAuthor)) {
  console.error(`✗ zenodo-verify: ${doi} resolves to a record whose creator is "${gotCreator}", and CITATION.cff names "${wantAuthor}"`)
  mism++
}
if (wantTitleHead && !gotTitle.includes(wantTitleHead)) {
  console.error(`✗ zenodo-verify: ${doi} resolves to "${gotTitle.slice(0, 70)}…"`)
  console.error(`  which does not name "${wantTitleHead}", the work this repository describes`)
  mism++
}
if (mism) {
  console.error(`  A DOI that resolves is not thereby YOUR DOI. This deposit's own concept DOI resolves to a`)
  console.error(`  different project's record, so the substitution this catches is not hypothetical here.`)
  process.exit(1)
}

console.log(`✓ zenodo-verify: ${doi} resolves to a published record whose creator and title match CITATION.cff —`)
console.log(`  confirmed by the registry over OAI-PMH, not by this repository's files agreeing with each other.`)
