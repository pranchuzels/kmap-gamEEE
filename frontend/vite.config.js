import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'


// https://vite.dev/config/
export default defineConfig({
  base: '/kmapgameee',
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    port: 5183,
    host: '0.0.0.0',
      allowedHosts: ['digital.eee.upd.edu.ph'],
    proxy: {
      '/kmapgameee/api': {
        target: 'http://server:8000',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/kmapgameee\/api/, ''),
      },
    },
  },
})
