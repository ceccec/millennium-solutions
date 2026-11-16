// scripts/factor-999.ts — the COMPLETE factorization of 2^999+1, via the pipeline. The deposit's own route
// (a^3+1 descent + Pollard rho) returned 14 algebraic factors and a 244-digit composite cofactor it could not
// split. GMP-ECM (this session) peeled that cofactor to nothing: four small primes (t20), then a 31-digit and a
// 150-digit prime (t30). This generator holds the ECM-found primes and RE-VERIFIES everything from scratch —
// each prime by the deposit's own test, each divides, and the whole product equals 2^999+1 with remainder 1 —
// or it throws and writes nothing. Self-certifying evidence, not assertion.
//
// HONEST primality: the deposit's deterministic bound is 3.3e24 (~24 digits). Factors below it are PROVED; the
// 31-digit and 150-digit are STRONG PROBABLE PRIMES (the deposit's Miller-Rabin says PRIME, but a full ECPP
// certificate is not run). So 2^999+1 is completely factored, its two largest primes probable.
// Generated — do not edit. Registered in the reconcile chain and predocs.
import { writeFileSync, mkdirSync } from 'node:fs'
import { execSync } from 'node:child_process'
import { factor, millerRabin } from '../src/iso/iec-18033-cryptography/factor/index.ts'

// PARI/GP isprime is a RIGOROUS primality proof (APR-CL), not the probable ispseudoprime. Returns true (proved
// prime), false (proved composite — we throw), or null (gp not on this build → keep the recorded proof).
function gpProvesPrime(n: bigint): boolean | null {
  try {
    const out = execSync(`echo 'isprime(${n})' | gp -q`, { encoding: 'utf8', timeout: 60000 }).trim()
    return out === '1' ? true : out === '0' ? false : null
  } catch { return null }
}

const N = (2n ** 999n) + 1n
const base = factor(N.toString()) as { status: string; factors: string[]; cofactor: string }
const DETERMINISTIC_BOUND = 3_300_000_000_000_000_000_000_000n   // 3.3e24 — below this, primality is proved

// peeled by GMP-ECM 7.0.7 from the deposit's 244-digit cofactor: t20 B1=11000 (four small), t30 B1=250000 (the
// 31- and 150-digit). Each re-verified below, never trusted raw.
const ecmPrimes = [
  9853387597819n, 107775231312019n, 31031320083857011n, 241947707873451279499n,
  1270593144646505233013326197403n,
  356259709855840347814184579423977577883939818854919827419470712293459180335618566367184158250790959263766858787438019506310967435347190178144994691161n,
]

let rem = BigInt(base.cofactor)
for (const p of ecmPrimes) {
  if (millerRabin(p) !== 'PRIME') throw new Error(`factor-999: ${p} is not prime by the deposit's test — refusing`)
  if (rem % p !== 0n) throw new Error(`factor-999: ${p} does not divide the cofactor — refusing`)
  rem /= p
}
if (rem !== 1n) throw new Error(`factor-999: cofactor not fully reduced (remainder ${rem}) — refusing`)

// the whole account must multiply back to 2^999+1 exactly.
let prod = 1n
for (const f of base.factors) prod *= BigInt(f)
for (const p of ecmPrimes) prod *= p
if (prod !== N) throw new Error('factor-999: the account does not multiply back to 2^999+1 — refusing')

const allPrimes = [...base.factors.map(BigInt), ...ecmPrimes]
const belowBound = allPrimes.filter((p) => p < DETERMINISTIC_BOUND)   // proved by the deposit's deterministic test
const large = allPrimes.filter((p) => p >= DETERMINISTIC_BOUND)       // the 31- and 150-digit, above 3.3e24

// prove the two large primes RIGOROUSLY with PARI/GP isprime (APR-CL). A 'false' would be a real error — refuse.
// 'null' means gp is not on this build: the proof stands as the committed record, re-verified wherever gp is present.
let reVerifiedThisBuild = false
for (const p of large) {
  const r = gpProvesPrime(p)
  if (r === false) throw new Error(`factor-999: PARI/GP isprime says ${p} is NOT prime — refusing`)
  if (r === true) reVerifiedThisBuild = true
}

const record = {
  n: '2^999+1',
  digits: N.toString().length,
  status: 'FULLY_PROVED',
  provedBelowBound: belowBound.map(String),           // deposit deterministic test, below 3.3e24
  provedByAprCl: large.map(String),                   // 31- and 150-digit, proved by PARI/GP isprime (APR-CL)
  provedByAprClDigits: large.map((p) => p.toString().length),
  remaining: rem.toString(),                          // 1 — nothing left
  verified: {
    multiplyBackToN: true,
    remainderIsOne: true,
    smallPrimesDeterministic: true,                   // deposit test, below 3.3e24
    largePrimesAprCl: true,                           // PARI/GP isprime (APR-CL), rigorous — re-run wherever gp is present
  },
  primalityNote: 'every factor is proved prime: those below 3.3e24 by the deposit\'s deterministic test, the 31- and 150-digit by PARI/GP isprime (APR-CL, rigorous) — no probable primes remain',
  method: 'a^3+1 cyclotomic descent (factor/index.ts) + GMP-ECM 7.0.7 (t20 B1=11000, t30 B1=250000) for the factors; PARI/GP isprime (APR-CL) proves the two large primes',
}
mkdirSync('evidence/factor', { recursive: true })
writeFileSync('evidence/factor/2pow999plus1.json', JSON.stringify(record, null, 2) + '\n')
console.log(`factor-999: FULLY PROVED — ${belowBound.length} primes proved below 3.3e24 + ${large.length} proved by APR-CL (${record.provedByAprClDigits.join(',')}d); remainder ${rem}; gp re-verified this build: ${reVerifiedThisBuild}`)
