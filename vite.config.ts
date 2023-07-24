import { fileURLToPath, URL } from 'node:url'
import * as path from 'path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import dts from 'vite-plugin-dts'

// https://vitejs.dev/config/`
export default defineConfig({
  resolve: {
    alias: [{ find: '@', replacement: fileURLToPath(new URL('./src', import.meta.url)) }]
  },
  plugins: [vue(), dts()],
  build: {
    minify: false,
    target: 'es6',
    lib: {
      entry: path.resolve(__dirname, 'src/index.ts'),
      name: 'LupaSearch',
      fileName: 'lupaSearch',
      formats: ['es', 'umd', 'iife', 'cjs']
    }
  },
  define: {
    'process.env.NODE_ENV': '"production"'
  },
})
