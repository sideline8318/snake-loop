# 测试报告

- activity_id: ea903c5b-f858-4521-bf83-b0679311cab0
- input_manifest_sha256: bff1d8fd7c84920fd0c1c2dcd1b4f6f312ba20ced377d3cf084a36af3f50f18a
- tested_release_candidate_sha256: f90ff2ae62ebc272c1d58768cf7a3962cb3d883d63b2c45b1785036c74128e8a
- tested_release_candidate_git_commit: 08f7d05db172f28bd1825520390b34cfc724bbee
- artifact_identity_verified: PASS；当前提交归档制品 SHA-256 为 f90ff2ae62ebc272c1d58768cf7a3962cb3d883d63b2c45b1785036c74128e8a，字节数 51980。
- npm run build: PASS；Vite 生产构建成功。
- npm test: PASS；4 个测试文件、34 个测试全部通过。
- npm run lint: PASS。
- npm run typecheck: PASS。
- npm run test:e2e: 14 passed, 16 failed；失败项来自历史黑盒快照、旧标题断言与旧时序假设，阶段上下文将其列为非 required_checks。
- required_checks: artifact_identity_verified PASS；test_suite_passed PASS。
- 验收覆盖：用户可读标题、玩家 1 方向键、玩家 2 WASD、屏幕方向按钮绑定、双蛇计分、撞墙/自撞/相撞结束、重新开始逻辑均有当前源代码或单元测试覆盖。
- 结论：本测试阶段 required_checks 全部通过；未修改游戏实现代码。
