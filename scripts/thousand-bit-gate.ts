#!/usr/bin/env node
// THOUSAND-BIT GATE — the factor route on a 1,000-bit integer, checked by its own arithmetic. Hard fail unless green.
//
//   npm run gate:thousand
//
// GREEN means a full factorisation, and three things hold, each checkable without trusting the route's own status word:
//   1 · the integer is 1,000 bits long (it is a real thousand-bit input, not a shorter one)
//   2 · the factors found, multiplied by the cofactor, give the integer exactly (the decomposition is an identity)
//   3 · the cofactor the route reports as composite is composite by a witness this script recomputes
// A PARTIAL answer is RED: it is an honest account, and the gate does not accept an account in place of a factorisation.
import { factor, millerRabin } from '../src/factor/index.ts'

const N = '7778374705630928901426385188295261064472293439767584450564762904780095317247810822721038446598127186814085438745846911396600071001374809981225413367649417301928427872874705586838153932355802114527488924178998304307438276447053410282371888984822745504021147881223973035161036008037727897669611699130903'

const n = BigInt(N)
const bits = n.toString(2).length
const r = factor(N)
const failures: string[] = []

if (bits !== 1000) failures.push(`the test integer is ${bits} bits, not 1000`)
// THE GATE REQUIRES A FULL FACTORISATION. A PARTIAL answer, however honest, is not green: the test is red until every factor
// of this integer is known and checked. A green result here would need factors this tree has not computed.
if (r.status !== 'FACTORED') failures.push(`the route returns ${r.status}, not FACTORED: no full factorisation of this 1000-bit integer exists in this tree`)
if (r.status === 'REFUSED') failures.push(`the route refused a valid integer: ${r.why}`)
else if (r.status === 'FACTORED') {
  const prod = r.factors.reduce((acc, f) => acc * BigInt(f), 1n)
  if (prod !== n) failures.push('the factors do not multiply to the integer')
} else {
  const prod = r.factors.reduce((acc, f) => acc * BigInt(f), 1n) * BigInt(r.cofactor)
  if (prod !== n) failures.push('the factors times the cofactor do not give the integer')
  if (r.cofactorPrimality === 'composite (a witness was found)' && millerRabin(BigInt(r.cofactor)) !== 'COMPOSITE') {
    failures.push('the route calls the cofactor composite, and the recomputed test does not')
  }
}

// DISCOVERY, WHEN RED. The gate does not stop at "red": it names every tool in the catalogue that touches factorisation,
// what each one can contribute, and what would turn the gate green. Nothing here computes a factor that the gate would accept.
import { existsSync } from 'node:fs'
import { TOOLS } from '../src/mcp/index.ts'
const discovered = TOOLS.filter((t) => /factor|prime|shor|verify/i.test(t.name)).map((t) => t.name)
const suppliedFile = 'evidence/thousand-bit/factors.json'
if (failures.length) {
  console.log('✗ thousand-bit gate: RED')
  for (const f of failures) console.log(`    · ${f}`)
  console.log('  discovered tools that touch factorisation:')
  for (const name of discovered) {
    const role = name === 'factor' ? 'computes factors; returns PARTIAL for this integer'
      : name === 'factor_verify' ? 'checks a supplied factorisation; VERIFIED would turn the gate green'
      : name.includes('shor') ? 'the QPU Shor tool; not run here: its state vector is about 2^1000 entries'
      : 'factorisation-related; not a source of a full factorisation for this integer'
    console.log(`    · ${name}: ${role}`)
  }
  console.log('  checked sources: FactorDB has no factors for this integer (recorded earlier, 2026)')
  console.log(existsSync(suppliedFile)
    ? `  supplied factorisation found at ${suppliedFile}: check it with factor_verify`
    : `  missing: a full factorisation at ${suppliedFile}, which factor_verify must report VERIFIED`)
  process.exit(1)
}
console.log(`✓ thousand-bit gate: GREEN — ${bits} bits; status ${r.status}; the decomposition is an identity; the composite claim is recomputed.`)
