#!/usr/bin/env node
// Review + seal orchestration. Reviews every abstract-bearing file for claims that
// contradict the honest layer (0/7), then content-address-seals the consistent set.
import { readFileSync } from 'node:fs'
import { toUuid, merkleFold } from '../src/0/index.ts'

const FILES = [
  'index.md', 'RESEARCH.md', 'PROOF-OF-CONCEPT.md', 'REALISATIONS.md',
  'SEQUENCE-DECODE.md', 'PHYSICS-SCALES.md', 'compute.md', 'proofs.md',
  'README.md', '.zenodo.json', 'CITATION.cff', 'paper.tex',
]
// red flags: unqualified claims the Clay problems are proven/solved
const RED = /\bwe prove\b|\bproven\b|confidence\s*=?\s*1\.0|ready for peer review|sealed via universal|all (six|seven)[^.]*proven|solves? the (clay|millennium)/i

let leaves = [], flagged = []
for (const f of FILES) {
  let txt = ''
  try { txt = readFileSync(f, 'utf8') } catch { continue }
  const hit = txt.match(RED)
  const seal = toUuid(f + ':' + txt)
  if (hit) flagged.push({ f, hit: hit[0] })
  leaves.push(seal)
  console.log((hit ? ' FLAG ' : ' seal ') + f.padEnd(22) + seal.slice(0, 13) + (hit ? '   ← "' + hit[0] + '"' : ''))
}
console.log('\ndeposit merkle root:', merkleFold(leaves))
console.log(flagged.length === 0
  ? '\n✓ ALL SEALED — every abstract consistent with the 0/7 layer.'
  : '\n✗ ' + flagged.length + ' file(s) FLAGGED — contradict the honest layer; reconcile before sealing:\n  ' + flagged.map(x => x.f).join(', '))
process.exit(flagged.length === 0 ? 0 : 1)
