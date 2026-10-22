# Release Candidate · 测试阶段（test.work.1 attempt 1）

## 概览

- artifact_type: release_candidate
- workflow_id: 4685ae3a-d06a-4da9-aee8-63a819398d73
- stage_run_id: cde242ef-9b03-489c-9395-c8e420120835
- activity_id: 3973046b-0772-41a6-a64a-7fd299778cf8
- activity_key: test.work.1
- generation: 1
- input_manifest_sha256: a5911faa6adbd6d7bb3af727649ebd44323d4b056467b108d852bae48e1b8cad
- parent_release_candidate_sha256: 41a8b8ca91467009ade6816378e0ef17b965b6d682efef6f78b5e351800e8068
- upstream_release_candidate_commit: 39a2f4cd77e81d505230d9cfa0978131219d6b63
- work_branch: loop-20261021-178786
- release_candidate_commit: 由 StageResult 的 git_commit_sha 给出，即本文件所在的测试阶段提交
- primary_repo: https://github.com/sideline8318/snake-loop

## 谱系

- 本候选直接承接开发阶段 release_candidate（sha256 `41a8b8ca…`，commit `39a2f4cd`），
  在其之上仅做测试阶段缺陷修复与证据补齐。
- 功能实现（结算排名、再来一局、并列名次标注）保持不变，改动集中在食物投放算法、
  黑盒用例随机序列构造、阶段 marker 与文档。

## 本阶段改动

- `src/game/engine.js`：`generateFood()` 改为空格集合一次性收集后单次随机抽取，
  消除重抽无界与首帧落到蛇头邻格的不确定性，空格耗尽返回 `{-1,-1}`。
- `tests/unit/engine.test.js`：新增空格覆盖与排除双方蛇身的抽样单测（77 例）。
- `tests/blackbox/02_integration.test.cjs`：新增 `straightLineFoodQueue()`，按引擎真实
  演进反推随机原始值，两处进食用例改用该构造器。
- `README.md`、`index.html`、`legacy-snake/index.html`：文档补充食物投放规则，
  发布根 workflow 标识校正，阶段 marker 对齐 `test.work.1 attempt 1`。

## 质量门禁

| 门禁 | 结果 |
| --- | --- |
| lint | PASS，exit 0 |
| typecheck | PASS，exit 0 |
| unit_tests | PASS，77/77 |
| build | PASS，双入口产物完整 |
| blackbox_tests | PASS，52/52（连续 3 次稳定） |
| git_commit_pushed | PASS，远程 loop-20261021-178786 HEAD 前进并一致 |

## 回滚

`git revert <release_candidate_commit>`，必要时回到 `39a2f4cd` 并重新 `npm ci && npm run build`。
