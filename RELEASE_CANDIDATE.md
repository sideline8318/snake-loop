# Release Candidate

- activity_id: 735c327a-577b-4af7-9c65-505e0c8565c8
- stage_run_id: 48b3a25f-2973-4db1-9e6f-a03250151630
- workflow_id: 82cd3989-8762-4d92-9ad5-8f0218ce2863
- input_manifest_sha256: 62fff2383831afd99cf1f10c72e09c56fa89ec1f281763d3c6b130bfcb9360fc
- parent_test_report_sha256: 49367e6b7d49b0bc21c80d8956e2de50376ca9ba248ee96e010d45670d9ba834
- parent_release_candidate_sha256: f2c32c707ed5ee5d55592daeeb6d79123d2603cb3947f3a52fec9e9f55030184
- parent_release_candidate_git: 30635e342591f158f300d0cefc2d41956c9d357c
- test_report: 本阶段 test_report 制品哈希 49367e6b7d49b0bc21c80d8956e2de50376ca9ba248ee96e010d45670d9ba834。
- release_scope: 冻结通过测试的双玩家同屏贪吃蛇演示，确认标题、键盘与屏幕按钮控制、计分、撞墙/自撞/相撞结束、暂停、重新开始和再玩一次闭环。
- quality_gate: 单元测试 37/37、黑盒测试 31/31、lint、typecheck、build 全部通过。
- deployed_artifact: dist/index.html、dist/assets/index-EO9ClrBK.js、dist/assets/index-DT_odxNQ.css。
- deployed_artifact_sha256: index.html=3f2f40fae8c40860e73917be988687228b372d1ddfcba734cd4beba4078cfbd4；JS=475fe2f03fc4a5b3e36ca91b856516c4e8e3522e6188ecb33fee1b769f834a69；CSS=b0795c460398ea7d3120dfa8c3d37f072a384ee3893880a103af0193bbc359c3。
- preview_url: http://preview.mcode.side419.cn:30105
- https_preview_status: 平台 HTTPS 替换入口 TLS 握手失败，待部署阶段处理预览网关协议配置。
- rollback_handle: git revert to 30635e342591f158f300d0cefc2d41956c9d357c
- git_commit_sha: 由本阶段 artifact manifest 登记推送后的提交 SHA。
