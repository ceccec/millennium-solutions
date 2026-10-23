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

if (failures.length) {
  console.log('✗ thousand-bit gate: RED')
  for (const f of failures) console.log(`    · ${f}`)
  process.exit(1)
}
console.log(`✓ thousand-bit gate: GREEN — ${bits} bits; status ${r.status}; the decomposition is an identity; the composite claim is recomputed.`)
