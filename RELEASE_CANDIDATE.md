# Release Candidate — 消消乐 · 3D 三消

- activity_id: 1ad54d94-9d70-450a-a015-aa32bc7ee783
- stage_run_id: 1db533fa-b926-43d6-9e4e-e68ad33a59c7
- workflow_id: a3d16e35-bd65-41e1-b430-995f7151e2a6
- input_manifest_sha256: f96133d9e64253eb8210c690ee2ccbfbbb313f2077736a061d842dfa88680c55
- parent_baseline_sha256: 55b894958e7767816281eb110f53962659e17bef81606582fe09f471a762f745
- parent_baseline_git: 0fe6ce01320f73d845645d793674211b1740d8de
- git_commit_sha: 0552d69f2a04e11ca43d434d2a773dcd075c9535
- release_scope: 交付可直接在浏览器打开游玩的消消乐（三消）Web 小游戏，入口 /three-match/；
  覆盖 AC-001~AC-006：8x8 棋盘初始无三连、点击/拖拽交换相邻方块、三连及以上消除加分、
  无效交换回退提示、消除后下落补位与连锁、死局自动洗牌、分数展示与重新开始；不回归既有贪吃蛇。
- deployment_bind: 0.0.0.0:4173（Vite preview 静态服务）
- preview_uri: http://preview.mcode.side419.cn:30029/three-match/
- quality_gate: lint PASS / typecheck PASS / 58 项单测 PASS / 36 项黑盒 PASS / build PASS

## 构建产物

- dist/three-match/index.html sha256=9b62627c0d88a0555707533b941dd0f55e8df30128d6725c89675ce6c2910099
- dist/assets/threeMatch-DoSQ6UAJ.js sha256=ca2d1ded940fcfe3bad1f376d357be2d0d8d37d293c791d257d7e85ec7e9a009
- dist/assets/threeMatch-i5Vbh66S.css sha256=fff67ee6204fb04ef0c18606fa907cabee81660b94ffa6cf02928190e4f7a8dd
- dist/index.html sha256=047a172a09c0ca1393bd09753c5f28facd0856b849abc08f04b87d95aa941207

## 已知限制

- 平台预览代理仅提供 HTTP 入口；HTTPS 变体因代理 TLS 配置返回 wrong version number（open_risk）。
- 沙箱无 GPU/真实浏览器，WebGL 像素渲染需在真实浏览器确认（open_risk）；逻辑层已由单测与运行时验证覆盖。
