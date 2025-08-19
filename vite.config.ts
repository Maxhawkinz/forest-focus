import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/forest-focus/',  // critical for GitHub Pages sub-path deployment
})
