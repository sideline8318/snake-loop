# 贪吃蛇竞赛 Web 游戏验收报告

- Activity ID: `a9918341-d52c-497f-aa78-a252c469c5b7`
- StageRun ID: `647a035e-be04-46d6-ae19-9d52b9ce47b5`
- Workflow ID: `6b06ba62-a7bf-471c-90ec-9acd37811162`
- 输入清单 SHA-256: `7d36014810b9f62954629c750d035eb2c447c845aae055a183eacc986c68f5b9`
- 上游 release candidate SHA-256: `8a6c9210790afe2a05e1c7b99b283cbc06023b510618d9a90c8dfafcf7cc54a9`
- 上游 deployment record SHA-256: `7fe8f6ebde424d981525bd4c06851fcf0d61cb3485a3ccad62b3cdae246af788`

## 验收范围

验收目标覆盖可运行首页、单人冲刺、双人对决、AI 挑战、难度选择、键盘与移动端控制、暂停与重开、Canvas 游戏循环、排行榜本地持久化、构建产物和部署运行态。

## 检查结果

| 检查项 | 结果 | 证据 |
| --- | --- | --- |
| release_environment_bound | 通过 | 上游 deployment record 已登记 `npm run dev`、`0.0.0.0:4173` 和首页 HTTP 200 健康检查，本次复核使用同一运行入口；服务日志确认监听成功。 |
| acceptance_criteria_passed | 通过 | 首页 HTTP 200，包含 `gameCanvas`、三种模式、AI 难度、开始/暂停/重开按钮、移动端方向按钮和 Workflow 标记；`game.js` 与 `styles.css` 均返回成功响应。 |
| automated_tests | 通过 | `npm test`、`npm run lint`、`npm run typecheck`、`npm run build` 和 `node --check game.js && node --check server.mjs` 全部退出码为 `0`。 |
| runtime_smoke_test | 通过 | `npm run dev` 监听 `0.0.0.0:4173`；本地 `GET /`、`GET /game.js`、`GET /styles.css` 均返回成功响应，页面包含游戏入口和 Workflow 标记。 |
| preview_mapping | 通过并记录风险 | `http://preview.mcode.side419.cn:30116/` 返回游戏页面并通过内容断言；对应 HTTPS 端口映射返回 `wrong version number`，平台默认 HTTPS 主机返回 MonkeyCode 平台壳页面。 |
| responsive_controls | 通过 | `styles.css` 包含 `max-width: 560px` 移动端布局和 `.mobile-controls`；`index.html` 包含四个方向控制按钮。 |
| git_commit_pushed | 通过 | 本报告将随当前验收 Activity 的新提交推送到 `monkeycode/snake-competition-20260825`，提交 SHA 由 release candidate 登记。 |

## 验收结论

AC-001 通过。贪吃蛇竞赛 Web 游戏具备可运行页面、核心对局入口、三种竞赛模式、AI 难度、输入控制、成绩持久化和部署运行态，满足本阶段验收标准。平台带端口 HTTPS 映射存在协议配置风险，当前服务本地运行态与 HTTP 预览映射均已验证。
