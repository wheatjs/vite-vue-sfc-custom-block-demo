import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDocsPlugin from './plugins/vue-docs'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDocsPlugin(),
  ]
})
