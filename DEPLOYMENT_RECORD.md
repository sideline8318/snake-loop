# 部署记录 — 消消乐 · 3D 三消（部署阶段 deployment.work.1）

- activity_id: 68912457-59d7-4c6f-9aeb-ddd9e36f8a81
- activity_key: deployment.work.1
- stage_run_id: b6d2224f-ace1-46bc-8b45-293214ec6140
- workflow_id: 7cc101c5-927c-49c2-affe-230fd2effb6d
- input_manifest_sha256: 23e63353b03a62132466322bd08fded42a8677a1a8aca6691d4c20992a5a5bc8
- parent_release_candidate_sha256: a7c0ae910f5191e1e740920f747697084dad9d8be21c2f14429c79ad118a8e12
- parent_release_candidate_git_commit: 51526a05f69ccaadee24c3941edc7eb064b4c6f7
- parent_test_report_sha256: 741c7ec02679e5286fd009b7a0c9bfa26f82607172800b9753e929e8387888f5
- deployment_target: Vite production build（静态服务根 /）
- deployment_bind: 0.0.0.0:4173
- deployment_port: 4173
- platform_preview_url: http://preview.mcode.side419.cn:30104/
- platform_preview_root: http://preview.mcode.side419.cn:30104/
- platform_https_probe: FAIL; request_preview 返回地址转换 HTTPS 后 Runner 探测返回 OpenSSL `wrong version number`（平台代理在该端口提供明文），HTTP 入口 200 且内容正确（沿用上游 open_risk R-04，非本轮新增）
- health_check: PASS; 生产预览 `/` HTTP 200，`<title>` 为「消消乐 · 3D 三消」，「贪吃蛇」出现 0 次；`/assets/threeMatch-Bwqb6rX7.js`、`/assets/threeMatch-i5Vbh66S.css` 均 HTTP 200；`/three-match/` 与 `/legacy-snake/` 均 HTTP 200
- rollback_handle: `git revert <release_candidate_git_commit>`；如需回退到上一可用版本，`git reset --hard 51526a05f69ccaadee24c3941edc7eb064b4c6f7 && npm ci && npm run build && npm run preview`
- build: PASS; `npm run build`（Vite 6.4.3，default 10 模块 + three-match 13 模块），单一命令自洽产出发布根
- lint: PASS; `npm run lint`（exit 0）
- typecheck: PASS; `npm run typecheck`（exit 0）
- unit_tests: PASS; vitest 5 files / 61 tests
- blackbox_tests: PASS; node:test 50 tests
- git_commit_pushed: PASS; 提交已推送至 origin 工作分支，远程 HEAD 由 51526a05 前进至本阶段新提交
- git_remote_head: 见本阶段 release_candidate git_commit_sha

## 发布根排他性

- 静态服务根 `/` 返回唯一默认文档 dist/index.html，标题「消消乐 · 3D 三消」，正文「贪吃蛇」0 次。
- dist 根目录仅一个 index.html；dist/legacy-snake/index.html 承载历史贪吃蛇页面，位于非根子路径，不占用发布根默认文档。

## 部署产物身份（deployed_artifact_sha256）

| 文件 | byte_size | sha256 |
| --- | --- | --- |
| dist/index.html | 2659 | 6812c6340e3a0087055717f6226908ae14ba91147be8ab92d8b13b3559981cd6 |
| dist/assets/threeMatch-Bwqb6rX7.js | 493063 | 7f6e7a392c7d1f7a55561fc1546a48ab0a25ea51d9ca33c688dffe011ba978c9 |
| dist/assets/threeMatch-i5Vbh66S.css | 4150 | fff67ee6204fb04ef0c18606fa907cabee81660b94ffa6cf02928190e4f7a8dd |
| dist/assets/legacySnake-B1fTUtnu.js | 11126 | 3fc98947035e08d7f458e4308469b4216fff6ea91828fc4c16bb0f8d16ede1bb |
| dist/assets/legacySnake-DgKMJGDq.css | 4939 | 8ee30570518c10a07f2a4015ba4631e969419cc9c0bf875e523f50611cb696d4 |

## 已知限制与风险

- R-04（低）平台预览代理 HTTPS 变体返回 `wrong version number`（沿用上游 open_risk），HTTP 预览入口可用且内容正确。
- 沙箱无 GPU/真实浏览器，three.js WebGL 像素渲染需真实浏览器最终确认；逻辑与交互层已由单测与黑盒事件链覆盖。
