import { CONFIG, SCENES, DIRECTIONS, isReverse } from './config.js';

export class Engine {
  constructor() {
    this.gridSize = CONFIG.GRID_SIZE;
    this.scene = SCENES.MENU;
    this.snake = [];
    this.rivalSnake = [];
    this.direction = { ...DIRECTIONS.RIGHT };
    this.rivalDirection = { ...DIRECTIONS.LEFT };
    this.nextDirection = { ...DIRECTIONS.RIGHT };
    this.rivalNextDirection = { ...DIRECTIONS.LEFT };
    this.food = { x: 0, y: 0 };
    this.score = 0;
    this.rivalScore = 0;
    this.scores = { player1: 0, player2: 0 };
    this.level = 1;
    this.foodEaten = 0;
    this.speed = CONFIG.INITIAL_SPEED;
    this.pendingDirection = null;
    this.rivalPendingDirection = null;
    this.winner = null;
    this.collisionReason = '';
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
    this.rivalSnake = [];
    for (let i = 0; i < INITIAL_SNAKE_LENGTH; i++) {
      this.rivalSnake.push({ x: center + i, y: center + 5 });
    }
    this.direction = { ...DIRECTIONS.RIGHT };
    this.rivalDirection = { ...DIRECTIONS.LEFT };
    this.nextDirection = { ...DIRECTIONS.RIGHT };
    this.rivalNextDirection = { ...DIRECTIONS.LEFT };
    this.pendingDirection = null;
    this.rivalPendingDirection = null;
    this.score = 0;
    this.rivalScore = 0;
    this.scores = { player1: 0, player2: 0 };
    this.level = 1;
    this.foodEaten = 0;
    this.speed = CONFIG.INITIAL_SPEED;
    this.winner = null;
    this.collisionReason = '';
    this.food = this.generateFood();
  }

  setDirection(dir) {
    this.setPlayerDirection('player1', dir);
  }

  setPlayerDirection(playerId, dir) {
    if (this.scene !== SCENES.PLAYING) return;
    const isPlayerOne = playerId === 'player1';
    const snake = isPlayerOne ? this.snake : this.rivalSnake;
    const direction = isPlayerOne ? this.direction : this.rivalDirection;
    if (snake.length > 1 && isReverse(dir, direction)) return;
    if (isPlayerOne) this.pendingDirection = dir;
    else this.rivalPendingDirection = dir;
  }

  step() {
    if (this.scene !== SCENES.PLAYING) return 'not-playing';
    if (this.pendingDirection) {
      this.direction = this.pendingDirection;
      this.pendingDirection = null;
    }
    if (this.rivalPendingDirection) {
      this.rivalDirection = this.rivalPendingDirection;
      this.rivalPendingDirection = null;
    }
    const nextOne = this.nextHead(this.snake, this.direction);
    const nextTwo = this.nextHead(this.rivalSnake, this.rivalDirection);
    if (this.isWallCollision(nextOne) || this.isWallCollision(nextTwo)) {
      return this.endGame('撞墙');
    }
    if (this.isSelfCollision(nextOne, this.snake) || this.isSelfCollision(nextTwo, this.rivalSnake)) {
      return this.endGame('撞到自己');
    }
    if (this.occupies(nextOne, this.rivalSnake) || this.occupies(nextTwo, this.snake) ||
        (nextOne.x === nextTwo.x && nextOne.y === nextTwo.y)) {
      return this.endGame('蛇身相撞');
    }
    const ateOne = this.sameCell(nextOne, this.food);
    const ateTwo = this.sameCell(nextTwo, this.food);
    this.advance(this.snake, nextOne, ateOne);
    this.advance(this.rivalSnake, nextTwo, ateTwo);
    if (ateOne) this.eatFood('player1');
    else if (ateTwo) this.eatFood('player2');
    return ateOne || ateTwo ? 'ate' : 'none';
  }

  nextHead(snake, direction) {
    const head = snake[0];
    return { x: head.x + direction.x, y: head.y + direction.y };
  }

  advance(snake, next, grows) {
    snake.unshift(next);
    if (!grows) snake.pop();
  }

  endGame(reason) {
    this.scene = SCENES.GAME_OVER;
    this.collisionReason = reason;
    this.winner = this.scores.player1 === this.scores.player2 ? '平局' :
      this.scores.player1 > this.scores.player2 ? '玩家 1 获胜' : '玩家 2 获胜';
    return 'dead';
  }

  eatFood(playerId = 'player1') {
    const points = this.eatScore();
    this.scores[playerId] += points;
    this.score = this.scores.player1 + this.scores.player2;
    this.rivalScore = this.scores.player2;
    this.foodEaten += 1;
    this.totalFoodEaten += 1;
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

  // Self-collision must be evaluated against the snake that is moving. The
  // previous signature hard-coded `this.snake`, so player two's self-collision
  // was tested against player one's body (AC-002 regression found by the
  // deployment audit). Callers pass the body explicitly; default keeps the
  // player-one meaning for any legacy caller.
  isSelfCollision(cell, snake = this.snake) {
    return this.occupies(cell, snake);
  }

  occupies(cell, snake) {
    return snake.some((segment) => this.sameCell(cell, segment));
  }

  sameCell(a, b) {
    return a.x === b.x && a.y === b.y;
  }

  generateFood() {
    const total = this.gridSize * this.gridSize;
    const occupied = new Set([...this.snake, ...this.rivalSnake].map((s) => s.y * this.gridSize + s.x));
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
    this.rivalPendingDirection = null;
  }

  get isGameOver() {
    return this.scene === SCENES.GAME_OVER;
  }
}
