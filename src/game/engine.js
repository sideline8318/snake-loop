import { CONFIG, SCENES, DIRECTIONS, isReverse } from './config.js';

export class Engine {
  constructor() {
    this.gridSize = CONFIG.GRID_SIZE;
    this.scene = SCENES.MENU;
    this.snake = [];
    this.direction = { ...DIRECTIONS.RIGHT };
    this.nextDirection = { ...DIRECTIONS.RIGHT };
    this.food = { x: 0, y: 0 };
    this.score = 0;
    this.level = 1;
    this.foodEaten = 0;
    this.speed = CONFIG.INITIAL_SPEED;
    this.pendingDirection = null;
  }

  start() {
    this.scene = SCENES.PLAYING;
    this.resetState();
  }

  resetState() {
    const { GRID_SIZE, INITIAL_SNAKE_LENGTH } = CONFIG;
    const center = Math.floor(GRID_SIZE / 2);
    this.snake = [];
    for (let i = 0; i < INITIAL_SNAKE_LENGTH; i++) {
      this.snake.push({ x: center - i, y: center });
    }
    this.direction = { ...DIRECTIONS.RIGHT };
    this.nextDirection = { ...DIRECTIONS.RIGHT };
    this.pendingDirection = null;
    this.score = 0;
    this.level = 1;
    this.foodEaten = 0;
    this.speed = CONFIG.INITIAL_SPEED;
    this.food = this.generateFood();
  }

  setDirection(dir) {
    if (this.scene === SCENES.PLAYING) {
      if (this.snake.length > 1 && isReverse(dir, this.direction)) {
        // reverse direction rejected while moving
      } else {
        this.pendingDirection = dir;
      }
    }
  }

  step() {
    if (this.scene !== SCENES.PLAYING) return 'not-playing';
    if (this.pendingDirection) {
      this.direction = this.pendingDirection;
      this.pendingDirection = null;
    }
    const head = this.snake[0];
    const next = { x: head.x + this.direction.x, y: head.y + this.direction.y };
    if (this.isWallCollision(next)) {
      this.scene = SCENES.GAME_OVER;
      return 'dead';
    }
    if (this.isSelfCollision(next)) {
      this.scene = SCENES.GAME_OVER;
      return 'dead';
    }
    this.snake.unshift(next);
    if (next.x === this.food.x && next.y === this.food.y) {
      this.eatFood();
      return 'ate';
    }
    this.snake.pop();
    return 'none';
  }

  eatFood() {
    this.score += this.eatScore();
    this.foodEaten += 1;
    if (this.foodEaten % CONFIG.FOODS_PER_LEVEL === 0) {
      this.level += 1;
      this.speed = Math.max(CONFIG.MIN_SPEED, CONFIG.INITIAL_SPEED - (this.level - 1) * CONFIG.SPEED_STEP);
    }
    this.food = this.generateFood();
  }

  eatScore() {
    return CONFIG.FOOD_SCORE * this.level;
  }

  isWallCollision(cell) {
    return cell.x < 0 || cell.x >= this.gridSize || cell.y < 0 || cell.y >= this.gridSize;
  }

  isSelfCollision(cell) {
    return this.snake.some((segment) => segment.x === cell.x && segment.y === cell.y);
  }

  generateFood() {
    const total = this.gridSize * this.gridSize;
    const occupied = new Set(this.snake.map((s) => s.y * this.gridSize + s.x));
    if (occupied.size >= total) return { x: -1, y: -1 };
    let index = 0;
    do {
      index = Math.floor(Math.random() * total);
    } while (occupied.has(index));
    return { x: index % this.gridSize, y: Math.floor(index / this.gridSize) };
  }

  pause() {
    if (this.scene === SCENES.PLAYING) this.scene = SCENES.PAUSED;
  }

  resume() {
    if (this.scene === SCENES.PAUSED) this.scene = SCENES.PLAYING;
  }

  toMenu() {
    this.scene = SCENES.MENU;
    this.pendingDirection = null;
  }

  get isGameOver() {
    return this.scene === SCENES.GAME_OVER;
  }
}