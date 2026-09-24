# 开发阶段测试报告（消消乐 · 3D 三消）

- activity_id: 1ad54d94-9d70-450a-a015-aa32bc7ee783
- stage_run_id: 1db533fa-b926-43d6-9e4e-e68ad33a59c7
- workflow_id: a3d16e35-bd65-41e1-b430-995f7151e2a6
- input_manifest_sha256: f96133d9e64253eb8210c690ee2ccbfbbb313f2077736a061d842dfa88680c55
- parent_baseline_sha256: 55b894958e7767816281eb110f53962659e17bef81606582fe09f471a762f745
- parent_baseline_git: 0fe6ce01320f73d845645d793674211b1740d8de

## 本阶段范围

将技术设计 55b89495（三消 Web 小游戏，AC-001~AC-006）落地为可在线游玩的实现产物，
交付入口 `three-match/index.html`（3D 三消）并保持既有贪吃蛇多页功能不回归。

## 检查结果

- lint: PASS；`npm run lint` 退出码 0
- typecheck: PASS；`npm run typecheck` 退出码 0
- unit_tests: PASS；`npm test` Vitest 5 个文件、58 项全部通过（含 threeMatch 21 项）
- build: PASS；`npm run build` 生成 dist/three-match/index.html 与 dist/index.html
- blackbox_tests: PASS；`npm run test:e2e` 36 项全部通过（含 three-match 页面/资源/多页可达）
- runtime_logic: PASS；直接驱动 GameState 运行验证：初始无三连、非法交换拒绝、
  合法交换→消除→下落→连锁→得分、死局自动洗牌并提示

## 构建产物（release_candidate 引用）

- dist/three-match/index.html sha256=9b62627c0d88a0555707533b941dd0f55e8df30128d6725c89675ce6c2910099
- dist/assets/threeMatch-DoSQ6UAJ.js sha256=ca2d1ded940fcfe3bad1f376d357be2d0d8d37d293c791d257d7e85ec7e9a009
- dist/assets/threeMatch-i5Vbh66S.css sha256=fff67ee6204fb04ef0c18606fa907cabee81660b94ffa6cf02928190e4f7a8dd
- dist/index.html sha256=047a172a09c0ca1393bd09753c5f28facd0856b849abc08f04b87d95aa941207

## 验收标准覆盖

- AC-001 浏览器直接打开即可游玩：`three-match/index.html` 引用构建后 ES 模块，无本地依赖
- AC-002 8x8 棋盘、初始无三连、点击/拖拽交换相邻方块：`board.js` + `input3d.js`，单测与运行时验证覆盖
- AC-003 三连及以上消除加分、无效交换回退提示：`GameState.trySwap` + `hud.toast`
- AC-004 消除后下落补位与连锁：`collapse` + `PHASE.CLEARING/FALLING` 链路
- AC-005 无可消除组合自动洗牌并提示：`ensurePlayable` + toast「没有可消除的组合，已自动洗牌」
- AC-006 展示分数与重新开始按钮、无控制台报错：`hud.js` + `restartBtn`

## 预览证据

- 本地：`http://127.0.0.1:4173/three-match/` HTTP 200，正文含 workflow marker `a3d16e35...e2a6`
- 平台入口：`http://preview.mcode.side419.cn:30029/three-match/` HTTP 200，正文含同一 workflow marker
- HTTPS 变体：平台代理对 TLS ClientHello 返回 wrong version number，属平台既有 TLS 限制（沿用 open_risk）

## release_candidate

- git_commit_sha: 由本阶段提交并推送后登记
- 质量门禁：lint / typecheck / 58 项单测 / 36 项黑盒 / build 全绿
