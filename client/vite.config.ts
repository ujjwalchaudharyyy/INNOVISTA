import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: true,
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:5000',
        changeOrigin: true,
        secure: false,
        bypass(req) {
          // Never proxy static assets
          if (/\.(jpg|jpeg|png|webp|svg|gif|mp4|mp3|ico|woff2?)(\?.*)?$/.test(req.url ?? '')) return req.url;
        },
      },
      '/r': {
        target: 'http://127.0.0.1:5000',
        changeOrigin: true,
        secure: false,
        bypass() {
          // Always route /r/* to SPA RedirectPage for instantaneous redirects
          return '/index.html';
        },
      },
    },
  },
})
