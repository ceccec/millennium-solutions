// The published test vectors — defined ONCE here and consumed by every runner (the node:test KAT
// suite and the runtime-neutral conformance runner). DRY: a vector lives in exactly one place, so
// Node, Deno, Bun, and the browser all check the same constants and cannot drift apart.
//
// Sources: FIPS 180-4 (SHA-256) · RFC 4231 (HMAC-SHA-256) · RFC 7914 §11 (PBKDF2-HMAC-SHA256)
//          RFC 8439 §2.4.2, §2.5.2, §2.8.2 (ChaCha20, Poly1305, AEAD_CHACHA20_POLY1305)

export const hex = (u) => Array.from(u, (b) => b.toString(16).padStart(2, '0')).join('')
export const un = (h) => new Uint8Array(h.replace(/\s+/g, '').match(/../g).map((b) => parseInt(b, 16)))
export const utf8 = (s) => new TextEncoder().encode(s)

/** FIPS 180-4 — SHA-256 digests. */
export const SHA256 = [
  { name: 'empty string', msg: '', digest: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855' },
  { name: 'abc (B.1)', msg: 'abc', digest: 'ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad' },
  { name: 'two-block (B.2)', msg: 'abcdbcdecdefdefgefghfghighijhijkijkljklmklmnlmnomnopnopq', digest: '248d6a61d20638b8e5c026930c3e6039a33ce45964ff2167f6ecedd419db06c1' },
  { name: 'one million a', msg: 'a'.repeat(1000000), digest: 'cdc76e5c9914fb9281a1c7e284d73e67f1809a48a497200e046d39ccc7112cd0' },
]

/** RFC 4231 — HMAC-SHA-256 test cases (key given as hex or text). */
export const HMAC = [
  { name: 'case 1', keyHex: '0b'.repeat(20), msg: 'Hi There', mac: 'b0344c61d8db38535ca8afceaf0bf12b881dc200c9833da726e9376c2e32cff7' },
  { name: 'case 2 (short key)', keyText: 'Jefe', msg: 'what do ya want for nothing?', mac: '5bdcc146bf60754e6a042426089575c75a003f089d2739839dec58b964ec3843' },
  { name: 'case 5 (key > block)', keyHex: 'aa'.repeat(131), msg: 'Test Using Larger Than Block-Size Key - Hash Key First', mac: '60e431591ee0b67f0d8a26aacbf5b77f8e0bc6213728c5140546040f0ee37f54' },
]

/** RFC 7914 §11 — PBKDF2-HMAC-SHA256. */
export const PBKDF2 = [
  {
    name: 'passwd/salt c=1 dkLen=64', pass: 'passwd', salt: 'salt', iter: 1, dkLen: 64,
    dk: '55ac046e56e3089fec1691c22544b605f94185216dde0465e68b9d57c20dacbc' +
        '49ca9cccf179b645991664b39d77ef317c71b845b1e30bd509112041d3a19783',
  },
  { name: 'partial final block (dkLen=20)', pass: 'password', salt: 'salt', iter: 1, dkLen: 20, dk: '120fb6cffcf8b32c43e7225256c4f837a86548c9' },
]

/** RFC 8439 §2.4.2 — ChaCha20 encryption. */
export const CHACHA20 = {
  keyHex: '000102030405060708090a0b0c0d0e0f101112131415161718191a1b1c1d1e1f',
  nonceHex: '000000000000004a00000000',
  counter: 1,
  plaintext: "Ladies and Gentlemen of the class of '99: If I could offer you only one tip for the future, sunscreen would be it.",
  ct: '6e2e359a2568f98041ba0728dd0d6981e97e7aec1d4360c20a27afccfd9fae0b' +
      'f91b65c5524733ab8f593dabcd62b3571639d624e65152ab8f530c359f0861d8' +
      '07ca0dbf500d6a6156a38e088a22b65e52bc514d16ccf806818ce91ab7793736' +
      '5af90bbf74a35be6b40b8eedf2785e42874d',
}

/** RFC 8439 §2.5.2 — Poly1305 one-time authenticator. */
export const POLY1305 = {
  keyHex: '85d6be7857556d337f4452fe42d506a80103808afb0db2fd4abff6af4149f51b',
  msg: 'Cryptographic Forum Research Group',
  tag: 'a8061dc1305136c6c22b8baf0c0127a9',
}

/** RFC 8439 §2.8.2 — AEAD_CHACHA20_POLY1305. */
export const AEAD = {
  keyHex: '808182838485868788898a8b8c8d8e8f909192939495969798999a9b9c9d9e9f',
  nonceHex: '070000004041424344454647',
  aadHex: '50515253c0c1c2c3c4c5c6c7',
  plaintext: "Ladies and Gentlemen of the class of '99: If I could offer you only one tip for the future, sunscreen would be it.",
  ct: 'd31a8d34648e60db7b86afbc53ef7ec2a4aded51296e08fea9e2b5a736ee62d6' +
      '3dbea45e8ca9671282fafb69da92728b1a71de0a9e060b2905d6a5b67ecd3b36' +
      '92ddbd7f2d778b8c9803aee328091b58fab324e4fad675945585808b4831d7bc' +
      '3ff4def08e4b7a9de576d26586cec64b6116',
  tag: '1ae10b594f09e26a7e902ecbd0600691',
}

/** Determinism anchors — the content-address is keyless and identical on every runtime, so these
 *  fixed outputs are what "agnostic" means in practice: a byte differs ⇒ a runtime diverged. */
export const ADDRESS = [
  { seed: 'uuidna', uuid: null },   // uuid filled at runtime; equality across runtimes is the assertion
]

/** Prose the honesty gate must drain (0) or hold (1) — the same corpus in every runtime. */
export const GATE = [
  { text: 'we prove the Riemann hypothesis', binary: 0 },
  { text: 'мы доказали гипотезу', binary: 0 },
  { text: 'это faster than light', binary: 0 },
  { text: 'a content-address proves integrity, not truth; 0/7', binary: 1 },
]
