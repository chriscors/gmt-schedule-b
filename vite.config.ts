import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { viteSingleFile } from "vite-plugin-singlefile"

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), viteSingleFile()],
  server: {
    proxy: {
      // Proxy API calls to Census API for local development
      '/api/classify': {
        target: 'https://uscensus.prod.3ceonline.com',
        changeOrigin: true,
        secure: true,
        rewrite: (path) => '/ui/classify',
        configure: (proxy) => {
          proxy.on('proxyReq', (proxyReq) => {
            proxyReq.setHeader('Origin', 'https://uscensus.prod.3ceonline.com');
          });
          proxy.on('proxyRes', (proxyRes, req) => {
            const origin = req.headers.origin || '*';
            proxyRes.headers['access-control-allow-origin'] = origin;
            proxyRes.headers['access-control-allow-methods'] = 'GET, POST, OPTIONS';
            proxyRes.headers['access-control-allow-headers'] = 'Content-Type, Cookie';
            proxyRes.headers['access-control-allow-credentials'] = 'true';
          });
        }
      },
      '/api/schedule-b': {
        target: 'https://uscensus.prod.3ceonline.com',
        changeOrigin: true,
        secure: true,
        rewrite: (path) => {
          // Extract code from query params and build the path
          const url = new URL(path, 'http://localhost');
          const code = url.searchParams.get('code');
          return `/ui/tradedata/export/schedule/find/${code}/US/US/EN`;
        },
        configure: (proxy) => {
          proxy.on('proxyReq', (proxyReq) => {
            proxyReq.setHeader('Origin', 'https://uscensus.prod.3ceonline.com');
          });
          proxy.on('proxyRes', (proxyRes, req) => {
            const origin = req.headers.origin || '*';
            proxyRes.headers['access-control-allow-origin'] = origin;
            proxyRes.headers['access-control-allow-methods'] = 'GET, POST, OPTIONS';
            proxyRes.headers['access-control-allow-headers'] = 'Content-Type, Cookie';
            proxyRes.headers['access-control-allow-credentials'] = 'true';
          });
        }
      }
    }
  }
})
