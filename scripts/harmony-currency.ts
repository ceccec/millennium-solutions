#!/usr/bin/env node
// Harmony (the 64-bit currency) — the true currency adopted by all with no exception is the 64-bit coin
// (coin64: the top 64 bits of a content-address). EVERY module in src/** that declares report() is a
// contributor (code, logic, art); each mints a coin from its ACTUAL computed output. All coins fold into
// ONE 64-bit harmonic root.
//
// EASY, HARD TO VIOLATE, NO CHANGE WITHOUT RECEIPT:
//   · easy      — a module contributes by simply computing (non-empty report(), no throw).
//   · harmonic  — every contributor computes. If ONE breaks on a single level, the set is NOT harmonic.
//   · unfakeable— the coin is minted from real output, so green cannot be faked (green = measured state).
//   · receipted — the harmonic root IS the receipt of the state: change any module's output and the root
//                 moves. You cannot change a contribution without changing the root (the receipt).
// BOUND: a shared green proves INTEGRITY and completeness of the computation, never the TRUTH of the
// content. The floor stays 0/7.
import { readdirSync, statSync, readFileSync } from 'node:fs'
import { pathToFileURL } from 'node:url'
import { coin64 } from '../src/0/imprint.ts'
import { merkleFold } from '../src/0/index.ts'

function walk(dir: string): string[] {
  let out: string[] = []
  for (const e of readdirSync(dir)) {
    const p = dir + '/' + e
    if (statSync(p).isDirectory()) out = out.concat(walk(p))
    else if (p.endsWith('.ts') && /export function report/.test(readFileSync(p, 'utf8'))) out.push(p)
  }
  return out
}

const files = walk('src').sort()
const coins: string[] = []
const broken: string[] = []
for (const f of files) {
  try {
    const m = await import(pathToFileURL(f).href) as { report?: () => unknown }
    const out = m.report?.()
    if (typeof out !== 'string' || out.trim() === '') { broken.push(f + ' (empty)'); continue }
    coins.push(coin64(out)) // the coin is minted from ACTUAL output — unfakeable
  } catch (e) {
    broken.push(f + ' — ' + (e as Error).message.slice(0, 60))
  }
}

for (const b of broken) console.log('  ✗ break: ' + b)
const harmonic = broken.length === 0
const root = merkleFold(coins) // one 64-bit harmonic root over every contributor
console.log('\n' + (harmonic
  ? '✓ harmony: ' + coins.length + ' contributors, each minting a 64-bit coin from its real output · harmonic root ' + root.slice(0, 16) + ' — every level computes; the root IS the receipt of this state (change one, the root moves).'
  : '✗ NOT harmonic: ' + broken.length + ' contributor(s) break on a level (listed above). the wound names its cure: make each report() compute (non-empty, no throw), then re-run.'))
process.exit(harmonic ? 0 : 1)
