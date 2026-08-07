#!/usr/bin/env node
// Review + seal orchestration. Reviews every abstract-bearing file for claims that
// contradict the honest layer (0/7), then content-address-seals the consistent set.
import { readFileSync, readdirSync } from 'node:fs'
import { toUuid, merkleFold } from '../src/0/index.ts'
import { computes } from './honesty-gate.ts'

// ALL prose is audited — globbed, not a hardcoded list, so new files auto-enter the audit and
// "all prose is audited" holds BY CONSTRUCTION (no silent gaps). excludes deps + generated output.
const EXCLUDE = /(^|[/\\])(node_modules|\.git)([/\\]|$)|\.vitepress[/\\](dist|cache)[/\\]|[/\\](en|bg|de|es|fr|ru|zh)[/\\]/
const FILES = [
  ...readdirSync('.', { recursive: true }).map(String)
    .filter((f) => f.endsWith('.md') && !EXCLUDE.test(f)),
  '.zenodo.json', 'CITATION.cff', 'paper.tex',
].filter((f, i, a) => a.indexOf(f) === i).sort()
// red flags (the shared honesty gate): unqualified claims the Clay problems are proven/solved

let leaves = [], flagged = []
for (const f of FILES) {
  let txt = ''
  try { txt = readFileSync(f, 'utf8') } catch { continue }
  const { binary, hit } = computes(txt)
  const seal = toUuid(f + ':' + txt)
  if (!binary) flagged.push({ f, hit })
  leaves.push(seal)
  console.log((binary ? ' seal ' : ' FLAG ') + f.padEnd(22) + seal.slice(0, 13) + (binary ? '' : '   ← "' + hit + '"'))
}
console.log('\ndeposit merkle root:', merkleFold(leaves))
console.log(flagged.length === 0
  ? '\n✓ ALL SEALED — every abstract consistent with the 0/7 layer.'
  : '\n✗ ' + flagged.length + ' file(s) FLAGGED — contradict the honest layer; reconcile before sealing:\n  ' + flagged.map(x => x.f).join(', '))
process.exit(flagged.length === 0 ? 0 : 1)
