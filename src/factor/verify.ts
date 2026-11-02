// VERIFY — check a claimed factorisation of an integer, without trusting whoever claimed it.
//
// Given n and a list of factors, the verifier checks three things and reports each one:
//   1 · PRODUCT   the factors multiply to n exactly. A mismatch is a refusal, whatever the factors look like.
//   2 · RANGE     every factor is at least 2. A factor of 1 proves nothing, so it is refused.
//   3 · PRIMALITY each factor is tested. Below 3.3 × 10^24 the test is a proof (the bases decide primality there). Above
//                 that range the test is probabilistic, and the result says PROBABLE: a probable prime is a claim a test
//                 passed, not a proof.
//
// The status is VERIFIED only when the product holds and every factor is proved prime. PROBABLE when the product holds
// and some factor is only probably prime. REFUSED when the product or the range fails. A verifier that returned VERIFIED
// for a wrong product would be a lie, so the product is checked first and alone decides the refusal.
import { millerRabin, parseInteger } from './index.ts'

const DETERMINISTIC_LIMIT = 3_317_044_064_679_887_385_961_981n

export type Verification =
  | { status: 'VERIFIED'; n: string; factors: string[]; primality: string; why: string }
  | { status: 'PROBABLE'; n: string; factors: string[]; primality: string; why: string }
  | { status: 'REFUSED'; n: string; why: string }

export const verifyFactors = (nIn: string, factorsIn: string[]): Verification => {
  // any binary variant is read here as in factor(): decimal, 0b binary or 0x hex; the verdict names the decimal digits
  const n = parseInteger(nIn) ?? nIn
  if (!/^\d+$/.test(n)) return { status: 'REFUSED', n, why: 'the integer is not a non-negative integer in decimal, 0b binary or 0x hex' }
  if (factorsIn.length === 0) return { status: 'REFUSED', n, why: 'no factors were given' }
  const factors = factorsIn.map((f) => parseInteger(f) ?? f)
  if (!factors.every((f) => /^\d+$/.test(f))) return { status: 'REFUSED', n, why: 'a factor is not a non-negative integer in decimal, 0b binary or 0x hex' }
  const values = factors.map((f) => BigInt(f))
  if (values.some((v) => v < 2n)) return { status: 'REFUSED', n, why: 'a factor is below 2, which proves nothing about a factorisation' }
  const product = values.reduce((acc, v) => acc * v, 1n)
  if (product !== BigInt(n)) return { status: 'REFUSED', n, why: 'the factors do not multiply to the integer' }
  const unproved = values.filter((v) => v >= DETERMINISTIC_LIMIT)
  const bad = values.filter((v) => millerRabin(v) === 'COMPOSITE')
  if (bad.length) return { status: 'REFUSED', n, why: `${bad.length} factor(s) are composite, by a witness the test found, so they are not prime factors` }
  const primality = unproved.length === 0
    ? 'every factor proved prime by the deterministic test'
    : `${values.length - unproved.length} factor(s) proved prime; ${unproved.length} factor(s) above 3.3e24 only probably prime`
  if (unproved.length === 0) return { status: 'VERIFIED', n, factors, primality, why: 'the product holds and every factor is proved prime' }
  return { status: 'PROBABLE', n, factors, primality, why: 'the product holds; some factor passed a probabilistic test, which is not a proof' }
}
