#!/usr/bin/env node
// TASK-ROUTE — classify what was pasted and answer only what can be verified.
//
//   echo '<anything>' | node scripts/task-route.ts
//
// The input is classified, then routed:
//   integer (decimal digits, optional sign)  trial division by primes up to 10 000, then a Miller–Rabin probable-prime
//                                            test with fixed bases. A factor is reported only with its product check
//                                            (factor × cofactor = n) passing. A probable prime is labelled as such.
//                                            Factorisation beyond trial division is NOT attempted: no classical method
//                                            here factors a large composite, and Shor's algorithm needs fault-tolerant
//                                            hardware this repository does not have.
//   hexadecimal (0x…)                        converted to its decimal value, then routed as an integer.
//   anything else                            text: no arithmetic task. It is returned unrouted, with the tools that
//                                            can take a text question (web_search, web_fetch, lean_ask).
// Every answer carries the reason and whether it is a proof or a probability. Nothing is guessed.
import { readFileSync } from 'node:fs'

const input = readFileSync(0, 'utf8').trim()

const powMod = (base: bigint, exp: bigint, mod: bigint): bigint => {
  let result = 1n
  let b = base % mod
  let e = exp
  while (e > 0n) {
    if (e & 1n) result = (result * b) % mod
    b = (b * b) % mod
    e >>= 1n
  }
  return result
}

// Miller–Rabin with the first 15 prime bases: deterministic below 3.3·10^24, a strong probable-prime test above it.
const BASES = [2n, 3n, 5n, 7n, 11n, 13n, 17n, 19n, 23n, 29n, 31n, 37n, 41n, 43n, 47n]
const probablePrime = (n: bigint): boolean => {
  if (n < 2n) return false
  for (const p of BASES) {
    if (n === p) return true
    if (n % p === 0n) return false
  }
  let d = n - 1n
  let s = 0
  while ((d & 1n) === 0n) { d >>= 1n; s++ }
  for (const a of BASES) {
    let x = powMod(a, d, n)
    if (x === 1n || x === n - 1n) continue
    let composite = true
    for (let r = 1; r < s; r++) {
      x = (x * x) % n
      if (x === n - 1n) { composite = false; break }
    }
    if (composite) return false
  }
  return true
}

const TRIAL_LIMIT = 10_000n
const smallPrimes: bigint[] = []
for (let i = 2n; i <= TRIAL_LIMIT; i++) {
  let isP = true
  for (const p of smallPrimes) {
    if (p * p > i) break
    if (i % p === 0n) { isP = false; break }
  }
  if (isP) smallPrimes.push(i)
}

const route = (raw: string) => {
  const hex = /^[+-]?0x[0-9a-fA-F]+$/.test(raw)
  const dec = /^[+-]?\d+$/.test(raw)
  if (!hex && !dec) {
    return {
      kind: 'text',
      status: 'UNROUTED',
      reason: 'not an integer: no arithmetic task. Use web_search or web_fetch for a text question, or lean_ask for a Lean statement.',
    }
  }
  const n = hex ? BigInt(raw) : BigInt(raw)
  const size = (n < 0n ? -n : n).toString().length
  const m = n < 0n ? -n : n
  if (m < 2n) return { kind: 'integer', status: 'ANSWERED', value: n.toString(), verdict: 'not prime (below 2)', proof: true, digits: size }

  for (const p of smallPrimes) {
    if (p * p > m) break
    if (m % p === 0n) {
      const cofactor = m / p
      const check = p * cofactor === m
      return {
        kind: 'integer', status: 'ANSWERED', digits: size,
        verdict: 'composite', factor: p.toString(), cofactor: cofactor.toString(),
        productCheck: check, proof: check,
        reason: 'found by trial division; the product check factor × cofactor = n is exact',
      }
    }
  }
  if (m < TRIAL_LIMIT * TRIAL_LIMIT) {
    return { kind: 'integer', status: 'ANSWERED', digits: size, verdict: 'prime', proof: true, reason: 'below the trial-division bound squared, so trial division is a complete proof' }
  }
  const prob = probablePrime(m)
  if (prob) {
    return {
      kind: 'integer', status: 'ANSWERED', digits: size, verdict: 'probably prime', proof: false,
      reason: 'no factor up to 10 000, and every fixed Miller–Rabin base agrees; a probable-prime test, not a proof (deterministic only below 3.3·10^24)',
    }
  }
  return {
    kind: 'integer', status: 'ANSWERED', digits: size, verdict: 'composite', factor: null, proof: true,
    reason: 'a Miller–Rabin base proves it composite, and no factor up to 10 000 is known. Its factors are NOT computed here: factorising a large composite is beyond this repository, and Shor needs fault-tolerant hardware this repository does not have.',
  }
}

console.log(JSON.stringify(route(input), null, 1))
