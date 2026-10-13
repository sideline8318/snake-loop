# Release Candidate · 测试阶段（test.work.1）

## 概览

- Workflow：7cc101c5-927c-49c2-affe-230fd2effb6d（SOW AI 可见性 E2E canary 20260928）
- StageRun：38efffa5-25a5-41c8-afef-85d771273d2d（test / work）
- ActivityRun：d0cdf9d0-4c7c-450e-90f1-bdd2f89d5d54
- 输入清单 SHA-256：37a9255aa4ccbcfecfc10adbf09f0d2e9bca8009ea76ef2ef5e8da4ecde3215b
- 工作分支：loop-20260928-f5a936
- 上游 release_candidate：2c3ee8053fd06d367e59f022209a087ee12721ec028c71ec4432b17848e8f65f（commit 7b219474d604c7585c0f491a4332b7b85ac77cb4）

## 本阶段修复的缺陷（就地修改代码）

- D1（构建流水线不自洽，systemic）：`npm run build` 仅执行 `vite build`，默认配置已不再
  产出 `dist/three-match/index.html`，发布根 `dist/index.html` 仍为历史贪吃蛇页面；
  全新构建后黑盒套件 17 项因 `ENOENT dist/three-match/index.html` 失败（33/50）。
- 修复 S1：`package.json` 的 `build` 改为 `vite build && npm run three-match`，
  使一次构建即产出完整可发布的 dist。
- 修复 S2：`vite.config.js` 默认构建输入移除 `main`（三消入口），只保留 `legacySnake`，
  避免默认构建与三消构建在 `dist/index.html` 上互相覆盖。

## 验证矩阵

| 门禁 | 命令 | 结果 |
| --- | --- | --- |
| lint | `npm run lint` | 通过（exit 0） |
| typecheck | `npm run typecheck` | 通过（exit 0） |
| unit_tests | `npm test` | 61/61 通过 |
| build | `npm run build` | 通过，单一命令自洽产出发布根 |
| e2e（黑盒） | `npm run test:e2e` | 50/50 通过（修复前 33/50） |

## 产物

- 发布根：`dist/index.html`（sha256=6812c6340e3a0087055717f6226908ae14ba91147be8ab92d8b13b3559981cd6）
- 三消页别名：`dist/three-match/index.html`（sha256 同上，逐字节相同）
- 历史贪吃蛇页：`dist/legacy-snake/index.html`（sha256=0259238b29f1677a32dffc07241e65aad82ba9767c8bb2c2f45b549c0c295639）
- 三消 JS bundle：`dist/assets/threeMatch-Bwqb6rX7.js`（sha256=7f6e7a392c7d1f7a55561fc1546a48ab0a25ea51d9ca33c688dffe011ba978c9）
- 三消 CSS：`dist/assets/threeMatch-i5Vbh66S.css`（sha256=fff67ee6204fb04ef0c18606fa907cabee81660b94ffa6cf02928190e4f7a8dd）

## 谱系

- 上游 release_candidate：2c3ee8053fd06d367e59f022209a087ee12721ec028c71ec4432b17848e8f65f（commit 7b219474…）
- 本 release_candidate 的 parent_artifact_hashes 包含上述上游 SHA-256。
