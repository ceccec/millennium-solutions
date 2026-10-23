// MIRROR AND SEMIPRIME SEARCH — the digit mirror, its involution check, and a search for semiprimes, all pure.
//
// THE DIGIT MIRROR. Each digit d maps to 10 − d, in place: 369 mirrors to 741. It is defined only when no digit is 0,
// since 10 − 0 is not a digit. The mirror is an involution: mirroring twice gives back the number. That is checked, not
// assumed, for every number the tool is asked about.
//
// THE SEMIPRIME SEARCH. Numbers in a range that are the product of exactly two distinct primes. A factor is found by trial
// division, so the search is exact for every number it reports. A number with a zero digit can be excluded, for the mirror.
// Trial division is exact but slow for very large numbers, so the range is capped by the caller and the cap is stated.

export const mirror = (n: string): { status: 'MIRRORED'; mirror: string; involution: boolean } | { status: 'REFUSED'; why: string } => {
  if (!/^\d+$/.test(n)) return { status: 'REFUSED', why: 'not a non-negative decimal integer' }
  if (n.includes('0')) return { status: 'REFUSED', why: 'a zero digit has no mirror: 10 − 0 is not a digit' }
  const m = [...n].map((c) => String(10 - Number(c))).join('')
  const back = [...m].map((c) => String(10 - Number(c))).join('')
  return { status: 'MIRRORED', mirror: m, involution: back === n }
}

/** The smallest prime factor of n, or null when n is prime (or below 2). Exact by trial division. */
const smallestFactor = (n: number): number | null => {
  if (n < 2) return null
  if (n % 2 === 0) return 2
  for (let d = 3; d * d <= n; d += 2) if (n % d === 0) return d
  return null
}

export interface Semiprime { n: string; p: number; q: number; mirror: string | null }

/** Semiprimes n = p × q with p ≠ q, both prime, for n in [lo, hi]. Odd n only for speed, since an even one is 2 × q. */
export const semiprimes = (lo: number, hi: number, opts: { noZero?: boolean; limit?: number } = {}): Semiprime[] => {
  const out: Semiprime[] = []
  const limit = opts.limit ?? 20
  const start = lo % 2 === 0 ? lo + 1 : lo
  for (let n = start; n <= hi && out.length < limit; n += 2) {
    const s = String(n)
    if (opts.noZero && s.includes('0')) continue
    const p = smallestFactor(n)
    if (p === null) continue
    const q = n / p
    if (q === p || smallestFactor(q) !== null) continue
    out.push({ n: s, p, q, mirror: s.includes('0') ? null : mirror(s).status === 'MIRRORED' ? (mirror(s) as { mirror: string }).mirror : null })
  }
  return out
}
