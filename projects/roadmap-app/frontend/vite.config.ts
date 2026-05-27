import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    port: 3000,
    proxy: {
      '/progress': {
        target: process.env.VITE_API_URL || 'https://roadmap-app-5noa.onrender.com',
        changeOrigin: true,
        secure: false
      }
    }
  }
})