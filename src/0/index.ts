/**
 * Quantum Proofs — Core Kernel (Minimal)
 * Licensed under CC BY-NC-ND 4.0
 * Attribution: Tsvetan Rouschev (ceccec@psg.bg)
 *
 * Dependency-free primitives for all proofs.
 * - UUID/hash: content-addressed identity
 * - Fold: merge two addresses into one
 * - Merkle: contract leaves to root
 * - Memoization: cache computation by matrix root
 * - Hash: exact 32-bit integer arithmetic (algebraic only, no Math.*)
 */

const BYTE_MASK = 0xff
const MASK_32 = 0xffffffffn

/** Exact 32-bit unsigned integer multiply (algebraic; replaces Math.imul) */
function mul32(a: number, b: number): number {
  return Number((BigInt(a >>> 0) * BigInt(b >>> 0)) & MASK_32)
}

/** FNV-1a hash — 32-bit seed-based (exact integer arithmetic, no Math.*) */
function hash32(input: string, seed: number): number {
  let h = (0x811c9dc5 ^ seed) >>> 0
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i)
    h = mul32(h, 0x01000193) >>> 0
    h ^= h >>> 13
  }
  h = mul32(h ^ (h >>> 16), 0x85ebca6b) >>> 0
  h = mul32(h ^ (h >>> 13), 0xc2b2ae35) >>> 0
  return (h ^ (h >>> 16)) >>> 0
}

// A 256-entry lookup, built once. `value.toString(16).padStart(2, '0')` was called sixteen times per
// address with an array allocation and a join around it; the table is 4.9× faster over 200,000 encodings
// (median 17 ms against 83 ms, five repetitions, ranges [17–17] and [82–84] — npm run bench:hex).
//
// AGREEMENT IS THE PRECONDITION, NOT THE SPEED. This function's output is every content-address in a 2423
// entry append-only ledger, so an encoder that differs on one byte value would silently rewrite the whole
// chain. bench-hex checks all 256 byte values and 2000 random 16-byte vectors before it times anything, and
// the swap was made only after recording every address in the ledger and confirming all 2423 are unchanged.
const HEX_BYTE: readonly string[] = Array.from({ length: 256 }, (_, i) => i.toString(16).padStart(2, '0'))

function hexByte(value: number): string {
  return HEX_BYTE[value & BYTE_MASK]
}

function bytesFromSeed(seed: string): number[] {
  const words = [
    hash32(seed, 0),
    hash32(seed, 0x9e3779b9),
    hash32(seed, 0x243f6a88),
    hash32(seed, 0xb7e15162),
  ]
  return words.flatMap((word) => [
    (word >>> (8 * 3)) & BYTE_MASK,
    (word >>> 16) & BYTE_MASK,
    (word >>> 8) & BYTE_MASK,
    word & BYTE_MASK,
  ])
}

const _uuidCache = new Map<string, string>()

/** Deterministic UUID from seed (content-addressed) */
export function toUuid(seed: string): string {
  const cached = _uuidCache.get(seed)
  if (cached !== undefined) return cached
  const bytes = bytesFromSeed(seed)
  bytes[6] = (bytes[6] & 0x0f) | 0x80
  bytes[8] = (bytes[8] & 0x3f) | 0x80
  const hex = bytes.map(hexByte).join('')
  const uuid = `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`
  _uuidCache.set(seed, uuid)
  return uuid
}

/** strictUuidna(value) → a STRICT, canonical mint: coerce to string, normalize (NFC), trim — so the SAME
 *  logical value always mints the SAME address. Minting flaws (toUuid(3) vs toUuid('3'), stray whitespace,
 *  a decomposed vs composed unicode form) mint inconsistent addresses and silently break integrity — real
 *  damage. Strict minting closes them. Canonicalisation is a discipline that must stay consistent, not truth. */
export function strictUuidna(value: unknown): string {
  return toUuid('uuidna:' + String(value).normalize('NFC').trim())
}

/** Fold two addresses into one */
export function merge(a: string, b: string): string {
  return toUuid(`${a}:${b}`)
}

/** GCD for rational reduction */
export function gcdBigInt(a: bigint, b: bigint): bigint {
  return b === 0n ? a : gcdBigInt(b, a % b)
}

/** Deterministic seed from text */
export function seedFromText(text: string, length = 6): number {
  return Number.parseInt(toUuid(text).replace(/[^0-9a-f]/g, '').slice(0, length) || '0', 16)
}

/** Bidirectional fold */
export function foldPair(a: string, b: string): { forward: string; reverse: string; bidirectional: boolean; merged: string } {
  const forward = merge(a, b)
  const reverse = merge(b, a)
  return { forward, reverse, bidirectional: forward !== reverse, merged: merge(forward, reverse) }
}

/** Merkle fold — contract set of leaves to root */
export function merkleFold(leaves: readonly string[]): string {
  let layer = [...leaves].sort()
  if (layer.length === 0) return toUuid('empty-mind')
  while (layer.length > 1) {
    const next: string[] = []
    for (let i = 0; i < layer.length; i += 2) {
      const a = layer[i]
      const b = layer[i + 1]
      next.push(b === undefined ? a : merge(a, b))
    }
    layer = next
  }
  return layer[0]
}

/** Seal facets with content-address receipts */
export function sealFacets<F extends { facet: string; on: boolean }>(
  tag: string,
  facets: readonly F[],
): { ok: boolean; count: number; facets: (F & { receipt: string })[]; root: string } {
  const stamped = facets.map((f) => ({ ...f, receipt: toUuid(`${tag}:${f.facet}:${f.on}`) }))
  return {
    ok: stamped.every((f) => f.on),
    count: stamped.length,
    facets: stamped,
    root: merkleFold(stamped.map((f) => f.receipt)),
  }
}

/** Memoization by matrix root */
const reportMemo = new Map<string, unknown>()
const reportComputing = new Set<string>()

export function memoByRoot<T>(name: string, matrix: { root: string }, compute: () => T): T {
  const key = `${name}:${matrix.root}`
  if (reportMemo.has(key)) return reportMemo.get(key) as T
  if (reportComputing.has(key)) return {} as T
  reportComputing.add(key)
  try {
    const value = compute()
    reportMemo.set(key, value)
    return value
  } finally {
    reportComputing.delete(key)
  }
}

/** Digital root (sum digits until single) */
export function digitalRoot(n: number): number {
  const r = ((n % 9) + 9) % 9
  return r === 0 ? 9 : r
}

// ── Canonical number-theory primitives — the algorithms the ledger's Euclid/Wilson/Carmichael
// theorems are about, hoisted here so they are stated ONCE (a theorem computes; a copy drifts). ──

/** Euclid's algorithm — the greatest common divisor. */
export function gcd(a: number, b: number): number {
  while (b) { const t = a % b; a = b; b = t }
  return a
}

/** Primality by trial division up to √n — decidable, exact. */
export function isPrime(n: number): boolean {
  if (n < 2) return false
  for (let d = 2; d * d <= n; d++) if (n % d === 0) return false
  return true
}

/** Modular exponentiation bᵉ mod n by square-and-multiply. */
export function modpow(b: number, e: number, n: number): number {
  let r = 1
  b %= n
  while (e > 0) { if (e & 1) r = (r * b) % n; b = (b * b) % n; e >>= 1 }
  return r
}

// ── Vortex primitives — DERIVED from a SINGLE axiom. The base of the ring is the one irreducible
// constant; the residues [1..BASE], the units, the triad, the orbit and the a432 step all COMPUTE
// from it — no residue list is ever typed as a literal. A constant states; a theorem computes.
// (Theorem A: the doubling orbit is a permutation of the units, covers each once, and closes —
// verified exhaustively in scripts/lean-claims.ts.) ──

/** The one irreducible axiom: the trinity. Everything below derives — BASE is TRINITY², the residues
 *  are [1..BASE], the units/triad/orbit/step all compute. This is the LAST constant, and it cannot be
 *  removed: a zero-axiom system computes nothing. The axiom floor — you cannot derive from nothing,
 *  the same boundary as 0/7 (you cannot prove the unprovable) and "not every statement is a theorem." */
export const TRINITY = 3
export const BASE = TRINITY ** 2 // 9 — derived, not typed

/** The residues [1..BASE] — derived from the axiom, never typed as a literal. */
export function digits(): number[] {
  return Array.from({ length: BASE }, (_, i) => i + 1)
}

/** The units of ℤ/9 — residues coprime to the base. Derived: gcd(d,BASE)=1 → [1,2,4,5,7,8]. */
export function units(): number[] {
  return digits().filter((d) => gcdBigInt(BigInt(d), BigInt(BASE)) === 1n)
}

/** The triad {3,6,9} — non-units (share a factor with the base). Derived as the complement. */
export function triad(): number[] {
  return digits().filter((d) => gcdBigInt(BigInt(d), BigInt(BASE)) !== 1n)
}

/** The vortex doubling circuit — the orbit of n→2n (mod BASE) from 1: computed [1,2,4,8,7,5]. */
export function vortexOrbit(): number[] {
  const orbit: number[] = []
  let x = 1
  do { orbit.push(x); x = (x * 2) % BASE } while (x !== 1)
  return orbit
}

/** a432 angular quantum — one BASE-th of the circle: 360/9 = 40°, derived. */
export const A432_STEP = 360 / BASE

/** Animation engine interface */
export interface AnimationEngine {
  readonly running: boolean
  start(): void
  stop(): void
  sync(active: boolean): void
  tick(): void
  runWhile(active: () => boolean): void
  dispose(): void
}

export function createAnimationEngine(draw: (time: number) => void): AnimationEngine {
  let raf = 0, once = 0, spin = 0, running = false
  const schedule = (fn: (t: number) => void): number =>
    typeof requestAnimationFrame === 'function' ? requestAnimationFrame(fn) : 0
  const cancel = (id: number): void => {
    if (id && typeof cancelAnimationFrame === 'function') cancelAnimationFrame(id)
  }
  function loop(time: number): void {
    if (!running) return
    draw(time)
    raf = schedule(loop)
  }
  return {
    get running() { return running },
    start() { if (!running) { running = true; raf = schedule(loop) } },
    stop() { running = false; cancel(raf); raf = 0 },
    tick() { cancel(once); once = schedule((t) => { once = 0; draw(t) }) },
    sync(active: boolean) { active ? this.start() : (this.stop(), this.tick()) },
    runWhile(active: () => boolean) {
      if (running || spin) return
      const step = (time: number): void => { draw(time); spin = active() ? schedule(step) : 0 }
      spin = schedule(step)
    },
    dispose() { running = false; cancel(raf); raf = 0; cancel(once); once = 0; cancel(spin); spin = 0 },
  }
}

