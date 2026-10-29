# 部署记录

- ActivityRun：`0f3c2457-b41d-4656-b044-76b9c0e13a7d`
- 输入清单 SHA-256：`fe9452e73959221918254fadb54f0781d05e018ff6e3a43180dcca613999c002`
- 上游 release candidate SHA-256：`1326ed42bf71d367201f3f383689b1eab5e7e47f42ab63ec9247b576ee722871`
- 上游测试报告 SHA-256：`de9c2923352a89b5c83f151630d86766408b9cbc9a62bb61f990bf8492094ad4`
- 工作分支：`loop-20261021-178786`
- 回滚句柄：`dffec31019290162a89ebfb6910ba779e1800d1c`

## 部署说明检索

实际读取的项目部署说明文件：

- `README.md`
- `package.json`
- `vite.config.js`
- `vite.three-match.config.js`

检索范围包括仓库根目录、`.github/workflows/`、常见部署配置文件和名称包含 `deploy`、`release`、`publish` 的脚本或文档。未找到项目部署说明、CI 流水线地址或目标机器配置。

项目现有文档声明的发布方式为执行 `npm run build` 生成 `dist/` 静态文件，并通过 `npm run preview` 在 `0.0.0.0:4173` 本地预览。Loop 本阶段仅推送可构建提交；外部或人工发布方应从工作分支取得提交，执行生产构建后将 `dist/` 发布到静态站点托管目标。

## 验证记录

- `npm run lint`：通过。
- `npm run typecheck`：通过。
- `npm test`：通过，6 个测试文件、77 个测试。
- `npm run build`：通过，生成发布根、历史贪吃蛇页面和三消页面。
- `npm run test:e2e`：通过，52 个黑盒测试。
- 本地健康检查：`http://127.0.0.1:4173/` 返回 200，并包含工作流标记、结算排名和“再来一局”。
- 平台预览健康检查：平台返回的 HTTP 入口返回 200；对应 HTTPS 握手在当前平台代理端口返回 `wrong version number`。

## 回滚方式

外部发布方可将工作分支构建来源恢复到 `dffec31019290162a89ebfb6910ba779e1800d1c`，重新执行 `npm run build` 并发布该提交生成的 `dist/`。

本记录所在提交即本阶段 release candidate；精确提交 SHA 由远程分支 HEAD 与 Loop ActivityResult 共同声明。
