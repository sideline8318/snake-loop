# 部署记录

- activity_id: 27acf5c1-7099-45bc-8ce5-ed892c32ca9f
- stage_run_id: c4ac8f55-4dde-402f-91a7-cc108efe0863
- workflow_id: 54d0b24f-1b46-4251-a80f-06574a15f631
- input_manifest_sha256: abe2444bfdb91c342d5107d66a9b119698bb7d7f2fef56d8348c4825de42233c
- tested_baseline_sha256: c9c57acfc59efeb202a4ec609cc406d4017c592522bddfbd07b3345345f8892a
- tested_baseline_git_commit: 175bff1e3604c951afaab608c0dafbd8a060fee8
- deployment_target: Vite production preview
- deployment_port: 4173
- health_check: PASS; HTTPS 200、页面标题、画布、双玩家计分字段和重新开始控件均已验证
- acceptance_url: https://preview.mcode.side419.cn:30042
- rollback_handle: git revert to 175bff1e3604c951afaab608c0dafbd8a060fee8
- build: PASS; npm run build
- lint: PASS; npm run lint
- typecheck: PASS; npm run typecheck
- unit_tests: PASS; 4 files and 37 tests
- blackbox_tests: PASS; 31 tests
- artifact_identity: PASS; HTTPS 预览使用当前构建产物，页面标记与 release candidate 一致
- git_commit_pushed: 由本阶段 artifact manifest 登记推送后的提交 SHA。
