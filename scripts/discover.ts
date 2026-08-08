#!/usr/bin/env node
// Discovery orchestration — search a FINITE domain for provable facts. Each candidate is tested
// EXHAUSTIVELY; the ones that hold are DISCOVERED (receipted, and chained — each seeds the next);
// the ones that fail are REFUTED and discarded. That discard is the honesty: it discovers *provable*
// facts, it does not rubber-stamp. "Discover provable" = decidable facts verified by exhaustion over
// a finite domain — genuinely true, genuinely found. It cannot discover a proof of an open conjecture;
// finite exhaustion does not reach the Clay set. That is why the floor stays 0/7.
import { toUuid, merkleFold, units, triad, digitalRoot } from '../src/0/index.ts'
const m9 = (n: number) => ((n % 9) + 9) % 9
const U = units() // [1,2,4,5,7,8]

// candidate conjectures over ℤ/9 — each an exhaustive predicate.
const candidates: [string, () => boolean][] = [
  ['every unit u: u⁶ ≡ 1 mod 9 (Euler, φ(9)=6)', () => U.every((u) => m9(u ** 6) === 1)],
  ['the units sum to 0 mod 9 (1+2+4+5+7+8=27)', () => m9(U.reduce((a, b) => a + b, 0)) === 0],
  ['exactly two self-inverse elements d²≡1 mod 9: {1,8}', () => [1, 2, 3, 4, 5, 6, 7, 8, 9].filter((d) => m9(d * d) === 1).join(',') === '1,8'],
  ['the triad is nilpotent d²≡0 mod 9: {3,6,9}', () => triad().every((d) => m9(d * d) === 0)],
  ['digital root of 2^k has period 6', () => { const s = []; for (let k = 0; k < 12; k++) s.push(digitalRoot(2 ** k)); return s.slice(0, 6).join(',') === s.slice(6, 12).join(',') }],
  ['REFUTED candidate: every unit is self-inverse (should fail: 2²=4)', () => U.every((u) => m9(u * u) === 1)],
]

const discovered: { name: string; receipt: string }[] = []
let prev = 'axiom:ℤ/9' // each discovery seeds the next — the chain
for (const [name, test] of candidates) {
  if (test()) { const receipt = toUuid(prev + '→' + name); prev = receipt; discovered.push({ name, receipt }); console.log('  ✓ DISCOVERED  ' + receipt.slice(0, 13) + '…  ' + name) }
  else console.log('  · refuted (discarded)  ' + name)
}
const root = merkleFold(discovered.map((d) => d.receipt))
console.log('\n  discovered ' + discovered.length + ' provable fact(s) of ' + candidates.length + ' candidates, chained → discovery root ' + root)
console.log('  bound: decidable facts verified by exhaustion over a finite domain — not a proof of any open conjecture. 0/7.')
process.exit(0)
