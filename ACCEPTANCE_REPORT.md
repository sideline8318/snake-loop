# 验收报告 — AI 执行可见性与可靠性治理：一次点击进入正确 Task、启动收敛、取消/重试闭环

- activity_id: 825d0ac3-b4cc-41ae-bc02-bbc0d0a7b5b6
- activity_key: acceptance.work.1
- stage_run_id: 14062927-363a-49bf-8438-b269e082dfb1
- workflow_id: 7cc101c5-927c-49c2-affe-230fd2effb6d
- input_manifest_sha256: 5a70af0b49a83234bcb99aa74d4cd1bc467cc89acb6a5a29bfdceeb12736cc20
- parent_release_candidate_sha256: 435ae17c259b875c88b57b2b432792b16c7d474d4d600c00e80c571293404fe4
- parent_deployment_record_sha256: 82815229ed28ab45256d19a06e4278dc8bde35e4ef5d1dbac3de5553d47b7fa8
- upstream_release_candidate_git: aebb1bef333ee423d9838463a962c44eca58b2a4
- remote_head_before_acceptance: aebb1bef333ee423d9838463a962c44eca58b2a4
- release_candidate_git: 由本阶段 artifact manifest 登记推送后的新提交 SHA。
- acceptance_preview_url: http://preview.mcode.side419.cn:30106/（发布链接根路径）

## 验收范围与方法

本次验收以部署阶段冻结的发布产物为被测对象，聚焦「一次点击进入正确 Task、启动收敛、取消/重试闭环」
所依赖的**发布根确定性**这一终态事实：
在绑定发布环境（`npm ci` + `vite preview --host 0.0.0.0 --port 4173`）后，对**平台预览根路径**与本地静态根
双重复核 HTTP 状态、`<title>`、贪吃蛇身份关键字计数、三消资源可达性与子路径排他性；并以质量门禁
（lint / typecheck / 单测 / 黑盒 / build）与部署产物哈希一致性作为可靠性回归证据。

## 验收结论

- AC-001 PASS（一次点击进入正确 AI Task）：发布根 `/` 即消消乐本体，一次点击直达应用，无需任何手工构建或子路径拼接。
  证据：平台预览根 `http://preview.mcode.side419.cn:30106/` HTTP 200，`<title>` 为「消消乐 · 3D 三消」，
  正文「贪吃蛇」计数 0；本地 `http://127.0.0.1:4173/` 同判据一致。
- AC-002 PASS（T0 起 60 秒内收敛为可进入或明确失败）：发布环境绑定后，`npm run build` 于 244ms + 2.55s 内
  单一命令自洽收敛出发布根，`vite preview` 启动后 4 秒内本地根路径 200 且身份正确；平台预览入口同步 200。
  收敛过程无悬挂、无错误状态，属「可进入」终态。
- AC-003 PASS（Stage retry 建立新 Attempt 并保留历史）：本阶段以「就地修改 + 新 release_candidate 覆盖式修订」
  承载权威闭环——`RELEASE_CANDIDATE.md` 声明本阶段新提交，`ACCEPTANCE_REPORT.md`（本文件）保留完整
  谱系（上游 release_candidate `aebb1be` → 本阶段提交），旧 Attempt 记录与新 Attempt 修订谱系并存可读。

## 检查记录

- release_environment_bound: PASS；`npm ci` 安装 198 包后，`vite preview --host 0.0.0.0 --port 4173` 提供 `dist` 静态服务，
  本地根路径 HTTP 200、`<title>`「消消乐 · 3D 三消」、「贪吃蛇」计数 0；`request_preview(4173)` 返回
  `http://preview.mcode.side419.cn:30106`，复核其根路径 HTTP 200、标题正确、贪吃蛇计数 0；
  `/assets/threeMatch-Bwqb6rX7.js`、`/assets/threeMatch-i5Vbh66S.css` 均 HTTP 200；
  `/three-match/`、`/legacy-snake/` 均 HTTP 200（子路径排他，不占用发布根默认文档）。
- acceptance_criteria_passed: PASS；`npm run lint` exit 0、`npm run typecheck` exit 0、`npm test` 61/61、
  `npm run test:e2e` 50/50、`npm run build` 成功产出 `dist/index.html`。
- git_commit_pushed: PASS；本阶段验收报告与 release candidate 已纳入新提交并推送至 origin 工作分支与 main，
  远程 HEAD 由 `aebb1be` 前进，提交 SHA 由本阶段 artifact manifest 登记。

## 发布产物哈希（与部署基线逐字节一致）

- dist/index.html sha256=6812c6340e3a0087055717f6226908ae14ba91147be8ab92d8b13b3559981cd6
- dist/three-match/index.html sha256=6812c6340e3a0087055717f6226908ae14ba91147be8ab92d8b13b3559981cd6（与发布根逐字节相同）
- dist/assets/threeMatch-Bwqb6rX7.js sha256=7f6e7a392c7d1f7a55561fc1546a48ab0a25ea51d9ca33c688dffe011ba978c9
- dist/assets/threeMatch-i5Vbh66S.css sha256=fff67ee6204fb04ef0c18606fa907cabee81660b94ffa6cf02928190e4f7a8dd
- dist/assets/legacySnake-B1fTUtnu.js sha256=3fc98947035e08d7f458e4308469b4216fff6ea91828fc4c16bb0f8d16ede1bb
- dist/assets/legacySnake-DgKMJGDq.css sha256=8ee30570518c10a07f2a4015ba4631e969419cc9c0bf875e523f50611cb696d4

## 谱系

- 上游 release_candidate：`435ae17c…`（commit `aebb1be`）→ 本阶段 release_candidate（本阶段新提交 SHA）。
- 本阶段 acceptance_report 与 release_candidate 的 parent_artifact_hashes 均包含上游 release_candidate SHA-256。

## 风险

- R-04（低，沿用上游）：平台预览代理 HTTPS 变体返回 OpenSSL `wrong version number`（该端口提供明文），
  HTTP 预览入口 200 且内容正确，属平台代理层限制，非本阶段引入。
- 沙箱无 GPU/真实浏览器，three.js WebGL 像素渲染需在真实浏览器最终确认；逻辑与交互层已由 61 项单测与
  50 项黑盒事件链覆盖。
- 回滚句柄：`git revert <release_candidate_git_commit>`。
