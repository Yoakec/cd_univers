import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
	           server: {
   host: '0.0.0.0', // 监听所有IP
   port: 5173,      // 你想要的端口
   open: true       // 自动打开浏览器（可选
 },

  plugins: [vue()],
  resolve: {
    alias: {
      '@': '/src',
    },
  },
})
