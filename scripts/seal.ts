#!/usr/bin/env node
// Review + seal orchestration. Reviews every abstract-bearing file for claims that
// contradict the honest layer (0/7), then content-address-seals the consistent set.
import { readFileSync } from 'node:fs'
import { toUuid, merkleFold } from '../src/0/index.ts'
import { computes } from './honesty-gate.ts'

const FILES = [
  'index.md', 'RESEARCH.md', 'PROOF-OF-CONCEPT.md', 'REALISATIONS.md',
  'SEQUENCE-DECODE.md', 'PHYSICS-SCALES.md', 'compute.md', 'proofs.md',
  'README.md', '.zenodo.json', 'CITATION.cff', 'paper.tex',
]
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
