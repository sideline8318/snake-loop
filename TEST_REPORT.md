# 测试阶段报告 — 消消乐 · 3D 三消

- activity_id: 934ee18e-f932-4791-8055-6b0846112824
- activity_key: test.work.1
- stage_run_id: 9ec84b62-cce1-4598-9f77-14d0db9357bf
- workflow_id: a3d16e35-bd65-41e1-b430-995f7151e2a6
- input_manifest_sha256: 55587bdb2874e1a8076e030abcf3c9e27849883e0cc22eefc0bf0544f12f55e1
- parent_release_candidate_sha256: 5d9172ed2d8d5375d65df160f5111a3f73a26b5fc3d6b12e8ccf5976d051b108
- parent_release_candidate_git: cc382f4f27c6c9d4145d93dc9902d981e8d4e387
- parent_test_report_sha256: be397388abf6dad4421ab2798acf5d3466abd417b6ae7dcde641736b5cc931e6
- parent_deployment_record_sha256: 9a7d330dccc924c3fc45bc052bf158042ffb3cea938c1b0ad863895661d1b200

## 测试范围

本轮针对测试阶段目标「交付可直接在浏览器打开游玩的消消乐（三消）Web 小游戏」，
在既有 58 项单测与 36 项黑盒基础上，新增 `tests/blackbox/05_acceptance.test.cjs`，
以确定性随机源逐条覆盖验收标准 AC-001~AC-006。

## 测试结果

- required_check artifact_identity_verified: PASS；本报告声明输入清单 SHA-256、上游 release_candidate / test_report / deployment_record 哈希与当前 Activity ID。
- required_check test_suite_passed: PASS；单元 58/58、黑盒 41/41（含新增 5 项验收），全绿。
- required_check git_commit_pushed: PASS；实现与测试变更提交并推送至 primary 仓库 main，远程 HEAD 前进。
- npm run lint: PASS，退出码 0。
- npm run typecheck: PASS，退出码 0。
- npm test: PASS，5 个文件 58 项全过（threeMatch 21 项）。
- npm run build: PASS，产出 dist/index.html、dist/three-match/index.html 及哈希命名的 assets。
- npm run test:e2e: PASS，5 个黑盒文件 41 项全过。
- 运行时验收（新增 05_acceptance）:
  - AC-001 PASS：入口页独立可访问，含 #gameCanvas / #startBtn / #restartBtn，无需本地构建即可打开。
  - AC-002 PASS：25 次确定性构造均为 8x8 且初始无现成三连、至少存在一步可消除组合。
  - AC-003/AC-004 PASS：非相邻交换被拒；无匹配交换被拒（reason=no-match）；合法交换被接受，结算后消除、下落补位、得分 >0、连锁计数、回到 idle、无残留匹配且仍可行动。
  - AC-005 PASS：构造真死局棋盘后 tick 触发一次洗牌，洗牌后无现成三连、有解，并输出提示文案「没有可消除的组合，已自动洗牌」。
  - AC-006 PASS：构建产物内嵌 HUD 接线、最高分持久化键 `three-match-best-score`、自动洗牌与无效交换提示文案、BOARD_SIZE 常量。
- 部署冒烟：`npm run preview` 监听 0.0.0.0:4173，`/` 与 `/three-match/` 均返回 200，页面含 workflow marker。

## 制品哈希

- release_candidate: RELEASE_CANDIDATE.md（见同阶段 release_candidate artifact）
- test_report: 本文件
- 构建产物（dist，可在本地复现）:
  - dist/three-match/index.html
  - dist/assets/threeMatch-*.js
  - dist/assets/threeMatch-*.css
  - dist/index.html（既有贪吃蛇入口，未回归）

## 缺陷与限制

- 实现缺陷：0；本轮复测未发现需修复的游戏缺陷。
- 已知平台限制（沿用上游 open_risk，非本轮新增）：平台预览代理仅提供 HTTP 入口，
  HTTPS 变体（https://preview.mcode.side419.cn:30033/three-match/）因代理 TLS 配置返回
  `wrong version number`；HTTP 入口返回 200 且正文含 workflow marker。
- 沙箱无 GPU/真实浏览器，three.js WebGL 像素渲染需在真实浏览器确认；逻辑层已由单测与
  GameState 运行时驱动覆盖（固定随机源）。
- npm ci 审计提示 5 个依赖漏洞，未执行破坏性自动升级以保持锁定版本。
