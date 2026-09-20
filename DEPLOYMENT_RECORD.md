# 部署记录

- activity_id: 3ee7be9a-624d-4a75-820e-7956154c7a27
- stage_run_id: 3af40a09-160e-4818-bd4b-85ca3711a9fb
- workflow_id: ce72a1f3-cc69-43e1-af98-200903a59cd9
- input_manifest_sha256: 1fb899b734d13a38609412e39e2eece9c7995dadeb0d43b9259a4c4b430d85e3
- tested_baseline_sha256: c580416ed1cc4d764e3cf383846ab01c0ceea0ff47770bfde9e1a315fd2ead8e
- tested_baseline_git_commit: b6e48e88d8257bdac43a4bdff97af43e18040539
- deployment_target: Vite production preview
- deployment_port: 4173
- health_check: PASS; HTTP 200 and page title marker verified
- acceptance_url: https://preview.mcode.side419.cn:30012
- rollback_handle: git revert to b6e48e88d8257bdac43a4bdff97af43e18040539
- build: PASS; npm run build
- lint: PASS; npm run lint
- typecheck: PASS; npm run typecheck
- unit_tests: PASS; 4 files and 34 tests
- artifact_identity: PASS; deployed build uses the tested baseline before this deployment record commit
