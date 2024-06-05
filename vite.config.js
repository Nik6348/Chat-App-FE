import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/Chat-App-FE/', 
  plugins: [react()],
  build: {
    outDir: 'dist'
  }
})
