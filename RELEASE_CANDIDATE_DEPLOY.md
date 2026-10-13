# Release Candidate · 部署阶段（deployment.work.1）

## 概览

- Workflow：7cc101c5-927c-49c2-affe-230fd2effb6d（SOW AI 可见性 E2E canary 20260928）
- StageRun：b6d2224f-ace1-46bc-8b45-293214ec6140（deployment / work）
- ActivityRun：68912457-59d7-4c6f-9aeb-ddd9e36f8a81
- Activity key：deployment.work.1
- 输入清单 SHA-256：23e63353b03a62132466322bd08fded42a8677a1a8aca6691d4c20992a5a5bc8
- 工作分支：loop-20260928-f5a936
- git_commit_sha：a6f2484028650a9431382017c8675103dc1da60e
- 上游 release_candidate：a7c0ae910f5191e1e740920f747697084dad9d8be21c2f14429c79ad118a8e12（commit 51526a05f69ccaadee24c3941edc7eb064b4c6f7）

## 本阶段工作

- 部署阶段未发现新的代码缺陷；上游 release_candidate（commit 51526a05）经完整质量门禁与生产构建验证一致。
- 就地仅新增部署证据文档 `DEPLOYMENT_RECORD.md`，未改动应用源码，维护了与上游一致的产物哈希谱系。
- 生产构建 `npm run build` 自洽产出发布根（三消页），发布根排他性成立。

## 验证矩阵

| 门禁 | 命令 | 结果 |
| --- | --- | --- |
| lint | `npm run lint` | 通过（exit 0） |
| typecheck | `npm run typecheck` | 通过（exit 0） |
| unit_tests | `npm test` | 61/61 通过 |
| blackbox_tests | `npm run test:e2e` | 50/50 通过 |
| build | `npm run build` | 通过，单一命令自洽产出发布根 |
| health_check | 生产预览 `/`、assets、子路径 | 全 200，标题正确 |

## 产物身份

- 发布根：`dist/index.html`（sha256=6812c6340e3a0087055717f6226908ae14ba91147be8ab92d8b13b3559981cd6）
- 三消 JS bundle：`dist/assets/threeMatch-Bwqb6rX7.js`（sha256=7f6e7a392c7d1f7a55561fc1546a48ab0a25ea51d9ca33c688dffe011ba978c9）
- 三消 CSS：`dist/assets/threeMatch-i5Vbh66S.css`（sha256=fff67ee6204fb04ef0c18606fa907cabee81660b94ffa6cf02928190e4f7a8dd）
- 历史贪吃蛇 JS：`dist/assets/legacySnake-B1fTUtnu.js`（sha256=3fc98947035e08d7f458e4308469b4216fff6ea91828fc4c16bb0f8d16ede1bb）
- 历史贪吃蛇 CSS：`dist/assets/legacySnake-DgKMJGDq.css`（sha256=8ee30570518c10a07f2a4015ba4631e969419cc9c0bf875e523f50611cb696d4）

## 谱系

- parent_artifact_hashes 包含上游 release_candidate SHA-256 a7c0ae910f5191e1e740920f747697084dad9d8be21c2f14429c79ad118a8e12
  与上游 test_report SHA-256 741c7ec02679e5286fd009b7a0c9bfa26f82607172800b9753e929e8387888f5。
