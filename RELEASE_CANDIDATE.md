# Release Candidate

- activity_id: 3204cf3b-ca77-441e-bf75-736dfed316e1
- stage_run_id: 0ab691c2-4b0b-48e5-a5e4-0c2ceb3fe8a6
- workflow_id: c88d84d9-6883-4279-b55b-4966054a097e
- input_manifest_sha256: 0a09bda6408b2e55b5c6c12357e90d2b582bb93de52a48cc83568d6661c9778f
- parent_release_candidate_sha256: 7ea1ce28639b5614f399f14891800fac91e16fe67352cbfff1ef4a4188e18d2b
- parent_deployment_artifact_sha256: cf372087e37d2444a0c640ace42ab181fb0f48f215c78ca4606c69a7516bf295
- parent_release_candidate_git: ca4227b726de50f2cc2618b7830ea333e17d391d
- release_scope: 验收生产预览，确认标题、双玩家同屏、方向键与屏幕按钮控制、计分、撞墙/自撞/相撞结束、暂停、重新开始和再玩一次闭环。
- quality_gate: npm run build、npm run lint、npm run typecheck、npm test 37/37、npm run test:e2e 31/31 全部通过。
- deployed_artifact: dist/index.html、dist/assets/index-BjlDay39.js、dist/assets/index-DgKMJGDq.css。
- preview_url: https://preview.mcode.side419.cn:30099
- preview_probe: 本地 HTTPS 预览 HTTP 200 且包含当前 Workflow marker；request_preview 返回入口的 HTTPS 终端探测受平台 TLS 代理限制，HTTP 上游入口可达
- git_commit_sha: 由本阶段 artifact manifest 登记推送后的提交 SHA。
- project_title: Web版多用户同屏贪吃蛇大战 · postdeploy 4046dbc8
- deployed_artifact_sha256: dist/index.html 511ebf1be1e0ee56ee43b61d9947d0b6be2be439517077a9985236a7d3e8cf5c；dist/assets/index-BjlDay39.js 3fc98947035e08d7f458e4308469b4216fff6ea91828fc4c16bb0f8d16ede1bb；dist/assets/index-DgKMJGDq.css 8ee30570518c10a07f2a4015ba4631e969419cc9c0bf875e523f50611cb696d4
