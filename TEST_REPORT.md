# 测试报告

- activity_id: 2285fc73-0370-41a1-80c3-e48a0c33c44f
- stage_run_id: 3ec2cc4c-8633-45a7-90ef-396308379557
- workflow_id: 54d0b24f-1b46-4251-a80f-06574a15f631
- input_manifest_sha256: edbeb995bb0d3cf2f37868a432afbed2aabe87ece58a90a5e6c714d58b67fadd
- parent_release_candidate_sha256: 90d739db3dc6cd7f15cbc9645b870311cec115b437ebc0db6256d033451aaf05
- artifact_identity_verified: PASS；测试材料引用上游 release candidate 哈希与提交 48fea910d1e6f4755bcbbef31d8d2584d730eb3b。
- npm run build: PASS；Vite 生产构建成功。
- npm run test: PASS；4 个测试文件、36 个测试全部通过。
- npm run test:e2e: PASS；4 个黑盒文件、31 个测试全部通过。
- npm run lint: PASS；ESLint 检查通过。
- npm run typecheck: PASS；TypeScript 类型检查通过。
- preview smoke: PASS；HTTPS 预览 https://preview.mcode.side419.cn:30028 返回页面标题“Web版多用户同屏贪吃蛇大战｜贪吃蛇竞赛”。
- 验收覆盖：项目标题、玩家 1 方向键、玩家 2 WASD、屏幕方向按钮、双蛇同屏、双方计分、撞墙/自撞/相撞结束、暂停、重新开始和再玩一次均有自动化验证。
- required_checks: artifact_identity_verified PASS；test_suite_passed PASS；git_commit_pushed 待本阶段提交完成后登记。
