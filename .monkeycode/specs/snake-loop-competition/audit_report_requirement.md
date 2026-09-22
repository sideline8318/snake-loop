# 审计报告：需求阶段 · requirement.audit.2

## 1. 审计元数据

- artifact_type: audit_report
- activity_id: 2f56cd43-2db9-47e3-9a97-67eae1d3c1e0
- activity_key: requirement.audit.2
- role: audit
- stage: requirement
- stage_run_id: a693d2a6-29d9-489d-96b6-aeeb9c096c24
- workflow_id: b5c7ccc5-94b9-41c9-9b0c-fa4557749d4c
- input_manifest_sha256: 6da243a6171d93f444673edbd675456ab6870c5c0d4ca6c25fe385d7147950f9
- stage_result_hash: 6da243a6171d93f444673edbd675456ab6870c5c0d4ca6c25fe385d7147950f9
- context_manifest_hash: bec314d4816b068e424c4204c54502c34119b4179dabcd3c99a1ad8072b59290
- audited_activity_run_id: 2217f0a6-71c1-4957-b0b3-60e9a743e48c
- audited_artifact_sha256: 1c5e90d9db9cf9b4c131068e618ce96c276fe9ae772d24956448379c77268526
- audited_git_commit_sha: 3a7f3c024cf71b309a23c62ca63c7f3a7a3d088a
- audit_verdict: PASS

## 2. required_checks 结果

| check | 结果 | 证据 |
| --- | --- | --- |
| input_hash_verified | PASS | stage_result.input_manifest_hash 与输入清单哈希 6da243a6...950f9 一致；context_manifest.manifest_hash 为上游独立的 bec314d4...59290，二者按契约分属扩展哈希与输入清单哈希，映射链闭合。 |
| artifact_hashes_verified | PASS | 下载上游 requirement_baseline 制品实测 sha256=1c5e90d9db9cf9b4c131068e618ce96c276fe9ae772d24956448379c77268526、byte_size=7736，与 stage_result.artifacts 声明完全一致；仓库内同名文件（commit 3a7f3c0）实测同哈希同字节数，三重一致。 |
| quality_policy_evaluated | PASS | 需求基线含范围冻结（IN-01~IN-10 / OUT-01~OUT-05 / AS-01~AS-03）、16 条需求条目、AC-001~AC-005 双向映射表、七阶段追溯基线表与 DoD-01~DOD-03，语义覆盖硬性契约的全部功能点。 |

## 3. 契约目标覆盖核验

| 目标要素 | 承载需求条目 | 判定 |
| --- | --- | --- |
| 方向键控制 | REQ-INPUT-01 | 覆盖 |
| 屏幕按钮控制 | REQ-INPUT-02 | 覆盖 |
| 多人同屏对战 | IN-02、REQ-ARENA-01 | 覆盖 |
| 计分 | REQ-SCORE-01、REQ-SCORE-02 | 覆盖 |
| 撞墙/自撞结束 | REQ-OVER-01 | 覆盖 |
| 重新开始 | REQ-OVER-02 | 覆盖 |
| 用户可读项目标题 | REQ-TITLE-01、REQ-TITLE-02 | 覆盖，product_display_title 与契约标题逐字一致 |

## 4. 验收标准前置评估（AC-001~AC-005）

- AC-001：需求层已由 REQ-TITLE-01/02 定义 `<title>` 与可见主标题的逐字要求，可黑盒验证。前置通过。
- AC-002：需求层已定义输入、计分、结束、重开的需求条目与验证方式（单元测试 + 黑盒集成测试）。前置通过。
- AC-003：REQ-TRACE-01 已要求七阶段制品声明 SHA-256、byte_size、artifact_uri、输入清单哈希与 Activity ID。前置通过。
- AC-004：REQ-PREVIEW-01 已要求 Runner 内启动服务并记录 HTTPS 预览地址与探测结果。前置通过。
- AC-005：REQ-RC-01 已要求测试、部署、验收引用同一 release candidate 哈希，追溯基线表同步锚定。前置通过。

注：以上为需求阶段对 AC 的前置可达性判定；AC 的最终通过与否由对应下游阶段的独立审计依据实际制品哈希判定，本报告不替代下游审计。

## 5. 观察项（不构成不通过）

- OBS-01 输入哈希双轨：stage_result 与本 Activity 契约使用 input_manifest_hash=6da243a6...950f9，而需求基线文档与 context_manifest 使用 manifest_hash=bec314d4...59290。二者均有明确声明且制品 forward 引用 bec314d4...59290 自洽，未发现矛盾链，记录为命名差异观察项，建议后续阶段沿用统一命名避免歧义。
- OBS-02 request_intent_hash 差异：本 Activity 契约 metadata 声明 54193ab9...0af51，需求基线文档登记 05ae1266...44813。二者属不同元数据字段来源，不作为本阶段不通过的判定依据，记录为观察项。
- OBS-03 多人范围口径：AS-02 与 OUT-01 明确本期多人限定为同设备同屏双玩家、排除网络联机，与硬性契约“多用户同屏对战”表述一致，验收材料不得表述为网络联机。
- OBS-04 HEAD 与 RC 一致性：本审计源码定位使用上下文声明的制品 git_commit_sha=3a7f3c0...；当前工作区 HEAD 与该 commit 一致，无差异。

## 6. 制品清单一致性判定

- 声明制品数量：1（requirement_baseline）
- 实测制品数量：1，类型、uri、媒体类型与 sha256/byte_size 声明一致
- 清单缺失/矛盾：未发现
- 审计结论：artifact_hashes_verified 通过，无矛盾。

## 7. 最终判定

PASS。上游需求阶段制品哈希与字节数经独立实测与上游声明及仓库工作区三重一致，清单无缺失无矛盾，需求基线语义完整覆盖硬性契约全部功能点与七阶段追溯要求，required_checks 三项全部通过。观察到 4 项不影响通过的观察项，建议后续阶段在元数据命名与多人范围口径上保持显式声明。