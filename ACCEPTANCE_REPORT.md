# 验收报告

- activity_id: 0940cfc8-47b1-49c4-bc9d-b335bb3a3876
- stage_run_id: 4e21f14c-d1c8-4eda-aaf5-4fd9b17b102f
- workflow_id: ce72a1f3-cc69-43e1-af98-200903a59cd9
- input_manifest_sha256: dc5e70b9219596f6b942d9e6d87f95655d19d92278b5d9c53b8e716d6d65a41c
- parent_release_candidate_sha256: 2d72c595c8577c2a6e17028f930df079ae591ce5713518a4be434aae57b89140
- parent_deployment_artifact_sha256: 3046ee483af333b4800e633c5bf95883fde8cd889b0f6cf377863f5b23715df3
- remote_head_before_acceptance: 19f86262e7338755fbe3601861777d09f5477722
- preview_url: https://preview.mcode.side419.cn:30033

## 验收结论

- AC-001: PASS；页面 title 与主标题均显示“Web版多用户同屏贪吃蛇大战”。
- AC-002: PASS；源码检查覆盖方向键、WASD、屏幕方向按钮；引擎测试覆盖双蛇移动、独立计分、吃食物加分、撞墙、自撞和相撞结束；页面包含重新开始与再玩一次控件。
- AC-003: PASS；本报告关联输入清单、上游 release candidate、部署记录、本次 Activity 与本次远程提交。
- AC-004: PASS；平台 HTTPS 预览地址返回 200，页面正文包含标题、双玩家分数、方向按钮、开始游戏和再玩一次控件。
- AC-005: PASS；本次验收引用部署阶段同一 release candidate 及其上游哈希链。

## 检查记录

- release_environment_bound: PASS；源代码静态预览服务监听 8080，平台返回 `https://preview.mcode.side419.cn:30033`。
- acceptance_criteria_passed: PASS；全部源模块 `node --check` 通过，页面结构检查通过，既有单元测试覆盖引擎、输入、UI 和存储闭环。
- preview_health: PASS；HTTPS 页面返回 200，页面标题、双玩家分数、方向按钮、开始游戏和再玩一次控件均可读取。
- npm run build: BLOCKED；当前工作区缺少 `node_modules`，Vite 不可执行；部署阶段记录证明同一候选版本构建通过。
- npm run lint: BLOCKED；当前工作区缺少 `node_modules`，ESLint 不可执行；部署阶段记录证明同一候选版本检查通过。
- npm run typecheck: BLOCKED；当前工作区缺少 `node_modules`，TypeScript 不可执行；部署阶段记录证明同一候选版本检查通过。
- npm test 与 npm run test:e2e: BLOCKED；当前工作区缺少 `node_modules/jsdom`，部署阶段记录证明同一候选版本测试通过。
- git_commit_pushed: PASS；本阶段文档纳入新提交并推送到远程分支，最终 SHA 由 artifact manifest 登记。

## 风险

- 当前多人模式为本地共享棋盘的双玩家演示，远程联网多人能力属于后续范围。
- 当前工作区依赖目录缺失，验收使用上游测试记录、源码检查和 HTTPS 页面检查形成闭环证据。
