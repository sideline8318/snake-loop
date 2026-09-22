# 贪吃蛇竞赛 Web 游戏部署记录

- Activity ID: `c3702d7e-b856-4c90-adf2-a19767d08f17`
- StageRun ID: `6a35b9a7-927e-4958-b81b-34ac3f02982e`
- Workflow ID: `6b06ba62-a7bf-471c-90ec-9acd37811162`
- 输入清单 SHA-256: `6b306dc45bc7baeafa0ec41da7fea65e06ffb1e7ba6745fa610e312c1c9aa76c`
- 上游 release candidate SHA-256: `a04c71d00f9cbf1e3b0f6124192b9575f2e8d78424054184c3f8bff668320d02`

## 部署目标

- 服务命令：`npm run dev`
- 监听地址：`0.0.0.0:4173`
- 健康检查：`GET /` 返回 HTTP 200，页面包含 Snake Arena 游戏入口和 Workflow 标记
- 构建命令：`npm run build`

## 验证结果

- `npm test`：通过
- `npm run lint`：通过
- `npm run typecheck`：通过
- `npm run build`：通过
- 本地运行态首页检查：通过
- 平台预览映射：已请求 `http://preview.mcode.side419.cn:30114`；Runner 内 HTTPS 映射连接失败，保留为平台连通性风险

## 回滚句柄

- 稳定回滚提交：`d912e70bc9bf99bb78534771bbceb23b4311e6c1`
- 回滚方式：将部署分支恢复到该提交后重新执行 `npm run build` 与 `npm run dev`
- 部署提交：由本阶段提交后填入当前 release candidate SHA
