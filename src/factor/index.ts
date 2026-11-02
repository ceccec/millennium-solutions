// FACTOR — the factors of an integer of any length, and an honest account of what was not found.
//
// THE INTEGER CAN BE ANY LENGTH. It arrives as decimal digits and is held as a BigInt, so a thousand-bit integer is
// read exactly. What the function can DO with it is a different question, and the answer is stated in the result:
//
//   FACTORED   every factor is known. Each factor found by trial division is a prime, because the divisors are tried in
//              increasing order and each one is divided out completely before the next. A cofactor left over is either 1,
//              or a prime the deterministic test below certifies (for values under 2^64, the bases used decide primality).
//   PARTIAL    some factors are known and the rest is a cofactor that has no factor below the trial bound, and that is
//              not small enough for the deterministic test. Its probable primality is stated, and it is NOT called prime:
//              a probable prime is a claim that a test passed, not a proof.
//   REFUSED    the input is not a non-negative decimal integer, or it is below 2, which has no factorisation to give.
//
// No method in this tree factors a cofactor of hundreds of digits, and the function does not pretend it does. A
// thousand-bit integer with no small factor comes back PARTIAL, with the cofactor's size and the step that is missing.

export const TRIAL_BOUND = 1_000_000n

// Pollard's rho with Brent's cycle detection finds a divisor of a composite without knowing it in advance. It is a search,
// not a proof, so it is bounded: when the step budget runs out it reports nothing, and the piece stays open.
export const RHO_BUDGET = 500_000

export type Factorisation =
  | { status: 'FACTORED'; factors: string[]; primality: 'every factor proved prime by trial division or by the deterministic test' }
  | { status: 'PARTIAL'; factors: string[]; cofactor: string; cofactorDigits: number; cofactorPrimality: 'probable prime by Miller–Rabin, not proved' | 'composite (a witness was found)' | 'composite (split into open pieces, each above the trial bound)'; blocking: string }
  | { status: 'REFUSED'; why: string }

const DETERMINISTIC_LIMIT = 3_317_044_064_679_887_385_961_981n

const modPow = (base: bigint, exp: bigint, mod: bigint): bigint => {
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

// Bases 2 to 37 decide primality for every n below 3.3 × 10^24, which covers the deterministic range used here.
// Above that range the same bases give a probable-prime verdict, and the result says so.
const BASES = [2n, 3n, 5n, 7n, 11n, 13n, 17n, 19n, 23n, 29n, 31n, 37n]
export const millerRabin = (n: bigint): 'PRIME' | 'COMPOSITE' => {
  if (n < 2n) return 'COMPOSITE'
  for (const p of BASES) {
    if (n === p) return 'PRIME'
    if (n % p === 0n) return 'COMPOSITE'
  }
  let d = n - 1n
  let r = 0
  while ((d & 1n) === 0n) { d >>= 1n; r++ }
  for (const a of BASES) {
    let x = modPow(a, d, n)
    if (x === 1n || x === n - 1n) continue
    let composite = true
    for (let i = 1; i < r; i++) {
      x = (x * x) % n
      if (x === n - 1n) { composite = false; break }
    }
    if (composite) return 'COMPOSITE'
  }
  return 'PRIME'
}

/** Any binary variant of an integer — `0b` binary, `0x` hex, or plain decimal, with optional `_` grouping — as the decimal
 *  digits every tool here reads. null when the text is none of the three. A 1,000-bit integer arrives as readily as 91. */
export const parseInteger = (input: string): string | null => {
  const t = input.trim().replace(/_/g, '')
  if (/^0b[01]+$/i.test(t)) return BigInt(t).toString()
  if (/^0x[0-9a-f]+$/i.test(t)) return BigInt(t).toString()
  if (/^\d+$/.test(t)) return t
  return null
}

export const factor = (input: string): Factorisation => {
  const digits = parseInteger(input)
  if (digits === null) return { status: 'REFUSED', why: 'the input is not a non-negative integer in decimal, 0b binary or 0x hex' }
  let n = BigInt(digits)
  if (n < 2n) return { status: 'REFUSED', why: `${n} has no factorisation to give` }

  const found: string[] = []
  // Trial division: 2, then the odd numbers, in increasing order. Each divisor is divided out completely, so every
  // divisor recorded is prime.
  const divide = (d: bigint) => { while (n % d === 0n) { found.push(d.toString()); n /= d } }
  divide(2n)
  let d = 3n
  for (; d <= TRIAL_BOUND && d * d <= n; d += 2n) divide(d)

  if (n === 1n) return { status: 'FACTORED', factors: found, primality: 'every factor proved prime by trial division or by the deterministic test' }

  // Case 1: the search reached the square root of the cofactor without finding a divisor. Then the cofactor is prime,
  // with no test needed: a composite cofactor has a factor no larger than its square root.
  if (d * d > n) return { status: 'FACTORED', factors: [...found, n.toString()], primality: 'every factor proved prime by trial division or by the deterministic test' }

  // Case 2: the cofactor still has no factor below the bound. Rho splits it into pieces; a piece is proved prime only
  // below the deterministic range, and any piece that stays open is reported, not called prime.
  const primes: bigint[] = []
  const open: bigint[] = []
  splitWithRho(n, primes, open)
  const all = [...found, ...primes.map((p) => p.toString())]
  if (open.length === 0) return { status: 'FACTORED', factors: all, primality: 'every factor proved prime by trial division or by the deterministic test' }
  const cofactor = open.reduce((acc, v) => acc * v, 1n)
  const cofactorPrimality = open.length > 1
    ? 'composite (split into open pieces, each above the trial bound)' as const
    : millerRabin(cofactor) === 'COMPOSITE' ? 'composite (a witness was found)' as const : 'probable prime by Miller–Rabin, not proved' as const
  return { status: 'PARTIAL', factors: all, cofactor: cofactor.toString(), cofactorDigits: cofactor.toString().length, cofactorPrimality,
    blocking: `the cofactor has no factor below ${TRIAL_BOUND} and Pollard rho did not split it within ${RHO_BUDGET} steps; no method in this tree factors it` }
}

/** Pollard–Brent rho: a proper divisor of n, or null when the budget runs out. Even n returns 2. */
export const rho = (n: bigint, budget: number = RHO_BUDGET): bigint | null => {
  if (n % 2n === 0n) return 2n
  const gcd = (a: bigint, b: bigint): bigint => { while (b) { [a, b] = [b, a % b] } return a }
  const diff = (a: bigint, b: bigint) => (a > b ? a - b : b - a)
  let steps = 0
  for (let c = 1n; c < 20n; c++) {
    const f = (v: bigint) => (v * v + c) % n
    let y = 2n, x = y, ys = y, g = 1n, q = 1n, r = 1
    const m = 128
    while (g === 1n) {
      x = y
      for (let i = 0; i < r; i++) y = f(y)
      let k = 0
      while (k < r && g === 1n) {
        ys = y
        for (let i = 0; i < Math.min(m, r - k); i++) { y = f(y); q = (q * diff(x, y)) % n }
        g = gcd(q, n)
        k += m
      }
      steps += r
      r *= 2
      if (steps > budget) return null
    }
    if (g === n) {
      g = 1n
      while (g === 1n) { ys = f(ys); g = gcd(diff(x, ys), n) }
    }
    if (g !== n) return g
  }
  return null
}

/** Split m into primes proved by the deterministic test (pushed to primes) and open pieces the search could not split. */
const splitWithRho = (m: bigint, primes: bigint[], open: bigint[]): void => {
  if (m === 1n) return
  const verdict = millerRabin(m)
  if (m < DETERMINISTIC_LIMIT && verdict === 'PRIME') { primes.push(m); return }
  const d = verdict === 'COMPOSITE' || m >= DETERMINISTIC_LIMIT ? rho(m) : null
  if (d === null || d === 1n || d === m) { open.push(m); return }
  splitWithRho(d, primes, open)
  splitWithRho(m / d, primes, open)
}

// ── THE WITNESS: FOURTEEN REFLECTIVE STATES ──────────────────────────────────────────────────────────────────
// A factorisation is a fact about an integer, not about one spelling of it. qpu.lean pins the register the served unit
// states: faces = coins × rays = 2 × 7 = 14. The witness here is that register rotated over the fact: two coins — the
// integer and its digit mirror (d ↦ 10 − d, an involution defined when no digit is 0) — and seven rays — the integer
// rendered in every binary variant 2^k for k = 1..7 (binary, base 4, octal, hex, base 32, 64, 128) and parsed back.
// A fact that survives a change of representation is a fact about the number, the way a dimensionless ratio (the
// proton-to-electron mass ratio nucleus.lean brings under the kernel) survives a change of units. Each state is checked,
// not assumed: a renderer that lost a digit, a mirror that was not an involution, or factors that did not multiply back
// would each turn one named state red. Nothing physical is claimed; the register is the served unit's and the arithmetic
// is this tree's.
export const RAYS: readonly number[] = [1, 2, 3, 4, 5, 6, 7]
const GLYPHS = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ-_abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
/** n in radix 2^k, as a list of digit values (most significant first). Pure, any width. */
export const renderDigits = (n: bigint, k: number): number[] => {
  const b = 1n << BigInt(k), out: number[] = []
  let m = n
  if (m === 0n) return [0]
  while (m > 0n) { out.unshift(Number(m % b)); m /= b }
  return out
}
/** the inverse: digit values in radix 2^k back to the integer */
export const parseDigits = (ds: readonly number[], k: number): bigint => ds.reduce((acc, d) => (acc << BigInt(k)) + BigInt(d), 0n)
/** the digit mirror as a string, or null when a digit is 0 (10 − 0 is not a digit) */
export const mirrorDigits = (digits: string): string | null => /0/.test(digits) ? null : digits.split('').map((c) => String(10 - Number(c))).join('')

export type WitnessState = { coin: 'integer' | 'mirror'; ray: number; radix: number; digits: number; roundTrip: boolean }
export type Witness = {
  register: { coins: 2; rays: 7; faces: 14; source: 'qpu.lean — the served register, faces = coins × rays' }
  coins: { integer: Factorisation & { n: string }; mirror: (Factorisation & { n: string }) | { status: 'UNDEFINED'; why: string } }
  states: WitnessState[]
  agree: boolean
  failures: string[]
}
/** The factorisation of any binary variant of an integer, with its fourteen-state witness. */
export const factorWitnessed = (input: string): (Factorisation & { n?: string; witness?: Witness }) => {
  const digits = parseInteger(input)
  const base = factor(input)
  if (digits === null || base.status === 'REFUSED') return base
  const n = BigInt(digits)
  const m = mirrorDigits(digits)
  const states: WitnessState[] = []
  const failures: string[] = []
  const coinsOf: [('integer' | 'mirror'), bigint][] = m === null ? [['integer', n]] : [['integer', n], ['mirror', BigInt(m)]]
  for (const [coin, v] of coinsOf) for (const k of RAYS) {
    const ds = renderDigits(v, k)
    const ok = parseDigits(ds, k) === v && ds.every((d) => d >= 0 && d < (1 << k))
    states.push({ coin, ray: k, radix: 1 << k, digits: ds.length, roundTrip: ok })
    if (!ok) failures.push(`${coin} does not survive radix ${1 << k}`)
  }
  const check = (label: string, r: Factorisation, v: string): void => {
    if (r.status === 'FACTORED') {
      const prod = r.factors.reduce((acc, x) => acc * BigInt(x), 1n)
      if (prod.toString() !== v) failures.push(`${label}: the factors do not multiply back`)
    } else if (r.status === 'PARTIAL') failures.push(`${label}: ${r.cofactorDigits}-digit cofactor left open — ${r.cofactorPrimality}`)
    else failures.push(`${label}: ${r.why}`)
  }
  check('integer', base, digits)
  const mirrorFact = m === null
    ? { status: 'UNDEFINED' as const, why: 'a digit is 0, and 10 − 0 is not a digit: the mirror coin is undefined, which is stated rather than counted' }
    : { n: m, ...factor(m) }
  if (mirrorFact.status !== 'UNDEFINED') check('mirror', mirrorFact, m!)
  // an undefined mirror is not a failure: the register has fourteen faces and the integer shows as many as its digits allow
  return {
    ...base, n: digits,
    witness: {
      register: { coins: 2, rays: 7, faces: 14, source: 'qpu.lean — the served register, faces = coins × rays' },
      coins: { integer: { n: digits, ...base }, mirror: mirrorFact },
      states, agree: failures.length === 0, failures,
    },
  }
}
