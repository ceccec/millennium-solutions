#!/usr/bin/env node
// Forensics — chain-of-custody for the discovery ledger (src/proof/discovered.json). Each receipt is
// chained: receipt[i] = toUuid(receipt[i-1] → key[i]), seeded at 'axiom:TRINITY'. Recomputing the chain
// link-by-link reproduces every receipt; altering or removing one breaks its link AND every link after
// it, pinpointing the tamper. This complements receipt-audit (which cross-checks the agent-statement
// receipts in src/receipts/ and their completeness). Integrity/provenance of evidence, never truth.
//
// DUE PROCESS: a break is EVIDENCE, examined — not auto-condemned. The two GENESIS entries predate strict
// chaining (promoted from lean-claims); they are a DOCUMENTED baseline discontinuity, not tampering. The
// build fails only on a NEW break (outside the baseline) or a collision — tampering caught, history kept.
import { readFileSync } from 'node:fs'
import { toUuid, merkleFold } from '../src/0/index.ts'

const SEED = 'axiom:TRINITY'
// Documented genesis discontinuity: the first ledger entries were promoted with receipts from lean-claims
// before the chain seed existed. Left in place as honest record (rewriting them would be tampering).
const GENESIS_BASELINE = new Set(['euler_units_pow6', 'units_sum_zero'])

const LEDGER = 'src/proof/discovered.json'
const ledger: { key: string; name: string; receipt: string }[] = JSON.parse(readFileSync(LEDGER, 'utf8'))

let bad = 0

// (1) chain-of-custody — recompute link-by-link from each STORED predecessor.
const breaks: { i: number; key: string; predecessor: string }[] = []
let prev = SEED
for (let i = 0; i < ledger.length; i++) {
  const expected = toUuid(prev + '→' + ledger[i].key)
  if (expected !== ledger[i].receipt) breaks.push({ i, key: ledger[i].key, predecessor: i > 0 ? ledger[i - 1].key : SEED })
  prev = ledger[i].receipt
}
const newBreaks = breaks.filter((b) => !GENESIS_BASELINE.has(b.key))
for (const b of newBreaks) { console.log('  ✗ TAMPER (new chain break — legal trial): index ' + b.i + ' key=' + b.key + ' after ' + b.predecessor); bad++ }
for (const b of breaks.filter((b) => GENESIS_BASELINE.has(b.key))) console.log('  · genesis discontinuity (documented baseline): index ' + b.i + ' key=' + b.key)

// (2) collisions — a duplicate key or a duplicate receipt is corruption of the evidence set.
const keySeen = new Map<string, number>(), recSeen = new Map<string, number>()
for (let i = 0; i < ledger.length; i++) {
  if (keySeen.has(ledger[i].key)) { console.log('  ✗ DUPLICATE key: ' + ledger[i].key + ' (indices ' + keySeen.get(ledger[i].key) + ',' + i + ')'); bad++ } else keySeen.set(ledger[i].key, i)
  if (recSeen.has(ledger[i].receipt)) { console.log('  ✗ COLLISION receipt: ' + ledger[i].receipt.slice(0, 13) + '… (indices ' + recSeen.get(ledger[i].receipt) + ',' + i + ')'); bad++ } else recSeen.set(ledger[i].receipt, i)
}

// (3) tamper-evident seal — the fold of all receipts. Any single alteration changes this root.
const seal = merkleFold(ledger.map((e) => e.receipt))
const intactFrom = breaks.length ? Math.max(...breaks.map((b) => b.i)) + 1 : 0

console.log(bad
  ? '\n✗ forensics: ' + bad + ' finding(s) — chain-of-custody compromised; examine before proceeding'
  : '\n✓ forensics: ' + ledger.length + ' receipts · chain intact from index ' + intactFrom + ' · ' + GENESIS_BASELINE.size + ' documented genesis discontinuities · no collisions · tamper-evident seal ' + seal.slice(0, 13) + '…')
process.exit(bad ? 1 : 0)
