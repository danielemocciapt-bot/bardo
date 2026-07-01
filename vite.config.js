import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    svelte(),
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,webmanifest,webm,m4a}'],
        maximumFileSizeToCacheInBytes: 6 * 1024 * 1024
      },
      manifest: {
        name: 'Bardo',
        short_name: 'Bardo',
        description: 'Colonne sonore per giochi di ruolo',
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
