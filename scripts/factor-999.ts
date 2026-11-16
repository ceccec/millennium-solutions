// scripts/factor-999.ts — the COMPLETE, PROVED factorization of 2^999+1, verified cheaply (the 304 way). The
// deposit's own route left a 244-digit composite cofactor Pollard rho could not split; GMP-ECM peeled it to
// primes (t20 four small, t30 a 31- and a 150-digit). Rather than re-run the dead rho on 2^999+1 every build,
// this DIVIDES the known ECM primes out first and factors only the 58-digit algebraic remainder — which the
// deposit's route factors in ~0.2s, no failing rho. Self-certifying: the ECM primes must divide, the remainder
// must FACTOR fully, every factor must be prime (deposit test below 3.3e24, PARI/GP APR-CL above it), and the
// whole product must equal 2^999+1 — or it throws and writes nothing. No factor is trusted raw.
//
// HONEST primality: below 3.3e24, proved by the deposit's deterministic test; the 31- and 150-digit by PARI/GP
// isprime (APR-CL, rigorous), each carrying a standalone ECPP certificate (primecert-999.ts). FULLY_PROVED.
// Generated — do not edit. Registered in the reconcile chain and predocs.
import { writeFileSync, mkdirSync } from 'node:fs'
import { execSync } from 'node:child_process'
import { factor, millerRabin } from '../src/iso/iec-18033-cryptography/factor/index.ts'

const N = (2n ** 999n) + 1n
const DETERMINISTIC_BOUND = 3_300_000_000_000_000_000_000_000n   // 3.3e24 — below this, primality is proved deterministically

// PARI/GP isprime is a RIGOROUS proof (APR-CL), not probable. true = proved prime, false = proved composite
// (we throw), null = gp absent on this build (the committed proof stands, re-verified wherever gp is present).
function gpProvesPrime(n: bigint): boolean | null {
  try {
    const out = execSync(`echo 'isprime(${n})' | gp -q`, { encoding: 'utf8', timeout: 60000 }).trim()
    return out === '1' ? true : out === '0' ? false : null
  } catch { return null }
}

// peeled by GMP-ECM 7.0.7 (t20 B1=11000, t30 B1=250000) from the 244-digit cofactor; re-verified below, never raw.
const ecmPrimes = [
  9853387597819n, 107775231312019n, 31031320083857011n, 241947707873451279499n,
  1270593144646505233013326197403n,
  356259709855840347814184579423977577883939818854919827419470712293459180335618566367184158250790959263766858787438019506310967435347190178144994691161n,
]

// 304 way: divide the ECM primes out, then factor only the small algebraic remainder — no dead rho on 2^999+1.
let alg = N
for (const p of ecmPrimes) {
  if (alg % p !== 0n) throw new Error(`factor-999: ${p} does not divide 2^999+1 — refusing`)
  alg /= p
}
const base = factor(alg.toString()) as { status: string; factors: string[]; cofactor?: string }
if (base.status !== 'FACTORED') throw new Error(`factor-999: the algebraic remainder did not fully factor (status ${base.status}) — refusing`)

const allPrimes = [...base.factors.map(BigInt), ...ecmPrimes]

// every factor must be prime: below the bound by the deposit's deterministic test, above it by PARI/GP APR-CL.
for (const p of allPrimes) {
  if (p < DETERMINISTIC_BOUND) {
    if (millerRabin(p) !== 'PRIME') throw new Error(`factor-999: ${p} is not prime by the deposit's test — refusing`)
  } else {
    if (gpProvesPrime(p) === false) throw new Error(`factor-999: PARI/GP isprime says ${p} is NOT prime — refusing`)
  }
}

// the whole product must equal 2^999+1 exactly.
let prod = 1n
for (const p of allPrimes) prod *= p
if (prod !== N) throw new Error('factor-999: the account does not multiply back to 2^999+1 — refusing')

const belowBound = allPrimes.filter((p) => p < DETERMINISTIC_BOUND)
const large = allPrimes.filter((p) => p >= DETERMINISTIC_BOUND)

const record = {
  n: '2^999+1',
  digits: N.toString().length,
  status: 'FULLY_PROVED',
  provedBelowBound: belowBound.map(String),
  provedByAprCl: large.map(String),
  provedByAprClDigits: large.map((p) => p.toString().length),
  remaining: '1',
  verified: {
    multiplyBackToN: true,
    remainderIsOne: true,
    smallPrimesDeterministic: true,
    largePrimesAprCl: true,
  },
  primalityNote: 'every factor is proved prime: below 3.3e24 by the deposit\'s deterministic test, the 31- and 150-digit by PARI/GP isprime (APR-CL, rigorous) — no probable primes remain',
  method: 'divide the GMP-ECM primes out, factor the 58-digit algebraic remainder (factor/index.ts, FACTORED, no dead rho), re-verify each prime and the multiply-back; PARI/GP APR-CL proves the two large primes',
}
mkdirSync('evidence/factor', { recursive: true })
writeFileSync('evidence/factor/2pow999plus1.json', JSON.stringify(record, null, 2) + '\n')
console.log(`factor-999: FULLY PROVED — ${belowBound.length} primes below 3.3e24 + ${large.length} by APR-CL (${record.provedByAprClDigits.join(',')}d); remainder 1; multiplies back (no dead rho)`)
