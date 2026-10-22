# Release Candidate · 开发阶段（development.work.1 attempt 7）

## 概览

- artifact_type: release_candidate
- workflow_id: 4685ae3a-d06a-4da9-aee8-63a819398d73
- stage_run_id: b3600d50-bdc3-40f9-af35-ccceb2e5218d
- activity_id: c93ea179-2132-4324-9348-0020e2350b9b
- activity_key: development.work.1
- generation: 1
- input_manifest_sha256: 4a48ecc2f607984e987aeab62f1f29bf9511322156730f2891494a6ce4fbbb1e
- primary_repo: https://github.com/sideline8318/snake-loop
- work_branch: loop-20261021-178786
- input_context_baseline_ref: technical_design sha256 6d82d988f9bf2877318cef552ebb05cf11f3efc94078e661d95689816a599c74
- upstream_baseline_commit: c28857358a3aa0bd7231682bf1eef76c44ceeaaa
- release_candidate_commit: 由 StageResult 的 git_commit_sha 给出，为本文件所在的功能提交
- functional_commit_anchor: 与本文件同一功能提交，即 StageResult 的 git_commit_sha
- anchor_policy: release_candidate / DEVELOPMENT_REPORT / RELEASE_CANDIDATE_DEVELOPMENT / StageResult 的 git_commit_sha 完全相同，均为本阶段功能提交的完整 SHA

## 锚点可追溯性

- 发布候选即本文件所在的功能提交（feat(settlement): 结算面板本局排名与再来一局），
  与 StageResult 的 git_commit_sha 完全相同，位于交付分支 loop-20261021-178786 的历史中。
- 该提交可用 git cat-file -t <sha> 与 git merge-base --is-ancestor <sha> origin/loop-20261021-178786 复核，
  是本阶段推送到远程后的真实提交（本阶段在其后不再追加提交）。
- 报告中没有任何不在该分支祖先链上的提交号。

## 功能范围（承接技术设计）

- 结算面板「本局排名」：buildSettlement() 输出 rank/playerId/label/score/tied 快照，按得分降序 + 竞赛并列名次（1,2,2,4）。
- Engine.getSettlement() 只读暴露快照，未改动 endGame() 状态机。
- #rankingList 仅用 createElement/textContent 渲染，并列行带 data-tied 与含「并列」的 aria-label。
- #playAgainBtn 文案「再来一局」，点击 disabled 幂等后复位分数/等级/排名并进入 PLAYING。
- 小屏面板 max-height: min(86vh, 640px) + 内部滚动，防止排名区块挤出按钮。

## 质量门禁结果

| 门禁 | 命令 | 结果 |
| --- | --- | --- |
| lint | npm run lint | 通过，exit 0，无告警 |
| typecheck | npm run typecheck | 通过，exit 0，无错误 |
| unit_tests | npm test | 6 个文件 76 条用例全部通过 |
| build | npm run build | 通过，dist 含贪吃蛇与三消双入口 |
| 黑盒回归 | npm run test:e2e | 52 条全部通过（fail 0） |
| preview_http_200 | curl 本地与预览入口 | 本地 127.0.0.1:8080 与 http://preview.mcode.side419.cn:30155 的 / 与 /legacy-snake/index.html 均 HTTP 200，正文含 workflow marker 4685ae3a-d06a-4da9-aee8-63a819398d73 与 attempt 7 |
| git_commit_pushed | git push origin HEAD | 远程 loop-20261021-178786 HEAD 前进到本阶段功能提交，与本地 HEAD 一致 |

## 验收标准映射

- 45312663-f315-44a4-a6de-3f5e7c7dc022「可按得分降序查看本局排名」：buildSettlement 降序 + 竞赛名次，UI 渲染至 #rankingList，由 settlement / ui 单测与黑盒降序断言覆盖。
- 45312663-f315-44a4-a6de-3f5e7c7dc022「可从结算页触发再来一局」：按钮文案「再来一局」，点击复位分数/等级/排名并进入 PLAYING，由 UI 单测与黑盒断言覆盖。

## 残留风险

- 预览隧道在当前环境不支持 TLS（https 访问返回 000），preview_http_200 以可访问的 HTTP 预览入口为准。
- 360×640 小屏结算弹层依赖 max-height 与内部滚动，仍需部署/验收阶段目视确认。
