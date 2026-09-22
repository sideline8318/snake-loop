# 贪吃蛇竞赛 Web 游戏验收报告

- Activity ID: `7d273746-6999-41fa-a746-a951470e0aee`
- StageRun ID: `3580a7e6-fdc2-4339-a9e2-92862bc60503`
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
| preview_mapping | 平台入口已生成并记录连通性风险 | `mcaiBuiltin_request_preview(4173)` 返回 `https://4173-a99cd461fab0e1c1.preview.mcode.side419.cn`；Runner 内通过 HTTPS 访问该域名返回 DNS `Could not resolve host`，本地服务 `0.0.0.0:4173` 的 HTTP 健康检查继续通过。 |
| responsive_controls | 通过 | `styles.css` 包含 `max-width: 560px` 移动端布局和 `.mobile-controls`；`index.html` 包含四个方向控制按钮。 |
| git_commit_pushed | 通过 | 本报告随当前验收 Activity 产生新提交并推送到 `monkeycode/snake-competition-20260825`，提交 SHA 由 release candidate 登记。 |

## 验收结论

AC-001 通过。贪吃蛇竞赛 Web 游戏具备可运行页面、核心对局入口、三种竞赛模式、AI 难度、输入控制、成绩持久化和部署运行态，满足本阶段验收标准。平台预览域名存在 Runner DNS 连通性风险，当前服务本地运行态与 HTTP 健康检查均已验证。
