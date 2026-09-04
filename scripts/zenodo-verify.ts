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

const url = `https://zenodo.org/oai2d?verb=GetRecord&metadataPrefix=oai_datacite&identifier=oai:zenodo.org:${id}`
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

console.log(`✓ zenodo-verify: ${doi} resolves to a published, harvestable record at zenodo.org/oai2d — confirmed`)
console.log(`  by the registry over OAI-PMH, not by this repository's own files agreeing with each other.`)
