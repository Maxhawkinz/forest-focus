import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/forest-focus/',   // repo name on GitHub
  build: {
    outDir: 'dist',
  },
})
