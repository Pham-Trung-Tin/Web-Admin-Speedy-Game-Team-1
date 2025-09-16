import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [react()],
  base: '/',
  build: {
    outDir: 'dist',
    // Optimize for static site deployment
    assetsDir: 'assets',
    sourcemap: false, // Disable sourcemaps for production
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          charts: ['recharts'],
        },
      },
    },
    // Minify for smaller bundle size
    minify: 'esbuild', // Use esbuild instead of terser to avoid dependency issues
    esbuild: {
      drop: mode === 'production' ? ['console', 'debugger'] : [], // Only drop in production
    },
  },
  server: {
    // Keep proxy for development only
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
    historyApiFallback: true,
  },
  // Environment variables optimization
  define: {
    __DEV__: JSON.stringify(mode === 'development'),
  },
}));
