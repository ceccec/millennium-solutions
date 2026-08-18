// C7 — Known-Answer Tests, as a node:test suite. The vectors themselves live in ./vectors.mjs and are
// shared with the runtime-neutral conformance runner (./conformance.mjs), so Node, Deno, Bun, and the
// browser all check the same published constants — one definition, no drift. This file is the blocking
// release gate for the crypto layer: if a byte moves, the build stops.
//
// Sources: FIPS 180-4 · RFC 4231 · RFC 7914 §11 · RFC 8439 §2.4.2, §2.5.2, §2.8.2
import test from 'node:test'
import assert from 'node:assert/strict'
import { sha256, hmacSha256, pbkdf2Sha256, chacha20, poly1305, aeadEncrypt, aeadDecrypt } from '../dist/index.js'
import { SHA256, HMAC, PBKDF2, CHACHA20, POLY1305, AEAD, hex, un, utf8 } from './vectors.mjs'

test('KAT · SHA-256 — FIPS 180-4 published digests', () => {
  for (const v of SHA256) assert.equal(hex(sha256(utf8(v.msg))), v.digest, v.name)
})

test('KAT · HMAC-SHA-256 — RFC 4231 test cases', () => {
  for (const v of HMAC) {
    const key = v.keyHex ? un(v.keyHex) : utf8(v.keyText)
    assert.equal(hex(hmacSha256(key, utf8(v.msg))), v.mac, v.name)
  }
})

test('KAT · PBKDF2-HMAC-SHA256 — RFC 7914 §11 published vectors', () => {
  for (const v of PBKDF2) assert.equal(hex(pbkdf2Sha256(utf8(v.pass), utf8(v.salt), v.iter, v.dkLen)), v.dk, v.name)
})

test('KAT · ChaCha20 — RFC 8439 §2.4.2 encryption vector', () => {
  const key = un(CHACHA20.keyHex), nonce = un(CHACHA20.nonceHex), pt = utf8(CHACHA20.plaintext)
  const ct = chacha20(key, CHACHA20.counter, nonce, pt)
  assert.equal(hex(ct), CHACHA20.ct)
  // the stream cipher is its own inverse at the same counter — decryption recovers the plaintext
  assert.deepEqual(chacha20(key, CHACHA20.counter, nonce, ct), pt)
})

test('KAT · Poly1305 — RFC 8439 §2.5.2 tag vector', () => {
  assert.equal(hex(poly1305(utf8(POLY1305.msg), un(POLY1305.keyHex))), POLY1305.tag)
})

test('KAT · AEAD_CHACHA20_POLY1305 — RFC 8439 §2.8.2 ciphertext + tag', () => {
  const key = un(AEAD.keyHex), nonce = un(AEAD.nonceHex), aad = un(AEAD.aadHex), pt = utf8(AEAD.plaintext)
  const { ct, tag } = aeadEncrypt(key, nonce, pt, aad)
  assert.equal(hex(ct), AEAD.ct)
  assert.equal(hex(tag), AEAD.tag)
  assert.deepEqual(aeadDecrypt(key, nonce, ct, tag, aad), pt) // the published envelope round-trips
})

test('KAT · authentication is enforced — a flipped bit in ct, tag, or aad fails', () => {
  const key = un(AEAD.keyHex), nonce = un(AEAD.nonceHex), aad = un(AEAD.aadHex)
  const { ct, tag } = aeadEncrypt(key, nonce, utf8('authenticate me'), aad)
  const flip = (u, i) => { const c = Uint8Array.from(u); c[i] ^= 1; return c }
  assert.throws(() => aeadDecrypt(key, nonce, flip(ct, 0), tag, aad), /authentication failed/)
  assert.throws(() => aeadDecrypt(key, nonce, ct, flip(tag, 15), aad), /authentication failed/)
  assert.throws(() => aeadDecrypt(key, nonce, ct, tag, flip(aad, 0)), /authentication failed/)
})
