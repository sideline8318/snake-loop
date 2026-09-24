# 验收报告 — 消消乐 · 3D 三消

- activity_id: 3009c1f7-c51f-400b-9970-b04915b7bcd9
- activity_key: acceptance.work.1
- stage_run_id: 5117d421-a271-4a33-9f7e-851b955745c1
- workflow_id: a3d16e35-bd65-41e1-b430-995f7151e2a6
- input_manifest_sha256: 003f4b00595e3d2662560526a3f0fcc539beac2b289f970ad81c2565e563ebf7
- parent_release_candidate_sha256: 758d32af7ecbddfaf1f0923526c1f8b42d57c027ea30f2609426d17c5c25685d
- parent_deployment_record_sha256: a58bf46d14db8b536664d71139d8b5f01286a26878860a7e8e3ed41f0b12bd3a
- remote_head_before_acceptance: e91b7f0d153af7b2ecc5f7c203ca1f4724a320c5
- release_candidate_git: 由本阶段 artifact manifest 登记推送后的新提交 SHA。
- preview_url: http://preview.mcode.side419.cn:30041/three-match/

## 验收结论

- AC-001: PASS；浏览器直接打开 `/three-match/` 即进入游戏，页面 title 为「消消乐 · 3D 三消」，
  含 `#gameCanvas` 与 `#startBtn` / `#restartBtn`，无需本地构建或安装依赖。
- AC-002: PASS；棋盘为 8x8，初始无现成三连且至少存在一步可消除组合；真实 DOM 事件链下
  「点击两颗相邻宝石」与「拖拽到相邻宝石」均触发交换（见 tests/blackbox/06_click_swap.test.cjs）。
- AC-003: PASS；形成三连即消除并加分，非相邻交换被拒并提示「只能交换相邻的宝石」，
  无匹配交换被拒（reason=no-match）并提示「这样换不能消除哦」，棋盘回退不变。
- AC-004: PASS；消除后上方方块自动下落补位，顶部补充新方块并携带正确颜色 kind，支持连锁消除。
- AC-005: PASS；棋盘无可消除组合时自动洗牌并提示「没有可消除的组合，已自动洗牌」。
- AC-006: PASS；页面展示当前得分与最高分，提供「重新开始」按钮，游戏过程无 JS 控制台报错。

## 本阶段发现并修复的真实缺陷

预审以「真实浏览器可玩性」为准，发现并修复以下会导致直接不可玩/降级的缺陷，并补充回归测试：

1. 点击式交换完全失效（P0，AC-002）：`input3d.js` 的 pointerdown/pointerup/click 状态机互相破坏，
   每次点击都把 `startCell` 置空后又清空，永远无法凑成 A→B 配对；只有拖拽能交换。
   修复：拆分「拖拽按下的 pressedCell」与「点击选中的 startCell」，pointerup 只清拖拽状态，
   交换判定完全交给 click；拖拽用 `suppressClick` 标记避免重复触发。
2. 补位宝石与消除粒子全部变白（P1，AC-004）：`collapse()` 返回的 spawns 丢掉了 kind，
   `boardView` 用 `addGem(row,col,null,offset)` 生成宝石，`GEM_IDS[null]===undefined` 落到白色兜底。
   修复：`collapse` 的 spawns 携带写入棋盘的 kind，clear 事件 cells 携带 kind，
   `applyEvents` 使用 `spawn.kind` / `cell.kind`。
3. 死局洗牌提示从不显示（P1，AC-005）：帧循环与 tick 拿到 shuffle 事件后未调用 `hud.toast`。
   修复：`main3d.js` 检测 `shuffle` 事件并弹出洗牌提示。
4. 拖拽交换无视觉反馈（P1，AC-003/004）：`trySwap` 只改逻辑棋盘，boardView 直到 0.22s 后的
   clear 才更新，画面表现为宝石凭空消失。修复：新增 `boardView.swapVisual(from,to)`，
   交换接受后立即交换两个 gem 的 target 并做补间。
5. R 键重启不同步棋盘且弹误导提示（P2）：`onKeyDown` 误把 `{type:'restart'}` 当 from 传给 trySwap。
   修复：新增 `onRestart` 回调解耦，重启时同步 boardView 与 HUD。

## 检查记录

- release_environment_bound: PASS；Vite 生产预览监听 0.0.0.0:4173，本地 `/` 与 `/three-match/`
  均 HTTP 200，页面含 workflow marker；平台预览工具返回 `http://preview.mcode.side419.cn:30041`，
  复测 `http://preview.mcode.side419.cn:30041/three-match/` 返回 200 且引用新 bundle
  `assets/threeMatch-DzX4FF-d.js`（HTTP 200）。
- acceptance_criteria_passed: PASS；`npm run lint` exit 0、`npm run typecheck` exit 0、
  `npm test` 61/61、`npm run test:e2e` 45/45（含新增 4 项点击/拖拽交互验收）、`npm run build` 成功。
- git_commit_pushed: PASS；本阶段验收报告、release candidate 与缺陷修复已纳入新提交并推送至
  origin/main，远程 HEAD 由 e91b7f0d 前进，提交 SHA 由 artifact manifest 登记。

## 风险

- 平台预览代理仅提供 HTTP 入口；HTTPS 变体受代理 TLS 配置影响返回 wrong version number（沿用上游 open_risk）。
- 沙箱无 GPU/真实浏览器，three.js WebGL 像素渲染需在真实浏览器确认；本阶段以 WebGL stub 驱动
  真实 bundle 执行 view/input 层，覆盖点击/拖拽事件链与补位 kind，逻辑层由单测覆盖。
- `npm ci` 审计提示 5 个依赖漏洞，保持锁定依赖树，未执行破坏性自动升级。
- 回滚句柄：`git revert <release_candidate_git_commit>`。
