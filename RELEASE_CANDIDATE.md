# Release Candidate — 消消乐 · 3D 三消（部署阶段）

- activity_id: 0c9d1266-25f0-4181-8f1a-f546a25aecc5
- stage_run_id: ea31850a-91ea-4d33-9d37-1faa312054c0
- workflow_id: a3d16e35-bd65-41e1-b430-995f7151e2a6
- input_manifest_sha256: d21809e452381689faa264659528fbb5ad64b2b6ad380feedcb358508e91d561
- parent_release_candidate_sha256: a4c405cb6e5ae0bae207222635468d83f8a5e69284fd87b52903fd6ff37de3ac
- parent_release_candidate_git: 880f06f20f137d1792f536fecd96c9b8529cc1d3
- git_commit_sha: （由本阶段提交产生，见 ArtifactManifest.git_commit_sha）
- release_scope: 交付可直接在浏览器打开游玩的消消乐（三消）Web 小游戏，入口 /three-match/；
  覆盖 AC-001~AC-006：8x8 棋盘初始无三连、点击/拖拽交换相邻方块、三连及以上消除加分、
  无效交换回退提示、消除后下落补位与连锁、死局自动洗牌、分数展示与重新开始；不回归既有贪吃蛇。
- deployment_bind: 0.0.0.0:4173（Vite preview 静态服务）
- preview_uri: http://preview.mcode.side419.cn:30035/three-match/
- quality_gate: lint PASS / typecheck PASS / 58 项单测 PASS / 41 项黑盒 PASS（含 6 项验收）/ build PASS

## 本阶段变更

- 更新 DEPLOYMENT_RECORD.md 与 RELEASE_CANDIDATE.md 登记部署阶段证据（健康检查、回滚句柄、制品哈希、远程 HEAD）。
- 无源码逻辑变更；release_candidate 复测产物与上游一致。

## 构建产物

- dist/three-match/index.html
- dist/assets/threeMatch-*.js
- dist/assets/threeMatch-*.css
- dist/index.html（既有贪吃蛇入口，未回归）

## 已知限制

- 平台预览代理仅提供 HTTP 入口；HTTPS 变体因代理 TLS 配置返回 wrong version number（open_risk）。
- 沙箱无 GPU/真实浏览器，three.js/WebGL 像素渲染需在真实浏览器确认（open_risk）；
  逻辑层已由单测与 GameState 运行时验证覆盖。
