# 测试报告

- activity_id: 72d78710-dbc3-4c24-8896-5199372c5eac
- stage_run_id: d5612ebc-b627-4298-afbf-ff1425c5a167
- workflow_id: 54d0b24f-1b46-4251-a80f-06574a15f631
- input_manifest_sha256: edbeb995bb0d3cf2f37868a432afbed2aabe87ece58a90a5e6c714d58b67fadd
- parent_release_candidate_sha256: 90d739db3dc6cd7f15cbc9645b870311cec115b437ebc0db6256d033451aaf05
- parent_release_candidate_git: 48fea910d1e6f4755bcbbef31d8d2584d730eb3b
- artifact_identity_verified: PASS；测试材料引用上游 release candidate 哈希和提交。
- npm run build: PASS；Vite 生产构建成功，生成 `dist/index.html`、JavaScript 和 CSS 资源。
- npm run test: PASS；4 个测试文件、36 个测试全部通过。
- npm run test:e2e: PASS；4 个黑盒文件、31 个测试全部通过。
- npm run lint: PASS；ESLint 检查通过。
- npm run typecheck: PASS；TypeScript 类型检查通过。
- preview smoke: PASS；HTTPS 预览 https://preview.mcode.side419.cn:30037 返回页面标题“Web版多用户同屏贪吃蛇大战｜贪吃蛇竞赛”，页面包含双玩家 HUD、方向按钮、开始游戏和重新开始控件。
- 验收覆盖：项目标题、玩家 1 方向键、玩家 2 WASD、屏幕方向按钮、双蛇同屏、双方计分、吃食物升级、撞墙/自撞/相撞结束、暂停、重新开始和再玩一次均有自动化验证。
- implementation_defects: 0；本阶段未发现需要修改游戏实现的缺陷。
- git_commit_pushed: PASS；本阶段测试材料已提交并推送至远程 `main`，最终提交 SHA 由 artifact manifest 登记。
- required_checks: artifact_identity_verified PASS；test_suite_passed PASS；git_commit_pushed PASS。
