#!/usr/bin/env node
// The forensic tool — for any statement, a recomputable verdict. It NEVER claims absolute truth:
// the honesty gate is a floor, not an oracle (a gate-clean falsehood like "2+2=5" still passes it).
// So the verdict is three-way and honest about its own limit:
//   REFUTED    — the gate drains a named overclaim, OR a supplied decidable test fails (counterexample).
//   SEALED     — gate-clean AND a decidable test holds → recomputable, admissible.
//   UNVERIFIED — gate-clean but no recomputable receipt supplied → the floor is not an oracle; it may
//                still be true or false. Bring a decidable test to move it to SEALED or REFUTED.
// Integrity, not truth. Everything content-addressed. 0/7.
import { computes } from './honesty-gate.ts'
import { toUuid, merkleFold } from '../src/0/index.ts'
import { imprint, readImprint } from '../src/0/imprint.ts'

export type VerdictKind = 'REFUTED' | 'SEALED' | 'UNVERIFIED'
export interface Verdict { statement: string; gateBinary: 0 | 1; verdict: VerdictKind; receipt: string; note: string }

export function adjudicate(statement: string, decidableTest?: () => boolean): Verdict {
  const g = computes(statement)
  const receipt = toUuid(statement)
  if (g.binary === 0) {
    return { statement, gateBinary: 0, verdict: 'REFUTED', receipt, note: 'the honesty gate drains a named overclaim: ' + JSON.stringify(g.hit) }
  }
  if (decidableTest) {
    let holds = false
    try { holds = decidableTest() === true } catch { holds = false }
    return holds
      ? { statement, gateBinary: 1, verdict: 'SEALED', receipt, note: 'gate-clean and a decidable test holds — recomputable, admissible' }
      : { statement, gateBinary: 1, verdict: 'REFUTED', receipt, note: 'gate-clean but its decidable test fails — refuted by counterexample' }
  }
  return { statement, gateBinary: 1, verdict: 'UNVERIFIED', receipt, note: 'gate-clean but no recomputable receipt — the floor is not an oracle; bring a decidable test' }
}

// uuidna quantum verification: recompute the address from its seed (integrity, reproducible by anyone),
// decode any bounded imprinted message, and fold a MULTI-PERSPECTIVE ("quantum") receipt — the same for
// any observer ordering. The quantum here is the multi-perspective structure, not hardware. Integrity, not truth.
export interface UuidnaVerdict { seed: string; address: string; recomputes: boolean; message: string | null; jointReceipt: string }
export function verifyUuidna(seed: string): UuidnaVerdict {
  const address = toUuid(seed)
  const recomputes = toUuid(seed) === address
  let message: string | null = null
  try { if (/^[01]+$/.test(seed)) { message = readImprint(imprint(seed)) === seed ? seed : null } } catch { message = null }
  const perspectives = ['a', 'b', 'c'].map((o) => toUuid(o + '→' + address))
  const jointReceipt = merkleFold(perspectives)
  return { seed, address, recomputes, message, jointReceipt }
}

// CLI: `node scripts/adjudicate.ts "statement one" "statement two" ...`
if (import.meta.url === `file://${process.argv[1]}`) {
  const statements = process.argv.slice(2)
  if (!statements.length) {
    console.log('usage: node scripts/adjudicate.ts "<statement>" ["<statement>" ...]')
  } else {
    for (const s of statements) {
      const v = adjudicate(s)
      const mark = v.verdict === 'SEALED' ? '✓' : v.verdict === 'REFUTED' ? '✗' : '?'
      console.log(`  ${mark} ${v.verdict.padEnd(10)} ${v.receipt.slice(0, 13)}…  ${s}`)
      console.log(`      ${v.note}`)
    }
    console.log('\n  verdicts are integrity, not truth — UNVERIFIED means bring a decidable test. 0/7.')
  }
}
