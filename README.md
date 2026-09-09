# snake-loop-competition

贪吃蛇竞赛 Web 游戏。零后端纯前端静态应用，由 Vite 构建。

## 玩法

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

## 质量门禁

```bash
npm run lint       # eslint
npm run typecheck  # tsc --noEmit
npm run test       # vitest 单元测试（引擎/输入/存储/UI）
npm run test:e2e   # 黑盒集成 + 静态服务测试（针对 dist/ 真实产物）
```

工作流标记：`snake-loop-competition`（流程 d138728f）。