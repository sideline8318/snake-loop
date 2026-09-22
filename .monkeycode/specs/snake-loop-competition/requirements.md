# 需求基线：Web 端多用户同屏贪吃蛇大战 · DeepSeek-V4.1-Flash

## 1. 制品元数据

- artifact_type: requirement_baseline
- activity_id: 2217f0a6-71c1-4957-b0b3-60e9a743e48c
- activity_key: requirement.work.1
- stage: requirement
- stage_run_id: a693d2a6-29d9-489d-96b6-aeeb9c096c24
- workflow_id: b5c7ccc5-94b9-41c9-9b0c-fa4557749d4c
- input_manifest_sha256: bec314d4816b068e424c4204c54502c34119b4179dabcd3c99a1ad8072b59290
- request_intent_sha256: 05ae1266d4ce1151a70d1c758d248ebfb1605871f58f11098402c48a67b44813
- generation: 1
- primary_repo: https://github.com/sideline8318/snake-loop
- project_name: snake-loop-competition
- product_display_title: Web版多用户同屏贪吃蛇大战 · DeepSeek-V4.1-Flash

## 2. 项目目标

交付一个零后端依赖的纯前端 Web 游戏，在同一块棋盘上支持两名玩家同屏对战，玩家可通过键盘方向键与屏幕方向按钮控制蛇的移动，吃到食物计分，撞墙或撞到自身/对方结束，并可重新开始。页面必须以“Web版多用户同屏贪吃蛇大战 · DeepSeek-V4.1-Flash”作为用户可读标题呈现，并为后续产品设计、技术设计、开发、测试、部署、验收六个阶段产出可追溯的真实制品与哈希证据。

## 3. 范围冻结（scope_frozen）

### 3.1 本阶段及后续阶段范围内（In Scope）

- IN-01 单页可玩 Web 游戏，运行于主流桌面浏览器，通过 HTTP(S) 直接访问。
- IN-02 双人同屏对战：玩家 1 与玩家 2 在同一条棋盘上同时操控各自蛇体。
- IN-03 键盘控制：玩家 1 使用方向键，玩家 2 使用 WASD，按键需阻止页面默认滚动。
- IN-04 屏幕按钮控制：为每位玩家提供一组屏幕方向按钮（上/左/下/右），与键盘控制等价可用。
- IN-05 计分：吃到食物即时加分，界面实时展示玩家 1 分数、玩家 2 分数与总分。
- IN-06 结束条件：撞墙、撞到自身、两名玩家蛇体相撞均触发本局结束，并展示结束原因。
- IN-07 重新开始：结束弹层与页头均提供重新开始入口，可重置棋盘与分数再次开局。
- IN-08 用户可读标题：页面 `<title>` 与可见主标题均包含“Web版多用户同屏贪吃蛇大战 · DeepSeek-V4.1-Flash”。
- IN-09 质量门禁：提供 lint、typecheck、单元测试、黑盒集成测试与生产构建脚本。
- IN-10 七阶段可追溯：需求、产品设计、技术设计、开发、测试、部署、验收各阶段产出制品并登记 SHA-256。

### 3.2 明确排除（Out of Scope）

- OUT-01 基于网络的远程联机对战、房间匹配与实时同步（本期仅同屏本地双玩家）。
- OUT-02 用户账号体系、登录注册、云端排行榜与跨设备数据同步。
- OUT-03 移动端原生 App、桌面客户端与 WebSocket 服务端组件。
- OUT-04 付费、道具、皮肤商城等商业化能力。
- OUT-05 游戏内聊天、语音与社交分享功能。

### 3.3 边界与假设

- AS-01 目标运行环境为具备 Canvas 与 ES Module 能力的现代浏览器。
- AS-02 本期“多人”指同一设备同屏两名玩家，该约定在验收材料中需显式声明。
- AS-03 应用为静态产物，部署不依赖后端服务与数据库。

## 4. 验收标准映射（acceptance_criteria_mapped）

### 4.1 上下文清单验收标准

| 验收标准 ID | 描述 | 需求映射 | 验证方式 |
| --- | --- | --- | --- |
| AC-001 | 可玩页面包含用户可读项目标题“Web版多用户同屏贪吃蛇大战 · DeepSeek-V4.1-Flash” | REQ-TITLE-01, REQ-TITLE-02 | 黑盒检查 `<title>` 与可见主标题文本 |
| AC-002 | 键盘方向键和屏幕方向按钮均可控制蛇移动，吃到食物加分，撞墙或撞到自身结束，可重新开始 | REQ-INPUT-01, REQ-INPUT-02, REQ-SCORE-01, REQ-OVER-01, REQ-OVER-02 | 单元测试 + 黑盒集成测试覆盖输入、计分、结束与重开 |
| AC-003 | 需求、产品设计、技术设计、开发、测试、部署、验收七阶段上下文和制品哈希可追溯 | REQ-TRACE-01 | 各阶段制品声明 SHA-256、输入清单哈希与 Activity ID |
| AC-004 | 开发 Task 在 mcdev Runner 运行并提供内部 HTTPS 预览证据 | REQ-PREVIEW-01 | Runner 内启动服务并记录 HTTPS 预览地址与探测结果 |
| AC-005 | 测试、部署、验收引用同一 release candidate 内容哈希 | REQ-RC-01 | 测试、部署、验收三阶段登记同一 release candidate SHA-256 |

### 4.2 需求条目

- REQ-TITLE-01：页面标题（`<title>`）必须包含“Web版多用户同屏贪吃蛇大战 · DeepSeek-V4.1-Flash”字样。
- REQ-TITLE-02：页面可见主标题（`<h1>`）必须展示同一用户可读标题，不含阶段或哈希占位内容。
- REQ-ARENA-01：应用需渲染单一棋盘画布，两名玩家蛇体在同一棋盘内共存。
- REQ-ARENA-02：棋盘中需存在食物，被任一玩家吃到后重新生成且不与蛇体或现有食物重叠。
- REQ-INPUT-01：键盘方向键（↑↓←→）必须能改变玩家 1 的移动方向，且不可反向自杀。
- REQ-INPUT-02：屏幕方向按钮（上/左/下/右）必须能改变对应玩家移动方向，触控与鼠标点击均有效。
- REQ-INPUT-03：方向输入需做队列化处理，同一帧内多次输入不得造成反向移动。
- REQ-INPUT-04：需提供暂停/继续与重新开始的键盘快捷方式（空格暂停、R 重开）。
- REQ-SCORE-01：任一玩家吃到食物时其分数递增，界面实时展示玩家 1 分数、玩家 2 分数与总分。
- REQ-SCORE-02：最高分需本地持久化，并在新纪录时给出提示。
- REQ-OVER-01：撞墙、撞到自身、撞到对方蛇体均需结束本局比赛，并给出明确结束原因。
- REQ-OVER-02：结束后展示结束弹层，并提供“重新开始/再玩一次”入口重置棋盘与分数。
- REQ-PREVIEW-01：开发与部署阶段需在 Runner 内启动 Web 服务并通过请求预览工具获得 HTTPS 地址，记录可访问证据。
- REQ-TRACE-01：七个阶段的制品均须声明 SHA-256、byte_size、artifact_uri、输入清单哈希与 Activity ID，形成可追溯链。
- REQ-RC-01：release candidate 需以上游 release candidate 内容哈希为锚点，测试、部署、验收三阶段引用同一哈希。

### 4.3 需求与验收标准双向覆盖

- AC-001 覆写 REQ-TITLE-01、REQ-TITLE-02；反之二者归属 AC-001。
- AC-002 覆写 REQ-ARENA-01、REQ-ARENA-02、REQ-INPUT-01 至 REQ-INPUT-04、REQ-SCORE-01、REQ-SCORE-02、REQ-OVER-01、REQ-OVER-02；反之以上条目均归属 AC-002。
- AC-003 覆写 REQ-TRACE-01。
- AC-004 覆写 REQ-PREVIEW-01。
- AC-005 覆写 REQ-RC-01。

## 5. 七阶段追溯基线

| 阶段 | 关键阶段 | 本阶段需产出 | 追溯锚点 |
| --- | --- | --- | --- |
| 需求 | requirement | requirement_baseline（本文件） | input_manifest_sha256, activity_id |
| 产品设计 | product_design | 玩法与交互设计说明 | requirement_baseline SHA-256 |
| 技术设计 | tech_design | 架构与模块设计说明 | requirement_baseline SHA-256 |
| 开发 | development | 可运行代码与构建产物 | tech_design SHA-256 |
| 测试 | testing | 测试报告与测试制品 | release candidate SHA-256 |
| 部署 | deployment | 部署记录与预览地址 | release candidate SHA-256 |
| 验收 | acceptance | 验收报告 | deployment artifact SHA-256 |

## 6. 完成定义（Definition of Done）

- DOD-01 本阶段 required_checks（scope_frozen、acceptance_criteria_mapped）均通过并附证据。
- DOD-02 需求基线文档登记 artifact_uri、byte_size 与 SHA-256。
- DOD-03 本文件提交至 primary 仓库并在后续阶段以同一 input_manifest_sha256 引用。