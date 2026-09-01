#!/usr/bin/env node
// PUBLISHED — compare what this repository says against what it has actually published.
//
// ci-health closed one outward blind spot: whether the workflows are passing. This closes the other, which
// is larger — whether the ARTEFACTS are what the tree thinks. A green deploy says a build ran, not that the
// site serves the ledger this repo holds; a green publish workflow says npm was called, not that the version
// on the registry is the one here.
//
// The drift this found on its first run is a good example of why. packages/uuidna is 0.1.1 in the tree and
// @uuidna/uuidna is 0.2.9 on the registry — eight minor versions apart, published from elsewhere — and it is
// the REGISTRY copy the gates import at runtime. That gap is the reason four CI workflows assumed a workspace
// that does not exist, and the reason "just add a workspaces field" is not a safe one-line fix: it would
// swap the citation gate for a lexical one removed by order. None of that was visible from inside the tree.
//
// A READER, like ci-health: it reports, it does not gate. Network state must not decide whether a local
// build is allowed, and offline it says so rather than guessing.
import { execSync } from 'node:child_process'
import { readFileSync } from 'node:fs'
import { ledger, live } from '../src/api/index.ts'

const q = (cmd: string): string | null => {
  try { return execSync(cmd, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim() } catch { return null }
}

const led = ledger()
const rows: string[] = []
let drift = 0

// ── the packages, tree against registry ──
for (const [path, name] of [['package.json', '@ceccec/millennium-solutions'], ['packages/uuidna/package.json', '@uuidna/uuidna']] as [string, string][]) {
  const here = JSON.parse(readFileSync(path, 'utf8')).version as string
  const there = q(`npm view ${name} version`)
  if (there === null) { rows.push(`  ? ${name.padEnd(30)} tree ${here.padEnd(8)} registry unreachable`); continue }
  const same = here === there
  if (!same) drift++
  rows.push(`  ${same ? '✓' : '·'} ${name.padEnd(30)} tree ${here.padEnd(8)} registry ${there}${same ? '' : '  ← differ'}`)
}

// ── the site, against the ledger this tree holds ──
const site = q('curl -sS --max-time 20 https://ceccec.psg.bg/millennium-solutions/')
if (site === null) rows.push('  ? live site                       unreachable')
else {
  const servesTotal = site.includes(String(led.length))
  const servesLive = site.includes(String(live(led).length))
  if (!servesTotal || !servesLive) drift++
  rows.push(`  ${servesTotal && servesLive ? '✓' : '✗'} live site                       serves ledger ${led.length} ${servesTotal ? '✓' : '✗'} · standing ${live(led).length} ${servesLive ? '✓' : '✗'}`)
}

// ── tags against releases: the automation mints a tag per push, and that is worth seeing ──
const tags = (q('git tag --sort=version:refname') ?? '').split('\n').filter(Boolean)
const releases = q('gh release list --limit 100') ?? ''
const released = releases.split('\n').filter(Boolean).length
rows.push(`  · provenance tags ${String(tags.length).padStart(4)}   ·  GitHub releases ${released}   ·  latest tag ${tags[tags.length - 1] ?? '(none)'}`)

console.log('published — what the tree says, against what is actually out there:')
console.log(rows.join('\n'))
console.log(drift
  ? `\n· ${drift} difference(s) between this tree and what it publishes. Reported, not gated: a registry or a\n  site is not this repository, and a build must not depend on reaching either.`
  : '\n✓ published: the tree and its published artefacts agree')
