# 开发阶段测试报告（Web版多用户同屏贪吃蛇大战）

- activity_id: c0f1c037-59f5-4439-b7e2-384ec306dcaa
- stage_run_id: bad7c6ea-c3cf-45a1-a5f5-f80702059004
- workflow_id: b8c4ef49-941e-4c96-b8b9-d508773e89de
- input_manifest_sha256: 45e7cd45b6859675e39e7a9d635ba8832939683751c332599460a2bec16db1c9
- parent_baseline_sha256: fdbb68018d78e67eed2f4a94849ec40c8b0343a43b6970fd8b77df4ba41a0a29
- parent_baseline_uri: `/api/v1/assets?key=temp%2Floop-artifacts%2Fb8c4ef49-941e-4c96-b8b9-d508773e89de%2Fd1e095fd-7a62-4886-bd36-a0c0435168b9%2F7bcac5ca-7903-4d75-96ad-1509d6420400%2Ff3afec41-b2fa-443d-812c-f572e103181d_fdbb68018d78e67eed2f4a94849ec40c8b0343a43b6970fd8b77df4ba41a0a29.md`

## 本阶段范围

将双蛇引擎、键盘输入、屏幕方向按钮、计分 HUD、碰撞结束面板和重新开始流程接入发布根入口 `index.html`，页面标题为“Web版多用户同屏贪吃蛇大战”。

## 检查结果

- lint: PASS；`npm run lint` 退出码 0
- typecheck: PASS；`npm run typecheck` 退出码 0
- unit_tests: PASS；`npm test` 5 个测试文件、61 项全部通过
- build: PASS；`npm run build` 生成根入口和多页面产物
- local_preview: PASS；`http://127.0.0.1:8080/` HTTP 200，正文包含当前 Workflow marker
- platform_preview_http: PASS；`http://preview.mcode.side419.cn:30056/` HTTP 200，正文包含当前 Workflow marker

## 验收标准覆盖

- AC-001：根页面展示用户可读标题“Web版多用户同屏贪吃蛇大战”
- AC-002：方向键、WASD 与两组屏幕按钮分别控制玩家 1/2；吃食物增加对应玩家分数；撞墙、自撞、蛇身相撞进入结束态；结束面板支持再玩一次
- AC-003：阶段输入上下文、活动 ID、父制品哈希和 release candidate 提交保持可追溯
- AC-004：开发预览在 Runner 中以 `0.0.0.0:8080` 持久进程运行

## 构建产物（release_candidate 引用）

- `dist/index.html` sha256=`a97895f33e43a3ff46d3d6bdb9b3208262abf3ddaad0f0611cc6c5581084d64c`
- `dist/assets/main-CwchcYB-.js` sha256=`369568e1ce54c80bf1f45185343f711553fecb0c65db288afd7d1f861083d2d2`
- `dist/assets/main-DgKMJGDq.css` sha256=`8ee30570518c10a07f2a4015ba4631e969419cc9c0bf875e523f50611cb696d4`

## 预览证据

- request_preview 返回：`http://preview.mcode.side419.cn:30056`
- 契约要求的 HTTPS 变体：`https://preview.mcode.side419.cn:30056`
- HTTPS 探测返回 OpenSSL `wrong version number`；平台代理对该端口提供 HTTP 服务，HTTP 入口实际返回 200。该平台 TLS 限制作为 open risk 记录。

## release_candidate

- git_commit_sha: `cbf7e2f86b5fab6b74a3cb45dd3d623330330c59`
- git_commit_pushed: PASS；已推送 `origin/main`
