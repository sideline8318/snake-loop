# Release Candidate — Web版多用户同屏贪吃蛇大战（开发阶段）

- activity_id: c0f1c037-59f5-4439-b7e2-384ec306dcaa
- activity_key: development.work.1
- stage_run_id: bad7c6ea-c3cf-45a1-a5f5-f80702059004
- workflow_id: b8c4ef49-941e-4c96-b8b9-d508773e89de
- workflow_title: 从想法到上线：Web 端多人同屏贪吃蛇大战
- generation: 1
- input_manifest_sha256: 45e7cd45b6859675e39e7a9d635ba8832939683751c332599460a2bec16db1c9
- parent_baseline_sha256: fdbb68018d78e67eed2f4a94849ec40c8b0343a43b6970fd8b77df4ba41a0a29
- base_git_commit_sha: bfd94d3749f2fe1a893a8bf4fc660bb6a70b86ef
- release_scope: 发布根入口恢复为双人同屏贪吃蛇大战，接入双玩家控制、计分、碰撞结束、暂停和重新开始闭环。
- release_target: 静态服务根 `/`（Vite 开发预览监听 `0.0.0.0:8080`）
- deployment_bind: 0.0.0.0:8080
- preview_uri: https://preview.mcode.side419.cn:30056

## 实现范围

| 文件 | 操作 | 要点 |
| --- | --- | --- |
| `index.html` | 更新 | 发布根显示目标标题、双蛇 HUD、开始/结束面板、双玩家屏幕控制 |
| `README.md` | 更新 | 说明发布根玩法与 Workflow marker |
| `src/game/*` | 沿用 | 引擎、渲染、输入和 UI 逻辑覆盖本阶段闭环 |

## 质量门禁（本阶段实测）

- lint: PASS; `npm run lint`（exit 0）
- typecheck: PASS; `npm run typecheck`（exit 0）
- unit_tests: PASS; Vitest 5 files / 61 tests
- build: PASS; `npm run build`
- preview_http_200: PASS; 本地 8080 与平台 HTTP 30056 均返回 200 并包含 Workflow marker
- git_commit_pushed: PASS; `cbf7e2f86b5fab6b74a3cb45dd3d623330330c59` 已推送至 `origin/main`

## 构建产物布局与哈希

- `dist/index.html` sha256=a97895f33e43a3ff46d3d6bdb9b3208262abf3ddaad0f0611cc6c5581084d64c
- `dist/assets/main-CwchcYB-.js` sha256=369568e1ce54c80bf1f45185343f711553fecb0c65db288afd7d1f861083d2d2
- `dist/assets/main-DgKMJGDq.css` sha256=8ee30570518c10a07f2a4015ba4631e969419cc9c0bf875e523f50611cb696d4

## 已知限制与风险

- R-01（中）平台代理对 `https://preview.mcode.side419.cn:30056` 返回 `wrong version number`；对应 HTTP 入口返回 200，页面正文和 Workflow marker 已核验。
- R-02（低）历史三消页面继续作为 `/three-match/` 多页面构建入口保留。

## 回滚句柄

- 单提交回滚：`git revert cbf7e2f86b5fab6b74a3cb45dd3d623330330c59`
- 构建级回滚：恢复基线提交 `bfd94d3749f2fe1a893a8bf4fc660bb6a70b86ef` 后执行 `npm install && npm run build`
