# Release Candidate — 消消乐 · 3D 三消（发布入口修正版 / 开发阶段）

- activity_id: 3b2a1f27-470c-412f-b1f0-18f68d53fb71
- activity_key: development.work.1
- stage_run_id: e9c91624-48af-4689-be67-ff498b0b8c75
- workflow_id: 86ed0cf8-a021-46c5-9639-81871d2b2463
- workflow_title: 消消乐 Web 在线小游戏（发布修复版）
- generation: 1
- input_manifest_sha256: f4abe0411f0b8c303f782009390454e1d3101c1bbe049cad0c2c3a2f76771f98
- parent_artifact_sha256: 5451134bda8eecb60c654f95b985964989795c8394040a7357d86c61372137cd（technical_design）
- base_git_commit_sha: 429ed987337cc5664859aea83b32db487201d7d3
- release_scope: 修复在线发布入口错误——发布链接根路径 `/` 直接呈现「消消乐 · 3D 三消」；
  贪吃蛇迁至非根路径 `/legacy-snake/`；三消与贪吃蛇逻辑源码零改动。
- release_target: 静态服务根 `/`（Vite 生产构建产物 `dist/`）
- deployment_bind: 0.0.0.0:4173
- preview_uri: http://preview.mcode.side419.cn:30007

## 根因与修复

根因：仓库根 `index.html` 是贪吃蛇页面，`vite.config.js` 将发布根默认文档
`dist/index.html` 绑定到贪吃蛇，三消仅存在于 `/three-match/` 子路径。

修复（入口换位，零逻辑源码改动）：

| 文件 | 操作 | 要点 |
| --- | --- | --- |
| `index.html` | 替换为三消页面 | 发布根唯一默认文档，标题「消消乐 · 3D 三消」 |
| `legacy-snake/index.html` | 新增（原根页面迁入） | 贪吃蛇页面，非根隔离 |
| `three-match/index.html` | 保留为兼容别名 | 与根文档等价 |
| `vite.config.js` | 修改 | input 增加 `legacySnake`，`main` 指向根三消页面 |
| `README.md` | 更新 | 说明发布根为三消 |
| `tests/blackbox/*` | 调整 | 发布根排他性断言，贪吃蛇断言迁移至 `/legacy-snake/` |
| `src/games/three-match/*`、`src/game/*`、`src/main.js` | 冻结 | 逐字节未改动 |

## 质量门禁

- lint: PASS; `npm run lint`（exit 0）
- typecheck: PASS; `npm run typecheck`（exit 0）
- unit_tests: PASS; vitest 5 files / 61 tests
- blackbox_tests: PASS; node:test 50 tests（含发布根排他性 FT-01~FT-09 与 AC-001~AC-008）
- build: PASS; `npm run build`

## 构建产物布局

- `dist/index.html` — 三消（发布根唯一默认文档）
- `dist/three-match/index.html` — 三消兼容别名
- `dist/legacy-snake/index.html` — 贪吃蛇（非根）
- `dist/assets/index-*.js` / `index-*.css` — 三消 bundle
- `dist/assets/legacySnake-*.js` / `legacySnake-*.css` — 贪吃蛇 bundle

## 已知限制与风险

- R-01（高）根路径排他性：已由发布根排他性断言 + 本地静态服务 + 平台预览代理
  HTTP 根路径 200 且正文含「消消乐 · 3D 三消」、不含贪吃蛇闭环。
- R-02（中）三消 3D 依赖真实浏览器 WebGL：沙箱无 GPU，渲染像素需真实浏览器确认；
  view/input 层已由 WebGL stub + 真实 bundle 驱动覆盖，规则层由单测覆盖。
- R-03（中）贪吃蛇迁至 `/legacy-snake/` 后仍可访达，但不再占据发布根默认文档。
- R-04（低）平台预览代理 HTTPS 变体返回 `wrong version number`（沿用上游 open_risk），
  HTTP 预览入口可用。

## 回滚句柄

- 单提交回滚：`git revert <release_candidate_git_commit>`
- 构建级回滚：`git reset --hard 429ed987337cc5664859aea83b32db487201d7d3 && npm ci && npm run build`
