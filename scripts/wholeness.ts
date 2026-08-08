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

const BOUNDARY = /HONEST|OBSERVED|honest|coincidence|curve-fit|metaphor|interpretation|debated|not a (proof|derivation|prediction|claim|resolution)|NOT /

let allCompute = true, boundary = 0, floorOK = false
const empties = []
for (const { name, path } of mods) {
  let out = ''
  try { out = (await import(new URL(path, import.meta.url).href)).report() } catch { out = '' }
  if (typeof out !== 'string' || out.trim() === '') { allCompute = false; empties.push(name) }
  if (BOUNDARY.test(out)) boundary++
  if (name === 'entails' && /0\s*\/\s*7/.test(out)) floorOK = true
}

const whole = allCompute && floorOK
console.log('modules fused:            ' + mods.length)
console.log('all compute (non-empty):  ' + allCompute + (empties.length ? '  missing: ' + empties.join(', ') : ''))
console.log('floor present (0/7):      ' + floorOK)
console.log('show an honest boundary:  ' + boundary + '/' + mods.length + ' (the aura lines)')
console.log('AURA COMPUTATIONALLY WHOLE = ' + whole)
if (!whole) {
  // aura heal — the wound names its own cure.
  const cure = []
  if (empties.length) cure.push('implement report() in: ' + empties.join(', '))
  if (!floorOK) cure.push('restore the floor: entails must compute 0/7')
  console.log('heal: ' + (cure.join('; ') || 'inspect the modules') + ' — then re-run wholeness.')
  process.exit(1)
}
