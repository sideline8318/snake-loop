# Release Candidate

- activity_id: 0b238a6a-22f7-4b0f-8046-13feea829d81
- stage_run_id: 39e22fdd-e056-440e-b888-e8065bab003c
- workflow_id: c88d84d9-6883-4279-b55b-4966054a097e
- input_manifest_sha256: 0789810dd1f4ab0f43f41b743090deb883d59aa274d48338098e6c0e1eb750ea
- parent_release_candidate_sha256: 2d60e28e736c7fa1f26457c4e94a5124c171430ca85c4db7b0167678093a233f
- parent_release_candidate_git: 02265971c07b2eef4abaa862db3b7b24806de11d
- release_scope: 测试闭环，确认标题、双玩家同屏、方向键与屏幕按钮控制、计分、撞墙/自撞/相撞结束、暂停、重新开始和再玩一次闭环。
- quality_gate: npm run build、npm run lint、npm run typecheck、npm test 37/37、npm run test:e2e 31/31 全部通过。
- deployed_artifact: dist/index.html、dist/assets/index-BjlDay39.js、dist/assets/index-DgKMJGDq.css。
- preview_url: https://preview.mcode.side419.cn:30103
- preview_probe: 本地 Vite 页面和 request_preview 返回的 HTTP 上游入口均 HTTP 200 且包含当前 workflow marker；平台 HTTPS 终端探测受 TLS 代理限制。
- git_commit_sha: 待本阶段推送提交产生后回填。
- project_title: Web版多用户同屏贪吃蛇大战 · postdeploy 4046dbc8
- deployed_artifact_sha256: dist/index.html 511ebf1be1e0ee56ee43b61d9947d0b6be2be439517077a9985236a7d3e8cf5c；dist/assets/index-BjlDay39.js 3fc98947035e08d7f458e4308469b4216fff6ea91828fc4c16bb0f8d16ede1bb；dist/assets/index-DgKMJGDq.css 8ee30570518c10a07f2a4015ba4631e969419cc9c0bf875e523f50611cb696d4
