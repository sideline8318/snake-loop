# 用户指令记忆

本文件记录项目协作中需要长期遵循的执行方式。

## 条目

### Loop 阶段交付规则
- Date: 2026-09-22
- Context: Web版多用户同屏贪吃蛇大战开发阶段
- Category: 工作流协作
- Instructions:
  - 每个 ActivityAttempt 结束前执行契约要求的检查，并通过 loop.complete_activity 提交带 SHA-256、byte_size、artifact_uri 的结构化产物。
  - Web 预览使用监听 0.0.0.0 的持久进程，先验证本地 HTTP 200 和 Workflow marker，再验证 request_preview 返回的 HTTPS 地址。
  - 写仓库阶段必须创建新提交并推送到执行分支，release_candidate 记录远程 HEAD 的提交 SHA。

### 构建与测试
- Date: 2026-09-24
- Context: 三消小游戏（three-match）交付阶段
- Category: 构建方法
- Instructions:
  - 依赖安装：`npm install`（无 node_modules 时必做）。
  - 完整质量门禁：`npm run lint`、`npm run typecheck`、`npm test`、`npm run test:e2e`、`npm run build`。
  - 多页面构建：`vite.config.js` 的 `build.rollupOptions.input` 同时登记 `index.html`（贪吃蛇）与 `three-match/index.html`（三消），产物分别输出到 `dist/index.html` 与 `dist/three-match/index.html`。
  - 新增多入口会改变 Vite 产物命名与模块预加载行为：贪吃蛇 bundle 由 `index-*.js` 变为 `main-*.js` 且带 `import "./modulepreload-polyfill-*.js"`，黑盒测试读取 `dist/index.html` 中实际引用而非硬编码文件名。
  - 平台预览端口通过 `request_preview` 获取，返回 HTTP 入口；HTTPS 探测受平台代理 TLS 影响会返回 wrong version number，以 HTTP 入口 200 作为预览可用判据。
  - 无 GPU/浏览器环境：three.js 的 WebGLRenderer 无法在 jsdom 中实例化，三消逻辑改用纯逻辑单元测试与 Node 端场景图（Scene/Group/BoardView）验证，不依赖真实渲染。
