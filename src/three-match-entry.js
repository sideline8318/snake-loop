import { GAME } from './games/three-match/config.js';
import { bootstrap, PHASE } from './games/three-match/main3d.js';

// 发布根入口：初始化 3D 三消并把运行时句柄挂到 globalThis.__THREE_MATCH__，
// 供黑盒测试与调试脚本读取游戏状态、棋盘视图与输入层。
export function initThreeMatch({ canvas, doc = globalThis.document } = {}) {
  doc.title = GAME.DISPLAY_TITLE;
  const target = canvas || doc.getElementById('gameCanvas');
  if (!target) {
    console.error('[three-match] missing #gameCanvas');
    return null;
  }
  return bootstrap({ canvas: target, doc });
}

if (typeof document !== 'undefined' && document.addEventListener) {
  document.addEventListener('DOMContentLoaded', () => {
    initThreeMatch({ doc: document });
  });
}

export { PHASE };
