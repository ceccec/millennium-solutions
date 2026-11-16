// scripts/factor-999.ts — the ECM-extended factor record for 2^999+1, via the pipeline. The deposit's own
// route (a^3+1 descent + Pollard rho) returns 14 algebraic factors and a 244-digit composite cofactor it could
// not split. GMP-ECM (this session) peeled four primes from that cofactor. This generator holds those four and
// RE-VERIFIES them from scratch — each must be prime by the deposit's own deterministic test AND divide the
// cofactor, and the whole account must multiply back to 2^999+1 — or it throws and writes nothing. So the
// constants are self-certifying evidence, not asserted. It records the extended, still-PARTIAL account.
// Generated — do not edit. Registered in the reconcile chain and predocs.
import { writeFileSync, mkdirSync } from 'node:fs'
import { factor, millerRabin } from '../src/iso/iec-18033-cryptography/factor/index.ts'

const N = (2n ** 999n) + 1n
const base = factor(N.toString()) as { status: string; factors: string[]; cofactor: string }
const depositCofactor = BigInt(base.cofactor)

// peeled by GMP-ECM 7.0.7 (t20, B1=11000) from the 244-digit cofactor; re-verified below, never trusted raw.
const ecmPrimes = [9853387597819n, 107775231312019n, 31031320083857011n, 241947707873451279499n]

let rem = depositCofactor
for (const p of ecmPrimes) {
  if (millerRabin(p) !== 'PRIME') throw new Error(`factor-999: ${p} is not prime by the deposit's test — refusing`)
  if (rem % p !== 0n) throw new Error(`factor-999: ${p} does not divide the cofactor — refusing`)
  rem /= p
}
let prod = rem
for (const f of base.factors) prod *= BigInt(f)
for (const p of ecmPrimes) prod *= p
if (prod !== N) throw new Error('factor-999: the account does not multiply back to 2^999+1 — refusing')

const remComposite = millerRabin(rem) === 'COMPOSITE'
const record = {
  n: '2^999+1',
  digits: N.toString().length,
  algebraicFactors: base.factors,
  ecmPrimes: ecmPrimes.map(String),
  ecmPrimeDigits: ecmPrimes.map((p) => p.toString().length),
  remainingCofactor: rem.toString(),
  remainingDigits: rem.toString().length,
  remainingComposite: remComposite,
  verified: { multiplyBackToN: true, ecmPrimesArePrime: true, test: "deposit millerRabin (deterministic below 3.3e24)" },
  method: 'a^3+1 cyclotomic descent (factor/index.ts) + GMP-ECM 7.0.7 t20 B1=11000 (session), re-verified here',
  status: base.status,
}
mkdirSync('evidence/factor', { recursive: true })
writeFileSync('evidence/factor/2pow999plus1.json', JSON.stringify(record, null, 2) + '\n')
console.log(`factor-999: ${base.factors.length} algebraic + ${ecmPrimes.length} ECM primes (${record.ecmPrimeDigits.join(',')}d) re-verified; cofactor ${depositCofactor.toString().length}d → ${rem.toString().length}d ${remComposite ? 'composite' : 'prime'}`)
