#!/usr/bin/env node
// THE DEPOSITIONS AGREE WITH THE PROOF TREE AND WITH THE PUBLISHED DOI, or the build fails.
//
// 336 records that will carry their own DOIs are worth exactly as much as their agreement with what the
// kernel accepts. A deposition naming a theorem that no longer exists, or quoting a statement that has
// since changed, is a citable false record — worse than no record, because a DOI is permanent.
//
// The concept DOI is read from CITATION.cff, not typed here, and cross-checked against README.md and
// .zenodo.json. Three files stating one identifier is three chances for it to drift.
import { readFileSync, existsSync, readdirSync } from 'node:fs'
import { leanTheorems } from '../src/api/index.ts'
import { deposition, ownFiles } from './zenodo-theorems.ts'

let bad = 0
const fail = (m: string) => { console.log('  ✗ ' + m); bad++ }
const OUT = '.zenodo/theorems'

if (!existsSync(OUT)) { console.log('  ✗ no depositions — run `node scripts/zenodo-theorems.ts --write`'); process.exit(1) }

// ── the DOI is one identifier, stated in three places ────────────────────────────────────────────────────
const doi = (readFileSync('CITATION.cff', 'utf8').match(/^doi:\s*"?(10\.\d{4,}\/[^\s"]+)"?/m) ?? [])[1]
if (!doi) fail('CITATION.cff states no concept DOI, so the depositions have nothing to be part of')
else {
  if (!readFileSync('README.md', 'utf8').includes(doi)) fail(`README.md does not carry the concept DOI ${doi} that CITATION.cff states`)
  const z = readFileSync('.zenodo.json', 'utf8')
  if (!z.includes(doi.split('/')[1])) fail(`.zenodo.json does not reference ${doi}`)
}

// ── every own-work theorem has a deposition, and every deposition has a theorem ──────────────────────────
const own = new Set(ownFiles())
const rows = leanTheorems().filter((t) => own.has(t.file))
const onDisk = new Set(readdirSync(OUT).filter((f) => f.endsWith('.json')).map((f) => f.replace(/\.json$/, '')))
for (const t of rows) if (!onDisk.has('lean_' + t.name)) fail(`${t.file}: ${t.name} is this deposit's own work and has no deposition`)
for (const k of onDisk) if (!rows.some((t) => 'lean_' + t.name === k)) fail(`${k}.json deposits a theorem the tree no longer holds — a citable record of something that is gone`)

// ── each deposition still says what the tree says ────────────────────────────────────────────────────────
let drifted = 0
for (const t of rows) {
  const p = `${OUT}/lean_${t.name}.json`
  if (!existsSync(p)) continue
  const want = deposition(t), got = JSON.parse(readFileSync(p, 'utf8'))
  if (JSON.stringify(want) !== JSON.stringify(got)) { drifted++; if (drifted <= 5) fail(`${p} no longer matches the theorem it deposits — regenerate with --write`) }
  if (doi && !JSON.stringify(got.related_identifiers).includes(doi)) fail(`${p} does not name the concept DOI as isPartOf`)
}
if (drifted > 5) fail(`…and ${drifted - 5} more depositions have drifted from the tree`)

console.log(bad
  ? `\n✗ zenodo: ${bad} finding(s) — a deposition disagrees with the proof tree or the published DOI`
  : `\n✓ zenodo: ${rows.length} per-theorem depositions over ${own.size} files, each quoting its Lean statement and `
    + `LaTeX, each naming ${doi} as isPartOf; every one agrees with the kernel-accepted declaration it deposits`)
process.exit(bad ? 1 : 0)
