import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  plugins: [react()],
  base: '/static/',
  root: resolve(__dirname, 'src'),
  build: {
    outDir: resolve(__dirname, 'dist'),
    emptyOutDir: true,
    rollupOptions: {
      input: {
        book:  resolve(__dirname, 'src/book.tsx'),
        index: resolve(__dirname, 'src/index.tsx'),
        about: resolve(__dirname, 'src/about.tsx'),
        page:  resolve(__dirname, 'src/page.tsx'),
        editor: resolve(__dirname, 'src/editor.js'),
      },
      output: {
        entryFileNames: 'js/[name].bundle.js',
        chunkFileNames: 'js/[name]-[hash].chunk.js',
        assetFileNames: assetInfo =>
          assetInfo.name?.endsWith('.css')
            ? 'css/[name][extname]'
            : 'js/assets/[name][extname]',
      },
    },
  },
})
