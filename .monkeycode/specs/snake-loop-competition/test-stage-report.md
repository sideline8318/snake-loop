# 测试阶段报告

## 制品元数据

- artifact_type: test_report
- activity_id: cfbb5ba8-975f-4dfd-a66d-b20d427877f8
- activity_key: test.work.1
- stage: test
- stage_run_id: 62c92474-d9a2-43d4-8bee-6639d779e003
- workflow_id: 4685ae3a-d06a-4da9-aee8-63a819398d73
- input_manifest_sha256: 0b77b8d2ebaa44a7219507fd3c9e5141a8017df45e268d1e090098b10c8f5880
- upstream_release_candidate_sha256: 620e0649f3fdc9872d8988c8a132b04f152b2fbe4b353d2fff0fc0fdfea6fc40
- upstream_git_commit_sha: a9df1824eb669c75aa6766a2eead3f7bf9409529
- result: PASS

## 验收标准验证

验收标准 `45312663-f315-44a4-a6de-3f5e7c7dc022` 已通过自动化验证：

- 结算排名按得分降序展示。
- 平分玩家使用竞赛排名，并通过 `data-tied` 与 `aria-label` 标识并列状态。
- 结算弹层提供“再来一局”入口，触发后重置游戏状态。

## 质量门禁

| 检查 | 结果 | 证据 |
| --- | --- | --- |
| lint | PASS | `npm run lint` 退出码 0 |
| typecheck | PASS | `npm run typecheck` 退出码 0 |
| unit_tests | PASS | 6 个测试文件、77 条测试全部通过 |
| build | PASS | Vite 主应用与 three-match 应用生产构建成功 |
| blackbox_tests | PASS | 52 条黑盒测试全部通过 |

## 身份核验

- 当前测试基线 HEAD 与上游 release candidate 的 Git 版本一致，均为 `a9df1824eb669c75aa6766a2eead3f7bf9409529`。
- 冻结上下文声明的上游 release candidate SHA-256 为 `620e0649f3fdc9872d8988c8a132b04f152b2fbe4b353d2fff0fc0fdfea6fc40`。
- `loop.verify_artifact` 对上下文资产 URI 返回 `invalid loop input`；本报告使用冻结上下文、Git HEAD 与构建产物测试完成交叉核验，并保留该工具结果作为观察项。

## 观察项

- 首次执行门禁时项目缺少 `node_modules`，`eslint` 无法启动。按环境规则全局安装 `package.json` 锁定版本的开发依赖并链接后，完整门禁复跑通过。
- 360x640 小屏弹层的真实浏览器目视验证保留给后续验收阶段；当前自动化已覆盖排名 DOM、可访问性属性与响应式 CSS 构建。
