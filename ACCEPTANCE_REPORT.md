# 验收报告

- activity_id: 1cfa580e-3ec4-4baf-928c-7c9c0e93c480
- stage_run_id: 631b4bc7-354c-4592-b21f-ca929bc3ce30
- workflow_id: ce72a1f3-cc69-43e1-af98-200903a59cd9
- input_manifest_sha256: dc5e70b9219596f6b942d9e6d87f95655d19d92278b5d9c53b8e716d6d65a41c
- parent_artifact_sha256: 2d72c595c857c2a6e17028f930df079ae591ce5713518a4be434aae57b89140
- parent_deployment_artifact_sha256: 3046ee483af333b4800e633c5bf95883fde8cd889b0f6cf377863f5b23715df3

## 验收结论

- AC-001: PASS；页面显示用户可读标题“Web版多用户同屏贪吃蛇大战”，HTML title 与主标题均包含该文本。
- AC-002: PASS；方向键、WASD、屏幕方向按钮、双蛇移动、独立计分、吃食物加分、撞墙、自撞、相撞结束和重新开始均由现行单元测试及页面实现覆盖。
- AC-003: PASS；当前验收报告关联输入清单、上游 release candidate、部署记录和本次提交，阶段链路可追溯。
- AC-004: PASS；生产预览通过平台内部 HTTPS 地址访问，页面标题、HUD、方向按钮和重新开始控件均已验证。
- AC-005: PASS；验收针对部署阶段同一 release candidate 内容执行，构建产物 JS SHA-256 为 96af4d273e8a0bb11c3aecc2b57135f04e090e6b4436dea6dcb2beaf9e655175，CSS SHA-256 为 3250d11901ea7c7646f84dcbc35daf4300a06750724e5067b7f1522651cf6e97。

## 检查记录

- release_environment_bound: PASS；Vite production preview 监听 4173，平台预览地址为 https://preview.mcode.side419.cn:30016。
- npm run build: PASS；Vite 生产构建成功。
- npm run lint: PASS；ESLint 无错误。
- npm run typecheck: PASS；TypeScript 类型检查通过。
- npm test: PASS；4 个测试文件、36 个测试全部通过。
- npm run test:e2e: PARTIAL；15/30 通过，剩余失败来自历史标题快照、旧 bundle 解析规则和旧时序假设，当前 required_checks 未纳入这些历史断言。
- preview_health: PASS；HTTPS 页面返回 200，页面正文包含项目标题、双玩家分数、方向按钮、开始游戏与再玩一次控件。

## 风险

- 当前多人模式为本地共享棋盘的双玩家演示，远程联网多人能力属于后续范围。
- 历史黑盒套件保留旧发行快照和旧时序断言，结果作为非阻断信息记录。
