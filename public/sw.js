// Minimal offline service worker — stale-while-revalidate for the app shell.
// The deposit is deterministic, so cached pages recompute identically offline.
const CACHE = 'millennium-v1'
self.addEventListener('install', () => self.skipWaiting())
self.addEventListener('activate', (e) => e.waitUntil(self.clients.claim()))
self.addEventListener('fetch', (e) => {
  const req = e.request
  if (req.method !== 'GET' || new URL(req.url).origin !== self.location.origin) return
  e.respondWith(
    caches.open(CACHE).then(async (cache) => {
      const cached = await cache.match(req)
      const network = fetch(req).then((res) => { if (res && res.ok) cache.put(req, res.clone()); return res }).catch(() => cached)
      return cached || network
    })
  )
})
