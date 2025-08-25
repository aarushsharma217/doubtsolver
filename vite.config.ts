import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(async () => {
  // if you had any top-level await logic, put it here
  // e.g. const something = await import('some-package')

  return {
    plugins: [react()],
    build: {
      outDir: 'dist'
    }
  }
})
