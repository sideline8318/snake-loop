# Release Candidate — 消消乐 · 3D 三消（测试阶段）

- activity_id: 934ee18e-f932-4791-8055-6b0846112824
- stage_run_id: 9ec84b62-cce1-4598-9f77-14d0db9357bf
- workflow_id: a3d16e35-bd65-41e1-b430-995f7151e2a6
- input_manifest_sha256: 55587bdb2874e1a8076e030abcf3c9e27849883e0cc22eefc0bf0544f12f55e1
- parent_release_candidate_sha256: 5d9172ed2d8d5375d65df160f5111a3f73a26b5fc3d6b12e8ccf5976d051b108
- parent_release_candidate_git: cc382f4f27c6c9d4145d93dc9902d981e8d4e387
- git_commit_sha: （由本阶段提交产生，见 ArtifactManifest.git_commit_sha）
- release_scope: 交付可直接在浏览器打开游玩的消消乐（三消）Web 小游戏，入口 /three-match/；
  覆盖 AC-001~AC-006：8x8 棋盘初始无三连、点击/拖拽交换相邻方块、三连及以上消除加分、
  无效交换回退提示、消除后下落补位与连锁、死局自动洗牌、分数展示与重新开始；不回归既有贪吃蛇。
- deployment_bind: 0.0.0.0:4173（Vite preview 静态服务）
- preview_uri: http://preview.mcode.side419.cn:30033/three-match/
- quality_gate: lint PASS / typecheck PASS / 58 项单测 PASS / 41 项黑盒 PASS（含 5 项验收）/ build PASS

## 本阶段变更

- 新增 tests/blackbox/05_acceptance.test.cjs：以确定性随机源逐条勾稽 AC-001~AC-006 的运行时验收测试。
- 更新 TEST_REPORT.md 与 RELEASE_CANDIDATE.md 登记测试阶段证据。

## 构建产物

- dist/three-match/index.html
- dist/assets/threeMatch-*.js
- dist/assets/threeMatch-*.css
- dist/index.html（既有贪吃蛇入口，未回归）

## 已知限制

- 平台预览代理仅提供 HTTP 入口；HTTPS 变体因代理 TLS 配置返回 wrong version number（open_risk）。
- 沙箱无 GPU/真实浏览器，three.js/WebGL 像素渲染需在真实浏览器确认（open_risk）；
  逻辑层已由单测与 GameState 运行时验证覆盖。
