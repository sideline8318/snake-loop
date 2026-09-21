# 测试报告

- activity_id: 63eb7dc8-88bd-4c3a-a3d1-a1a48220052b
- stage_run_id: c6822dfd-5e0c-40d6-9529-2b65d471d37f
- workflow_id: 0f819d33-4d58-4982-bf1a-e3a2e53e03c5
- input_manifest_sha256: 767b6d554a1b03249b2212bffb40975dcfc4ea1e3b365261ef62d9a601419885
- parent_release_candidate_sha256: fa502be7a9ae5fa0a7228a3fbebd83260460ae86d6106e221ba5ba18ec87d7da
- parent_release_candidate_git: 1b379933783a12c5edce8f780611a8604f729c67
- artifact_identity_verified: PASS；测试报告引用上游 release candidate 哈希与提交。
- npm run build: PASS；Vite 生产构建成功，生成 index.html、JavaScript 与 CSS 产物。
- npm test: PASS；4 个测试文件、37 项测试全部通过。
- npm run test:e2e: PASS；4 个黑盒文件、31 项测试全部通过。
- npm run lint: PASS；ESLint 检查通过。
- npm run typecheck: PASS；TypeScript 类型检查通过。
- acceptance_scope: PASS；验证项目标题“E2E Git Identity Closure 20260921”、方向键、屏幕按钮、双玩家同屏、计分、吃食物、撞墙/自撞/相撞结束、暂停、重新开始和再玩一次。
- implementation_defects: 0；本阶段未发现需要修改游戏实现的缺陷。
- required_checks: artifact_identity_verified PASS；test_suite_passed PASS；git_commit_pushed PASS。
- git_commit_pushed: 本报告及 release candidate 更新后提交并推送到 execution_profile 工作分支，提交 SHA 由 artifact manifest 登记。
