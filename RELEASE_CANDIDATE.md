# Release Candidate — 消消乐 · 3D 三消（验收阶段）

- activity_id: 3009c1f7-c51f-400b-9970-b04915b7bcd9
- stage_run_id: 5117d421-a271-4a33-9f7e-851b955745c1
- workflow_id: a3d16e35-bd65-41e1-b430-995f7151e2a6
- input_manifest_sha256: 003f4b00595e3d2662560526a3f0fcc539beac2b289f970ad81c2565e563ebf7
- parent_release_candidate_sha256: 758d32af7ecbddfaf1f0923526c1f8b42d57c027ea30f2609426d17c5c25685d
- parent_release_candidate_git: e91b7f0d153af7b2ecc5f7c203ca1f4724a320c5
- git_commit_sha: （由本阶段提交产生，见 ArtifactManifest.git_commit_sha）
- release_scope: 交付可直接在浏览器打开游玩的消消乐（三消）Web 小游戏，入口 /three-match/；
  覆盖 AC-001~AC-006，并修复验收预审发现的 5 项真实可玩性缺陷；不回归既有贪吃蛇。
- deployment_bind: 0.0.0.0:4173（Vite preview 静态服务）
- preview_uri: http://preview.mcode.side419.cn:30041/three-match/
- quality_gate: lint PASS / typecheck PASS / 61 项单测 PASS / 45 项黑盒 PASS（含 AC-001~AC-006）/ build PASS

## 本阶段变更（就近缺陷修复）

- `src/games/three-match/input3d.js`：修复点击交换状态机（拆分 pressedCell 与 startCell），
  新增 onRestart 回调；移除失效的 adjacentFromRelease/cellToScreen。
- `src/games/three-match/board.js`：`collapse()` 的 spawns 携带 kind。
- `src/games/three-match/game.js`：clear 事件 cells 携带 kind。
- `src/games/three-match/boardView.js`：`applyEvents` 使用 spawn.kind / cell.kind，新增 `swapVisual`。
- `src/games/three-match/main3d.js`：交换后立即视觉同步、洗牌提示、R 键重启委托 onRestart。
- `src/games/three-match/index.js`：导出 `initThreeMatch`，保持 DOMContentLoaded 自动启动。
- `tests/unit/threeMatch.test.js`：新增 spawn kind、clear/fall kind 断言。
- `tests/blackbox/06_click_swap.test.cjs`：新增真实 DOM 事件链下的点击/拖拽交换与无效回退验收。

## 构建产物

- dist/three-match/index.html
- dist/assets/threeMatch-DzX4FF-d.js
- dist/assets/threeMatch-i5Vbh66S.css
- dist/index.html（既有贪吃蛇入口，未回归）

## 已知限制

- 平台预览代理仅提供 HTTP 入口；HTTPS 变体因代理 TLS 配置返回 wrong version number（open_risk）。
- 沙箱无 GPU/真实浏览器，three.js/WebGL 像素渲染需在真实浏览器确认（open_risk）；
  view/input 层已由 WebGL stub + 真实 bundle 驱动覆盖，逻辑层由单测覆盖。
- 回滚句柄：`git revert <release_candidate_git_commit>`。
