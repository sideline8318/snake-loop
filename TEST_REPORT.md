# 测试阶段报告 — 结算排名与再来一局体验交付

- artifact_type: test_report
- workflow_id: 4685ae3a-d06a-4da9-aee8-63a819398d73
- stage_run_id: cde242ef-9b03-489c-9395-c8e420120835
- activity_id: 3973046b-0772-41a6-a64a-7fd299778cf8
- activity_key: test.work.1
- generation: 1
- input_manifest_sha256: a5911faa6adbd6d7bb3af727649ebd44323d4b056467b108d852bae48e1b8cad
- parent_release_candidate_sha256: 41a8b8ca91467009ade6816378e0ef17b965b6d682efef6f78b5e351800e8068
- upstream_release_candidate_commit: 39a2f4cd77e81d505230d9cfa0978131219d6b63
- work_branch: loop-20261021-178786
- primary_repo: https://github.com/sideline8318/snake-loop

## 测试范围

针对测试阶段目标「结算排名与再来一局体验交付」，在开发阶段交付的
`39a2f4cd` 基线上执行全量质量门禁，覆盖结算排名降序、并列名次标注、
再来一局复位、食物投放、双人对战结束与历史三消子页面回归。

## 本轮发现的缺陷与就地修复

- 缺陷 D1（引擎食物投放不稳定，systemic）：`Engine.generateFood()` 用
  `do { index = Math.floor(Math.random() * total) } while (occupied.has(index))`
  在整块棋盘上重抽，直到抽到空格。棋盘只剩少量空格时重抽次数无界，且首帧食物
  有概率落在蛇头即将进入的格子，导致黑盒 01「start lays snake right at centre;
  step keeps length moving right」间歇性断言失败（实测 3 次中出现 1 次
  `'ate' !== 'none'`）。
  - 修复 S1：先一次性收集全部空格，再从空格集合中随机取一个；无空格时返回
    `{-1,-1}` 哨兵。投放结果与占用集合在同一快照内计算，抽取为常数开销。
  - 修复 S2：新增单测 `generateFood covers every free cell and excludes both snakes`，
    以 4000 次抽样验证食物覆盖全部空格且不落在任意一条蛇身上。
- 缺陷 D2（黑盒用例随机序列脆弱，occasional）：`tests/blackbox/02_integration.test.cjs`
  中两处用例手工构造 `(211 + k) / 400` 的随机队列，依赖「整块棋盘索引」假设。
  空格池长度随每次进食变化，序列失效导致玩家一在第 9 步撞右墙，等级停在 1，
  「eating raises score/level...」用例断言 `level should reach 2 after 5 foods` 失败。
  - 修复 S3：新增 `straightLineFoodQueue()` 辅助函数，先规划玩家一直线可达的目标格，
    再按引擎真实演进反推每餐应喂给 `Math.random` 的精确原始值，使随机队列与空格池
    长度解耦，两处用例改用该构造器。
- 修复 S4：README 记录食物投放规则并校正发布根 workflow 标识；`index.html` 与
  `legacy-snake/index.html` 的阶段 marker 对齐到 `test.work.1 attempt 1`。

## 测试结果

- required_check artifact_identity_verified: PASS；本报告声明输入清单 SHA-256
  `a5911faa…`、上游 release_candidate 哈希 `41a8b8ca…` 与当前 Activity ID
  `3973046b-0772-41a6-a64a-7fd299778cf8`。
- required_check test_suite_passed: PASS；lint exit 0、typecheck exit 0、单测 77/77、
  黑盒 52/52。
- required_check git_commit_pushed: PASS；修复与报告提交推送至
  `origin/loop-20261021-178786`，远程 HEAD 由 `39a2f4cd` 前进至本阶段提交。

| 门禁 | 命令 | 结果 |
| --- | --- | --- |
| lint | `npm run lint` | PASS，exit 0 |
| typecheck | `npm run typecheck` | PASS，exit 0 |
| unit_tests | `npm test` | PASS，6 文件 77 用例（engine 24） |
| build | `npm run build` | PASS，dist 含发布根与 `/legacy-snake/`、`/three-match/` |
| blackbox_tests | `npm run test:e2e` | PASS，52/52 |
| blackbox_stability | `npm run test:e2e` 连续 3 次 | PASS，每次 52/52 |
| legacy_01_stability | `node --test tests/blackbox/01_engine_shipped.test.cjs` 连续 8 次 | PASS，每次 8/8 |
| marker_check | 构建产物 grep | PASS，`test.work.1 attempt 1` |

## 验收标准映射

- 45312663-f315-44a4-a6de-3f5e7c7dc022「对战结束后，房间内玩家均可查看按得分降序
  排列的本局排名，且可从结算页触发再来一局」：`settlement.test.js`（8 例）与
  `ui.test.js`（11 例）覆盖降序、并列名次（1,2,2,4）、`data-tied` 与 `aria-label`
  标注；黑盒
  `settlement modal shows score-descending ranking and play-again label` 与
  `draw settlement marks tied rows with data-tied and aria-label` 在真实 dist 产物上
  验证渲染、降序、点击「再来一局」后排行清空与分数复位。

## 已知风险与后续动作

- 平台预览 HTTPS 入口仍返回 SSL wrong version number（承接上游 open_risk），测试阶段
  以 HTTP 入口与本地静态服务为准，部署/验收阶段需再次确认可用预览入口。
- 360x640 小屏结算弹层内部滚动仍待部署/验收阶段目视确认。
