// vite.config.js
import { defineConfig } from "file:///sessions/eager-cool-archimedes/mnt/WEBMURILLO_PResidente/node_modules/vite/dist/node/index.js";
import react from "file:///sessions/eager-cool-archimedes/mnt/WEBMURILLO_PResidente/node_modules/@vitejs/plugin-react/dist/index.js";
import { VitePWA } from "file:///sessions/eager-cool-archimedes/mnt/WEBMURILLO_PResidente/node_modules/vite-plugin-pwa/dist/index.js";
var vite_config_default = defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["favicon.svg", "icon-192.png", "icon-512.png", "og-image.jpg"],
      manifest: {
        name: "Luis Gilberto Murillo 2026",
        short_name: "LGM2026",
        description: "Candidato independiente del Choco. Sin partido, sin escandalos.",
        theme_color: "#F5A623",
        background_color: "#ffffff",
        display: "standalone",
        start_url: "/",
        scope: "/",
        lang: "es-CO",
        icons: [
          {
            src: "/icon-192.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "any"
          },
          {
            src: "/icon-512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any"
          },
          {
            src: "/icon-512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable"
          }
        ]
      },
      workbox: {
        globPatterns: ["**/*.{js,css,html,ico,png,svg,jpg,webp}"],
        runtimeCaching: [
          {
            // HTML -> NetworkFirst: correcciones de datos llegan rapido
            urlPattern: /\.html$/,
            handler: "NetworkFirst",
            options: { networkTimeoutSeconds: 3, cacheName: "html-cache" }
          },
          {
            // Google Fonts CSS
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: "StaleWhileRevalidate",
            options: { cacheName: "google-fonts-stylesheets" }
          },
          {
            // Google Fonts archivos
            urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
            handler: "CacheFirst",
            options: {
              cacheName: "google-fonts-webfonts",
              expiration: { maxAgeSeconds: 60 * 60 * 24 * 365 }
            }
          }
        ]
      }
    })
  ],
  ssgOptions: {
    script: "defer",
    formatting: "minify",
    includedRoutes() {
      return ["/", "/qr", "/stats"];
    },
    onFinished() {
      console.log("SSG pre-rendering completo");
    }
  },
  build: {
    outDir: "dist",
    sourcemap: false,
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom", "react-router-dom"],
          animations: ["framer-motion"],
          utils: ["html2canvas", "qrcode.react"]
        }
      }
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvc2Vzc2lvbnMvZWFnZXItY29vbC1hcmNoaW1lZGVzL21udC9XRUJNVVJJTExPX1BSZXNpZGVudGVcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIi9zZXNzaW9ucy9lYWdlci1jb29sLWFyY2hpbWVkZXMvbW50L1dFQk1VUklMTE9fUFJlc2lkZW50ZS92aXRlLmNvbmZpZy5qc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vc2Vzc2lvbnMvZWFnZXItY29vbC1hcmNoaW1lZGVzL21udC9XRUJNVVJJTExPX1BSZXNpZGVudGUvdml0ZS5jb25maWcuanNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tICd2aXRlJ1xuaW1wb3J0IHJlYWN0IGZyb20gJ0B2aXRlanMvcGx1Z2luLXJlYWN0J1xuaW1wb3J0IHsgVml0ZVBXQSB9IGZyb20gJ3ZpdGUtcGx1Z2luLXB3YSdcblxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcbiAgcGx1Z2luczogW1xuICAgIHJlYWN0KCksXG4gICAgVml0ZVBXQSh7XG4gICAgICByZWdpc3RlclR5cGU6ICdhdXRvVXBkYXRlJyxcbiAgICAgIGluY2x1ZGVBc3NldHM6IFsnZmF2aWNvbi5zdmcnLCAnaWNvbi0xOTIucG5nJywgJ2ljb24tNTEyLnBuZycsICdvZy1pbWFnZS5qcGcnXSxcbiAgICAgIG1hbmlmZXN0OiB7XG4gICAgICAgIG5hbWU6ICdMdWlzIEdpbGJlcnRvIE11cmlsbG8gMjAyNicsXG4gICAgICAgIHNob3J0X25hbWU6ICdMR00yMDI2JyxcbiAgICAgICAgZGVzY3JpcHRpb246ICdDYW5kaWRhdG8gaW5kZXBlbmRpZW50ZSBkZWwgQ2hvY28uIFNpbiBwYXJ0aWRvLCBzaW4gZXNjYW5kYWxvcy4nLFxuICAgICAgICB0aGVtZV9jb2xvcjogJyNGNUE2MjMnLFxuICAgICAgICBiYWNrZ3JvdW5kX2NvbG9yOiAnI2ZmZmZmZicsXG4gICAgICAgIGRpc3BsYXk6ICdzdGFuZGFsb25lJyxcbiAgICAgICAgc3RhcnRfdXJsOiAnLycsXG4gICAgICAgIHNjb3BlOiAnLycsXG4gICAgICAgIGxhbmc6ICdlcy1DTycsXG4gICAgICAgIGljb25zOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgc3JjOiAnL2ljb24tMTkyLnBuZycsXG4gICAgICAgICAgICBzaXplczogJzE5MngxOTInLFxuICAgICAgICAgICAgdHlwZTogJ2ltYWdlL3BuZycsXG4gICAgICAgICAgICBwdXJwb3NlOiAnYW55J1xuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgc3JjOiAnL2ljb24tNTEyLnBuZycsXG4gICAgICAgICAgICBzaXplczogJzUxMng1MTInLFxuICAgICAgICAgICAgdHlwZTogJ2ltYWdlL3BuZycsXG4gICAgICAgICAgICBwdXJwb3NlOiAnYW55J1xuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgc3JjOiAnL2ljb24tNTEyLnBuZycsXG4gICAgICAgICAgICBzaXplczogJzUxMng1MTInLFxuICAgICAgICAgICAgdHlwZTogJ2ltYWdlL3BuZycsXG4gICAgICAgICAgICBwdXJwb3NlOiAnbWFza2FibGUnXG4gICAgICAgICAgfVxuICAgICAgICBdXG4gICAgICB9LFxuICAgICAgd29ya2JveDoge1xuICAgICAgICBnbG9iUGF0dGVybnM6IFsnKiovKi57anMsY3NzLGh0bWwsaWNvLHBuZyxzdmcsanBnLHdlYnB9J10sXG4gICAgICAgIHJ1bnRpbWVDYWNoaW5nOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgLy8gSFRNTCAtPiBOZXR3b3JrRmlyc3Q6IGNvcnJlY2Npb25lcyBkZSBkYXRvcyBsbGVnYW4gcmFwaWRvXG4gICAgICAgICAgICB1cmxQYXR0ZXJuOiAvXFwuaHRtbCQvLFxuICAgICAgICAgICAgaGFuZGxlcjogJ05ldHdvcmtGaXJzdCcsXG4gICAgICAgICAgICBvcHRpb25zOiB7IG5ldHdvcmtUaW1lb3V0U2Vjb25kczogMywgY2FjaGVOYW1lOiAnaHRtbC1jYWNoZScgfVxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgLy8gR29vZ2xlIEZvbnRzIENTU1xuICAgICAgICAgICAgdXJsUGF0dGVybjogL15odHRwczpcXC9cXC9mb250c1xcLmdvb2dsZWFwaXNcXC5jb21cXC8uKi9pLFxuICAgICAgICAgICAgaGFuZGxlcjogJ1N0YWxlV2hpbGVSZXZhbGlkYXRlJyxcbiAgICAgICAgICAgIG9wdGlvbnM6IHsgY2FjaGVOYW1lOiAnZ29vZ2xlLWZvbnRzLXN0eWxlc2hlZXRzJyB9XG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICAvLyBHb29nbGUgRm9udHMgYXJjaGl2b3NcbiAgICAgICAgICAgIHVybFBhdHRlcm46IC9eaHR0cHM6XFwvXFwvZm9udHNcXC5nc3RhdGljXFwuY29tXFwvLiovaSxcbiAgICAgICAgICAgIGhhbmRsZXI6ICdDYWNoZUZpcnN0JyxcbiAgICAgICAgICAgIG9wdGlvbnM6IHtcbiAgICAgICAgICAgICAgY2FjaGVOYW1lOiAnZ29vZ2xlLWZvbnRzLXdlYmZvbnRzJyxcbiAgICAgICAgICAgICAgZXhwaXJhdGlvbjogeyBtYXhBZ2VTZWNvbmRzOiA2MCAqIDYwICogMjQgKiAzNjUgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgXVxuICAgICAgfVxuICAgIH0pLFxuICBdLFxuICBzc2dPcHRpb25zOiB7XG4gICAgc2NyaXB0OiAnZGVmZXInLFxuICAgIGZvcm1hdHRpbmc6ICdtaW5pZnknLFxuICAgIGluY2x1ZGVkUm91dGVzKCkge1xuICAgICAgcmV0dXJuIFsnLycsICcvcXInLCAnL3N0YXRzJ11cbiAgICB9LFxuICAgIG9uRmluaXNoZWQoKSB7XG4gICAgICBjb25zb2xlLmxvZygnU1NHIHByZS1yZW5kZXJpbmcgY29tcGxldG8nKVxuICAgIH1cbiAgfSxcbiAgYnVpbGQ6IHtcbiAgICBvdXREaXI6ICdkaXN0JyxcbiAgICBzb3VyY2VtYXA6IGZhbHNlLFxuICAgIGNodW5rU2l6ZVdhcm5pbmdMaW1pdDogNjAwLFxuICAgIHJvbGx1cE9wdGlvbnM6IHtcbiAgICAgIG91dHB1dDoge1xuICAgICAgICBtYW51YWxDaHVua3M6IHtcbiAgICAgICAgICB2ZW5kb3I6IFsncmVhY3QnLCAncmVhY3QtZG9tJywgJ3JlYWN0LXJvdXRlci1kb20nXSxcbiAgICAgICAgICBhbmltYXRpb25zOiBbJ2ZyYW1lci1tb3Rpb24nXSxcbiAgICAgICAgICB1dGlsczogWydodG1sMmNhbnZhcycsICdxcmNvZGUucmVhY3QnXSxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfSxcbiAgfSxcbn0pXG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQTZWLFNBQVMsb0JBQW9CO0FBQzFYLE9BQU8sV0FBVztBQUNsQixTQUFTLGVBQWU7QUFFeEIsSUFBTyxzQkFBUSxhQUFhO0FBQUEsRUFDMUIsU0FBUztBQUFBLElBQ1AsTUFBTTtBQUFBLElBQ04sUUFBUTtBQUFBLE1BQ04sY0FBYztBQUFBLE1BQ2QsZUFBZSxDQUFDLGVBQWUsZ0JBQWdCLGdCQUFnQixjQUFjO0FBQUEsTUFDN0UsVUFBVTtBQUFBLFFBQ1IsTUFBTTtBQUFBLFFBQ04sWUFBWTtBQUFBLFFBQ1osYUFBYTtBQUFBLFFBQ2IsYUFBYTtBQUFBLFFBQ2Isa0JBQWtCO0FBQUEsUUFDbEIsU0FBUztBQUFBLFFBQ1QsV0FBVztBQUFBLFFBQ1gsT0FBTztBQUFBLFFBQ1AsTUFBTTtBQUFBLFFBQ04sT0FBTztBQUFBLFVBQ0w7QUFBQSxZQUNFLEtBQUs7QUFBQSxZQUNMLE9BQU87QUFBQSxZQUNQLE1BQU07QUFBQSxZQUNOLFNBQVM7QUFBQSxVQUNYO0FBQUEsVUFDQTtBQUFBLFlBQ0UsS0FBSztBQUFBLFlBQ0wsT0FBTztBQUFBLFlBQ1AsTUFBTTtBQUFBLFlBQ04sU0FBUztBQUFBLFVBQ1g7QUFBQSxVQUNBO0FBQUEsWUFDRSxLQUFLO0FBQUEsWUFDTCxPQUFPO0FBQUEsWUFDUCxNQUFNO0FBQUEsWUFDTixTQUFTO0FBQUEsVUFDWDtBQUFBLFFBQ0Y7QUFBQSxNQUNGO0FBQUEsTUFDQSxTQUFTO0FBQUEsUUFDUCxjQUFjLENBQUMseUNBQXlDO0FBQUEsUUFDeEQsZ0JBQWdCO0FBQUEsVUFDZDtBQUFBO0FBQUEsWUFFRSxZQUFZO0FBQUEsWUFDWixTQUFTO0FBQUEsWUFDVCxTQUFTLEVBQUUsdUJBQXVCLEdBQUcsV0FBVyxhQUFhO0FBQUEsVUFDL0Q7QUFBQSxVQUNBO0FBQUE7QUFBQSxZQUVFLFlBQVk7QUFBQSxZQUNaLFNBQVM7QUFBQSxZQUNULFNBQVMsRUFBRSxXQUFXLDJCQUEyQjtBQUFBLFVBQ25EO0FBQUEsVUFDQTtBQUFBO0FBQUEsWUFFRSxZQUFZO0FBQUEsWUFDWixTQUFTO0FBQUEsWUFDVCxTQUFTO0FBQUEsY0FDUCxXQUFXO0FBQUEsY0FDWCxZQUFZLEVBQUUsZUFBZSxLQUFLLEtBQUssS0FBSyxJQUFJO0FBQUEsWUFDbEQ7QUFBQSxVQUNGO0FBQUEsUUFDRjtBQUFBLE1BQ0Y7QUFBQSxJQUNGLENBQUM7QUFBQSxFQUNIO0FBQUEsRUFDQSxZQUFZO0FBQUEsSUFDVixRQUFRO0FBQUEsSUFDUixZQUFZO0FBQUEsSUFDWixpQkFBaUI7QUFDZixhQUFPLENBQUMsS0FBSyxPQUFPLFFBQVE7QUFBQSxJQUM5QjtBQUFBLElBQ0EsYUFBYTtBQUNYLGNBQVEsSUFBSSw0QkFBNEI7QUFBQSxJQUMxQztBQUFBLEVBQ0Y7QUFBQSxFQUNBLE9BQU87QUFBQSxJQUNMLFFBQVE7QUFBQSxJQUNSLFdBQVc7QUFBQSxJQUNYLHVCQUF1QjtBQUFBLElBQ3ZCLGVBQWU7QUFBQSxNQUNiLFFBQVE7QUFBQSxRQUNOLGNBQWM7QUFBQSxVQUNaLFFBQVEsQ0FBQyxTQUFTLGFBQWEsa0JBQWtCO0FBQUEsVUFDakQsWUFBWSxDQUFDLGVBQWU7QUFBQSxVQUM1QixPQUFPLENBQUMsZUFBZSxjQUFjO0FBQUEsUUFDdkM7QUFBQSxNQUNGO0FBQUEsSUFDRjtBQUFBLEVBQ0Y7QUFDRixDQUFDOyIsCiAgIm5hbWVzIjogW10KfQo=
