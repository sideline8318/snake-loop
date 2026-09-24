import { defineConfig } from 'vite';
import fs from 'node:fs';

const https = process.env.PREVIEW_HTTPS === '1'
  ? {
      key: fs.readFileSync('/tmp/snake-preview-key.pem'),
      cert: fs.readFileSync('/tmp/snake-preview-cert.pem'),
    }
  : undefined;

export default defineConfig({
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    rollupOptions: {
      input: {
        main: new URL('./index.html', import.meta.url).pathname,
        threeMatch: new URL('./three-match/index.html', import.meta.url).pathname,
      },
    },
  },
  server: {
    host: '0.0.0.0',
    port: 8080,
    https,
    allowedHosts: ['.monkeycode-ai.online', '.side419.cn'],
  },
});
