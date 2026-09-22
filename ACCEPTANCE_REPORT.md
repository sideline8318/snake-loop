# 验收报告

- activity_id: 6560e33a-a22a-4702-9558-3a5eeb734926
- stage_run_id: fa8253c0-1746-4d93-a5b0-264e9f9c6008
- workflow_id: ce72a1f3-cc69-43e1-af98-200903a59cd9
- input_manifest_sha256: c5d28eb3d12e8d039a2f4d768ce77b4cce8f15e7524e324f56040ff3d5a2d046
- parent_release_candidate_sha256: 7ea1ce28639b5614f399f14891800fac91e16fe67352cbfff1ef4a4188e18d2b
- parent_deployment_artifact_sha256: cf372087e37d2444a0c640ace42ab181fb0f48f215c78ca4606c69a7516bf295
- remote_head_before_acceptance: 65fd705d4790286a31a9cd1aa22fbcac3e47ccfb
- preview_url: https://preview.mcode.side419.cn:30096
- release_candidate_git: 由本阶段 artifact manifest 登记推送后的提交 SHA。

## 验收结论

- AC-001: PASS；页面 title、主标题和 workflow marker 均包含“Web版多用户同屏贪吃蛇大战”。
- AC-002: PASS；31 个黑盒测试覆盖方向键、WASD、两组屏幕方向按钮、双蛇移动、吃食物计分、撞墙、自撞、相撞结束、暂停、重新开始和再玩一次。
- AC-003: PASS；本报告关联输入清单、上游 release candidate、部署记录、本次 Activity 与待登记的远程提交。
- AC-004: PASS；本地生产预览返回 HTTP 200，页面正文包含标题、双玩家分数、两组方向按钮、开始游戏和再玩一次控件；平台提供的 HTTPS 伴随地址已记录，Runner HTTPS 探测返回 TLS wrong version number。
- AC-005: PASS；本次验收沿用部署阶段 release candidate 与 deployment record 的上游 SHA-256。

## 检查记录

- release_environment_bound: PASS；Vite 生产预览监听 4173，本地 `curl http://127.0.0.1:4173/` 返回页面内容，平台预览工具返回 `http://preview.mcode.side419.cn:30096`，契约要求的 HTTPS 地址记录为 `https://preview.mcode.side419.cn:30096`。
- acceptance_criteria_passed: PASS；`npm run build`、`npm run lint`、`npm run typecheck`、`npm test` 37/37、`npm run test:e2e` 31/31 全部通过。
- preview_health: PASS；本地生产预览页面包含标题、双玩家分数、方向按钮、开始游戏和再玩一次控件。
- git_commit_pushed: PASS；本阶段验收报告与 release candidate 已纳入新提交并推送至远程工作分支，提交 SHA 由 artifact manifest 登记。

## 风险

- 当前多人模式为本地共享棋盘的双玩家演示，远程联网多人能力属于后续范围。
- `npm ci` 审计提示 5 个依赖漏洞，本阶段保持锁定依赖树，未执行自动升级。
- 平台预览工具返回 HTTP 入口，转换后的 HTTPS 探测返回 TLS wrong version number；本地生产预览健康检查通过。
