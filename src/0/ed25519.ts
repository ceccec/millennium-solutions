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

export const P = (1n << 255n) - 19n                                       // the field prime, 2^255 - 19
export const L = (1n << 252n) + 27742317777372353535851937790883648493n   // the prime order of the base point
const D = -121665n * inv(121666n) % P
const I = expmod(2n, (P - 1n) / 4n, P)                            // a square root of -1

function mod(a: bigint, m: bigint = P): bigint { const r = a % m; return r < 0n ? r + m : r }
function expmod(b: bigint, e: bigint, m: bigint): bigint {
  let r = 1n, x = mod(b, m), k = e
  while (k > 0n) { if (k & 1n) r = r * x % m; x = x * x % m; k >>= 1n }
  return r
}
function inv(a: bigint): bigint { return expmod(a, P - 2n, P) }

// EXTENDED COORDINATES, BECAUSE AFFINE PUT AN INVERSION INSIDE EVERY ADDITION. The first version added
// points as (x, y) and each addition called `inv` twice — a 255-step modular exponentiation apiece — so a
// single scalar multiplication paid for roughly five hundred of them. crypto-kat took 3.8 seconds to check
// three published vectors. In extended coordinates (X : Y : Z : T), with x = X/Z, y = Y/Z and T = XY/Z, an
// addition is multiplications only; ONE inversion is paid, at the end, when a point is encoded. The
// formulas are the standard ones for a twisted Edwards curve with a = −1 (Hisil, Wong, Carter and Dawson,
// 2008, "add-2008-hwcd-3"), and RFC 8032's vectors are what says the port is faithful — they are checked on
// every run by scripts/crypto-kat.ts, which is the only reason to believe any of this.
type Pt = [bigint, bigint]
type Ext = [bigint, bigint, bigint, bigint]
const toExt = ([x, y]: Pt): Ext => [mod(x), mod(y), 1n, mod(x * y)]
const toAffine = ([X, Y, Z]: Ext): Pt => { const zi = inv(Z); return [mod(X * zi), mod(Y * zi)] }
const D2 = mod(2n * D)

function extAdd(p: Ext, q: Ext): Ext {
  const [X1, Y1, Z1, T1] = p, [X2, Y2, Z2, T2] = q
  const A = mod((Y1 - X1) * (Y2 - X2))
  const B = mod((Y1 + X1) * (Y2 + X2))
  const C = mod(T1 * D2 * T2)
  const Dd = mod(Z1 * 2n * Z2)
  const E = B - A, F = Dd - C, G = Dd + C, H = B + A
  return [mod(E * F), mod(G * H), mod(F * G), mod(E * H)]
}
function extDouble(p: Ext): Ext { return extAdd(p, p) }

function scalarMult(p: Pt, e: bigint): Pt {
  let acc: Ext = [0n, 1n, 1n, 0n]          // the neutral element
  let base = toExt(p)
  let k = e
  while (k > 0n) {
    if (k & 1n) acc = extAdd(acc, base)
    base = extDouble(base)
    k >>= 1n
  }
  return toAffine(acc)
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

// THE SIZES, NAMED ONCE. `SEED_BYTES` was exported and used nowhere, which read as dead weight — and the
// reason it was unused is that every check below typed `32` and `64` as literals instead. Deleting the
// constant would have removed the name and kept three copies of the number; this keeps the name and removes
// the copies, which is the rule this deposit states as never type a constant.
export const PUBLIC_KEY_BYTES = 32
export const SIGNATURE_BYTES = 64
export const SEED_BYTES = 32

/** The secret scalar and the prefix, derived from a 32-byte seed (RFC 8032 §5.1.5). */
function expand(seed: readonly number[]): { a: bigint; prefix: number[] } {
  const h = sha512(seed)
  const s = h.slice(0, 32)
  s[0] &= 248; s[31] &= 127; s[31] |= 64
  return { a: le(s), prefix: h.slice(32) }
}

/** The public key for a 32-byte seed. */
export function publicKey(seed: readonly number[]): number[] {
  if (seed.length !== SEED_BYTES) throw new Error(`ed25519: a seed is ${SEED_BYTES} bytes`)
  return encodePoint(scalarMult(B, expand(seed).a))
}

/** A 64-byte signature over `msg` by the holder of `seed`. */
export function sign(seed: readonly number[], msg: readonly number[]): number[] {
  if (seed.length !== SEED_BYTES) throw new Error(`ed25519: a seed is ${SEED_BYTES} bytes`)
  const { a, prefix } = expand(seed)
  const A = encodePoint(scalarMult(B, a))
  const r = mod(le(sha512([...prefix, ...msg])), L)
  const R = encodePoint(scalarMult(B, r))
  const k = mod(le(sha512([...R, ...A, ...msg])), L)
  return [...R, ...toLe(mod(r + k * a, L), 32)]
}

/** Does `sig` verify against `pub` for `msg`? Anyone can ask; only the seed's holder can produce one. */
export function verify(pub: readonly number[], msg: readonly number[], sig: readonly number[]): boolean {
  if (pub.length !== PUBLIC_KEY_BYTES || sig.length !== SIGNATURE_BYTES) return false
  const A = decodePoint(pub); if (!A) return false
  const R = decodePoint(sig.slice(0, 32)); if (!R) return false
  const S = le(sig.slice(32))
  if (S >= L) return false                                  // a non-canonical S is rejected
  const k = mod(le(sha512([...sig.slice(0, 32), ...pub, ...msg])), L)
  const lhs = scalarMult(B, S)
  const rhs = toAffine(extAdd(toExt(R), toExt(scalarMult(A, k))))
  return lhs[0] === rhs[0] && lhs[1] === rhs[1]
}

