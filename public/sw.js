// Offline service worker. The deposit is deterministic, so cached pages recompute
// identically offline. Freshness gap fixed: the HTML shell is fetched network-first
// (so a new deploy's shell always references the newest hashed CSS/JS — no stale
// theme), while VitePress's content-hashed assets are cache-first (immutable, fast).
const CACHE = 'millennium-v2'
self.addEventListener('install', () => self.skipWaiting())
self.addEventListener('activate', (e) => e.waitUntil((async () => {
  for (const k of await caches.keys()) if (k !== CACHE) await caches.delete(k) // evict stale caches
  await self.clients.claim()
})()))
self.addEventListener('fetch', (e) => {
  const req = e.request
  if (req.method !== 'GET' || new URL(req.url).origin !== self.location.origin) return
  const isDoc = req.mode === 'navigate' || req.destination === 'document'
  if (isDoc) {
    // network-first: newest shell → newest hashed assets; fall back to cache offline
    e.respondWith(
      fetch(req).then((res) => { if (res && res.ok) caches.open(CACHE).then((c) => c.put(req, res.clone())); return res })
        .catch(() => caches.match(req).then((r) => r || caches.match(req)))
    )
    return
  }
  // content-hashed assets are immutable → cache-first (fast); network fills on miss
  e.respondWith(
    caches.open(CACHE).then(async (cache) => {
      const cached = await cache.match(req)
      if (cached) return cached
      const res = await fetch(req)
      if (res && res.ok) cache.put(req, res.clone())
      return res
    })
  )
})
