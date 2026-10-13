# 开发阶段测试报告 · development.work.1

- Workflow：7cc101c5-927c-49c2-affe-230fd2effb6d
- StageRun：a1288fa7-4609-49a1-99da-cdb0185f30c0
- ActivityRun：f8e717fa-a8e1-4afb-a373-87d1363cf730
- 输入清单 SHA-256：8407117980345614b9a4880eb9b4f3a3ef72ed1c043997113e78ccc5b3667bf8
- release_candidate 提交：369b7613c23a35803206c0745fdbe462a1804993

## 门禁结果

- lint：`npm run lint` → exit 0
- typecheck：`npm run typecheck` → exit 0
- unit_tests：`npm run test` → 61 passed / 61
- build：`npm run build`（贪吃蛇）+ `npm run three-match`（三消）→ exit 0
- e2e：`npm run test:e2e` → 50 passed / 50（修复前 41 passed / 9 failed）
- preview_http_200：本地 `http://127.0.0.1:4173/` = 200；外部 `http://preview.mcode.side419.cn:30099/` = 200，含三消 workflow marker

## 覆盖验收标准

- AC-001（一次点击进入正确 Task）：发布根 `/` 与别名 `/three-match/` 均渲染同一三消应用，`<title>消消乐 · 3D 三消</title>`，`startBtn`/`restartBtn` 控件齐备，无贪吃蛇身份残留。
- AC-002（T0 起 60 秒内收敛）：黑盒 06 在真实 pointer/click 事件链上验证一次点击（两次相邻点选）即进入 `swapping`，`swapCount===1`；无效交换回退到 `idle` 并给出 toast。
- AC-003（Stage retry 建立新 Attempt 并保留历史）：本轮为第 5 次 Attempt，历史 Attempt 的失败证据保留在平台上；本 Attempt 以新提交 369b761 推进远程 HEAD。

## 缺陷闭环

原 9 条失败用例（root 身份、HUD 契约 id、服务类型、部署 marker、AC-001/AC-003、AC-006）全部修复并通过。根因是 Vite 多入口产物冲突与三消页脚本引用方式，详见 RELEASE_CANDIDATE.md。
