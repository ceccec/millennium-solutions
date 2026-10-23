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

export const factor = (input: string): Factorisation => {
  const digits = input.trim()
  if (!/^\d+$/.test(digits)) return { status: 'REFUSED', why: 'the input is not a non-negative decimal integer' }
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
