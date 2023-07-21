import { fileURLToPath, URL } from 'url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
const path = require('path');
// 添加打包入口文件夹 packages（需要手动创建）
const entryDir = path.resolve(__dirname, './');

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  build: {
    rollupOptions: {
      output: {
        entryFileNames: `assets/[name].js`,
        chunkFileNames: `assets/[name].js`,
        assetFileNames: `assets/[name].[ext]`
      }
    },
    lib: {
      entry: path.resolve(entryDir, './src/index.js'),
      // 组件库名字
      name: 'put-file-tools',
      fileName: 'put-file',
      // 输出格式
      formats: ['es', 'umd'], // es项目中可直接use；umd在html文件中引入
    },
  }
})
