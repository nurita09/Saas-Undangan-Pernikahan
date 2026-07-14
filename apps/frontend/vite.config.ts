import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// Target proxy untuk /api dibaca dari env (docker-compose set ke
// "http://backend:8080"; default lokal non-docker ke localhost:8080).
// changeOrigin sengaja TIDAK diaktifkan supaya Host header asli (mis.
// "ivan-aura.localhost:5173") diteruskan apa adanya ke backend Rust --
// itulah yang dipakai backend untuk resolusi tenant multi-subdomain.
const backendInternalUrl = process.env.BACKEND_INTERNAL_URL || 'http://localhost:8080';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: true,
    port: 5173,
    strictPort: true,
    proxy: {
      '/api': {
        target: backendInternalUrl,
        changeOrigin: false,
      },
    },
  },
});
