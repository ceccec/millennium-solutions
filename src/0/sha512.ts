// SHA-512 — pure TypeScript, no dependency, KAT-verified. FIPS 180-4 (NIST, 2015).
//
// Here because Ed25519 requires it (RFC 8032 §5.1) and this deposit had SHA-256 only. Written with BigInt
// rather than 32-bit halves: the halved form is faster and is where every hand-written SHA-512 goes wrong,
// and nothing in this tree hashes enough bytes for the difference to matter. Correctness over cleverness,
// checked against the published vectors in scripts/crypto-kat.ts rather than asserted here.
const M64 = (1n << 64n) - 1n
const rotr = (x: bigint, n: bigint) => ((x >> n) | (x << (64n - n))) & M64
const shr = (x: bigint, n: bigint) => (x >> n) & M64

// ── THE CONSTANTS ARE DERIVED, NOT TYPED ─────────────────────────────────────────────────────────────────
// FIPS 180-4 does not hand you eighty-eight magic numbers; it says what they ARE. K[t] is the first 64 bits
// of the fractional part of the cube root of the t-th prime (§4.2.3), and H[i] the same of the square root
// (§5.3.5). Written out as literals — eighty lines of hex — they are eighty-eight chances to mistype a
// digit, and a single wrong digit gives a hash that is self-consistent, passes every round-trip you could
// write, and is not SHA-512.
//
// So they are computed from the definition, in exact integer arithmetic: floor(cbrt(p · 2^192)) is
// cbrt(p) · 2^64 as an integer, and its low 64 bits are the fraction. No floating point, nothing to round.
// The typed tables they replace were checked against this derivation first — all 88 identical — and the
// FIPS vectors in scripts/crypto-kat.ts are what says the whole thing is SHA-512 rather than something
// that looks like it.
const iroot = (n: bigint, k: number): bigint => {
  if (n < 2n) return n
  let x = 1n << (BigInt(Math.ceil(n.toString(2).length / k)) + 1n)
  for (;;) {
    const y = ((BigInt(k) - 1n) * x + n / x ** BigInt(k - 1)) / BigInt(k)
    if (y >= x) return x
    x = y
  }
}
const firstPrimes = (m: number): bigint[] => {
  const out: bigint[] = []
  for (let n = 2; out.length < m; n++) {
    let prime = true
    for (let d = 2; d * d <= n; d++) if (n % d === 0) { prime = false; break }
    if (prime) out.push(BigInt(n))
  }
  return out
}
/** the fractional part of the k-th root of p, as 64 bits */
const frac64 = (p: bigint, k: number): bigint => iroot(p << BigInt(64 * k), k) & M64

const K: bigint[] = firstPrimes(80).map((p) => frac64(p, 3))   // FIPS 180-4 §4.2.3
const H0: bigint[] = firstPrimes(8).map((p) => frac64(p, 2))   // FIPS 180-4 §5.3.5

export function sha512(bytes: readonly number[]): number[] {
  const len = BigInt(bytes.length) * 8n
  const msg = [...bytes, 0x80]
  while (msg.length % 128 !== 112) msg.push(0)
  for (let i = 15; i >= 0; i--) msg.push(Number((len >> BigInt(i * 8)) & 0xffn))
  const H = [...H0]
  for (let off = 0; off < msg.length; off += 128) {
    const w = new Array<bigint>(80)
    for (let t = 0; t < 16; t++) {
      let v = 0n
      for (let b = 0; b < 8; b++) v = (v << 8n) | BigInt(msg[off + t * 8 + b])
      w[t] = v
    }
    for (let t = 16; t < 80; t++) {
      const s0 = rotr(w[t - 15], 1n) ^ rotr(w[t - 15], 8n) ^ shr(w[t - 15], 7n)
      const s1 = rotr(w[t - 2], 19n) ^ rotr(w[t - 2], 61n) ^ shr(w[t - 2], 6n)
      w[t] = (w[t - 16] + s0 + w[t - 7] + s1) & M64
    }
    let [a, b, c, d, e, f, g, h] = H
    for (let t = 0; t < 80; t++) {
      const S1 = rotr(e, 14n) ^ rotr(e, 18n) ^ rotr(e, 41n)
      const ch = (e & f) ^ (~e & M64 & g)
      const t1 = (h + S1 + ch + K[t] + w[t]) & M64
      const S0 = rotr(a, 28n) ^ rotr(a, 34n) ^ rotr(a, 39n)
      const maj = (a & b) ^ (a & c) ^ (b & c)
      const t2 = (S0 + maj) & M64
      h = g; g = f; f = e; e = (d + t1) & M64
      d = c; c = b; b = a; a = (t1 + t2) & M64
    }
    const next = [a, b, c, d, e, f, g, h]
    for (let i = 0; i < 8; i++) H[i] = (H[i] + next[i]) & M64
  }
  const out: number[] = []
  for (const v of H) for (let i = 7; i >= 0; i--) out.push(Number((v >> BigInt(i * 8)) & 0xffn))
  return out
}

export const hex = (bytes: readonly number[]): string => bytes.map((b) => b.toString(16).padStart(2, '0')).join('')
export const unhex = (s: string): number[] => (s.match(/../g) ?? []).map((h) => parseInt(h, 16))
