# 验收报告 — 消消乐 · 3D 三消（发布入口根路径修复）

- activity_id: 342b7594-7c1c-43c0-b4ed-feb11fe7598c
- activity_key: acceptance.work.1
- stage_run_id: b4503988-85e6-4767-91e6-71460ca18c8e
- workflow_id: 86ed0cf8-a021-46c5-9639-81871d2b2463
- input_manifest_sha256: 2cd4ea8d9d0383c09409b8f092de643776aadf2b8c14630575bc0fc5427224df
- parent_release_candidate_sha256: 438f5137f480715d4385af5aea1738d625a2b5f9211e77127dfdbc1623802f85
- parent_deployment_record_sha256: 40a69c8f86c9724cabaeab4e41de326b4b18042e886efa01d404d0ec257b5441
- remote_head_before_acceptance: 00898a11b46fa59f2949f77b072a67613cf4a4f4
- release_candidate_git: 由本阶段 artifact manifest 登记推送后的新提交 SHA。
- acceptance_preview_url: http://preview.mcode.side419.cn:30037/（发布链接根路径）

## 验收范围与方法

本次验收聚焦最高优先级目标：**在线发布链接根路径（静态服务根 `/`）必须直接呈现「消消乐 · 3D 三消」，不得再出现贪吃蛇或仓库中任何其他应用的页面**。
验证方式：安装锁定依赖（`npm ci`）→ 质量门禁（lint / typecheck / 单测 / 黑盒 / build）→ 以 Vite 生产预览在 0.0.0.0:4173 提供 `dist` 静态服务 →
本地根路径与平台预览根路径双重复核 HTTP 状态、`<title>`、贪吃蛇关键字计数与资源可达性。

## 验收结论

- AC-001: PASS；平台预览根路径 `http://preview.mcode.side419.cn:30037/` HTTP 200，`<title>` 为「消消乐 · 3D 三消」，
  正文贪吃蛇（含 snake）关键字计数为 0；本地 `http://127.0.0.1:4173/` 同样 200、标题正确、贪吃蛇计数 0。
  黑盒用例 3 / 8 / 34 / 41 佐证发布根标记与排他性。
- AC-002: PASS；构建输出 `dist/index.html` 即消消乐本体（与 `dist/three-match/index.html` 同内容），
  静态服务根唯一默认文档为消消乐；历史贪吃蛇迁至 `dist/legacy-snake/index.html`，不占用根默认入口（黑盒 8 / 35 / 40）。
- AC-003: PASS；发布根 `/` 无需拼接 `/three-match/` 即可进入游戏（黑盒 42 佐证根路径与别名渲染同一应用）。
- AC-004: PASS；棋盘为 8x8，初始无现成三连且至少存在一步可消除组合；真实 pointer/click 事件链下点击相邻宝石与拖拽到相邻宝石均触发交换（黑盒 43 / 47 / 48）。
- AC-005: PASS；形成三连即消除并加分；相邻性不足被拒且回退，无匹配交换（reason=no-match）被拒并提示，棋盘保持不变（黑盒 44 / 49）。
- AC-006: PASS；消除后上方方块自动下落补位、顶部补充新方块并携带正确 kind，支持连锁消除（黑盒 44 / 50）。
- AC-007: PASS；棋盘无可消除组合时自动检测并洗牌为可玩状态，页面弹出洗牌提示（黑盒 45 / 46）。
- AC-008: PASS；页面展示当前得分与最高分，`#restartBtn` 可重新开始，HUD 与持久化键齐备；黑盒全程无 JS 控制台报错（黑盒 4 / 41 / 46）。

## 检查记录

- release_environment_bound: PASS；`npm ci` 安装 198 个包后，`npx vite preview --host 0.0.0.0 --port 4173` 提供 `dist` 静态服务，
  本地根路径 HTTP 200 且携带 workflow marker；`request_preview(4173)` 返回 `http://preview.mcode.side419.cn:30037`，
  复核其根路径 HTTP 200、`<title>` 正确、贪吃蛇计数 0、`/assets/index-B4I_FDOS.js` 与 `/assets/index-i5Vbh66S.css` 均 HTTP 200。
- acceptance_criteria_passed: PASS；`npm run lint` exit 0、`npm run typecheck` exit 0、`npm test` 61/61、
  `npm run test:e2e` 50/50、`npm run build` 成功产出 `dist/index.html`（2.74 kB）。
- git_commit_pushed: PASS；本阶段验收报告与 release candidate 已纳入新提交并推送至 origin/main，远程 HEAD 由 00898a11 前进，
  提交 SHA 由 artifact manifest 登记。

## 发布产物哈希（与部署基线一致）

- dist/index.html sha256=8a19cea4f276e49bfe5f6bd3ef7826bd9c304c375bb0d91fb9a4d1797c4b7262
- dist/assets/index-B4I_FDOS.js sha256=eadd98b5bf4fabc88d55deb22dfb0e643a870bf6ced0e75c61997b9faebad096
- dist/assets/index-i5Vbh66S.css sha256=fff67ee6204fb04ef0c18606fa907cabee81660b94ffa6cf02928190e4f7a8dd
- dist/assets/modulepreload-polyfill-B5Qt9EMX.js sha256=d2a32840421496e872ade591618d2fa5c33797605d1aec04301717e5a90757d0

## 风险

- 平台预览代理 HTTPS 变体受代理 TLS 配置影响返回 wrong version number（沿用上游 open_risk R-04），HTTP 入口验证通过。
- 沙箱无 GPU/真实浏览器，three.js WebGL 像素渲染需在真实浏览器最终确认；本阶段以真实 dist bundle + WebGL stub 驱动
  视图/输入层，覆盖点击与拖拽事件链、补位 kind 与洗牌提示，逻辑层由 61 项单测覆盖。
- 历史贪吃蛇页面保留在 `/legacy-snake/` 非根子路径（HTTP 200），不占用发布根默认文档；如需彻底下线需后续阶段处置。
- 回滚句柄：`git revert <release_candidate_git_commit>`。
