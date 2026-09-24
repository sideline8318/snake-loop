# 审计报告：开发阶段 · development.audit.2

## 1. 审计元数据

- artifact_type: audit_report
- activity_id: 011bbb6b-edac-4a48-9141-e618bc717f5b
- activity_key: development.audit.2
- role: audit
- stage: development
- stage_run_id: 1db533fa-b926-43d6-9e4e-e68ad33a59c7
- workflow_id: a3d16e35-bd65-41e1-b430-995f7151e2a6
- input_manifest_sha256: f96133d9e64253eb8210c690ee2ccbfbbb313f2077736a061d842dfa88680c55
- stage_result_hash: dfc257b2ff6655c8b82ab479d3d7cb1b6bd5b5d4c3a8f45782225223b92bb5da
- audited_activity_run_id: 1ad54d94-9d70-450a-a015-aa32bc7ee783
- audited_release_candidate_sha256: 5d9172ed2d8d5375d65df160f5111a3f73a26b5fc3d6b12e8ccf5976d051b108
- audited_git_commit_sha: cc382f4f27c6c9d4145d93dc9902d981e8d4e387
- audit_verdict: PASS

## 2. required_checks 结果

| check | 结果 | 证据 |
| --- | --- | --- |
| input_hash_verified | PASS | 本 Activity 契约 input_manifest_hash 与 stage_result.input_manifest_hash 均为 f96133d9e64253eb8210c690ee2ccbfbbb313f2077736a061d842dfa88680c55，与工作流上下文一致；三个制品（RC/TR/DR）均在正文头部登记同一 input_manifest_sha256=f96133d9...80c55，映射链闭合。 |
| artifact_hashes_verified | PASS | 经下载实测：release_candidate sha256=5d9172ed2d8d5375d65df160f5111a3f73a26b5fc3d6b12e8ccf5976d051b108 / byte_size=1828；test_report sha256=be397388abf6dad4421ab2798acf5d3466abd417b6ae7dcde641736b5cc931e6 / byte_size=2931；deployment_record sha256=9a7d330dccc924c3fc45bc052bf158042ffb3cea938c1b0ad863895661d1b200 / byte_size=1290。三者与 stage_result.artifacts 声明逐项一致。另复核 RC/TR 登记的 4 个构建产物哈希，重新构建后实测全部逐字节吻合（见第 5 节）。 |
| quality_policy_evaluated | PASS | 在制品 git_commit_sha=cc382f4 工作区复跑质量门禁：lint 退出 0、typecheck 退出 0、58 项单测全过（含 threeMatch 21 项）、构建成功、36 项黑盒全过；并直接驱动 GameState 复验 AC-001~AC-006 运行时行为全部成立。 |

## 3. 契约目标覆盖核验（AC-001~AC-006）

| 验收标准 | 承载实现 | 独立复验证据 | 判定 |
| --- | --- | --- | --- |
| AC-001 浏览器直接打开即可游玩 | `three-match/index.html` + `src/games/three-match/index.js`（ES 模块，无本地依赖） | 构建产出 `dist/three-match/index.html`，引用构建后模块；e2e 多页可达断言通过 | 覆盖 |
| AC-002 8x8 棋盘、初始无三连、点击/拖拽交换相邻方块 | `board.js`、`input3d.js`（点击+拖拽滑动手势）、`config.js:BOARD_SIZE=8` | 运行时：size=8x8、初始 matches=0；`areAdjacent` 仅接受正交邻居；input 单测覆盖 | 覆盖 |
| AC-003 三连及以上消除加分、无效交换回退提示 | `game.js:trySwap`（no-match 拒绝并保持棋盘）+ `hud.toast` | 运行时：无效交换棋盘不变；合法交换 accepted→clear 事件→score>0 | 覆盖 |
| AC-004 消除后下落补位与连锁 | `board.js:collapse` + `PHASE.CLEARING/FALLING` 链路 | 运行时：resolve 循环回到 IDLE、棋盘无空位、`hasPossibleMove=true` | 覆盖 |
| AC-005 无可消除组合自动洗牌并提示 | `game.js:ensurePlayable` + toast 文案 | 运行时：死局 `hasPossibleMove=false` → 洗牌后 `true`、无现成三连、toast=「没有可消除的组合，已自动洗牌」 | 覆盖 |
| AC-006 展示分数与重新开始按钮、无控制台报错 | `three-match/index.html` #score/#restartBtn + `hud.js` | 运行时：score 为 number、start() 重置为 0；e2e 校验页面标记与入口可达 | 覆盖 |

## 4. 制品清单一致性判定

- 声明制品数量：3（release_candidate / test_report / deployment_record）
- 实测制品数量：3，类型、uri、媒体类型、sha256、byte_size 与 stage_result.artifacts 声明全部一致
- 清单缺失/矛盾：未发现
- 审计结论：artifact_hashes_verified 通过，无清单矛盾。

## 5. 构建产物哈希独立复核（不要求，但已实测）

在 `git_commit_sha=cc382f4` 工作区执行 `npm run build` 后实测：

- dist/three-match/index.html = 9b62627c0d88a0555707533b941dd0f55e8df30128d6725c89675ce6c2910099（与 RC/TR 声明一致）
- dist/assets/threeMatch-DoSQ6UAJ.js = ca2d1ded940fcfe3bad1f376d357be2d0d8d37d293c791d257d7e85ec7e9a009（一致）
- dist/assets/threeMatch-i5Vbh66S.css = fff67ee6204fb04ef0c18606fa907cabee81660b94ffa6cf02928190e4f7a8dd（一致）
- dist/index.html = 047a172a09c0ca1393bd09753c5f28facd0856b849abc08f04b87d95aa941207（一致）

## 6. 质量门禁独立复核

- lint: 退出码 0
- typecheck: 退出码 0
- unit_tests: 58 项全部通过（engine 23 / threeMatch 21 / input 6 / ui 4 / storage 4）
- build: 成功，产出 dist/three-match/index.html 与 dist/index.html
- blackbox_tests: 36 项全部通过（含 three-match 页面/资源/多页可达）
- runtime_logic: PASS，AC-001~AC-006 行为经 GameState 直接驱动复验

注：首次运行 `test:e2e` 前工作区无 `dist/`，该批 e2e 因缺构建产物出现 ENOENT/404 失败；执行 `npm run build` 后重跑 36 项全过。此为工作区未预置构建产物所致，非制品缺陷。

## 7. 观察项（不构成不通过）

- OBS-01 RC 正文 git_commit_sha 与实际 RC 不一致：`RELEASE_CANDIDATE.md` 第 9 行登记 `git_commit_sha: 0552d69f...`，而 stage_result.artifacts[release_candidate].git_commit_sha 与仓库/origin/main HEAD 均为 `cc382f4f...`，且仓库中不存在 `0552d69f` 对象。判定：git_commit_sha 的权威字段为 complete_activity 提交的 artifact 记录（cc382f4），与仓库 HEAD 一致；RC 正文该行为文档内残留占位值，属文档瑕疵，不影响制品哈希与清单一致性，记录为观察项。建议后续阶段在文档正文中与实际提交哈希对齐。
- OBS-02 构建产物仅登记哈希未随制品上传：RC/TR 引用的 4 个 dist 产物哈希经独立重建逐字节吻合，但 dist 本身未作为独立 artifact 上传（受 .gitignore 与制品类型口径约束）。记录为观察项，不构成不通过。
- OBS-03 预览可达性受平台会话限制：审计时本地 4173 与平台预览入口均不可达（连接失败），本次审计以文件级/运行时级证据为准（制品哈希、AC 行为、质量门禁），未以实时 HTTP 探测作为通过依据；RC/TR/DR 已登记部署时 HTTP 200 证据，属部署阶段观察项。
- OBS-04 HEAD 与 RC 一致性：本次源码定位使用上下文声明的 release_candidate git_commit_sha=cc382f4，当前工作区 HEAD 与 origin/main 均与该 commit 一致，无差异。

## 8. 最终判定

PASS。三个声明制品（release_candidate / test_report / deployment_record）的 SHA-256 与 byte_size 经独立下载实测与上游 stage_result 声明逐项一致，清单无缺失无矛盾；input_manifest_hash 在契约、stage_result 与制品正文三处一致；在制品 commit cc382f4 工作区复跑质量门禁与运行时 AC 行为全部成立，AC-001~AC-006 均有可验证实现与证据支撑。required_checks 三项全部通过。记录 4 项不影响通过的观察项（其中 OBS-01 RC 正文提交哈希残留值建议后续校正）。
