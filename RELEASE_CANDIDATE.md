# Release Candidate · 阶段开发（development.work.1）

## 概览

- Workflow：7cc101c5-927c-49c2-affe-230fd2effb6d（SOW AI 可见性 E2E canary 20260928）
- StageRun：a1288fa7-4609-49a1-99da-cdb0185f30c0（development / work）
- ActivityRun：f8e717fa-a8e1-4afb-a373-87d1363cf730
- 输入清单 SHA-256：8407117980345614b9a4880eb9b4f3a3ef72ed1c043997113e78ccc5b3667bf8
- 工作分支：loop-20260928-f5a936
- 本阶段最终提交：eb4cbe84e15da53f4106c79bd824d835ec9bfb3a（远程工作分支 HEAD，已核验）

## 本阶段修复的缺陷

前 4 次 Attempt 均因「发布根应呈现三消」相关契约不满足而失败。本阶段定位到根因并修复：

1. 源文件 `three-match/index.html` 指向 `/src/games/three-match/index.js`，而既有黑盒用例 06 依赖该页面的**内联构建 bundle**才能拿到 `window.__THREE_MATCH__`；旧页脚本引用导致 06 无法建立运行时句柄。
2. Vite 多入口同时产出 `dist/index.html`（贪吃蛇）与 `dist/three-match/index.html`（三消），二者产物命名与模块预加载行为相互冲突，`dist/index.html` 始终是贪吃蛇身份，与「根路径 `/` 呈现三消」的发布契约矛盾。

修复方案：

- 重写 `three-match/index.html`：补齐 `startBtn`/`restartBtn` 等控制入口与 HUD 契约 id（`gameCanvas`/`score`/`bestScore`/`combo`/`toast`/`menuOverlay`），作为唯一事实来源。
- 新增 `src/three-match-entry.js`：在 `DOMContentLoaded` 初始化 3D 三消，并暴露 `globalThis.__THREE_MATCH__`（`game`/`boardView`/`hud`/`input`）。
- 移除 `vite.config.js` 中的 `threeMatch` 多入口，改用独立 `vite.three-match.config.js`（`emptyOutDir: false`）叠加构建，避免产物互相覆盖。
- 新增 Vite 插件 `scripts/vite-plugin-release-root.cjs`：在 `closeBundle` 阶段以三消页生成发布根 `dist/index.html`，改写标题/身份 meta 与资源引用，并断言不得泄漏任何贪吃蛇身份。
- `package.json` 新增 `three-match` 构建脚本。

## 验证矩阵

| 门禁 | 命令 | 结果 |
| --- | --- | --- |
| lint | `npm run lint` | 通过（exit 0） |
| typecheck | `npm run typecheck` | 通过（exit 0） |
| unit_tests | `npm run test` | 61/61 通过 |
| build | `npm run build` + `npm run three-match` | 通过 |
| e2e（黑盒） | `npm run test:e2e` | 50/50 通过（原 9 条失败） |
| preview_http_200 | `vite preview` + `request_preview` | 本地与外部预览均 HTTP 200，含三消 workflow marker |

## 产物

- 发布根：`dist/index.html`（sha256=6812c6340e3a0087055717f6226908ae14ba91147be8ab92d8b13b3559981cd6，byte_size=2659）
- 三消 JS bundle：`dist/assets/threeMatch-Bwqb6rX7.js`（sha256=7f6e7a392c7d1f7a55561fc1546a48ab0a25ea51d9ca33c688dffe011ba978c9）
- 三消 CSS：`dist/assets/threeMatch-i5Vbh66S.css`（sha256=fff67ee6204fb04ef0c18606fa907cabee81660b94ffa6cf02928190e4f7a8dd）

## 谱系

- 上游基线：technical_design 制品 c5bfcefa89c7147ffe79229f3f78600cd6a33d1a174842f95c164b1810817745（commit f118de507bc28434dc2af933bed2eeb87fdeb107）
