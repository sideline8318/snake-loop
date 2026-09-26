# 部署记录 — 消消乐 · 3D 三消（发布修复版 / 部署阶段）

- activity_id: bbedd866-70d5-47ec-83ce-1698d89973ac
- activity_key: deployment.work.1
- stage_run_id: 98e2d11a-42a3-45a0-a354-54dfa19fe825
- workflow_id: 86ed0cf8-a021-46c5-9639-81871d2b2463
- input_manifest_sha256: e13e2133d42067b8507da8e13b06bf4bc81e21adeadcd4e7a2f05c618aa3fc7c
- parent_release_candidate_sha256: 438f5137f480715d4385af5aea1738d625a2b5f9211e77127dfdbc1623802f85
- parent_release_candidate_git_commit: 4e416e8583489974e9c922bff12e2b518793bedb
- parent_test_report_sha256: 3f94a87292aff72dd94b8a597dea8135aae426d5d8c0fa6820e1f33bda72612e
- deployment_target: Vite production build（静态服务根 /）
- deployment_bind: 0.0.0.0:4173
- deployment_port: 4173
- health_check: PASS; 本地生产预览 `/` HTTP 200，`<title>` 为「消消乐 · 3D 三消」，「贪吃蛇」出现 0 次；`/assets/index-B4I_FDOS.js`、`/assets/index-i5Vbh66S.css` 均 HTTP 200；`/three-match/` 与 `/legacy-snake/` 可达
- platform_preview_url: http://preview.mcode.side419.cn:30030/
- platform_preview_root: http://preview.mcode.side419.cn:30030/
- platform_https_probe: FAIL; 将 request_preview 返回地址转换为 HTTPS 后 Runner 探测返回 OpenSSL `wrong version number`，平台 HTTP 入口可访问（沿用上游 open_risk R-04，非本轮新增）
- rollback_handle: `git revert <release_candidate_git_commit>`；如需回退到上一可用版本，`git reset --hard 4e416e8583489974e9c922bff12e2b518793bedb && npm ci && npm run build && npm run preview`
- build: PASS; `npm run build`（Vite 6.4.3，23 模块）
- lint: PASS; `npm run lint`（exit 0）
- typecheck: PASS; `npm run typecheck`（exit 0）
- unit_tests: PASS; vitest 5 files / 61 tests
- blackbox_tests: PASS; node:test 50 tests（含发布根排他性 FT 与 AC-001~AC-008）
- artifact_identity: PASS; dist/index.html sha256 8a19cea4f276e49bfe5f6bd3ef7826bd9c304c375bb0d91fb9a4d1797c4b7262（2744 bytes）；dist/assets/index-B4I_FDOS.js sha256 eadd98b5bf4fabc88d55deb22dfb0e643a870bf6ced0e75c61997b9faebad096（492342 bytes）；dist/assets/index-i5Vbh66S.css sha256 fff67ee6204fb04ef0c18606fa907cabee81660b94ffa6cf02928190e4f7a8dd（4150 bytes）；dist/assets/modulepreload-polyfill-B5Qt9EMX.js sha256 d2a32840421496e872ade591618d2fa5c33797605d1aec04301717e5a90757d0（711 bytes）
- git_commit_pushed: PASS; 提交已推送至 origin/main，远程 HEAD 由 4e416e8 前进至本阶段新提交
- git_remote_head: 见本阶段 release_candidate git_commit_sha（origin/main，与本地 HEAD 一致）

## 发布根排他性（AC-001~AC-003）

- 静态服务根 `/` 返回唯一默认文档 dist/index.html，标题「消消乐 · 3D 三消」，正文「贪吃蛇」0 次。
- dist 根目录仅一个 index.html；dist/legacy-snake/index.html 承载历史贪吃蛇页面，位于非根子路径，不占用发布根默认文档。
- 发布链接根路径可直接游玩消消乐，无需拼接 `/three-match/`。

## 已知限制与风险

- R-04（低）平台预览代理 HTTPS 变体返回 `wrong version number`（沿用上游 open_risk），HTTP 预览入口可用且内容正确。
- 沙箱无 GPU/真实浏览器，three.js WebGL 像素渲染需真实浏览器最终确认；逻辑与交互层已由单测与黑盒事件链覆盖。
