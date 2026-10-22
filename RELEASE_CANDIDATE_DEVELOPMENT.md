# Release Candidate · 开发阶段（development.work.1 attempt 2）

## 概览

- artifact_type: release_candidate
- workflow_id: 4685ae3a-d06a-4da9-aee8-63a819398d73
- stage_run_id: 43a6d69c-22ad-4ddb-a8dc-d4c556e80833
- activity_id: 68eedcb5-43bd-44df-87cc-e8af037367c5
- activity_key: development.work.1
- generation: 1
- input_manifest_sha256: 364a58b4daceb1e984238161b9e9b20e2289116791934f53acfca37098fc7ebf
- primary_repo: https://github.com/sideline8318/snake-loop
- work_branch: loop-20261021-178786
- input_context_baseline_ref: technical_design sha256 `6d82d988f9bf2877318cef552ebb05cf11f3efc94078e661d95689816a599c74`
- upstream_baseline_commit: c28857358a3aa0bd7231682bf1eef76c44ceeaaa
- base_head_before_stage: 5330c18ccff97042e1d320e1b2e32ee192df6d9e
- release_candidate_commit: c8f2b4c5d4d13d028fbe837fadb228de1c44960a
- release_candidate_commit_sha256: 7e4bd028a01ce467ce113fd5981dc5b2a28b983f0beae8678f3a067790b3cf0d

## 本轮目的：修复发布候选锚点不可追溯

上游独立审计结论：功能实现通过，但制品正文与 DEVELOPMENT_REPORT.md 曾登记一个仓库中不存在的提交，
而真实可验证提交为 `5330c18`。本轮只做锚点可追溯性与可核验性修复，不重写已通过的功能实现：

1. 发布根 `index.html` 与 `legacy-snake/index.html` 内嵌当前 Workflow marker
   `4685ae3a-d06a-4da9-aee8-63a819398d73`，使预览/部署门禁可直接比对当前 Workflow，而非依赖历史 workflow 标记。
2. `scripts/vite-plugin-release-root.cjs` 在生成发布根时注入同一 marker（`workflow-marker-current` 与
   `workflow-id-current`），保证构建产物与源码声明一致，且不破坏既有身份隔离断言。
3. `DEVELOPMENT_REPORT.md` 的 activity_id、stage_run_id、input_manifest_sha256、base_head_before_stage
   与 release_candidate_commit 全部更新为本轮真实值，移除对不可验证提交的引用。
4. 本文件登记的 `release_candidate_commit` 与 `release_candidate_commit_sha256` 由同一真实提交计算，
   并可由 `git cat-file -e <sha>` 与远程分支 HEAD 双向核验。

## 功能范围（承接技术设计，交由本轮门禁复核）

- 结算面板「本局排名」：`buildSettlement()` 输出 rank/playerId/label/score/tied 快照，降序 + 竞赛并列名次。
- `Engine.getSettlement()` 只读暴露快照，未改动 `endGame()` 状态机。
- `#rankingList` 仅用 `createElement`/`textContent` 渲染，并列行带 `data-tied` 与含「并列」的 `aria-label`。
- `#playAgainBtn` 文案「再来一局」，点击 disabled 幂等后复位分数/等级/排名并进入 PLAYING。

## 质量门禁（本轮实测）

| 门禁 | 命令 | 结果 |
| --- | --- | --- |
| lint | `npm run lint` | exit 0 |
| typecheck | `npm run typecheck` | exit 0 |
| unit_tests | `npm test` | 6 文件 / 71 用例全部通过 |
| build | `npm run build` | exit 0，dist 含三消发布根与 legacy 页 |
| blackbox | `npm run test:e2e` | 52 用例全部通过，fail 0 |
| preview_http_200 | `curl http://127.0.0.1:4173/`、`http://preview.mcode.side419.cn:30134/` | 均 HTTP 200，正文含当前 marker 与 `rankingList` |
| git_commit_pushed | `git push origin HEAD` | 远程 `loop-20261021-178786` 由 5330c18 前进到本轮新提交 |

## 谱系

- parent_artifact_hashes 包含上游 technical_design 制品 SHA-256
  `6d82d988f9bf2877318cef552ebb05cf11f3efc94078e661d95689816a599c74`。
- 本轮未发现需要修改的功能缺陷，故 release_candidate 内容与上游验收实现一致，仅追加锚点可追溯性修复。
