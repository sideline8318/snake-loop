import { defineConfig } from 'vite';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const { releaseRootPlugin } = require('./scripts/vite-plugin-release-root.cjs');

// 三消专用构建：只打包 three-match 入口，产物落到 dist/ 下，与贪吃蛇默认构建叠加。
// 复用已存在的 dist/assets 目录，因此不会清空贪吃蛇构建结果（emptyOutDir: false）。
// closeBundle 阶段由插件把三消页提升为发布根 dist/index.html。
export default defineConfig({
  plugins: [releaseRootPlugin()],
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    emptyOutDir: false,
    sourcemap: false,
    rollupOptions: {
      input: {
        threeMatch: new URL('./three-match/index.html', import.meta.url).pathname,
      },
    },
  },
});
