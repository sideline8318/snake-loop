# 开发阶段测试报告

- activity_id: cada00c7-ea9c-4573-a147-c8ac4b091cb2
- stage_run_id: 7c3a5532-a264-4f19-a5d2-a3cdeb91c181
- workflow_id: c88d84d9-6883-4279-b55b-4966054a097e
- input_manifest_sha256: 0a09bda6408b2e55b5c6c12357e90d2b582bb93de52a48cc83568d6661c9778f
- parent_artifact_sha256: fdf072b6c6508f016457bfa701ce400a842b32ee7c2e898cdaf49ebf9c65d7bd

## 检查结果

- lint: PASS；`npm run lint`
- typecheck: PASS；`npm run typecheck`
- unit_tests: PASS；Vitest 4 个文件、37 项测试全部通过
- build: PASS；`npm run build` 生成 Vite dist 产物
- blackbox_tests: PASS；31 项黑盒测试全部通过
- release_candidate_artifacts: dist/index.html 756759dfb7bfd04b74d88e3a3ea7d46c2f8056a6d064e9d3a03d1237e24c0dea；JS 475fe2f03fc4a5b3e36ca91b856516c4e8e3522e6188ecb33fee1b769f834a69；CSS b0795c460398ea7d3120dfa8c3d37f072a384ee3893880a103af0193bbc359c3
- acceptance_scope: PASS；标题、方向键、屏幕按钮、双玩家、计分、撞墙/自撞/相撞结束、暂停、重新开始和再玩一次均有覆盖
- release_candidate_git_commit: 由本阶段 ActivityResult 登记并与远程分支 HEAD 对齐
