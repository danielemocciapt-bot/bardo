import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  base: '/bardo/',
  plugins: [
    svelte(),
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        // Precache solo app-shell + immagini (leggere). L'audio NON è precache:
        // si scarica alla prima riproduzione e resta in cache (runtime CacheFirst).
        globPatterns: ['**/*.{js,css,html,ico,png,svg,webmanifest,webp}'],
        maximumFileSizeToCacheInBytes: 4 * 1024 * 1024,
        runtimeCaching: [
          {
            urlPattern: ({ url }) => url.pathname.includes('/audio/'),
            handler: 'CacheFirst',
            options: {
              cacheName: 'bardo-audio',
              rangeRequests: true,
              cacheableResponse: { statuses: [0, 200, 206] },
              expiration: { maxEntries: 300, maxAgeSeconds: 60 * 60 * 24 * 60 }
            }
          }
        ]
      },
      manifest: {
        name: 'Bardo',
        short_name: 'Bardo',
        description: 'Colonne sonore per giochi di ruolo',
        lang: 'it',
        theme_color: '#ecb14c',
        background_color: '#f6ecd6',
        display: 'standalone',
        orientation: 'portrait',
        icons: [
          { src: 'icons/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icons/icon-512.png', sizes: '512x512', type: 'image/png' }
        ]
      }
    })
  ],
  test: {
    environment: 'jsdom',
    globals: true
  }
});
