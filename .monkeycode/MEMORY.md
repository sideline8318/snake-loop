# 用户指令记忆

本文件记录项目协作中需要长期遵循的执行方式。

## 条目

### Loop 阶段交付规则
- Date: 2026-09-22
- Context: Web版多用户同屏贪吃蛇大战开发阶段
- Category: 工作流协作
- Instructions:
  - 每个 ActivityAttempt 结束前执行契约要求的检查，并通过 loop.complete_activity 提交带 SHA-256、byte_size、artifact_uri 的结构化产物。
  - Web 预览使用监听 0.0.0.0 的持久进程，先验证本地 HTTP 200 和 Workflow marker，再验证 request_preview 返回的 HTTPS 地址。
  - 写仓库阶段必须创建新提交并推送到执行分支，release_candidate 记录远程 HEAD 的提交 SHA。
