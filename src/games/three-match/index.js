import { GAME } from './config.js';
import { bootstrap } from './main3d.js';

document.addEventListener('DOMContentLoaded', () => {
  document.title = GAME.DISPLAY_TITLE;
  const canvas = document.getElementById('gameCanvas');
  if (!canvas) {
    console.error('[three-match] missing #gameCanvas');
    return;
  }
  bootstrap({ canvas });
});
