// GENERATE — the create door to factor's decode door. Mint a semiprime trapdoor N = p·q over a uuid, so the pair
// (generate, factor) is a round trip: generate(uuid) hands back N and its primes, factor(N) recovers them.
//
// THE UUID IS THE KEY. The two primes are derived deterministically from the uuid seed by a KDF (sha512 of the
// uuid, chained to fill the width), so whoever holds the uuid regenerates the primes, and whoever holds only N
// must factor it. That is the trapdoor's shape — and its HONEST limit: this is not a secure RSA key generator and
// makes no hardness claim of its own. A small N is opened by the factor tool (the decode); a large one comes back
// PARTIAL, one-way only because no method in this tree factors a hard semiprime — the T-count wall where Shor on a
// physical quantum processor (§3.4.8) is needed, which scripts/quantum-hardware.ts asks IBM's for. Nothing is
// stored: the trapdoor lives in the caller's memory, the way the generated vectors in crypto-kat do.
import { sha512 } from '../0/sha512.ts'
import { toUuid } from '../0/index.ts'
import { millerRabin } from './index.ts'

export type Generated =
  | { status: 'GENERATED'; n: string; p: string; q: string; bits: number; uuid: string; address: string; note: string }
  | { status: 'REFUSED'; why: string }

/** the next prime at or above `from` (odd stepping; millerRabin decides) */
const nextPrime = (from: bigint): bigint => { let p = from | 1n; while (millerRabin(p) !== 'PRIME') p += 2n; return p }

/** a deterministic `bits`-bit odd integer with its top bit set, from the seed and a label — sha512 chained to fill the width */
const seedInt = (seed: string, label: string, bits: number): bigint => {
  let out = 0n, have = 0, i = 0
  while (have < bits) {
    const block = sha512([...(`${seed}:${label}:${i}`)].map((c) => c.charCodeAt(0)))
    for (const byte of block) { out = (out << 8n) | BigInt(byte); have += 8 }
    i++
  }
  out &= (1n << BigInt(bits)) - 1n   // exactly `bits` bits
  out |= 1n << BigInt(bits - 1)      // top bit set, so the prime has the asked width
  return out | 1n                    // odd, so nextPrime starts on an odd
}

/** Mint a semiprime trapdoor over a uuid. `bits` is the width of N (8..512, default 48); the uuid is the key. */
export const generate = (opts: { uuid?: string; bits?: number } = {}): Generated => {
  const bits = Math.max(8, Math.min(Math.trunc(opts.bits ?? 48), 512))
  const half = Math.max(4, Math.floor(bits / 2))
  // a given uuid is the key as-is; anything else (including nothing) is content-addressed to one, so the key is always a uuid
  const key = opts.uuid && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(opts.uuid)
    ? opts.uuid.toLowerCase()
    : toUuid(`generate:${opts.uuid ?? 'default'}:${bits}`)
  const p = nextPrime(seedInt(key, 'p', half))
  const q = nextPrime(seedInt(key, 'q', half))
  const n = p * q
  return {
    status: 'GENERATED',
    n: n.toString(), p: p.toString(), q: q.toString(),
    bits: n.toString(2).length, uuid: key, address: toUuid(n.toString()),
    note: 'a semiprime trapdoor: the uuid is the key that regenerates the primes, and factor(n) is the decode. '
      + 'NOT a secure RSA keygen and no hardness claim of its own — a small n the factor tool opens, a large one it '
      + 'returns PARTIAL on (one-way without Shor on a physical §3.4.8 processor). Nothing is stored.',
  }
}
