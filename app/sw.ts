import type { PrecacheEntry, SerwistGlobalConfig } from 'serwist';
import { CacheFirst, ExpirationPlugin, StaleWhileRevalidate, Serwist } from 'serwist';

// This declares the value of `injectionPoint` to TypeScript.
// `injectionPoint` is the string that will be replaced by the
// actual precache manifest. By default, this string is set to
// `"self.__SW_MANIFEST"`.
declare global {
  interface ServiceWorkerGlobalScope extends SerwistGlobalConfig {
    __SW_MANIFEST: (PrecacheEntry | string)[] | undefined;
  }
}

declare const self: ServiceWorkerGlobalScope;

const ONE_DAY = 24 * 60 * 60; // seconds

const serwist = new Serwist({
  precacheEntries: self.__SW_MANIFEST,
  skipWaiting: true,
  clientsClaim: true,
  navigationPreload: false,
  runtimeCaching: [
    // Fonts – rarely change, cache aggressively for 1 year
    {
      matcher: ({ request }) => request.destination === 'font',
      handler: new CacheFirst({
        cacheName: 'fonts',
        plugins: [
          new ExpirationPlugin({
            maxEntries: 10,
            maxAgeSeconds: 365 * ONE_DAY,
          }),
        ],
      }),
    },
    // Images – cache for 30 days
    {
      matcher: ({ request }) => request.destination === 'image',
      handler: new CacheFirst({
        cacheName: 'images',
        plugins: [
          new ExpirationPlugin({
            maxEntries: 60,
            maxAgeSeconds: 30 * ONE_DAY,
          }),
        ],
      }),
    },
    // CSS & JS – serve from cache while revalidating, 30-day expiry
    {
      matcher: ({ request }) => request.destination === 'style' || request.destination === 'script',
      handler: new StaleWhileRevalidate({
        cacheName: 'static-resources',
        plugins: [
          new ExpirationPlugin({
            maxEntries: 50,
            maxAgeSeconds: 30 * ONE_DAY,
          }),
        ],
      }),
    },
  ],
});

serwist.addEventListeners();
