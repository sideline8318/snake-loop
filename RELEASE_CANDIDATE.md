# Release Candidate — 消消乐 · 3D 三消（发布入口修正版 / 验收阶段）

- activity_id: 342b7594-7c1c-43c0-b4ed-feb11fe7598c
- activity_key: acceptance.work.1
- stage_run_id: b4503988-85e6-4767-91e6-71460ca18c8e
- workflow_id: 86ed0cf8-a021-46c5-9639-81871d2b2463
- workflow_title: 消消乐 Web 在线小游戏（发布修复版）
- generation: 1
- input_manifest_sha256: 2cd4ea8d9d0383c09409b8f092de643776aadf2b8c14630575bc0fc5427224df
- parent_release_candidate_sha256: 438f5137f480715d4385af5aea1738d625a2b5f9211e77127dfdbc1623802f85
- parent_deployment_record_sha256: 40a69c8f86c9724cabaeab4e41de326b4b18042e886efa01d404d0ec257b5441
- base_git_commit_sha: 00898a11b46fa59f2949f77b072a67613cf4a4f4
- release_scope: 修复在线发布入口错误——发布链接根路径 `/` 直接呈现「消消乐 · 3D 三消」；
  贪吃蛇迁至非根路径 `/legacy-snake/`；三消与贪吃蛇逻辑源码零改动。
- release_target: 静态服务根 `/`（Vite 生产构建产物 `dist/`）
- deployment_bind: 0.0.0.0:4173
- preview_uri: http://preview.mcode.side419.cn:30037

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

## 质量门禁（本阶段实测）

- lint: PASS; `npm run lint`（exit 0）
- typecheck: PASS; `npm run typecheck`（exit 0）
- unit_tests: PASS; vitest 5 files / 61 tests
- blackbox_tests: PASS; node:test 50 tests（含发布根排他性 FT-01~FT-09 与 AC-001~AC-008）
- build: PASS; `npm run build`

## 构建产物布局与哈希

- `dist/index.html` — 三消（发布根唯一默认文档）sha256=8a19cea4f276e49bfe5f6bd3ef7826bd9c304c375bb0d91fb9a4d1797c4b7262
- `dist/three-match/index.html` — 三消兼容别名（同内容）
- `dist/legacy-snake/index.html` — 贪吃蛇（非根）
- `dist/assets/index-B4I_FDOS.js` sha256=eadd98b5bf4fabc88d55deb22dfb0e643a870bf6ced0e75c61997b9faebad096
- `dist/assets/index-i5Vbh66S.css` sha256=fff67ee6204fb04ef0c18606fa907cabee81660b94ffa6cf02928190e4f7a8dd
- `dist/assets/modulepreload-polyfill-B5Qt9EMX.js` sha256=d2a32840421496e872ade591618d2fa5c33797605d1aec04301717e5a90757d0

## 已知限制与风险

- R-01（高）根路径排他性：已由本地静态服务根 `/`（HTTP 200，标题「消消乐 · 3D 三消」，贪吃蛇计数 0）
  与平台预览根路径 `http://preview.mcode.side419.cn:30037/`（HTTP 200，标题正确，贪吃蛇计数 0，资源 200）闭环。
- R-02（中）三消 3D 依赖真实浏览器 WebGL：沙箱无 GPU，渲染像素需真实浏览器确认；
  view/input 层已由 WebGL stub + 真实 bundle 驱动覆盖，规则层由单测覆盖。
- R-03（中）贪吃蛇迁至 `/legacy-snake/` 后仍可访达（HTTP 200），但不再占据发布根默认文档。
- R-04（低）平台预览代理 HTTPS 变体返回 `wrong version number`（沿用上游 open_risk），
  HTTP 预览入口可用。

## 回滚句柄

- 单提交回滚：`git revert <release_candidate_git_commit>`
- 构建级回滚：`git reset --hard 00898a11b46fa59f2949f77b072a67613cf4a4f4 && npm ci && npm run build`
