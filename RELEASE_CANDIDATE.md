# Release Candidate

- activity_id: cada00c7-ea9c-4573-a147-c8ac4b091cb2
- stage_run_id: 7c3a5532-a264-4f19-a5d2-a3cdeb91c181
- workflow_id: c88d84d9-6883-4279-b55b-4966054a097e
- input_manifest_sha256: 0a09bda6408b2e55b5c6c12357e90d2b582bb93de52a48cc83568d6661c9778f
- parent_test_report_sha256: 当前开发阶段 test_report 由 ActivityResult 登记
- parent_release_candidate_sha256: fdf072b6c6508f016457bfa701ce400a842b32ee7c2e898cdaf49ebf9c65d7bd
- parent_release_candidate_git: ad4d961c3bf41fe29b6863e7266cf7de7cf4071c
- test_report: 上游 test_report 制品哈希 0fae23b11bb9f424897511f17cb4124d8c370486cde3b120e37010fc155b4616。
- release_scope: 部署生产预览，确认标题、双玩家同屏、键盘与屏幕按钮控制、计分、撞墙/自撞/相撞结束、暂停、重新开始和再玩一次闭环。
- quality_gate: npm test 37/37、npm run test:e2e 31/31、lint、typecheck、build 全部通过。
- deployed_artifact: dist/index.html、dist/assets/index-Bg6mpRhq.js、dist/assets/index-Dg-7wL2f.css。
- preview_url: http://preview.mcode.side419.cn:30087
- rollback_handle: git revert to 0e24c5e7eb94f081a45b0c5beb16c769e27c1907
- git_commit_sha: 由本阶段 artifact manifest 登记推送后的提交 SHA。
- project_title: Web版多用户同屏贪吃蛇大战 · postdeploy 4046dbc8
- deployed_artifact_sha256: dist/index.html 756759dfb7bfd04b74d88e3a3ea7d46c2f8056a6d064e9d3a03d1237e24c0dea；dist/assets/index-EO9ClrBK.js 475fe2f03fc4a5b3e36ca91b856516c4e8e3522e6188ecb33fee1b769f834a69；dist/assets/index-DT_odxNQ.css b0795c460398ea7d3120dfa8c3d37f072a384ee3893880a103af0193bbc359c3
