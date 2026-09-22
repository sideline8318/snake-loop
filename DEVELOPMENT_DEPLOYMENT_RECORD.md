# 开发阶段部署记录

- activity_id: cada00c7-ea9c-4573-a147-c8ac4b091cb2
- stage_run_id: 7c3a5532-a264-4f19-a5d2-a3cdeb91c181
- workflow_id: c88d84d9-6883-4279-b55b-4966054a097e
- input_manifest_sha256: 0a09bda6408b2e55b5c6c12357e90d2b582bb93de52a48cc83568d6661c9778f
- tested_baseline_sha256: fdf072b6c6508f016457bfa701ce400a842b32ee7c2e898cdaf49ebf9c65d7bd
- deployment_target: Vite development server
- deployment_bind: 0.0.0.0:8080
- local_health_check: PASS；HTTPS 200，正文包含当前 Workflow ID 与项目标题
- preview_url: https://preview.mcode.side419.cn:30094
- preview_health_check: 平台 HTTP 入口返回 200；对应 HTTPS 探测受平台代理 TLS 配置影响，返回 wrong version number
- release_candidate_git_commit: 由本阶段 ActivityResult 登记
