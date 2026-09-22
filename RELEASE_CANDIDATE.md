# Release Candidate

- activity_id: 3fae8744-e47b-4652-881c-512ab34e627c
- stage_run_id: 4c187519-c3bc-480d-8081-c765717002ca
- workflow_id: c88d84d9-6883-4279-b55b-4966054a097e
- input_manifest_sha256: 0789810dd1f4ab0f43f41b743090deb883d59aa274d48338098e6c0e1eb750ea
- parent_baseline_uri: artifact://development-summary.md
- parent_baseline_sha256: 2d60e28e736c7fa1f26457c4e94a5124c171430ca85c4db7b0167678093a233f
- parent_baseline_git: 02265971c07b2eef4abaa862db3b7b24806de11d
- test_report: 本阶段 TEST_REPORT.md 制品哈希由 artifact manifest 登记。
- release_scope: 冻结通过测试的双玩家同屏贪吃蛇演示，确认标题、键盘与屏幕按钮控制、计分、撞墙/自撞/相撞结束、暂停、重新开始和再玩一次闭环。
- quality_gate: 单元测试 37/37、黑盒测试 31/31、lint、typecheck、build 全部通过。
- deployed_artifact: dist/index.html、dist/assets/index-CG_HjHcC.js、dist/assets/index-CdmV6boD.css。
- deployed_artifact_sha256: index.html=e0f7430e4840c7df618c64f9aaed6847276d54efdc844be21ec9dc374c435f14；JS=3fc98947035e08d7f458e4308469b4216fff6ea91828fc4c16bb0f8d16ede1bb；CSS=d89c0723a7589f7a394aa933eeac1af81e6c4f1bc658838a46e4b3dab918091c
- preview_url: http://preview.mcode.side419.cn:30110
- https_preview_status: 平台 HTTPS 入口连接失败，测试报告保留失败证据，部署阶段继续处理预览网关协议配置。
- rollback_handle: git revert to 2c9212a51cb51ea769cc436ce7419749be081d92
- git_commit_sha: 由本阶段 artifact manifest 登记推送后的提交 SHA。
