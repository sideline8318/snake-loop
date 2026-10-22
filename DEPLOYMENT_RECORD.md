# 部署记录 — 结算排名与再来一局体验交付（部署阶段 deployment.work.1 attempt 1）

- activity_id: f57ae77a-060e-4288-a6f2-aa9c31b572c8
- activity_key: deployment.work.1
- stage_run_id: 7b41967d-1935-44f6-9855-ddc31e83d50a
- workflow_id: 4685ae3a-d06a-4da9-aee8-63a819398d73
- input_manifest_sha256: 95ddd9b766f3f2c9fca58b6ae8a8acc1d2236d5d637bdcc01ea995b0ea2cffc3
- parent_release_candidate_sha256: 5e39d14cb81dbbda289d6ae53a0306f8bf38044725575d6db1cc0841831fae64
- parent_release_candidate_git_commit: bbfda748419376718355e2fa25b85430ca4837da
- parent_test_report_sha256: ba8ded823396692b5777f6aba4ed4b64a36afe8c2f4808628b42ce12ea06bf1d
- work_branch: loop-20261021-178786
- deployment_target: Vite production build（静态服务根 /）
- deployment_bind: 0.0.0.0:4173
- deployment_port: 4173
- platform_preview_url: http://preview.mcode.side419.cn:30168/
- platform_preview_root: http://preview.mcode.side419.cn:30168/
- platform_https_probe: FAIL; request_preview 返回地址转换 HTTPS 后 Runner 探测 curl exit 35（OpenSSL `wrong version number`，平台代理在该端口提供明文），HTTP 入口 200 且标题正确（沿用上游 open_risk，非本轮新增）
- health_check: PASS; 生产预览 `/` HTTP 200，`<title>` 为「消消乐 · 3D 三消」，正文「贪吃蛇」出现 0 次；`/assets/threeMatch-Bwqb6rX7.js`、`/assets/threeMatch-i5Vbh66S.css`、`/assets/legacySnake-KHQ88lRo.js` 均 HTTP 200；`/three-match/` 与 `/legacy-snake/` 均 HTTP 200
- tested_artifact_digest_matched: PASS; 部署产物 `dist/three-match/index.html`（6812c634…）、三消 JS（7f6e7a39…）、三消 CSS（fff67ee6…）与上游测试阶段记录的构建产物哈希一致
- rollback_handle: `git revert <release_candidate_git_commit>`；如需回退到上一可用版本，`git reset --hard bbfda748419376718355e2fa25b85430ca4837da && npm ci && npm run build && npm run preview`
- build: PASS; `npm run build`（Vite 6.4.3，default legacySnake + three-match 13 模块），单一命令自洽产出发布根
- lint: PASS; `npm run lint`（exit 0）
- typecheck: PASS; `npm run typecheck`（exit 0）
- unit_tests: PASS; vitest 6 files / 77 tests
- blackbox_tests: PASS; node:test 52 tests（构建后执行；首轮在 dist 缺失时 47 例失败属预期，构建后复跑全绿）
- git_commit_pushed: PASS; 提交已推送至 origin loop-20261021-178786，远程 HEAD 由 bbfda74 前进至本阶段新提交
- git_remote_head: 见本阶段 release_candidate git_commit_sha

## 发布根与入口

- 静态服务根 `/` 返回发布根 `dist/index.html`（2898 B），标题「消消乐 · 3D 三消」，正文「贪吃蛇」0 次。
- `dist/three-match/index.html` 与 `dist/legacy-snake/index.html` 位于非根子路径，保留兼容入口。
- 本轮交付的结算排名与再来一局能力随发布根 bundle `dist/assets/threeMatch-Bwqb6rX7.js` 提供，
  验收标准 45312663（排名降序 + 再来一局）由上游 settlement/ui 单测与两条结算黑盒用例覆盖。

## 部署产物身份（deployed_artifact_sha256）

| 文件 | byte_size | sha256 |
| --- | --- | --- |
| dist/index.html | 2898 | 476e0faa87f5a66389808218f2b34264ea87d86a1478038f6bde74a032e89e68 |
| dist/assets/threeMatch-Bwqb6rX7.js | 493063 | 7f6e7a392c7d1f7a55561fc1546a48ab0a25ea51d9ca33c688dffe011ba978c9 |
| dist/assets/threeMatch-i5Vbh66S.css | 4150 | fff67ee6204fb04ef0c18606fa907cabee81660b94ffa6cf02928190e4f7a8dd |
| dist/assets/legacySnake-KHQ88lRo.js | 13370 | 757a314416d7241bb96173b2659f8ccbf8570b418805cd161acc3879e639204b |
| dist/assets/legacySnake-DYooQKfO.css | 5684 | 1335d65b63358bd93eb577c0b90659736fccd069d9e21f1514da4ac539e1666b |
| dist/three-match/index.html | 2659 | 6812c6340e3a0087055717f6226908ae14ba91147be8ab92d8b13b3559981cd6 |

## 已知限制与风险

- 平台预览代理 HTTPS 变体返回 `wrong version number`（沿用上游 open_risk），HTTP 预览入口 `http://preview.mcode.side419.cn:30168/` 可用且内容正确。
- 黑盒测试依赖 `dist/` 构建产物，必须先 `npm run build` 再执行，否则命中缺失产物。
- 360x640 小屏结算弹层内部滚动需在验收阶段于真实浏览器目视确认。
