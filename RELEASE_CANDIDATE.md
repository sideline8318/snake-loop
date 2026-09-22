# Release Candidate

- parent_baseline_uri: artifact://development-summary.md
- parent_baseline_sha256: 2d60e28e736c7fa1f26457c4e94a5124c171430ca85c4db7b0167678093a233f
- parent_baseline_git: 02265971c07b2eef4abaa862db3b7b24806de11d
- activity_id: 16bb1b47-57ea-46c8-9375-ac8286ce2b4d
- stage_run_id: c665b45c-30d1-499d-b923-e7b1b77a2c0d
- workflow_id: c88d84d9-6883-4279-b55b-4966054a097e
- input_manifest_sha256: 737d43d9a00dcc35c27339080828c750930a189d4fc1d1741f38159969f044e2
- test_report: TEST_REPORT.md；本阶段测试报告与 release candidate 共同提交。
- release_scope: 验证标题、双玩家同屏、方向键与屏幕按钮控制、计分、吃食物、撞墙/自撞/相撞结束、暂停、重新开始和再玩一次闭环。
- quality_gate: npm run build、npm test 37/37、npm run test:e2e 31/31、npm run lint、npm run typecheck 全部通过。
- deployed_artifact: dist/index.html、dist/assets/index-BjlDay39.js、dist/assets/index-DgKMJGDq.css。
- preview_url: https://preview.mcode.side419.cn:30121；本地生产预览 HTTP 200，平台 HTTPS 探测返回 `wrong version number`。
- rollback_handle: git revert to 本阶段提交 SHA。
- git_commit_sha: 由 complete_activity artifact manifest 登记本阶段推送后的真实远程 HEAD。
- project_title: Web版多用户同屏贪吃蛇大战 · postdeploy 4046dbc8
- deployed_artifact_sha256: dist/index.html 718109f66fd2248d907fc838d10acd81746dafd891ffd9a8de3f38f43941f62b；dist/assets/index-BjlDay39.js 3fc98947035e08d7f458e4308469b4216fff6ea91828fc4c16bb0f8d16ede1bb；dist/assets/index-DgKMJGDq.css 8ee30570518c10a07f2a4015ba4631e969419cc9c0bf875e523f50611cb696d4。
