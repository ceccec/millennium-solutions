// crypt — full PURE-TypeScript authenticated encryption. No native WebCrypto, no deps, nothing but latest TS.
//
//   KDF:    PBKDF2-HMAC-SHA256 (600k) — pure TS (./sha256), KAT-verified.
//   CIPHER: ChaCha20-Poly1305 AEAD (RFC 8439) — pure TS (./chacha), KAT-verified.
//   ENVELOPE: the uuidna 7d fold content-addresses the sealed message (public integrity/routing).
//
// TWO MODES, one shared AEAD path:
//   · CONVERGENT (default, `encrypt`): salt, key, and nonce are derived from the passphrase and plaintext, so the
//     same (passphrase, plaintext) always seals to the same envelope — reproducible and content-addressable.
//     Trade-off: determinism reveals when two envelopes hold the SAME plaintext under the same passphrase.
//   · RANDOMIZED (`encryptRandom`): a per-message random salt+nonce (from globalThis.crypto.getRandomValues, or an
//     injected `random`), so equal plaintexts seal to DISTINCT envelopes — equality is hidden. Not reproducible.
// Honest caveats (both modes): pure JS is NOT constant-time (timing side-channels). Strength = ChaCha20-Poly1305 +
// the passphrase's own entropy. `iter` is overridable via opts (default 600k; lower only for tests). Integrity, not truth. 0/7.
import { toUuid, merkleFold } from './address.js'
import { pbkdf2Sha256, sha256 } from './sha256.js'
import { aeadEncrypt, aeadDecrypt } from './chacha.js'

const enc = new TextEncoder(), dec = new TextDecoder()
export const ITER = 600_000 // PBKDF2-SHA-256 iterations (OWASP 2023)

// Pure, dependency-free base64 (standard alphabet, padded) — no btoa/atob global, so the core
// carries zero platform assumptions and runs identically on Node, Deno, Bun, browsers, and edge.
const B64 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
const B64I = /*@__PURE__*/ (() => { const m = new Int8Array(128).fill(-1); for (let i = 0; i < B64.length; i++) m[B64.charCodeAt(i)] = i; return m })()
const b64 = (u: Uint8Array): string => {
  let s = ''
  for (let i = 0; i < u.length; i += 3) {
    const a = u[i], b = i + 1 < u.length ? u[i + 1] : 0, c = i + 2 < u.length ? u[i + 2] : 0
    const n = (a << 16) | (b << 8) | c
    s += B64[(n >> 18) & 63] + B64[(n >> 12) & 63]
    s += (i + 1 < u.length ? B64[(n >> 6) & 63] : '=') + (i + 2 < u.length ? B64[n & 63] : '=')
  }
  return s
}
const ub64 = (s: string): Uint8Array => {
  const clean = s.replace(/[^A-Za-z0-9+/]/g, '') // drop padding and any whitespace
  const out = new Uint8Array((clean.length * 3) >> 2)
  let o = 0
  for (let i = 0; i < clean.length; i += 4) {
    const x0 = B64I[clean.charCodeAt(i)], x1 = B64I[clean.charCodeAt(i + 1)]
    const x2 = i + 2 < clean.length ? B64I[clean.charCodeAt(i + 2)] : 0
    const x3 = i + 3 < clean.length ? B64I[clean.charCodeAt(i + 3)] : 0
    const n = (x0 << 18) | (x1 << 12) | (x2 << 6) | x3
    out[o++] = (n >> 16) & 255
    if (i + 2 < clean.length) out[o++] = (n >> 8) & 255
    if (i + 3 < clean.length) out[o++] = n & 255
  }
  return out
}
const cat = (...a: Uint8Array[]): Uint8Array => { const t = new Uint8Array(a.reduce((s, x) => s + x.length, 0)); let o = 0; for (const x of a) { t.set(x, o); o += x.length } return t }

const foldEnvelope = (alg: string, salt: string, nonce: string, ct: string, tag: string): string =>
  merkleFold([alg, salt, nonce, ct, tag].map(toUuid))

/** How the envelope's salt/nonce were sourced: derived from the input (reproducible) vs. random (equality-hiding). */
export type CryptMode = 'convergent' | 'randomized'

/** A sealed envelope: the ChaCha20-Poly1305 ciphertext + tag, its public parameters, and its 7d-fold address.
 *  `v:1` envelopes (pre-mode) still decrypt — `decrypt`/`verifyEnvelope` read only the cipher parameters. */
export interface Sealed {
  v: 1 | 2
  alg: 'ChaCha20-Poly1305'
  kdf: 'PBKDF2-SHA256'
  mode: CryptMode
  iter: number
  salt: string
  nonce: string
  ct: string
  tag: string
  address: string
}

/** Options common to both modes. `iter` overrides the PBKDF2 count (default {@link ITER}); lower only for tests. */
export interface EncryptOpts { iter?: number }
/** Randomized-mode options. `random(n)` returns n secure random bytes; default: globalThis.crypto.getRandomValues. */
export interface RandomOpts extends EncryptOpts { random?: (n: number) => Uint8Array }

/** Default entropy — Web Crypto's getRandomValues (Node ≥18, Deno, Bun, browsers, Workers). Throws if absent,
 *  never silently weakens: pass opts.random to supply your own source. */
function defaultRandom(n: number): Uint8Array {
  const g = (globalThis as { crypto?: { getRandomValues?: (a: Uint8Array) => Uint8Array } }).crypto
  if (!g || typeof g.getRandomValues !== 'function')
    throw new Error('uuidna crypt: no secure entropy (globalThis.crypto.getRandomValues) — pass opts.random to encryptRandom')
  return g.getRandomValues(new Uint8Array(n))
}

/** The one AEAD+envelope path both modes share (DRY): given the resolved key/salt/nonce, seal and address it. */
function seal(pt: Uint8Array, salt: Uint8Array, nonce: Uint8Array, key: Uint8Array, iter: number, mode: CryptMode): Sealed {
  const { ct, tag } = aeadEncrypt(key, nonce, pt)
  const s = { v: 2 as const, alg: 'ChaCha20-Poly1305' as const, kdf: 'PBKDF2-SHA256' as const, mode, iter, salt: b64(salt), nonce: b64(nonce), ct: b64(ct), tag: b64(tag) }
  return { ...s, address: foldEnvelope(s.alg, s.salt, s.nonce, s.ct, s.tag) }
}

/** Encrypt plaintext under a passphrase — pure-TS, DETERMINISTIC (convergent): same input → same envelope. */
export function encrypt(plaintext: string, passphrase: string, opts: EncryptOpts = {}): Sealed {
  const iter = opts.iter ?? ITER
  const pt = enc.encode(plaintext), pass = enc.encode(passphrase)
  // content-derived, per-plaintext salt (unique per plaintext → no cross-target rainbow tables), pure & deterministic
  const salt = sha256(cat(enc.encode('uuidna-crypt-salt-v1'), pt)).slice(0, 16)
  const key = pbkdf2Sha256(pass, salt, iter, 32)
  // nonce derived from the (unique-per-plaintext) key — pure, deterministic, non-repeating for distinct plaintexts
  const nonce = sha256(cat(enc.encode('uuidna-crypt-nonce-v1'), key)).slice(0, 12)
  return seal(pt, salt, nonce, key, iter, 'convergent')
}

/** Encrypt with a per-message RANDOM salt+nonce — equal plaintexts seal to DISTINCT envelopes (equality hidden).
 *  Not reproducible/content-addressable; use when hiding plaintext equality matters more than convergence. */
export function encryptRandom(plaintext: string, passphrase: string, opts: RandomOpts = {}): Sealed {
  const iter = opts.iter ?? ITER
  const random = opts.random ?? defaultRandom
  const pt = enc.encode(plaintext), pass = enc.encode(passphrase)
  const salt = random(16), nonce = random(12)
  const key = pbkdf2Sha256(pass, salt, iter, 32)
  return seal(pt, salt, nonce, key, iter, 'randomized')
}

/** Decrypt a sealed envelope (either mode). A wrong passphrase or tampered ciphertext throws (Poly1305 auth). */
export function decrypt(sealed: Sealed, passphrase: string): string {
  const key = pbkdf2Sha256(enc.encode(passphrase), ub64(sealed.salt), sealed.iter, 32)
  return dec.decode(aeadDecrypt(key, ub64(sealed.nonce), ub64(sealed.ct), ub64(sealed.tag)))
}

/** Verify the envelope's 7d-fold content-address (integrity/routing) without the key — public, reproducible. */
export function verifyEnvelope(sealed: Sealed): boolean {
  return foldEnvelope(sealed.alg, sealed.salt, sealed.nonce, sealed.ct, sealed.tag) === sealed.address
}
