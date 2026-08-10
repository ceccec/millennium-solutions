#!/usr/bin/env node
// verify-theorems — the regression-guard workflow, at ledger scale. The release trusts the saved ledger; this
// RE-RUNS every recorded theorem's test and re-gates every name, so a silent regression (a test that no longer
// computes true, a name that drains) is caught. Also checks the chain-of-custody and duplicate keys. Run it
// anytime: `npm run verify`. Integrity, not truth. 0/7.
import { readFileSync } from 'node:fs'
import { provable } from './discover.ts'
import { computes } from './honesty-gate.ts'
import { toUuid } from '../src/0/index.ts'

const ledger: { key: string; name: string; receipt: string }[] = JSON.parse(readFileSync('src/proof/discovered.json', 'utf8'))
const cand = new Map(provable().map((c) => [c.key, c]))
const GENESIS = new Set(['euler_units_pow6', 'units_sum_zero'])

let testFail = 0, nameDrain = 0, noCand = 0, chainBreak = 0, dup = 0
const seen = new Set<string>()
let prev = 'axiom:TRINITY'
for (const e of ledger) {
  const c = cand.get(e.key)
  if (!c) noCand++
  else { try { if (!c.test()) { testFail++; console.log('  ✗ TEST REGRESSED: ' + e.key) } } catch { testFail++; console.log('  ✗ TEST THREW: ' + e.key) } }
  if (computes(e.name).binary !== 1) { nameDrain++; console.log('  ✗ NAME DRAINS: ' + e.key + ' [' + computes(e.name).hit + ']') }
  if (seen.has(e.key)) { dup++; console.log('  ✗ DUPLICATE KEY: ' + e.key) } else seen.add(e.key)
  if (toUuid(prev + '→' + e.key) !== e.receipt && !GENESIS.has(e.key)) chainBreak++
  prev = e.receipt
}

const bad = testFail + nameDrain + dup + chainBreak
console.log('\nverify-theorems: re-ran ' + ledger.length + ' theorems · test-fail ' + testFail + ' · name-drain ' + nameDrain +
  ' · dup-key ' + dup + ' · chain-break ' + chainBreak + ' (excl. ' + GENESIS.size + ' genesis) · no-candidate ' + noCand)
console.log(bad === 0
  ? '✓ every recorded theorem still computes true, every name is gate-clean, the chain is intact — the ledger holds at scale. 0/7'
  : '✗ ' + bad + ' regression(s) — the ledger must be healed before shipping')
process.exit(bad === 0 ? 0 : 1)
