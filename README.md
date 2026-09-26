# snake-loop-competition

零后端纯前端静态应用，由 Vite 构建。发布根 `/` 呈现「消消乐 · 3D 三消」，
历史贪吃蛇项目保留于非根路径 `/legacy-snake/`。

## 消消乐 · 3D 三消（three-match）

三消小游戏是当前发布入口，直接以发布链接根路径 `/` 打开即开始游玩，
兼容别名 `/three-match/`，使用 three.js 渲染 3D 棋盘。

- 8x8 棋盘、6 种宝石，初始保证无可消除组合
- 点击或拖拽交换相邻宝石，凑成三个及以上同色连线即消除得分
- 消除后上方宝石下落补位，支持连锁（combo）加分
- 棋盘无可消除组合时自动洗牌并提示
- 无效交换自动回退并提示；最高分本地持久化

源码位于 `src/games/three-match/`，发布根 HTML 为 `index.html`，兼容别名页面为 `three-match/index.html`。

## 玩法（贪吃蛇，`/legacy-snake/`）

用方向键 / WASD 控制蛇移动，吃食物得分，撞墙或撞自己结束。

- 空格暂停，R 重新开始
- 每吃 5 个食物升一级，蛇速加快，分数递增
- 最高分本地持久化（localStorage）

## 开发

```bash
npm install
npm run dev        # 本地开发
npm run build      # 生产构建到 dist/
npm run preview    # 预览构建产物（0.0.0.0:4173）
```

多页面构建产物：`dist/index.html`（三消，发布根唯一入口）、
`dist/three-match/index.html`（三消兼容别名）与 `dist/legacy-snake/index.html`（贪吃蛇，非根）。

发布入口说明：在线发布链接根路径 `/` 直接呈现「消消乐 · 3D 三消」，
贪吃蛇页面已迁至源码 `legacy-snake/index.html`，不再占据发布根默认文档。

## 质量门禁

```bash
npm run lint       # eslint
npm run typecheck  # tsc --noEmit
npm run test       # vitest 单元测试（引擎/输入/存储/UI/三消）
npm run test:e2e   # 黑盒集成 + 静态服务测试（针对 dist/ 真实产物）
```

用户可读项目标题（贪吃蛇）：`Web版多用户同屏贪吃蛇大战 · postdeploy 893a5b1f`
用户可读项目标题（三消）：`消消乐 · 3D 三消`

工作流标记（三消，发布根）：`消消乐 · 3D 三消`；Workflow：`a3d16e35-bd65-41e1-b430-995f7151e2a6`。
工作流标记（贪吃蛇，`/legacy-snake/`）：`Web版多用户同屏贪吃蛇大战 · postdeploy 893a5b1f`；Workflow：`82cd3989-8762-4d92-9ad5-8f0218ce2863`。
