# 验收报告 · 验收阶段（acceptance.work.1 attempt 1）

## 身份

- Workflow：4685ae3a-d06a-4da9-aee8-63a819398d73（结算排名与再来一局体验交付）
- StageRun：e63b195f-09fd-4734-9569-ef9d5a2eeec2（acceptance / work）
- ActivityRun：683d51b0-4a7c-44cf-8dbf-029ea754bded
- Activity key：acceptance.work.1
- 输入清单 SHA-256：a1e26f04c12a83c2c37b7089596afb04245fb55ab6fd664147a68c9f206f976e
- 工作分支：loop-20261021-178786
- 远程 HEAD（验收前）：1193f3e3556714f7802d1357d4a83b5e401fce80
- 上游 release_candidate：705fda1db80611544664c5940a211ed51b0a4ef1c0cf7f6445d5e0ea79103bad（commit 1193f3e）
- 上游 deployment_record：47f42ec3272da8bcd9f82cbdf54c0951e1a7625bc1ac0ae0f3c86f6bb129e8f4

## 验收对象与方法

被测对象是部署阶段冻结的发布产物（`dist/`，三消页为发布根，贪吃蛇页面保留在 `/legacy-snake/`）。
验收方法：绑定发布环境（`npm ci` → `npm run build` → `vite preview --host 0.0.0.0 --port 4173`），
对平台预览入口与本地静态根复核 HTTP 可达性与页面身份，并用官方黑盒 jsdom 工具链
（`tests/blackbox/helpers.cjs` 的 `createGameWindow` + `createStaticServer`）对**发布产物页面**
执行真实事件链探针：点击「开始游戏」→ 对战结束 → 读取「本局排名」DOM → 点击「再来一局」→ 读取复位后状态。
探针共 3 组：进食后撞墙（玩家 1 得 30 分）、平局并列、360×640 小屏视口。

## 验收标准 45312663 逐条结论

标准：对战结束后，房间内玩家均可查看按得分降序排列的本局排名，且可从结算页触发再来一局。

- 结论：PASS
- 排名区块：结算弹层展示 `#ranking`（`aria-label="本局排名"`）与标题「本局排名」，排名行 2 条（玩家 1、玩家 2），
  得分序列 [30, 0] 满足降序，首行 `data-rank="1"`，并列场景两行均为 `data-rank="1"` 且带 `data-tied="true"`
  与可读 `aria-label`（「第 1 名 · 并列 · 玩家 1 · 0 分」）。
- 再来一局：按钮文案「再来一局」，点击后结算弹层隐藏、菜单隐藏、总分归零、`#rankingList` 行数归 0，
  新一局立即开始并继续计分；360×640 视口下同一判据一致。
- 结论覆盖玩家视角：排名行同时提供名次、玩家标签与得分（`rank-no` / `rank-name` / `rank-score`），
  信息对房间内两位玩家同等可见。

## 检查记录

- release_environment_bound: PASS（exit 0）；`npm ci` 安装 198 包，`npm run build` 产出 `dist/index.html`，
  `vite preview` 监听 0.0.0.0:4173；本地 `/` HTTP 200（`<title>`「消消乐 · 3D 三消」）、`/legacy-snake/` HTTP 200；
  平台预览 `http://preview.mcode.side419.cn:30172/` 根路径 HTTP 200、标题一致、`/legacy-snake/` HTTP 200。
- acceptance_criteria_passed: PASS（exit 0）；`npm run lint` exit 0、`npm run typecheck` exit 0、
  `npm test` 77/77、`npm run test:e2e` 52/52（基于构建后 `dist/`），3 组发布产物探针全部满足标准 45312663。
- git_commit_pushed: PASS（exit 0）；本阶段提交推送到 origin `loop-20261021-178786`，远程 HEAD 由 1193f3e 前进，
  新提交 SHA 由本阶段 release_candidate 登记。

## 本阶段就地修改

- `index.html` 的 workflow 锚点元数据与页脚由历史阶段字符串（`b8c4ef49…` / `development.work.1` / `test.work.1`）
  对齐到本次交付 workflow（`4685ae3a…`）与 `acceptance.work.1`，仅改元数据与文案，不影响玩法与构建产物逻辑。
- 重新构建后发布根与子页产物哈希与部署基线一致（`dist/index.html` 476e0faa…、`dist/three-match/index.html` 6812c634…、
  三消 JS 7f6e7a39…、三消 CSS fff67ee6…、legacy JS 757a3144…、legacy CSS 1335d65b…）。

## 发布产物身份

| 文件 | sha256 |
| --- | --- |
| dist/index.html | 476e0faa87f5a66389808218f2b34264ea87d86a1478038f6bde74a032e89e68 |
| dist/three-match/index.html | 6812c6340e3a0087055717f6226908ae14ba91147be8ab92d8b13b3559981cd6 |
| dist/assets/threeMatch-Bwqb6rX7.js | 7f6e7a392c7d1f7a55561fc1546a48ab0a25ea51d9ca33c688dffe011ba978c9 |
| dist/assets/threeMatch-i5Vbh66S.css | fff67ee6204fb04ef0c18606fa907cabee81660b94ffa6cf02928190e4f7a8dd |
| dist/assets/legacySnake-KHQ88lRo.js | 757a314416d7241bb96173b2659f8ccbf8570b418805cd161acc3879e639204b |
| dist/assets/legacySnake-DYooQKfO.css | 1335d65b63358bd93eb577c0b90659736fccd069d9e21f1514da4ac539e1666b |

## 谱系

- 上游 release_candidate `705fda1d…`（commit 1193f3e）→ 本阶段 release_candidate（本阶段新提交）。
- 本阶段 acceptance_report 与 release_candidate 的 `parent_artifact_hashes` 均包含上游真实 SHA-256。

## 风险与限制

- 平台预览 HTTPS 变体仍返回 OpenSSL `wrong version number`（沿用上游 open_risk），HTTP 入口 200 且内容正确。
- 360×640 视口以 jsdom 视口属性模拟，未在真实 GPU 浏览器逐像素目视；布局事实（弹层可见、排名行可读、按钮可点）已确认。
- 回滚句柄：`git revert <release_candidate_git_commit>`。
