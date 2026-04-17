import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'icon-192.png', 'icon-512.png', 'og-image.jpg'],
      manifest: {
        name: 'Luis Gilberto Murillo 2026',
        short_name: 'LGM2026',
        description: 'Candidato independiente del Choco. Sin partido, sin escandalos.',
        theme_color: '#F5A623',
        background_color: '#ffffff',
        display: 'standalone',
        start_url: '/',
        scope: '/',
        lang: 'es-CO',
        icons: [
          {
            src: '/icon-192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: '/icon-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: '/icon-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable'
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,jpg,webp}'],
        runtimeCaching: [
          {
            // HTML -> NetworkFirst: correcciones de datos llegan rapido
            urlPattern: /\.html$/,
            handler: 'NetworkFirst',
            options: { networkTimeoutSeconds: 3, cacheName: 'html-cache' }
          },
          {
            // Google Fonts CSS
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'StaleWhileRevalidate',
            options: { cacheName: 'google-fonts-stylesheets' }
          },
          {
            // Google Fonts archivos
            urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-webfonts',
              expiration: { maxAgeSeconds: 60 * 60 * 24 * 365 }
            }
          }
        ]
      }
    }),
  ],
  ssgOptions: {
    script: 'defer',
    formatting: 'minify',
    includedRoutes() {
      return ['/', '/qr', '/stats']
    },
    onFinished() {
      console.log('SSG pre-rendering completo')
    }
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          animations: ['framer-motion'],
          utils: ['html2canvas', 'qrcode.react'],
        },
      },
    },
  },
})
