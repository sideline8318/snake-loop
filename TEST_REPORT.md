# 测试阶段报告 — 消消乐 · 3D 三消（发布构建自洽修复版）

- activity_id: d0cdf9d0-4c7c-450e-90f1-bdd2f89d5d54
- activity_key: test.work.1
- activity_run_id: d0cdf9d0-4c7c-450e-90f1-bdd2f89d5d54
- stage_run_id: 38efffa5-25a5-41c8-afef-85d771273d2d
- workflow_id: 7cc101c5-927c-49c2-affe-230fd2effb6d
- input_manifest_sha256: 37a9255aa4ccbcfecfc10adbf09f0d2e9bca8009ea76ef2ef5e8da4ecde3215b
- parent_release_candidate_sha256: 2c3ee8053fd06d367e59f022209a087ee12721ec028c71ec4432b17848e8f65f
- parent_release_candidate_git: 7b219474d604c7585c0f491a4332b7b85ac77cb4

## 测试范围

针对测试阶段目标「修复在线发布产物错误」，验证单一 `npm run build` 即可自洽产出
发布根 `dist/index.html` 呈现「消消乐 · 3D 三消」，并回归全部游戏功能（8x8 棋盘、
点击/拖拽交换相邻方块、三连及以上消除计分、无效交换回退、消除后下落补位连锁、
无解自动洗牌、分数与最高分、重开）。

## 本轮发现的缺陷与修复（就地修改代码并提交新 release_candidate）

- 缺陷 D1（构建流水线不自洽，systemic）：`npm run build` 仅执行 `vite build`，
  默认配置不再产出 `dist/three-match/index.html`，发布根 `dist/index.html` 仍是历史
  贪吃蛇页面。前序开发阶段依赖手工串联 `npm run three-match` 才能得到正确发布根，
  导致黑盒测试套件（04/06 依赖 `dist/three-match/index.html`）在全新构建后 17 项失败：
  `ENOENT: no such file or directory, open '/workspace/dist/three-match/index.html'`。
- 修复 S1：`package.json` 的 `build` 改为 `vite build && npm run three-match`，
  使一次构建即产出完整、可发布的 dist（三消发布根 + 三消别名 + 历史贪吃蛇子路径）。
- 修复 S2：`vite.config.js` 默认构建输入移除 `main`（三消入口），只保留
  `legacySnake`，避免与三消构建产物在 `dist/index.html` 上互相覆盖，职责单一。

## 测试结果

- required_check artifact_identity_verified: PASS；本报告声明输入清单 SHA-256
  （37a9255a…）、上游 release_candidate 哈希（2c3ee805…）与当前 Activity ID（d0cdf9d0…）。
- required_check test_suite_passed: PASS；单元 61/61、黑盒 50/50，全绿。
- required_check git_commit_pushed: PASS；测试证据提交并推送至工作分支与 main，远程 HEAD 前进。
- npm run lint: PASS，退出码 0。
- npm run typecheck: PASS，退出码 0。
- npx vitest run: PASS，5 个文件 61 项全过（threeMatch 24 项）。
- npm run build（单一命令，自洽）: PASS，先出 dist/legacy-snake/index.html，
  再由 three-match 构建出 dist/three-match/index.html 并经插件提升为发布根
  dist/index.html（标题「消消乐 · 3D 三消」）。
- npm run test:e2e: PASS，6 个黑盒文件 50 项全过（修复前 33/50，17 项因 D1 失败）。

## 发布根排他性验证（AC-001~AC-003）

- dist/index.html 的 `<title>` 为「消消乐 · 3D 三消」，「贪吃蛇」出现次数为 0。
- dist/index.html 与 dist/three-match/index.html 内容逐字节相同，
  sha256 均为 6812c6340e3a0087055717f6226908ae14ba91147be8ab92d8b13b3559981cd6。
- dist 根目录仅存在一个 index.html；历史贪吃蛇页面位于 dist/legacy-snake/index.html
  （sha256 0259238b…），不占用发布根默认文档。
- 页面 head 含 workflow marker `消消乐 · 3D 三消 | workflow a3d16e35-bd65-41e1-b430-995f7151e2a6`。
- 黑盒 03/04 断言：`/`、`/three-match/`、`/three-match/index.html` 均返回消消乐；
  `/` 正文不含「贪吃蛇」「snake-loop-competition」；`/legacy-snake/` 可达且含历史贪吃蛇标识。

## 功能验收（AC-004~AC-008，黑盒 05/06）

- AC-002 PASS：25 次确定性构造均为 8x8，初始无现成三连且至少存在一步可消除组合。
- AC-003/AC-004 PASS：非相邻交换被拒；无匹配交换被拒（reason=no-match）；合法交换被接受，
  结算后消除、下落补位、得分 >0、连锁计数、回到 idle、无残留匹配且仍可行动。
- AC-005 PASS：构造真死局后触发一次洗牌，洗牌后无现成三连、有解并输出提示
  「没有可消除的组合，已自动洗牌」。
- AC-006 PASS：构建产物内嵌 HUD 接线、最高分持久化键 `three-match-best-score`、
  自动洗牌与无效交换提示文案、BOARD_SIZE 常量。
- AC-002（交互）PASS：真实 pointer/click 事件链下，相邻两次点击完成交换并进入 swapping；
  拖拽阈值跨越亦完成交换；无效点击交换保持棋盘不变。
- AC-008 PASS：黑盒 jsdom 运行时驱动游戏初始化与交互，未触发 window error。

## 制品哈希

- release_candidate: RELEASE_CANDIDATE.md（本阶段新提交，git_commit_sha 见下）
- test_report: 本文件
- 构建产物（dist，可由单一 npm run build 复现）:
  - dist/index.html sha256 6812c6340e3a0087055717f6226908ae14ba91147be8ab92d8b13b3559981cd6
  - dist/three-match/index.html sha256 6812c6340e3a0087055717f6226908ae14ba91147be8ab92d8b13b3559981cd6
  - dist/legacy-snake/index.html sha256 0259238b29f1677a32dffc07241e65aad82ba9767c8bb2c2f45b549c0c295639
  - dist/assets/threeMatch-Bwqb6rX7.js sha256 7f6e7a392c7d1f7a55561fc1546a48ab0a25ea51d9ca33c688dffe011ba978c9
  - dist/assets/threeMatch-i5Vbh66S.css sha256 fff67ee6204fb04ef0c18606fa907cabee81660b94ffa6cf02928190e4f7a8dd

## 缺陷与限制

- 本轮修复实现缺陷 1 项（D1 构建流水线不自洽），修复后单元/黑盒/lint/typecheck/build 全绿。
- 已知平台限制（沿用上游 open_risk，非本轮新增）：沙箱无 GPU/真实浏览器，
  three.js WebGL 像素渲染需在真实浏览器最终确认；逻辑层已由单测与 GameState/事件链运行时驱动覆盖。
- 历史贪吃蛇页面保留在 `/legacy-snake/` 非根子路径，不占用发布根默认文档。
