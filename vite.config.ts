import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/forest-focus/',   // 👈 must match your repo name
  build: {
    outDir: 'dist',         // 👈 make sure Vite outputs to dist/
  },
})
