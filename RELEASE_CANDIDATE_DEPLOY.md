# Release Candidate · 部署阶段（deployment.work.1 attempt 1）

## 概览

- Workflow：4685ae3a-d06a-4da9-aee8-63a819398d73（结算排名与再来一局体验交付）
- StageRun：7b41967d-1935-44f6-9855-ddc31e83d50a（deployment / work）
- ActivityRun：f57ae77a-060e-4288-a6f2-aa9c31b572c8
- Activity key：deployment.work.1
- 输入清单 SHA-256：95ddd9b766f3f2c9fca58b6ae8a8acc1d2236d5d637bdcc01ea995b0ea2cffc3
- 工作分支：loop-20261021-178786
- git_commit_sha：由 StageResult 的 release_candidate.git_commit_sha 给出，即本文件所在的部署阶段提交
- 上游 release_candidate：5e39d14cb81dbbda289d6ae53a0306f8bf38044725575d6db1cc0841831fae64（commit bbfda748419376718355e2fa25b85430ca4837da）
- 上游 test_report：ba8ded823396692b5777f6aba4ed4b64a36afe8c2f4808628b42ce12ea06bf1d

## 本阶段工作

- 部署阶段未发现新的代码缺陷；上游 release_candidate（commit bbfda74）经完整质量门禁与生产构建验证一致。
- 就地仅新增部署证据文档 `RELEASE_CANDIDATE_DEPLOY.md` 与 `DEPLOYMENT_RECORD.md`，未改动应用源码，
  部署产物哈希与上游构建配置自洽一致（三消 JS/CSS/兼容页哈希与上游记录相同）。
- 生产构建 `npm run build` 自洽产出发布根（三消页）与两个子路径入口。
- 部署阶段 marker 对齐 `deployment.work.1 attempt 1`（记录于本文件，发布根静态产物不做二次改动）。

## 验证矩阵

| 门禁 | 命令 | 结果 |
| --- | --- | --- |
| lint | `npm run lint` | 通过（exit 0） |
| typecheck | `npm run typecheck` | 通过（exit 0） |
| unit_tests | `npm test` | 77/77 通过 |
| build | `npm run build` | 通过，双入口产物完整 |
| blackbox_tests | `npm run test:e2e`（build 后） | 52/52 通过 |
| health_check | 生产预览 `/`、assets、子路径 | 全 200，标题正确 |
| git_commit_pushed | `git push origin loop-20261021-178786` | 远程 HEAD 由 bbfda74 前进至本阶段提交 |

## 产物身份

- 发布根：`dist/index.html`（sha256=476e0faa87f5a66389808218f2b34264ea87d86a1478038f6bde74a032e89e68，2898 B）
- 三消 JS bundle：`dist/assets/threeMatch-Bwqb6rX7.js`（sha256=7f6e7a392c7d1f7a55561fc1546a48ab0a25ea51d9ca33c688dffe011ba978c9，493063 B）
- 三消 CSS：`dist/assets/threeMatch-i5Vbh66S.css`（sha256=fff67ee6204fb04ef0c18606fa907cabee81660b94ffa6cf02928190e4f7a8dd，4150 B）
- 历史贪吃蛇 JS：`dist/assets/legacySnake-KHQ88lRo.js`（sha256=757a314416d7241bb96173b2659f8ccbf8570b418805cd161acc3879e639204b，13370 B）
- 历史贪吃蛇 CSS：`dist/assets/legacySnake-DYooQKfO.css`（sha256=1335d65b63358bd93eb577c0b90659736fccd069d9e21f1514da4ac539e1666b，5684 B）
- 三消兼容页：`dist/three-match/index.html`（sha256=6812c6340e3a0087055717f6226908ae14ba91147be8ab92d8b13b3559981cd6，2659 B）

## 谱系

- parent_artifact_hashes 包含上游 release_candidate SHA-256 5e39d14cb81dbbda289d6ae53a0306f8bf38044725575d6db1cc0841831fae64
  与上游 test_report SHA-256 ba8ded823396692b5777f6aba4ed4b64a36afe8c2f4808628b42ce12ea06bf1d。

## 回滚

`git revert <release_candidate_git_commit>`；如需回退到上一可用版本，
`git reset --hard bbfda748419376718355e2fa25b85430ca4837da && npm ci && npm run build && npm run preview`。
