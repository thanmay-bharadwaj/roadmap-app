import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  plugins: [vue()],
  
  // ✅ CRITICAL: Set base path for production deployment
  base: '/', // Use '/' for root domain, or '/your-app-name/' for subpath
  
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    // Ensure assets have proper hashing for cache busting
    assetsInlineLimit: 4096,
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['vue', 'axios']
        }
      }
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
  },
  
  // ✅ Define env vars for client-side access
  define: {
    __APP_VERSION__: JSON.stringify(process.env.npm_package_version)
  }
})