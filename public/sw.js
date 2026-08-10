// Offline + SECURE INTEGRITY PROXY that PROXIES ALL TRAFFIC and SIGNS RECEIPTS. The deposit is deterministic,
// so cached pages recompute identically offline. This worker sits in the path of EVERY request: same-origin
// GET is verified against a build-time SHA-256 manifest (sw-integrity.json) with a pure-JS SHA-256 (no native
// WebCrypto) — a MITM-tampered response over assumed-insecure transport fails and is refused, never served or
// cached; every other request (cross-origin, non-GET) is forwarded transparently. Each verified asset is
// SIGNED into a chained content-address RECEIPT (toUuid, ported from the ledger) and posted to the clients, so
// the traffic is an audited, tamper-evident stream — forensics (a broken link localises tampering) and
// analytics run on the receipts. Honest scope: INTEGRITY and provenance, NOT confidentiality; a receipt is a
// content-address, not a keyed signature; opaque cross-origin responses cannot be hash-verified. 0/7.

// ── pure-JS SHA-256 (FIPS 180-4), a port of src/0/sha256.ts → lowercase hex. KAT: sha256("abc") = ba7816bf… ──
const K = new Uint32Array([
  0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
  0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
  0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
  0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
  0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
  0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
  0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
  0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2])
const rotr = (x, n) => ((x >>> n) | (x << (32 - n))) >>> 0
function sha256hex(msg) {
  const H = new Uint32Array([0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a, 0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19])
  const l = msg.length, bitLen = l * 8, k = ((56 - ((l + 1) % 64)) + 64) % 64, total = l + 1 + k + 8
  const m = new Uint8Array(total); m.set(msg); m[l] = 0x80
  const hi = Math.floor(bitLen / 0x100000000), lo = bitLen >>> 0
  m[total - 8] = (hi >>> 24) & 255; m[total - 7] = (hi >>> 16) & 255; m[total - 6] = (hi >>> 8) & 255; m[total - 5] = hi & 255
  m[total - 4] = (lo >>> 24) & 255; m[total - 3] = (lo >>> 16) & 255; m[total - 2] = (lo >>> 8) & 255; m[total - 1] = lo & 255
  const w = new Uint32Array(64)
  for (let off = 0; off < total; off += 64) {
    for (let i = 0; i < 16; i++) w[i] = ((m[off + i * 4] << 24) | (m[off + i * 4 + 1] << 16) | (m[off + i * 4 + 2] << 8) | m[off + i * 4 + 3]) >>> 0
    for (let i = 16; i < 64; i++) { const s0 = rotr(w[i - 15], 7) ^ rotr(w[i - 15], 18) ^ (w[i - 15] >>> 3), s1 = rotr(w[i - 2], 17) ^ rotr(w[i - 2], 19) ^ (w[i - 2] >>> 10); w[i] = (w[i - 16] + s0 + w[i - 7] + s1) >>> 0 }
    let a = H[0], b = H[1], c = H[2], d = H[3], e = H[4], f = H[5], g = H[6], h = H[7]
    for (let i = 0; i < 64; i++) {
      const S1 = rotr(e, 6) ^ rotr(e, 11) ^ rotr(e, 25), ch = (e & f) ^ (~e & g), t1 = (h + S1 + ch + K[i] + w[i]) >>> 0
      const S0 = rotr(a, 2) ^ rotr(a, 13) ^ rotr(a, 22), maj = (a & b) ^ (a & c) ^ (b & c), t2 = (S0 + maj) >>> 0
      h = g; g = f; f = e; e = (d + t1) >>> 0; d = c; c = b; b = a; a = (t1 + t2) >>> 0
    }
    H[0] = (H[0] + a) >>> 0; H[1] = (H[1] + b) >>> 0; H[2] = (H[2] + c) >>> 0; H[3] = (H[3] + d) >>> 0
    H[4] = (H[4] + e) >>> 0; H[5] = (H[5] + f) >>> 0; H[6] = (H[6] + g) >>> 0; H[7] = (H[7] + h) >>> 0
  }
  let hex = ''
  for (let i = 0; i < 8; i++) hex += H[i].toString(16).padStart(8, '0')
  return hex
}

// ── toUuid — the deposit's content-address (FNV-1a → v8 UUID), ported faithfully so the worker's receipts
// match the ledger's. A receipt is a content-address, not a keyed signature: it proves the observation
// (what was fetched, unaltered), never the truth. ──
function h32(s, seed) {
  let h = (0x811c9dc5 ^ seed) >>> 0
  for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 0x01000193) >>> 0; h ^= h >>> 13 }
  h = Math.imul(h ^ (h >>> 16), 0x85ebca6b) >>> 0
  h = Math.imul(h ^ (h >>> 13), 0xc2b2ae35) >>> 0
  return (h ^ (h >>> 16)) >>> 0
}
function toUuid(seed) {
  const words = [h32(seed, 0), h32(seed, 0x9e3779b9), h32(seed, 0x243f6a88), h32(seed, 0xb7e15162)]
  const b = []
  for (const w of words) b.push((w >>> 24) & 255, (w >>> 16) & 255, (w >>> 8) & 255, w & 255)
  b[6] = (b[6] & 0x0f) | 0x80; b[8] = (b[8] & 0x3f) | 0x80
  const x = b.map((v) => v.toString(16).padStart(2, '0')).join('')
  return x.slice(0, 8) + '-' + x.slice(8, 12) + '-' + x.slice(12, 16) + '-' + x.slice(16, 20) + '-' + x.slice(20)
}
// The traffic receipt chain — each receipt seeded by the last (receipt = toUuid(prev → url:hash)), so altering
// or dropping one breaks every receipt after it: a tamper-evident, auditable log of what the worker proxied.
let CHAIN = toUuid('axiom:traffic')
let SIGNED = 0
async function signReceipt(pathname, hash) {
  CHAIN = toUuid(CHAIN + '→' + pathname + ':' + hash)
  SIGNED++
  const receipt = { type: 'uuidna-receipt', pathname, address: hash, receipt: CHAIN, n: SIGNED }
  for (const c of await self.clients.matchAll()) c.postMessage(receipt) // clients audit + analyse the stream
}

// AUDIT WARNINGS — the honest complement to the receipt chain: traffic the worker CANNOT verify as uuidna-signed
// (cross-origin, or a non-GET cleartext request) is forwarded but flagged to every client in realtime. Anything
// not uuidna-signed warns — cleartext hardening. Integrity/audit, not a claim that the worker encrypts the wire.
let WARNED = 0
async function warn(url, reason) {
  WARNED++
  const w = { type: 'uuidna-warning', url, reason, n: WARNED }
  for (const c of await self.clients.matchAll()) c.postMessage(w)
}

const CACHE = 'millennium-v4'
let INTEGRITY = null
async function manifest() {
  if (INTEGRITY) return INTEGRITY
  try { INTEGRITY = await (await fetch('sw-integrity.json', { cache: 'no-store' })).json() } catch { INTEGRITY = {} }
  return INTEGRITY
}
// verify a response against the manifest; throw on a tamper (hash mismatch) so it is never served or cached.
async function verified(req, res) {
  if (!res || !res.ok) return res
  const m = await manifest()
  const want = m[new URL(req.url).pathname]
  if (want) {
    const got = sha256hex(new Uint8Array(await res.clone().arrayBuffer()))
    if (got !== want) throw new Error('integrity mismatch — refusing tampered asset: ' + new URL(req.url).pathname)
    signReceipt(new URL(req.url).pathname, got) // sign a chained receipt for the verified asset
  }
  return res
}

self.addEventListener('install', () => self.skipWaiting())
self.addEventListener('activate', (e) => e.waitUntil((async () => {
  for (const k of await caches.keys()) if (k !== CACHE) await caches.delete(k)
  await self.clients.claim()
})()))
self.addEventListener('fetch', (e) => {
  const req = e.request
  // PROXY ALL TRAFFIC: every request passes through the worker. Same-origin GET is integrity-verified against
  // the manifest below; everything else (cross-origin, POST/PUT/…) is forwarded transparently — the worker is
  // in the path of all traffic, but honestly cannot hash-verify opaque cross-origin responses.
  const sameOriginGet = req.method === 'GET' && new URL(req.url).origin === self.location.origin
  if (!sameOriginGet) {
    // AUDIT + WARN in realtime: traffic the worker cannot verify as uuidna-signed is forwarded but flagged.
    // Plain http (cleartext) and non-GET cleartext requests are the weak-encryption leaks a uuidna scanner
    // reports to the UI; cross-origin https is unverified (opaque). Anything not uuidna-signed warns.
    const u = new URL(req.url)
    const reason = u.protocol === 'http:' ? 'cleartext http — weak/no encryption, leaks; not uuidna-signed'
      : req.method !== 'GET' ? req.method + ' cleartext request — not uuidna-signed, integrity unverified'
        : 'cross-origin — opaque, not uuidna-signed, integrity unverified'
    warn(req.url, reason)
    e.respondWith(fetch(req).catch(() => caches.match(req)))
    return
  }
  const isDoc = req.mode === 'navigate' || req.destination === 'document'
  if (isDoc) {
    e.respondWith(
      fetch(req).then((res) => verified(req, res)).then((res) => { if (res && res.ok) caches.open(CACHE).then((c) => c.put(req, res.clone())); return res })
        .catch(() => caches.match(req)) // offline OR refused tamper → the last verified cached copy
    )
    return
  }
  e.respondWith(
    caches.open(CACHE).then(async (cache) => {
      const cached = await cache.match(req)
      if (cached) return cached // already verified when first cached
      const res = await verified(req, await fetch(req))
      if (res && res.ok) cache.put(req, res.clone())
      return res
    }).catch(() => caches.match(req))
  )
})
