import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  css: {
    devSourcemap: false
  },
  assetsInclude: ['**/*.PNG', '**/*.JPG', '**/*.png', '**/*.jpg', '**/*.jpeg'],
  resolve: {
    alias: {
      '@': '/src',
      '@assets': '/src/assets'
    }
  }
})
