#!/usr/bin/env node
// THE FULL TRIAL — every entry in the ledger put in the dock, none exempt.
//
// Nothing is removed by my hand here. Each entry is adjudicated and the verdict is recorded; what happens to
// a REFUTED entry is the captain's to order, not mine to enact. Three verdicts, decided by evidence:
//
//   SEALED     — its test recomputes true, and its name carries no fabricated citation
//   REFUTED    — its test does not recompute true (a counterexample), or its name cites a proof that is not
//                in the ledger (the one decidably-false case under the theorem gate)
//   UNVERIFIED — it has no candidate in the current space, so nothing can be recomputed: not false, just
//                unbacked. A bare UNVERIFIED row is a crack, so each is named.
//
// The gate used is the theorem gate (citation-based). The lexicon was removed by order, so no word-list
// decides anything here. Integrity, not truth.
import { readFileSync, writeFileSync } from 'node:fs'
import { CANDIDATES } from './discover.ts'
import { computes } from './honesty-gate.ts'
import { toUuid, merkleFold } from '../src/0/index.ts'

const ledger = JSON.parse(readFileSync('src/proof/discovered.json', 'utf8')) as { key: string; name: string; receipt: string }[]
const byKey = new Map(CANDIDATES.map((c) => [c.key, c]))
const src = readFileSync('scripts/discover.ts', 'utf8')
const bodyOf = new Map([...src.matchAll(/out\.push\(\{ key: '([a-z_0-9]+)'[\s\S]*?test: \(\) => ([\s\S]*?)\}\)\n/g)].map((m) => [m[1], m[2]]))

type Row = { key: string; verdict: 'SEALED' | 'REFUTED' | 'UNVERIFIED'; ground: string; receipt: string }
const rows: Row[] = []

for (const e of ledger) {
  const c = byKey.get(e.key)
  const body = bodyOf.get(e.key) ?? ''
  const g = computes(e.name)
  const circular = /\(\s*_?\w*\s*(:\s*\w+)?\s*\)\s*(:\s*boolean\s*)?=>\s*false/.test(body) || /\(\s*\)\s*=>\s*true/.test(body)

  let verdict: Row['verdict'], ground: string
  if (!c) { verdict = 'UNVERIFIED'; ground = 'no candidate in the current space — nothing to recompute' }
  else if (g.binary === 0) { verdict = 'REFUTED'; ground = 'its name cites a proof not in the ledger: ' + g.hit }
  else {
    let holds = false
    try { holds = c.test() === true } catch (err) { holds = false }
    if (!holds) { verdict = 'REFUTED'; ground = 'its test does not recompute true — refuted by counterexample' }
    else if (circular) { verdict = 'REFUTED'; ground = 'circular by construction — the test defines the answer it checks' }
    else { verdict = 'SEALED'; ground = 'recomputes true, cites nothing fabricated' }
  }
  rows.push({ key: e.key, verdict, ground, receipt: e.receipt })
}

const count = (v: Row['verdict']) => rows.filter((r) => r.verdict === v).length
const root = merkleFold(rows.map((r) => toUuid(r.verdict + ':' + r.key)))

writeFileSync('src/proof/trial-all.json', JSON.stringify(rows, null, 2) + '\n')

console.log('THE FULL TRIAL — ' + rows.length + ' entries, none exempt\n')
console.log('  SEALED     ' + String(count('SEALED')).padStart(5))
console.log('  REFUTED    ' + String(count('REFUTED')).padStart(5))
console.log('  UNVERIFIED ' + String(count('UNVERIFIED')).padStart(5))
console.log('\n  grounds for refusal, by cause:')
const causes = new Map<string, number>()
for (const r of rows.filter((x) => x.verdict !== 'SEALED')) {
  const k = r.ground.split('—')[0].split(':')[0].trim()
  causes.set(k, (causes.get(k) ?? 0) + 1)
}
for (const [k, n] of [...causes].sort((a, b) => b[1] - a[1])) console.log('    ' + String(n).padStart(5) + '  ' + k)
console.log('\n  verdict root ' + root + ' (order-invariant)')
console.log('  written to src/proof/trial-all.json — every row named, no bare verdict')
