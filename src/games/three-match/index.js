import { GAME } from './config.js';
import { bootstrap } from './main3d.js';

export function initThreeMatch({ canvas, doc = document } = {}) {
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
