# 开发阶段部署记录

- activity_id: 2e6ad021-b66b-4795-b3e4-a53d0426d0aa
- stage_run_id: 7bff5502-d439-4b31-a4d4-7e65dc76bcee
- workflow_id: 0f819d33-4d58-4982-bf1a-e3a2e53e03c5
- input_manifest_sha256: d2b76143a2f2dbf6d747c47f4e9aa15f167b02e958ee480224d7079e3bcee6cc
- tested_baseline_sha256: 25661a5034d3b254a9ca719a6e6d38c40131ec7771bbf3cda77ba300e424ba04
- deployment_target: Vite development server
- deployment_bind: 0.0.0.0:8080
- local_health_check: PASS；HTTP 200，正文包含当前 Workflow ID 与项目标题
- preview_url: https://preview.mcode.side419.cn:30035
- preview_health_check: PASS；HTTPS 200，正文包含当前 Workflow ID 与项目标题
- release_candidate_git_commit: 由本阶段 ActivityResult 登记
