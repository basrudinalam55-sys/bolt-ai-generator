// Service Worker for Bolt AI Image Generator
// Provides offline support and caching

const CACHE_NAME = 'bolt-ai-v1'
const STATIC_ASSETS = [
  '/',
  '/manifest.json',
  '/icon.svg',
]

// Install - cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS)
    })
  )
  self.skipWaiting()
})

// Activate - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      )
    })
  )
  self.clients.claim()
})

// Fetch - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  const { request } = event
  const url = new URL(request.url)

  // Skip non-GET requests
  if (request.method !== 'GET') return

  // Skip cross-origin requests (Pollinations API)
  if (url.origin !== location.origin) {
    // For Pollinations images, use network-first with cache fallback
    if (url.hostname === 'image.pollinations.ai') {
      event.respondWith(networkFirstThenCache(request))
      return
    }
    return
  }

  // For same-origin requests, use stale-while-revalidate
  event.respondWith(staleWhileRevalidate(request))
})

// Network first, then cache
async function networkFirstThenCache(request) {
  try {
    const response = await fetch(request)
    if (response.ok) {
      const cache = await caches.open(CACHE_NAME)
      cache.put(request, response.clone())
    }
    return response
  } catch {
    const cached = await caches.match(request)
    if (cached) return cached
    // Return placeholder for failed images
    if (request.destination === 'image') {
      return new Response(
        `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024"><rect width="1024" height="1024" fill="#1e293b"/></svg>`,
        { headers: { 'Content-Type': 'image/svg+xml' } }
      )
    }
    return new Response('Offline', { status: 503 })
  }
}

// Stale while revalidate
async function staleWhileRevalidate(request) {
  const cached = await caches.match(request)
  const fetchPromise = fetch(request).then((response) => {
    if (response.ok) {
      caches.open(CACHE_NAME).then((cache) => cache.put(request, response.clone()))
    }
    return response
  }).catch(() => cached)

  return cached || fetchPromise
}