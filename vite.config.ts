import { fileURLToPath, URL } from 'url'
import path from 'path'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      web3: path.resolve(__dirname, './node_modules/web3/dist/web3.min.js'),
    },
  },
  base: process.env.NODE_ENV === 'production' ? '/dapp-example/' : '/',
})
