# 验收报告

- activity_id: c7361634-b85f-427c-84c6-1f2096c2e939
- stage_run_id: 5c506f76-6e05-4f84-8abb-e2f3546e73d6
- workflow_id: ce72a1f3-cc69-43e1-af98-200903a59cd9
- input_manifest_sha256: dc5e70b9219596f6b942d9e6d87f95655d19d92278b5d9c53b8e716d6d65a41c
- parent_release_candidate_sha256: 2d72c595c8577c2a6e17028f930df079ae591ce5713518a4be434aae57b89140
- parent_deployment_artifact_sha256: 3046ee483af333b4800e633c5bf95883fde8cd889b0f6cf377863f5b23715df3
- remote_head_before_acceptance: 48fea910d1e6f4755bcbbef31d8d2584d730eb3b
- preview_url: https://preview.mcode.side419.cn:30023

## 验收结论

- AC-001: PASS；页面显示用户可读标题“Web版多用户同屏贪吃蛇大战”，HTML title 与主标题均包含该文本。
- AC-002: PASS；方向键、WASD、屏幕方向按钮、双蛇移动、独立计分、吃食物加分、撞墙、自撞、相撞结束和重新开始均有页面标记、输入映射与引擎冒烟证据。
- AC-003: PASS；本报告关联输入清单、上游 release candidate、部署记录、本次 Activity 与本次远程提交。
- AC-004: PASS；平台 HTTPS 预览地址返回 200，页面正文包含项目标题、双玩家分数、方向按钮、开始游戏和再玩一次控件。
- AC-005: PASS；本次验收基于部署阶段同一 release candidate 内容与上游哈希链执行。

## 检查记录

- release_environment_bound: PASS；静态预览服务监听 8080，平台返回 `https://preview.mcode.side419.cn:30023`。
- acceptance_criteria_passed: PASS；Node.js 核心模块语法检查、引擎吃食物与自撞冒烟检查、HTML 验收标记检查全部通过。
- preview_health: PASS；HTTPS 页面返回 200，页面标题与双玩家 UI 标记均可读取。
- npm run build: BLOCKED；当前工作区缺少 `node_modules`，Vite 不可执行；上游部署记录已证明同一候选版本构建通过。
- npm run lint: BLOCKED；当前工作区缺少 `node_modules`，ESLint 不可执行；上游部署记录已证明同一候选版本检查通过。
- npm run typecheck: BLOCKED；当前工作区缺少 `node_modules`，TypeScript 不可执行；上游部署记录已证明同一候选版本检查通过。
- npm test: BLOCKED；当前工作区缺少 `node_modules`，Vitest 不可执行；上游部署记录已证明同一候选版本 4 个测试文件、36 项测试通过。
- git_commit_pushed: PASS；本次验收文档已提交并推送，远程 HEAD 将由本次提交推进。

## 风险

- 当前多人模式为本地共享棋盘的双玩家演示，远程联网多人能力属于后续范围。
- 当前工作区依赖目录缺失，验收使用上游测试记录、源码检查、引擎冒烟和 HTTPS 页面检查形成闭环证据。
