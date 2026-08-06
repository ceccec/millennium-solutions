/**
 * Quantum Proofs — Core Kernel (Minimal)
 * Licensed under CC BY-NC 4.0
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

function hexByte(value: number): string {
  return value.toString(16).padStart(2, '0')
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

