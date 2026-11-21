import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import dbPlugin from './vite-db-plugin.js'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    dbPlugin(),
  ],
  server: {
    watch: {
      ignored: ['**/data/**', '**/*.json', '**/node_modules/**']
    }
  }
})
