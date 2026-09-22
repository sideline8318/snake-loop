# 贪吃蛇竞赛 Web 游戏测试报告

- Activity ID: `1de18d0a-2ac6-4c65-8c40-edcae87ca2d8`
- StageRun ID: `c9ee00a2-4748-4e12-9a8b-b280afb918c1`
- 输入清单 SHA-256: `31a966592614cc4bf1ccd4597977a8f2f16a508b04c90983ab6eed29baf6f80a`
- 上游 release candidate: `artifact://release-candidate-bc02977.md`
- 上游 release candidate SHA-256: `27d926fa8a891a0493093a54e1a730b413e1c7848b60c05a2a3a5b7b90b70e8a`

## 结果

- `npm test`: 通过，完成移动、边界、游戏循环、模式和持久化断言。
- `npm run lint`: 通过，运行时控制器、排行榜持久化和调试日志断言通过。
- `npm run typecheck`: 通过，运行时规则导出和 TypeScript 类型契约断言通过。
- `npm run build`: 通过，成功生成 `dist/` 构建产物。
- 运行态检查: 通过，`node server.mjs` 在 `0.0.0.0:4173` 启动，首页 HTTP 200，HTML 含游戏入口和 Workflow 标记。

## 备注

仓库未提交本地依赖目录和 lockfile。独立执行 `vitest` 时，临时下载的 Vitest 无法解析 `vite.config.ts` 中的 `vite` 依赖，因此该项未纳入通过项；项目既有 `npm test` 门禁已完整通过。
