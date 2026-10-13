# Release Candidate · 验收阶段（acceptance.work.1）

## 概览

- Workflow：7cc101c5-927c-49c2-affe-230fd2effb6d（SOW AI 可见性 E2E canary 20260928）
- StageRun：14062927-363a-49bf-8438-b269e082dfb1（acceptance / work）
- ActivityRun：825d0ac3-b4cc-41ae-bc02-bbc0d0a7b5b6
- 输入清单 SHA-256：5a70af0b49a83234bcb99aa74d4cd1bc467cc89acb6a5a29bfdceeb12736cc20
- 工作分支：loop-20260928-f5a936
- remote_head_before_acceptance：aebb1bef333ee423d9838463a962c44eca58b2a4
- 上游 release_candidate：435ae17c259b875c88b57b2b432792b16c7d474d4d600c00e80c571293404fe4（commit aebb1bef333ee423d9838463a962c44eca58b2a4）

## 验收阶段动作

本阶段为写仓库阶段。验收结论为发布产物无需修订：部署阶段冻结的 `dist` 与平台预览根路径逐项通过，
故本 release_candidate 为对同一受控发布版本的验收确认，并新增验收报告与登记谱系所需的仓库提交，
使远程工作分支 HEAD 前进（由 aebb1be 前进至本阶段新提交）。

## 验证矩阵

| 门禁 | 命令 | 结果 |
| --- | --- | --- |
| lint | `npm run lint` | 通过（exit 0） |
| typecheck | `npm run typecheck` | 通过（exit 0） |
| unit_tests | `npm test` | 61/61 通过 |
| blackbox_tests | `npm run test:e2e` | 50/50 通过 |
| build | `npm run build` | 通过，单一命令自洽产出发布根 |
| release_environment_bound | `vite preview --host 0.0.0.0 --port 4173` | 本地根 200，平台预览根 200 |

## 发布产物哈希（与部署基线逐字节一致）

- dist/index.html sha256=6812c6340e3a0087055717f6226908ae14ba91147be8ab92d8b13b3559981cd6
- dist/three-match/index.html sha256=6812c6340e3a0087055717f6226908ae14ba91147be8ab92d8b13b3559981cd6
- dist/assets/threeMatch-Bwqb6rX7.js sha256=7f6e7a392c7d1f7a55561fc1546a48ab0a25ea51d9ca33c688dffe011ba978c9
- dist/assets/threeMatch-i5Vbh66S.css sha256=fff67ee6204fb04ef0c18606fa907cabee81660b94ffa6cf02928190e4f7a8dd
- dist/assets/legacySnake-B1fTUtnu.js sha256=3fc98947035e08d7f458e4308469b4216fff6ea91828fc4c16bb0f8d16ede1bb
- dist/assets/legacySnake-DgKMJGDq.css sha256=8ee30570518c10a07f2a4015ba4631e969419cc9c0bf875e523f50611cb696d4

## 谱系

- 上游 release_candidate：435ae17c…（commit aebb1be…）
- 本 release_candidate 的 parent_artifact_hashes 包含上述上游 SHA-256。
