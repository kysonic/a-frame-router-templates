import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        entryFileNames: `assets/[name].v${process.env.npm_package_version}.js`,
      }
    }
  }
})