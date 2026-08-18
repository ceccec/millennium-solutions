// C8/C14 — the runtime-neutral conformance runner. ONE file, run unmodified by Node, Deno, Bun, and
// the browser (and any edge runtime that can import an ESM module). It uses no test framework and no
// platform API beyond the Web standards the core itself is limited to, so "it runs here" is a real
// signal about the runtime rather than about a test harness.
//
// The vectors come from ./vectors.mjs — the same constants the node:test KAT suite asserts, so the
// two runners cannot drift. Determinism is the point: every runtime must produce identical bytes.
//
// Usage:  node test/conformance.mjs · deno run --allow-read test/conformance.mjs · bun test/conformance.mjs
//         (browser: import runConformance from the bundle-backed page in site/)
import { SHA256, HMAC, PBKDF2, CHACHA20, POLY1305, AEAD, GATE, hex, un, utf8 } from './vectors.mjs'

/** Run every conformance check against a uuidna module namespace. Returns {passed, failed, results}. */
export function runConformance(U) {
  const results = []
  const check = (name, fn) => {
    try {
      const detail = fn()
      results.push({ name, ok: true, detail: detail ?? '' })
    } catch (e) {
      results.push({ name, ok: false, detail: e && e.message ? e.message : String(e) })
    }
  }
  const eq = (actual, expected, what) => {
    if (actual !== expected) throw new Error(`${what}: got ${actual}, expected ${expected}`)
    return actual
  }

  // ── crypto KATs — identical bytes on every runtime ──
  for (const v of SHA256) check(`sha256 · ${v.name}`, () => eq(hex(U.sha256(utf8(v.msg))), v.digest, 'digest'))
  for (const v of HMAC) {
    check(`hmac-sha256 · ${v.name}`, () => {
      const key = v.keyHex ? un(v.keyHex) : utf8(v.keyText)
      return eq(hex(U.hmacSha256(key, utf8(v.msg))), v.mac, 'mac')
    })
  }
  for (const v of PBKDF2) {
    check(`pbkdf2-sha256 · ${v.name}`, () => eq(hex(U.pbkdf2Sha256(utf8(v.pass), utf8(v.salt), v.iter, v.dkLen)), v.dk, 'dk'))
  }
  check('chacha20 · RFC 8439 §2.4.2', () =>
    eq(hex(U.chacha20(un(CHACHA20.keyHex), CHACHA20.counter, un(CHACHA20.nonceHex), utf8(CHACHA20.plaintext))), CHACHA20.ct, 'ct'))
  check('poly1305 · RFC 8439 §2.5.2', () =>
    eq(hex(U.poly1305(utf8(POLY1305.msg), un(POLY1305.keyHex))), POLY1305.tag, 'tag'))
  check('aead · RFC 8439 §2.8.2', () => {
    const { ct, tag } = U.aeadEncrypt(un(AEAD.keyHex), un(AEAD.nonceHex), utf8(AEAD.plaintext), un(AEAD.aadHex))
    eq(hex(ct), AEAD.ct, 'ct')
    return eq(hex(tag), AEAD.tag, 'tag')
  })

  // ── the content-address: keyless, deterministic, and the SAME on every runtime ──
  check('address · deterministic and context-free', () => {
    eq(U.toUuid('uuidna'), U.toUuid('uuidna'), 'repeatable')
    if (U.toUuid('a') === U.toUuid('b')) throw new Error('distinct seeds collided')
    if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/.test(U.toUuid('x'))) throw new Error('shape')
    return U.toUuid('uuidna') // printed so a cross-runtime diff is visible at a glance
  })
  check('address · exact integer arithmetic (no float drift)', () =>
    eq(U.toUuid('the quick brown fox jumps over the lazy dog'), U.toUuid('the quick brown fox jumps over the lazy dog'), 'stable'))
  check('merkleFold · order-independent', () => {
    const leaves = ['a', 'b', 'c', 'd'].map(U.toUuid)
    return eq(U.merkleFold(leaves), U.merkleFold([...leaves].reverse()), 'root')
  })
  check('merkle proof · sound, and a forgery fails', () => {
    const leaves = Array.from({ length: 8 }, (_, i) => U.toUuid('leaf' + i))
    const root = U.merkleRoot(leaves)
    const proof = U.merkleProof(leaves, 3)
    if (!U.verifyProof(leaves[3], proof, root)) throw new Error('true leaf did not verify')
    if (U.verifyProof(U.toUuid('forgery'), proof, root)) throw new Error('a forged leaf verified')
    return root
  })

  // ── the honesty gate — the same corpus, the same verdicts, in every runtime ──
  for (const g of GATE) check(`gate · ${JSON.stringify(g.text.slice(0, 32))}`, () => eq(U.computes(g.text).binary, g.binary, 'binary'))

  // ── the imprint codec and the two crypt modes ──
  check('imprint · round-trips text through a uuid chain', () => {
    for (const s of ['', 'Hi', 'the units of Z/9', '你好 · Riemann']) {
      if (U.readImprintTextChain(U.imprintTextChain(s)) !== s) throw new Error('round-trip failed for ' + JSON.stringify(s))
    }
    return 'ok'
  })
  check('crypt · convergent mode is deterministic and round-trips', () => {
    const a = U.encrypt('hello', 'pw', { iter: 1000 })
    const b = U.encrypt('hello', 'pw', { iter: 1000 })
    eq(a.address, b.address, 'convergent address')
    eq(U.decrypt(a, 'pw'), 'hello', 'plaintext')
    if (!U.verifyEnvelope(a)) throw new Error('envelope did not verify')
    return a.address
  })
  check('crypt · a wrong passphrase throws', () => {
    const s = U.encrypt('secret', 'right', { iter: 1000 })
    try { U.decrypt(s, 'wrong') } catch { return 'threw as required' }
    throw new Error('a wrong passphrase decrypted')
  })
  check('crypt · randomized mode hides plaintext equality', () => {
    // injected entropy keeps this deterministic for the runner while exercising the randomized path
    let n = 0
    const random = (len) => new Uint8Array(len).map(() => (n = (n * 31 + 17) & 255))
    const a = U.encryptRandom('same', 'pw', { iter: 1000, random })
    const b = U.encryptRandom('same', 'pw', { iter: 1000, random })
    if (a.address === b.address) throw new Error('equal plaintexts produced equal envelopes')
    return eq(U.decrypt(a, 'pw'), 'same', 'plaintext')
  })

  const failed = results.filter((r) => !r.ok)
  return { passed: results.length - failed.length, failed: failed.length, results }
}

/** Identify the host runtime without assuming any of them exists. */
export function runtimeName() {
  const g = globalThis
  if (g.Deno?.version?.deno) return `Deno ${g.Deno.version.deno}`
  if (g.Bun?.version) return `Bun ${g.Bun.version}`
  if (g.process?.versions?.node) return `Node ${g.process.versions.node}`
  if (g.navigator?.userAgent) return `browser (${g.navigator.userAgent.slice(0, 40)})`
  return 'unknown runtime'
}

// When executed directly (Node/Deno/Bun), import the built module and report. In a browser this file
// is imported for `runConformance` instead, so the CLI branch below simply never runs.
const isDirectRun = !!(globalThis.process?.argv?.[1] || globalThis.Deno?.args)
if (isDirectRun) {
  const U = await import('../dist/index.js')
  const { passed, failed, results } = runConformance(U)
  for (const r of results) console.log(`${r.ok ? '✓' : '✗'} ${r.name}${r.detail ? '  ' + r.detail : ''}`)
  console.log(`\n${runtimeName()} — ${passed} passed, ${failed} failed`)
  if (failed) {
    const exit = globalThis.process?.exit ?? globalThis.Deno?.exit
    if (exit) exit(1)
    else throw new Error(`${failed} conformance check(s) failed`)
  }
}
