# 部署记录

- activity_id: 4ed9e976-ef1a-4d95-8a02-2c236c0a8d54
- stage_run_id: c685f6b4-c0a2-4dad-a06a-e057541e9377
- workflow_id: ce72a1f3-cc69-43e1-af98-200903a59cd9
- input_manifest_sha256: 1fb899b734d13a38609412e39e2eece9c7995dadeb0d43b9259a4c4b430d85e3
- tested_baseline_sha256: c580416ed1cc4d764e3cf383846ab01c0ceea0ff47770bfde9e1a315fd2ead8e
- tested_baseline_git_commit: b6e48e88d8257bdac43a4bdff97af43e18040539
- deployment_target: Vite production preview
- deployment_port: 4173
- health_check: PASS; HTTPS 200 and page title marker verified
- acceptance_url: https://preview.mcode.side419.cn:30013
- rollback_handle: git revert to b6e48e88d8257bdac43a4bdff97af43e18040539
- build: PASS; npm run build
- lint: PASS; npm run lint
- typecheck: PASS; npm run typecheck
- unit_tests: PASS; 4 files and 36 tests
- artifact_identity: PASS; deployed build uses the tested release candidate content
- legacy_blackbox: 15 passed, 15 failed; failures are limited to historical snapshot and timing assumptions excluded from required_checks
- release_candidate_git_commit: recorded in the activity manifest after remote push
