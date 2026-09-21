# 验收报告

- activity_id: 8f4e9741-2687-48b4-8a0d-d18127a6c7a4
- stage_run_id: b4eb74e1-a8e4-4622-a35f-e129bc798178
- workflow_id: 54d0b24f-1b46-4251-a80f-06574a15f631
- input_manifest_sha256: 8641820da029d86fad52fdfd0b9b1064b475f71c73bc6b37f963b0e0f2d61f77
- parent_release_candidate_sha256: 81dbdf0b13c01e407c1a8cac59e36d1da970e2df8a0e1e58167746115b69aba4
- parent_deployment_artifact_sha256: e60dec23fc8d819175d8a788fcda6eb305b07645cabccf7a0f8ace8845d2f78e
- remote_head_before_acceptance: 070a8ced64dfa1c9f76fe3b4f7c9a612eddf9166
- preview_url: https://preview.mcode.side419.cn:30044
- release_candidate_git: 由本阶段 artifact manifest 登记推送后的提交 SHA。

## 验收结论

- AC-001: PASS；页面 title 与主标题均显示“Web版多用户同屏贪吃蛇大战”。
- AC-002: PASS；31 个黑盒测试覆盖方向键、WASD、屏幕方向按钮、双蛇移动、计分、吃食物、撞墙、自撞、相撞结束、暂停、重新开始和再玩一次。
- AC-003: PASS；本报告关联输入清单、上游 release candidate、部署记录、本次 Activity 与本次远程提交。
- AC-004: PASS；平台 HTTPS 预览返回页面内容，正文包含标题、双玩家分数、两组方向按钮、开始游戏和再玩一次控件。
- AC-005: PASS；本次验收引用部署阶段同一 release candidate 上游哈希链。

## 检查记录

- release_environment_bound: PASS；Vite 预览监听 4173，平台返回 `https://preview.mcode.side419.cn:30044`，HTTPS 页面检查成功。
- acceptance_criteria_passed: PASS；`npm run build`、`npm run lint`、`npm run typecheck`、`npm test` 37/37、`npm run test:e2e` 31/31 全部通过。
- preview_health: PASS；HTTPS 页面返回标题、双玩家分数、方向按钮、开始游戏和再玩一次控件。
- git_commit_pushed: PASS；本阶段验收报告纳入新提交并推送到远程工作分支，提交 SHA 由 artifact manifest 登记。

## 风险

- 当前多人模式为本地共享棋盘的双玩家演示，远程联网多人能力属于后续范围。
- `npm install` 审计提示 5 个依赖漏洞，未执行自动升级，避免改变本阶段候选版本依赖树。
