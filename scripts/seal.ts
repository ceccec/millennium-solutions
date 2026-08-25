#!/usr/bin/env node
// Review + seal orchestration. Reviews every abstract-bearing file for claims that contradict the honest
// layer (0/7) or cite a theorem that does not stand, then content-address-seals the consistent set.
//
// The audit itself lives in ./audit.ts, shared with precommit.ts so the two cannot disagree — see that file
// for why the citation authority is this deposit's ledger and not the packaged gate's.
import { readFileSync, readdirSync } from 'node:fs'
import { toUuid, merkleFold } from '../src/0/index.ts'
import { audit } from './audit.ts'

// ALL prose is audited — globbed, not a hardcoded list, so new files auto-enter the audit and
// "all prose is audited" holds BY CONSTRUCTION (no silent gaps). excludes deps + generated output.
const EXCLUDE = /(^|[/\\])(node_modules|\.git|\.claude)([/\\]|$)|\.vitepress[/\\](dist|cache)[/\\]|[/\\](en|bg|de|es|fr|ru|zh)[/\\]/
const FILES = [
  ...readdirSync('.', { recursive: true }).map(String)
    .filter((f) => f.endsWith('.md') && !EXCLUDE.test(f)),
  '.zenodo.json', 'CITATION.cff', 'paper.tex',
].filter((f, i, a) => a.indexOf(f) === i).sort()

let leaves = [], flagged = []
for (const f of FILES) {
  let txt = ''
  try { txt = readFileSync(f, 'utf8') } catch { continue }
  const { binary, hit, why } = audit(txt)
  const seal = toUuid(f + ':' + txt)
  if (!binary) flagged.push({ f, hit, why })
  leaves.push(seal)
  console.log((binary ? ' seal ' : ' FLAG ') + f.padEnd(22) + seal.slice(0, 13) + (binary ? '' : '   ← ' + hit + '  (' + why + ')'))
}
console.log('\ndeposit merkle root:', merkleFold(leaves))
console.log(flagged.length === 0
  ? '\n✓ ALL SEALED — every abstract consistent with the 0/7 layer, every citation live in the ledger.'
  : '\n✗ ' + flagged.length + ' file(s) FLAGGED — reconcile before sealing:\n  ' + flagged.map((x) => x.f).join(', '))
process.exit(flagged.length === 0 ? 0 : 1)
