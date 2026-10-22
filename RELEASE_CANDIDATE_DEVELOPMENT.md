# Release Candidate · 开发阶段（development.work.1 attempt 3）

## 概览

- artifact_type: release_candidate
- workflow_id: 4685ae3a-d06a-4da9-aee8-63a819398d73
- stage_run_id: 6a4e76b1-43ac-4575-9319-42c8d2b05849
- activity_id: 0577be7f-26f9-4d18-b268-a86436ce5e00
- activity_key: development.work.1
- generation: 1
- input_manifest_sha256: e5a6547ffb917dc1c9db1054ebd354fa9ff7728ebafeb8efdead81ea91e04fdf
- primary_repo: https://github.com/sideline8318/snake-loop
- work_branch: loop-20261021-178786
- input_context_baseline_ref: technical_design sha256 `6d82d988f9bf2877318cef552ebb05cf11f3efc94078e661d95689816a599c74`
- upstream_baseline_commit: c28857358a3aa0bd7231682bf1eef76c44ceeaaa
- base_head_before_stage: 8a6cf776ca6e0e79bdbe470896d2af5821d5ca77
- functional_commit_anchor: 5330c18ccff97042e1d320e1b2e32ee192df6d9e
- release_candidate_commit: 8ac430c799372c05e651c0bab32d8b1c237da788
- release_candidate_commit_sha256: 0ab6c054c7f875e33dee10543f4536f8397ce7e5fa2a85930d12224edb623df2

## 锚点可追溯性

- 功能实现提交为 `5330c18`（结算排名与再来一局），位于本交付分支祖先链上，可用
  `git cat-file -t 5330c18ccff97042e1d320e1b2e32ee192df6d9e` 验证。
- 本轮修复提交为 `8ac430c`，是 `5330c18` 的直接后裔，同样位于 `loop-20261021-178786` 祖先链上。
- `release_candidate_commit_sha256` 为 `git cat-file -p 8ac430c | sha256sum` 的真实结果，
  可由该命令单向复算核验。
- 不再引用不可验证的 `15cef6a`、`8c081df`、`a354f04`。

## 本轮修复内容

1. `src/game/settlement.js`：`competitionRank` 原实现从去重后的名次向下回退，导致
   中间并列与前三并列时分名错乱；改为按已排序成绩顺序累进计算 `1, 2, 2, 4` 型竞赛名次，
   并补齐 `player3` / `player4` 标签以保持多参与者快照语义。
2. `src/game/ui.js`：并列行 `aria-label` 去掉全角括号，改为「第 N 名 · 并列 · 玩家 · 分数」，
   避免读屏器把括号读成名次的一部分；`再来一局` 按钮在 `disabled` 状态下的重复点击直接忽略。
3. `tests/unit/settlement.test.js`、`tests/unit/ui.test.js`：新增 3 条用例覆盖并列名次、
   前三并列名次单调性与重复点击幂等。

## 功能范围（承接技术设计，保持已通过实现不变）

- 结算面板「本局排名」：`buildSettlement()` 输出 rank/playerId/label/score/tied 快照，降序 + 竞赛并列名次。
- `Engine.getSettlement()` 只读暴露快照，未改动 `endGame()` 状态机。
- `#rankingList` 仅用 `createElement`/`textContent` 渲染，并列行带 `data-tied` 与含「并列」的 `aria-label`。
- `#playAgainBtn` 文案「再来一局」，点击 disabled 幂等后复位分数/等级/排名并进入 PLAYING。
- 小屏面板 `max-height: min(86vh, 640px)` + 内部滚动，防止排名区块挤出按钮。

## 质量门禁结果

| 门禁 | 命令 | 结果 |
| --- | --- | --- |
| lint | `npm run lint` | 通过，无告警输出 |
| typecheck | `npm run typecheck` | 通过，无错误 |
| unit_tests | `npm test` | 6 个文件 74 条用例全部通过 |
| build | `npm run build` | 通过，产出 dist/ 含贪吃蛇与三消双入口 |
| 黑盒回归 | `npm run test:e2e` | 52 条用例全部通过（fail 0） |
| preview_http_200 | `curl http://127.0.0.1:8080/legacy-snake/index.html` 与预览入口 | HTTP 200，正文含 workflow marker 与 `rankingList` |
| git_commit_pushed | `git push origin HEAD` | 远程 `loop-20261021-178786` 由 8a6cf77 前进到 8ac430c |

## 验收标准映射

- `45312663-f315-44a4-a6de-3f5e7c7dc022`「可按得分降序查看本局排名」：`buildSettlement` 降序 +
  竞赛名次，UI 渲染至 `#rankingList`，由 settlement / ui 单测与黑盒降序断言覆盖。
- `45312663-f315-44a4-a6de-3f5e7c7dc022`「可从结算页触发再来一局」：按钮文案「再来一局」，
  点击复位分数/等级/排名并进入 PLAYING，由 UI 单测与黑盒断言覆盖。

## 残留风险

- 预览隧道在当前环境不支持 TLS（https 访问返回 000），preview_http_200 以可访问的 HTTP 预览入口为准。
- 360×640 小屏结算弹层依赖 `max-height` 与内部滚动，仍需部署/验收阶段目视确认。
