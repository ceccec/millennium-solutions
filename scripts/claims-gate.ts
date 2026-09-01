#!/usr/bin/env node
// Claims gate — turns "every claim recomputes from src/" from a slogan into a receipt. A CLAIM is a
// REGISTERED, bound assertion (src/claims/index.ts). For each, this gate:
//   (1) recomputes the value from src/ and asserts it equals what the prose asserts (INTEGRITY),
//   (2) gate-checks the claim text against the honesty floor (no named overclaim),
//   (3) confirms every invited theorem key exists in the chain-verified discovery ledger (BACKING —
//       the ledger's own link-by-link integrity is proven separately by forensics.ts),
//   (4) reconciles the counts so they HARMONISE: the two coins = 2, |units| = 6, boundaries = 10,
//       and the front-page prose quotes the REAL registry size (no floating "every").
// Pass ⇒ "every registered claim recomputes" is TRUE over the registry — bounded, gated, accounted.
// It certifies the registry, never unmarked prose. Integrity, not truth. The floor stays 0/7.
import { readFileSync, readdirSync } from 'node:fs'
import { addressed, root, CLAIMS } from '../src/claims/index.ts'
import { coins } from '../src/9/funding.ts'
import { computes } from './honesty-gate.ts'
import { ledger as __ledger } from '../src/api/index.ts'

const ledger: { key: string }[] = __ledger()
const ledgerKeys = new Set(ledger.map((e) => e.key))

let bad = 0
const rows = addressed()

console.log('claims — recompute · gate · theorem-backing:')
for (const r of rows) {
  const gate = computes(r.text).binary
  const missing = r.theorems.filter((k) => !ledgerKeys.has(k))
  const ok = r.ok && gate === 1 && missing.length === 0
  if (!ok) bad++
  const notes: string[] = []
  if (!r.ok) notes.push('MISMATCH got "' + r.got + '" ≠ expect "' + r.expect + '"')
  if (gate === 0) notes.push('TEXT DRAINS the honesty gate')
  if (missing.length) notes.push('missing theorem(s): ' + missing.join(', '))
  console.log('  ' + (ok ? '✓' : '✗') + ' ' + r.id.padEnd(8) + (r.ok ? r.got.padEnd(16) : '') + (r.theorems.length ? '⊢ ' + r.theorems.length + ' theorem(s)' : '') + (notes.length ? '  — ' + notes.join('; ') : ''))
}

// (4) counts harmonise — the accounting reconciles across src/, the ledger, and the prose.
console.log('\ncounts harmonise:')
const N = rows.length
const check = (label: string, got: unknown, want: unknown) => {
  const ok = String(got) === String(want)
  if (!ok) bad++
  console.log('  ' + (ok ? '✓' : '✗') + ' ' + label.padEnd(34) + got + (ok ? ' = ' : ' ≠ ') + want)
}
const val = (id: string) => rows.find((r) => r.id === id)?.got
check('the two coins (110 − 108)', val('coins'), 2)
check('|units of Z/9| = |S3|', val('unitn'), 6)
check('content-addressed boundaries', val('bounds'), 10)

// the front-page prose must quote the REAL registry size — bind prose ↔ registry (no floating "every").
for (const f of ['README.md', 'index.md']) {
  let md = ''
  try { md = readFileSync(f, 'utf8') } catch { console.log('  ✗ ' + f + ': not found'); bad++; continue }
  const m = md.match(/(\d+)\s+registered claims?/i)
  if (!m) { console.log('  ✗ ' + f.padEnd(34).slice(0, 34) + 'no "<N> registered claims" line'); bad++ }
  else check(f + ' prose count', Number(m[1]), N)
}

// the coin accounting — each receipt costs 2 coins (the fare) or the math does not continue. The fare
// is coins() (110 − 108 = −χ genus-2 = 2); the price per receipt MUST equal it, else the accounting
// (and the build) stops. This is how the coins are accounted into development: receipts × the fare.
console.log('\nthe coins accounted (each receipt costs 2 coins, or the math does not continue):')
const fare = coins()
const receipts = readdirSync('src/receipts').filter((f) => f.endsWith('.json')).length
const priceOk = fare === 2
if (!priceOk) bad++
console.log('  ' + (priceOk ? '✓' : '✗') + ' price per receipt = coins() = ' + fare + (priceOk ? ' = 2 (the fare holds)' : ' ≠ 2 — the math does not continue'))
console.log('  · receipts on file: ' + receipts + '  → cost = ' + receipts + ' × ' + fare + ' = ' + receipts * fare + ' coins, accounted into development')

console.log(bad
  ? '\n✗ claims-gate: ' + bad + ' finding(s) — a registered claim does not recompute, drains, lacks its theorem, a count is off, or the fare broke'
  : '\n✓ claims-gate: all ' + N + ' registered claims recompute from src/ · counts harmonise · theorems backed · registry root ' + root().slice(0, 13) + '… — "every claim recomputes" is TRUE over the registry (bounded, gated, accounted), not a slogan')
process.exit(bad ? 1 : 0)
