export const CONFIG = {
  GRID_SIZE: 20,
  INITIAL_SNAKE_LENGTH: 3,
  INITIAL_SPEED: 120,
  MIN_SPEED: 60,
  SPEED_STEP: 8,
  FOODS_PER_LEVEL: 5,
  FOOD_SCORE: 10,
  PLAYER_COUNT: 2,
};

export const SCENES = {
  MENU: 'menu',
  PLAYING: 'playing',
  PAUSED: 'paused',
  GAME_OVER: 'gameOver',
};

export const DIRECTIONS = {
  UP: { x: 0, y: -1 },
  DOWN: { x: 0, y: 1 },
  LEFT: { x: -1, y: 0 },
  RIGHT: { x: 1, y: 0 },
};

export const STORAGE_KEY = 'snake-loop-high-score';

export function isReverse(a, b) {
  return a.x + b.x === 0 && a.y + b.y === 0;
}
