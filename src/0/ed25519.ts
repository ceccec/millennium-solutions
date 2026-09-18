// ED25519 — asymmetric signatures, pure TypeScript, no dependency, verified against the published vectors.
//
// RFC 8032 (Josefsson & Liusvaara, 2017); the curve is Bernstein, Duif, Lange, Schwabe and Yang, 2011. None
// of it is this deposit's and none is claimed. What is this deposit's is only where it is USED.
//
// WHY ASYMMETRIC AT ALL, AND WHERE IT DOES NOT GO. Everything cryptographic here until now was SYMMETRIC —
// FNV, SHA-256, HMAC, ChaCha20-Poly1305 — and a symmetric tag proves possession of a shared secret, so it
// cannot tell a reader WHO produced something. A signature can: the signer holds a key nobody else has, and
// anybody at all verifies with the public one.
//
// IT DOES NOT GO IN THE UUID, and this is not a preference. A signature is 64 bytes and a public key is 32.
// A uuid is 16 bytes in total. So the signature is carried BESIDE the identifier it covers — in the receipt,
// the envelope, the deposition — exactly as the deposit already carries its receipts beside their addresses.
// Anyone who says the signature is "in" the uuid has either shortened it, in which case it is not a
// signature, or changed what a uuid is.
//
// HONEST BOUNDS, stated because the word "unbreakable" is what this tree's own gate drains:
//   · this is an implementation of a standard, not a new scheme, and its security is the standard's
//   · it is CONSTANT-TIME IN NOTHING. The scalar multiply below branches on key bits, so a local attacker
//     measuring this process can recover a secret key. It is fit for signing public records, which is what
//     it is for here; it is NOT fit for a key held on a machine an attacker can measure.
//   · verification checks the equation and rejects non-canonical encodings; it does not implement the
//     stricter cofactorless checks some libraries add.
import { sha512 } from './sha512.ts'

const P = (1n << 255n) - 19n
const L = (1n << 252n) + 27742317777372353535851937790883648493n   // the prime order of the base point
const D = -121665n * inv(121666n) % P
const I = expmod(2n, (P - 1n) / 4n, P)                            // a square root of -1

function mod(a: bigint, m: bigint = P): bigint { const r = a % m; return r < 0n ? r + m : r }
function expmod(b: bigint, e: bigint, m: bigint): bigint {
  let r = 1n, x = mod(b, m), k = e
  while (k > 0n) { if (k & 1n) r = r * x % m; x = x * x % m; k >>= 1n }
  return r
}
function inv(a: bigint): bigint { return expmod(a, P - 2n, P) }

// Edwards curve points in extended coordinates would be faster; affine is shorter and this signs uuids.
type Pt = [bigint, bigint]
function edwards(a: Pt, b: Pt): Pt {
  const [x1, y1] = a, [x2, y2] = b
  const t = mod(D * x1 * x2 * y1 * y2)
  return [mod((x1 * y2 + x2 * y1) * inv(1n + t)), mod((y1 * y2 + x1 * x2) * inv(1n - t))]
}
function scalarMult(p: Pt, e: bigint): Pt {
  if (e === 0n) return [0n, 1n]
  const q = scalarMult(p, e >> 1n)
  const d = edwards(q, q)
  return (e & 1n) ? edwards(d, p) : d
}
function recoverX(y: bigint, sign: bigint): bigint | null {
  const y2 = y * y % P
  const u = mod(y2 - 1n), v = mod(D * y2 + 1n)
  let x = expmod(u * inv(v), (P + 3n) / 8n, P)
  if (mod(x * x - u * inv(v)) !== 0n) x = mod(x * I)
  if (mod(x * x - u * inv(v)) !== 0n) return null
  if ((x & 1n) !== sign) x = mod(-x)
  return x
}
const By = 4n * inv(5n)
const B: Pt = [recoverX(By, 0n)!, By]

const le = (bytes: readonly number[]): bigint => { let v = 0n; for (let i = bytes.length - 1; i >= 0; i--) v = (v << 8n) | BigInt(bytes[i]); return v }
const toLe = (v: bigint, n: number): number[] => Array.from({ length: n }, (_, i) => Number((v >> BigInt(i * 8)) & 0xffn))

function encodePoint([x, y]: Pt): number[] {
  const out = toLe(mod(y), 32)
  out[31] = (out[31] & 0x7f) | (Number(x & 1n) << 7)
  return out
}
function decodePoint(bytes: readonly number[]): Pt | null {
  const y = le(bytes) & ((1n << 255n) - 1n)
  if (y >= P) return null                                   // non-canonical y is rejected
  const x = recoverX(y, BigInt((bytes[31] >> 7) & 1))
  return x === null ? null : [x, y]
}

/** The secret scalar and the prefix, derived from a 32-byte seed (RFC 8032 §5.1.5). */
function expand(seed: readonly number[]): { a: bigint; prefix: number[] } {
  const h = sha512(seed)
  const s = h.slice(0, 32)
  s[0] &= 248; s[31] &= 127; s[31] |= 64
  return { a: le(s), prefix: h.slice(32) }
}

/** The public key for a 32-byte seed. */
export function publicKey(seed: readonly number[]): number[] {
  if (seed.length !== 32) throw new Error('ed25519: a seed is 32 bytes')
  return encodePoint(scalarMult(B, expand(seed).a))
}

/** A 64-byte signature over `msg` by the holder of `seed`. */
export function sign(seed: readonly number[], msg: readonly number[]): number[] {
  if (seed.length !== 32) throw new Error('ed25519: a seed is 32 bytes')
  const { a, prefix } = expand(seed)
  const A = encodePoint(scalarMult(B, a))
  const r = mod(le(sha512([...prefix, ...msg])), L)
  const R = encodePoint(scalarMult(B, r))
  const k = mod(le(sha512([...R, ...A, ...msg])), L)
  return [...R, ...toLe(mod(r + k * a, L), 32)]
}

/** Does `sig` verify against `pub` for `msg`? Anyone can ask; only the seed's holder can produce one. */
export function verify(pub: readonly number[], msg: readonly number[], sig: readonly number[]): boolean {
  if (pub.length !== 32 || sig.length !== 64) return false
  const A = decodePoint(pub); if (!A) return false
  const R = decodePoint(sig.slice(0, 32)); if (!R) return false
  const S = le(sig.slice(32))
  if (S >= L) return false                                  // a non-canonical S is rejected
  const k = mod(le(sha512([...sig.slice(0, 32), ...pub, ...msg])), L)
  const lhs = scalarMult(B, S)
  const rhs = edwards(R, scalarMult(A, k))
  return lhs[0] === rhs[0] && lhs[1] === rhs[1]
}

export const PUBLIC_KEY_BYTES = 32
export const SIGNATURE_BYTES = 64
export const SEED_BYTES = 32
