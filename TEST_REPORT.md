# 测试阶段报告 — 消消乐 · 3D 三消（发布修复版）

- activity_id: 69904a44-4b19-4499-b4a3-cf8485556ef7
- activity_key: test.work.1
- activity_run_id: 69904a44-4b19-4499-b4a3-cf8485556ef7
- stage_run_id: 1163fc08-af96-4e79-8df1-65deb5cf7e18
- workflow_id: 86ed0cf8-a021-46c5-9639-81871d2b2463
- input_manifest_sha256: 28c4924d36688de7bb7620ab0e2a7924bd7e625540c65e9a59a6d86e44d4ffa7
- parent_release_candidate_sha256: 438f5137f480715d4385af5aea1738d625a2b5f9211e77127dfdbc1623802f85
- parent_release_candidate_git: 794d47da87528cfd276e911f05bc0bb9fc1e5f15

## 测试范围

针对测试阶段目标「修复在线发布产物错误」，验证发布入口根路径 `/` 呈现「消消乐 · 3D 三消」
而非历史贪吃蛇项目，并回归全部游戏功能（8x8 棋盘、点击/拖拽交换相邻方块、
三连及以上消除计分、无效交换回退、消除后下落补位连锁、无解自动洗牌、分数与最高分、重开）。

本轮针对该目标新增发布根排他性黑盒断言，并在真实平台预览入口上完成端到端验证。

## 测试结果

- required_check artifact_identity_verified: PASS；本报告声明输入清单 SHA-256、上游
  release_candidate 哈希（438f5137…）与当前 Activity ID（69904a44…）。
- required_check test_suite_passed: PASS；单元 61/61、黑盒 50/50，全绿。
- required_check git_commit_pushed: PASS；测试证据提交并推送至 primary 仓库 main，远程 HEAD 前进。
- npm run lint: PASS，退出码 0。
- npm run typecheck: PASS，退出码 0。
- npx vitest run: PASS，5 个文件 61 项全过（threeMatch 24 项）。
- npm run build: PASS，产出 dist/index.html（根入口）、dist/three-match/index.html（别名）、
  dist/legacy-snake/index.html（非根历史页面）及哈希命名 assets。
- npm run test:e2e: PASS，6 个黑盒文件 50 项全过。

## 发布根排他性验证（本轮核心，AC-001~AC-003）

- dist/index.html 的 `<title>` 为「消消乐 · 3D 三消」。
- dist/index.html 正文中「贪吃蛇」出现次数为 0；不含 `snake-loop-competition`、历史
  workflow id `82cd3989-8762-4d92-9ad5-8f0218ce2863`、`postdeploy`。
- dist 根目录仅存在一个 `index.html`，且与 dist/three-match/index.html 内容逐字节相同
  （sha256 均为 8a19cea4f276e49bfe5f6bd3ef7826bd9c304c375bb0d91fb9a4d1797c4b7262）。
- dist/legacy-snake/index.html（sha256 7a9a7d5d…）承载历史贪吃蛇页面，位于非根子路径。
- 黑盒 04/05 断言：`/` 与 `/three-match/` 均返回消消乐、根路径无贪吃蛇字样；
  `/legacy-snake/` 可达但占用非根路径。

## 在线预览端到端验证

- 平台预览入口（HTTP）: http://preview.mcode.side419.cn:30012/
  - 根路径 `/` HTTP 200，`<title>` 为「消消乐 · 3D 三消」，「贪吃蛇」出现 0 次。
  - 页面 head 含 workflow marker `消消乐 · 3D 三消 | workflow a3d16e35-bd65-41e1-b430-995f7151e2a6`。
  - 引用资源 `/assets/index-B4I_FDOS.js`、`/assets/index-i5Vbh66S.css` 均 HTTP 200。
  - `/three-match/` HTTP 200；`/legacy-snake/` HTTP 200（非根，不占用发布根默认文档）。
  - 预览连通性探测 `/.well-known/mcai-preview-connect-status-detect` 未返回 mcai-preview-error。

## 功能验收（AC-004~AC-008，黑盒 05/06）

- AC-002 PASS：25 次确定性构造均为 8x8，初始无现成三连且至少存在一步可消除组合。
- AC-003/AC-004 PASS：非相邻交换被拒；无匹配交换被拒（reason=no-match）；合法交换被接受，
  结算后消除、下落补位、得分 >0、连锁计数、回到 idle、无残留匹配且仍可行动。
- AC-005 PASS：构造真死局后触发一次洗牌，洗牌后无现成三连、有解，并输出提示
  「没有可消除的组合，已自动洗牌」。
- AC-006 PASS：构建产物内嵌 HUD 接线、最高分持久化键 `three-match-best-score`、
  自动洗牌与无效交换提示文案、BOARD_SIZE 常量。
- AC-002（交互）PASS：真实 pointer/click 事件链下，相邻两次点击完成交换并进入 swapping；
  拖拽阈值跨越亦完成交换；无效点击交换保持棋盘不变。
- AC-008 PASS：黑盒 jsdom 运行时驱动游戏初始化与交互，未触发 window error。

## 制品哈希

- release_candidate: RELEASE_CANDIDATE.md（本阶段新提交，git_commit_sha 见下）
- test_report: 本文件
- 构建产物（dist，可由 npm run build 复现）:
  - dist/index.html sha256 8a19cea4f276e49bfe5f6bd3ef7826bd9c304c375bb0d91fb9a4d1797c4b7262
  - dist/three-match/index.html sha256 8a19cea4f276e49bfe5f6bd3ef7826bd9c304c375bb0d91fb9a4d1797c4b7262
  - dist/legacy-snake/index.html sha256 7a9a7d5d4f02abbe4064c813c807fd9a2ce582075a6fae2c9f4e48a54f78a5c6

## 缺陷与限制

- 实现缺陷：0；本轮复测未发现需修复的游戏缺陷，发布根排他性已由黑盒与在线预览双重闭环。
- 已知平台限制（沿用上游 open_risk，非本轮新增）：平台预览代理 HTTPS 变体
  （https://preview.mcode.side419.cn:30012/）因代理 TLS 配置返回 `wrong version number`；
  HTTP 入口返回 200 且内容正确。
- 沙箱无 GPU/真实浏览器，three.js WebGL 像素渲染需在真实浏览器最终确认；
  逻辑层已由单测与 GameState/事件链运行时驱动覆盖（固定随机源与 WebGL stub）。
- 历史贪吃蛇页面保留在 `/legacy-snake/` 非根子路径，不占用发布根默认文档。
