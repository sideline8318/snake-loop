# Release Candidate · 验收阶段（acceptance.work.1 attempt 1）

- Workflow：4685ae3a-d06a-4da9-aee8-63a819398d73
- StageRun：e63b195f-09fd-4734-9569-ef9d5a2eeec2
- ActivityRun：683d51b0-4a7c-44cf-8dbf-029ea754bded
- Activity key：acceptance.work.1
- 输入清单 SHA-256：a1e26f04c12a83c2c37b7089596afb04245fb55ab6fd664147a68c9f206f976e
- 工作分支：loop-20261021-178786
- git_commit_sha：由本阶段 release_candidate artifact 登记的提交 SHA（远程 HEAD 由 1193f3e 前进）
- 上游 release_candidate：705fda1db80611544664c5940a211ed51b0a4ef1c0cf7f6445d5e0ea79103bad（commit 1193f3e3556714f7802d1357d4a83b5e401fce80）
- 上游 deployment_record：47f42ec3272da8bcd9f82cbdf54c0951e1a7625bc1ac0ae0f3c86f6bb129e8f4

## 本阶段变更

- 验收过程中确认验收标准 45312663（结算排名降序 + 再来一局）在部署产物上全部通过，功能无需返工。
- 就地修正发布根 `index.html` 的 workflow 锚点元数据（`workflow-marker-current`）与页脚，
  对齐本次交付 workflow `4685ae3a-d06a-4da9-aee8-63a819398d73` 与 `acceptance.work.1`；
  旧的 `b8c4ef49…` / `development.work.1` / `test.work.1` 标记已清除。
- 重新执行 `npm ci`、`npm run build`，发布产物哈希与部署基线逐字节一致。

## 门禁结果

- lint exit 0；typecheck exit 0；单元测试 77/77；构建后黑盒 52/52。
- 发布产物探针：进食后撞墙 / 平局并列 / 360×640 小屏，排名降序与再来一局复位全部 PASS。

## 回滚

`git revert <release_candidate_git_commit>`；如需回退到部署基线，`git reset --hard 1193f3e3556714f7802d1357d4a83b5e401fce80 && npm ci && npm run build`。
