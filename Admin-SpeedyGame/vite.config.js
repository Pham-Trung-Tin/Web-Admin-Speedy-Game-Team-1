import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/',
  server: {
    proxy: {
      '/api': {
        target: 'https://speedycount-staging.amazingtech.cc', // BE server
        changeOrigin: true, // cần để tránh lỗi CORS
        secure: true, // true nếu BE dùng HTTPS có SSL hợp lệ
        configure: (proxy, _options) => {
          proxy.on('error', (err, _req, _res) => {
            console.error('🔴 Proxy Error:', err);
          });
          proxy.on('proxyReq', (proxyReq, req, _res) => {
            console.log('➡️ Sending Request to Target:', req.method, req.url);
          });
          proxy.on('proxyRes', (proxyRes, req, _res) => {
            console.log('✅ Received Response:', proxyRes.statusCode, req.url);
          });
        },
      },
    },
    build: {
    outDir: 'dist'
  }
  },
});
