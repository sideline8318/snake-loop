export const GAME = {
  DISPLAY_TITLE: '消消乐 · 3D 三消',
  BOARD_SIZE: 8,
  GEM_KINDS: 6,
  BASE_SCORE: 10,
  CASCADE_BONUS: 0.5,
};

export const SCENES = {
  MENU: 'menu',
  PLAYING: 'playing',
  RESOLVING: 'resolving',
};

export const GEM_COLORS = {
  red: 0xff5b6e,
  orange: 0xffa64d,
  yellow: 0xffe066,
  green: 0x66e08a,
  blue: 0x5b8dff,
  purple: 0xb07cff,
};

export const GEM_IDS = ['red', 'orange', 'yellow', 'green', 'blue', 'purple'];

export const HUD = {
  SCORE_ID: 'score',
  BEST_ID: 'bestScore',
  COMBO_ID: 'combo',
  TOAST_ID: 'toast',
  RESTART_ID: 'restartBtn',
  START_ID: 'startBtn',
  OVERLAY_ID: 'menuOverlay',
  CANVAS_ID: 'gameCanvas',
};
