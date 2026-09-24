# 开发阶段部署记录（消消乐 · 3D 三消）

- activity_id: 1ad54d94-9d70-450a-a015-aa32bc7ee783
- stage_run_id: 1db533fa-b926-43d6-9e4e-e68ad33a59c7
- workflow_id: a3d16e35-bd65-41e1-b430-995f7151e2a6
- input_manifest_sha256: f96133d9e64253eb8210c690ee2ccbfbbb313f2077736a061d842dfa88680c55
- tested_baseline_sha256: 55b894958e7767816281eb110f53962659e17bef81606582fe09f471a762f745
- tested_baseline_git: 0fe6ce01320f73d845645d793674211b1740d8de

## 部署目标

- 部署方式：Vite preview 静态服务（构建产物 `dist/`）
- 监听绑定：`0.0.0.0:4173`（后台持久进程）
- 入口页面：`/three-match/`（3D 三消）；`/` 保留既有贪吃蛇入口

## 健康检查

- 本地健康检查：PASS；`http://127.0.0.1:4173/three-match/` 返回 HTTP 200，
  正文包含 workflow marker `a3d16e35-bd65-41e1-b430-995f7151e2a6`
- 平台入口：`http://preview.mcode.side419.cn:30029/three-match/` 返回 HTTP 200，
  正文包含同一 workflow marker
- HTTPS 变体：平台代理对 TLS ClientHello 返回 wrong version number，
  无法建立 TLS 会话（沿用上游 open_risk，属平台既有能力限制）

## preview_url

- `http://preview.mcode.side419.cn:30029/three-match/`

## release_candidate_git_commit

- 由本阶段 ActivityResult 登记
