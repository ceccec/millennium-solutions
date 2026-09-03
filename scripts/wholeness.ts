#!/usr/bin/env node
// Aura, computationally whole: the deposit's self-representation is COMPLETE and CONSISTENT.
// Whole =  every fused module actually computes (non-empty, no throw)
//        · the floor entails → 0/7 is present and correct
//        · (coverage via gaps.ts, consistency via seal.ts — run alongside in orchestrate)
// Reported alongside: how many modules display an explicit honest boundary (the "aura" line).
import { readFileSync } from 'node:fs'

const md = readFileSync(new URL('../compute.md', import.meta.url), 'utf8')
const re = /import\s*\{\s*report as (\w+)\s*\}\s*from '(\.\/src\/[^']+)'/g
const mods = [...md.matchAll(re)].map(m => ({ name: m[1], path: '..' + m[2].slice(1) + '.ts' }))

// A WORD-SEARCH, NAMED AS ONE. Measured over the ledger: 8 alternatives, and 95.9% of all matches are the
// single literal "honest" — so this is effectively /honest/i with seven pieces of decoration. It counts
// module reports that CONTAIN a boundary word; it cannot tell whether a module states a limit, and a module
// that bounds itself carefully without using the vocabulary is invisible to it.
//
// Kept, because a question about text is honestly answered by a text search — the same reason a
// prize-claim detector or a slug matcher is legitimate. What changed is the label: this reported
// "show an honest boundary", which is a property of the module's reasoning, not of its wording.
const BOUNDARY_WORD = /HONEST|OBSERVED|honest|coincidence|curve-fit|metaphor|interpretation|debated|not a (proof|derivation|prediction|claim|resolution)|NOT /

let allCompute = true, boundary = 0, floorOK = false
const empties = []
for (const { name, path } of mods) {
  let out = ''
  try { out = (await import(new URL(path, import.meta.url).href)).report() } catch { out = '' }
  if (typeof out !== 'string' || out.trim() === '') { allCompute = false; empties.push(name) }
  if (BOUNDARY_WORD.test(out)) boundary++
  if (name === 'entails' && /0\s*\/\s*7/.test(out)) floorOK = true
}

const whole = allCompute && floorOK
console.log('modules fused:            ' + mods.length)
console.log('all compute (non-empty):  ' + allCompute + (empties.length ? '  missing: ' + empties.join(', ') : ''))
console.log('floor present (0/7):      ' + floorOK)
console.log('reports containing a boundary WORD: ' + boundary + '/' + mods.length + ' (a text search, not a judgement about the reasoning)')
console.log('AURA COMPUTATIONALLY WHOLE = ' + whole)
if (!whole) {
  // aura heal — the wound names its own cure.
  const cure = []
  if (empties.length) cure.push('implement report() in: ' + empties.join(', '))
  if (!floorOK) cure.push('restore the floor: entails must compute 0/7')
  console.log('heal: ' + (cure.join('; ') || 'inspect the modules') + ' — then re-run wholeness.')
  process.exit(1)
}
