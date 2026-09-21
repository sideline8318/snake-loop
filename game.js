const WORKFLOW_MARKER = '6b06ba62-a7bf-471c-90ec-9acd37811162';
const GRID_SIZE = 20;
const TICK_MS = 125;
const STORAGE_KEY = 'snake-arena-leaderboard';

const DIRECTIONS = {
  up: { x: 0, y: -1 },
  down: { x: 0, y: 1 },
  left: { x: -1, y: 0 },
  right: { x: 1, y: 0 },
};

const MODE_COPY = {
  solo: { label: '单人冲刺', subtitle: '在无尽竞技场里刷新你的最高分' },
  duo: { label: '双人对决', subtitle: '两条路线，一张地图，先撞墙的人出局' },
  ai: { label: 'AI 挑战', subtitle: '对阵自适应 AI，争夺本局冠军' },
};

const $ = (selector) => document.querySelector(selector);
const clonePoint = (point) => ({ x: point.x, y: point.y });
const samePoint = (a, b) => a.x === b.x && a.y === b.y;

function createSnake(startX, startY, direction = 'right') {
  const vector = DIRECTIONS[direction];
  return [0, 1, 2].map((step) => ({ x: startX - vector.x * step, y: startY - vector.y * step }));
}

function nextHead(snake, direction) {
  const vector = DIRECTIONS[direction];
  return { x: snake[0].x + vector.x, y: snake[0].y + vector.y };
}

function isOutOfBounds(point) {
  return point.x < 0 || point.x >= GRID_SIZE || point.y < 0 || point.y >= GRID_SIZE;
}

function getOpenCells(snake, otherSnake = []) {
  const occupied = new Set([...snake, ...otherSnake].map((point) => `${point.x},${point.y}`));
  const cells = [];
  for (let y = 0; y < GRID_SIZE; y += 1) {
    for (let x = 0; x < GRID_SIZE; x += 1) {
      if (!occupied.has(`${x},${y}`)) cells.push({ x, y });
    }
  }
  return cells;
}

function randomFood(snakes) {
  const allSnakes = Array.isArray(snakes[0]) ? snakes.flat() : snakes;
  const cells = getOpenCells(allSnakes);
  return cells[Math.floor(Math.random() * cells.length)] || { x: 10, y: 10 };
}

function loadLeaderboard() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    return Array.isArray(saved) && saved.length ? saved : defaultLeaderboard();
  } catch {
    return defaultLeaderboard();
  }
}

function defaultLeaderboard() {
  return [
    { name: 'NOVA', score: 980, mode: 'AI 挑战' },
    { name: 'LUNA', score: 760, mode: '单人冲刺' },
    { name: 'KAI', score: 540, mode: '双人对决' },
    { name: 'YOU', score: 420, mode: '单人冲刺' },
  ];
}

function saveLeaderboard(entries) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries.slice(0, 8)));
}

class SnakeArena {
  constructor() {
    this.canvas = $('#gameCanvas');
    this.ctx = this.canvas.getContext('2d');
    this.currentMode = 'solo';
    this.difficulty = 'normal';
    this.status = 'ready';
    this.score = 0;
    this.opponentScore = 0;
    this.level = 1;
    this.combo = 0;
    this.lastTick = 0;
    this.elapsed = 0;
    this.leaderboard = loadLeaderboard();
    this.bindEvents();
    this.reset();
    this.render();
  }

  bindEvents() {
    document.body.dataset.workflow = WORKFLOW_MARKER;
    document.addEventListener('keydown', (event) => this.handleKey(event));
    $('#startBtn').addEventListener('click', () => this.start());
    $('#pauseBtn').addEventListener('click', () => this.togglePause());
    $('#restartBtn').addEventListener('click', () => this.reset());
    $('#playAgainBtn').addEventListener('click', () => this.reset());
    $('#closeModalBtn').addEventListener('click', () => this.closeModal());
    document.querySelectorAll('[data-mode]').forEach((button) => {
      button.addEventListener('click', () => this.setMode(button.dataset.mode));
    });
    document.querySelectorAll('[data-difficulty]').forEach((button) => {
      button.addEventListener('click', () => this.setDifficulty(button.dataset.difficulty));
    });
    document.querySelectorAll('[data-direction]').forEach((button) => {
      button.addEventListener('click', () => this.queueDirection(button.dataset.direction));
    });
    window.addEventListener('resize', () => this.resizeCanvas());
  }

  reset() {
    this.player = { snake: createSnake(5, 10), direction: 'right', nextDirection: 'right', alive: true };
    this.opponent = { snake: createSnake(14, 10, 'left'), direction: 'left', nextDirection: 'left', alive: this.currentMode !== 'solo' };
    this.food = randomFood([this.player.snake, this.opponent.snake]);
    this.score = 0;
    this.opponentScore = 0;
    this.level = 1;
    this.combo = 0;
    this.elapsed = 0;
    this.status = 'ready';
    this.updateHud();
    this.closeModal();
    this.render();
  }

  start() {
    if (this.status === 'gameover') this.reset();
    if (this.status === 'playing') return;
    this.status = 'playing';
    this.lastTick = performance.now();
    requestAnimationFrame((time) => this.loop(time));
    this.updateHud();
  }

  loop(time) {
    if (this.status !== 'playing') return;
    if (time - this.lastTick >= TICK_MS - Math.min(this.level * 4, 35)) {
      this.tick();
      this.lastTick = time;
    }
    this.render();
    requestAnimationFrame((nextTime) => this.loop(nextTime));
  }

  tick() {
    this.elapsed += TICK_MS;
    this.moveSnake(this.player);
    if (this.currentMode !== 'solo') this.moveOpponent();
    this.resolveFood();
    if (!this.player.alive && (this.currentMode === 'solo' || !this.opponent.alive)) this.endGame();
    if (this.currentMode !== 'solo' && !this.player.alive && this.opponent.alive) this.endGame('opponent');
    if (this.currentMode !== 'solo' && this.player.alive && !this.opponent.alive) this.endGame('player');
  }

  moveSnake(contender) {
    if (!contender.alive) return;
    contender.direction = contender.nextDirection;
    const head = nextHead(contender.snake, contender.direction);
    const allBodies = [...this.player.snake, ...(this.currentMode === 'solo' ? [] : this.opponent.snake)];
    const hitBody = allBodies.some((segment, index) => !samePoint(segment, contender.snake[contender.snake.length - 1]) || index < contender.snake.length - 1 ? samePoint(segment, head) : false);
    if (isOutOfBounds(head) || hitBody) {
      contender.alive = false;
      return;
    }
    contender.snake.unshift(head);
    if (!samePoint(head, this.food)) contender.snake.pop();
  }

  moveOpponent() {
    if (!this.opponent.alive) return;
    const choices = Object.keys(DIRECTIONS).filter((name) => !this.isReverse(name, this.opponent.direction));
    const safe = choices.filter((name) => {
      const head = nextHead(this.opponent.snake, name);
      return !isOutOfBounds(head) && !this.player.snake.some((segment) => samePoint(segment, head)) && !this.opponent.snake.some((segment, index) => index > 0 && samePoint(segment, head));
    });
    const target = safe.sort((a, b) => this.distance(nextHead(this.opponent.snake, a), this.food) - this.distance(nextHead(this.opponent.snake, b), this.food))[0];
    this.opponent.nextDirection = target || this.opponent.direction;
  }

  resolveFood() {
    if (this.player.alive && samePoint(this.player.snake[0], this.food)) {
      this.score += 10 * this.level;
      this.combo += 1;
      this.level = Math.floor(this.score / 100) + 1;
      this.food = randomFood([this.player.snake, this.opponent.snake]);
    } else if (this.opponent.alive && samePoint(this.opponent.snake[0], this.food)) {
      this.opponentScore += 10;
      this.food = randomFood([this.player.snake, this.opponent.snake]);
    }
    this.updateHud();
  }

  distance(a, b) {
    return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
  }

  isReverse(next, current) {
    return DIRECTIONS[next].x + DIRECTIONS[current].x === 0 && DIRECTIONS[next].y + DIRECTIONS[current].y === 0;
  }

  queueDirection(direction) {
    if (this.status === 'ready') this.start();
    if (!this.isReverse(direction, this.player.direction)) this.player.nextDirection = direction;
  }

  handleKey(event) {
    const keyMap = { ArrowUp: 'up', w: 'up', ArrowDown: 'down', s: 'down', ArrowLeft: 'left', a: 'left', ArrowRight: 'right', d: 'right' };
    if (keyMap[event.key]) {
      event.preventDefault();
      this.queueDirection(keyMap[event.key]);
    }
    if (event.key === ' ' || event.key === 'p') {
      event.preventDefault();
      this.togglePause();
    }
  }

  togglePause() {
    if (this.status === 'ready' || this.status === 'gameover') return;
    this.status = this.status === 'playing' ? 'paused' : 'playing';
    if (this.status === 'playing') {
      this.lastTick = performance.now();
      requestAnimationFrame((time) => this.loop(time));
    }
    this.updateHud();
    this.render();
  }

  setMode(mode) {
    this.currentMode = mode;
    document.querySelectorAll('[data-mode]').forEach((button) => button.classList.toggle('active', button.dataset.mode === mode));
    $('#modeTitle').textContent = MODE_COPY[mode].label;
    $('#modeSubtitle').textContent = MODE_COPY[mode].subtitle;
    $('#opponentPanel').classList.toggle('hidden', mode === 'solo');
    this.reset();
  }

  setDifficulty(difficulty) {
    this.difficulty = difficulty;
    document.querySelectorAll('[data-difficulty]').forEach((button) => button.classList.toggle('active', button.dataset.difficulty === difficulty));
  }

  endGame(winner = 'player') {
    if (this.status === 'gameover') return;
    this.status = 'gameover';
    const won = winner === 'player' || (winner === 'player' && this.currentMode === 'solo');
    $('#resultKicker').textContent = this.currentMode === 'solo' ? 'RUN COMPLETE' : (won ? 'VICTORY' : 'MATCH OVER');
    $('#resultTitle').textContent = this.currentMode === 'solo' ? '漂亮的一局' : (won ? '你赢下了对决' : '对手拿下本局');
    $('#resultScore').textContent = String(this.score).padStart(3, '0');
    $('#resultMeta').textContent = `${this.level} 级 · ${Math.floor(this.elapsed / 1000)} 秒 · ${MODE_COPY[this.currentMode].label}`;
    this.recordScore();
    $('#resultModal').classList.add('show');
    this.updateHud();
  }

  recordScore() {
    const entry = { name: 'YOU', score: this.score, mode: MODE_COPY[this.currentMode].label };
    this.leaderboard = [...this.leaderboard, entry].sort((a, b) => b.score - a.score).slice(0, 8);
    saveLeaderboard(this.leaderboard);
    this.renderLeaderboard();
  }

  closeModal() { $('#resultModal').classList.remove('show'); }

  updateHud() {
    $('#scoreValue').textContent = String(this.score).padStart(3, '0');
    $('#levelValue').textContent = String(this.level).padStart(2, '0');
    $('#comboValue').textContent = `x${this.combo}`;
    $('#opponentScore').textContent = String(this.opponentScore).padStart(3, '0');
    $('#startBtn').textContent = this.status === 'playing' ? '对局进行中' : '开始对局';
    $('#pauseBtn').textContent = this.status === 'paused' ? '继续' : '暂停';
    $('#statusBadge').textContent = this.status === 'playing' ? 'LIVE' : this.status === 'paused' ? 'PAUSED' : 'READY';
  }

  renderLeaderboard() {
    $('#leaderboard').innerHTML = this.leaderboard.slice(0, 4).map((entry, index) => `<div class="rank-row"><span class="rank-index">0${index + 1}</span><span class="rank-name">${entry.name}</span><span class="rank-mode">${entry.mode}</span><strong>${String(entry.score).padStart(3, '0')}</strong></div>`).join('');
  }

  resizeCanvas() {
    const size = Math.min(this.canvas.parentElement.clientWidth, 620);
    const ratio = window.devicePixelRatio || 1;
    this.canvas.width = size * ratio;
    this.canvas.height = size * ratio;
    this.canvas.style.width = `${size}px`;
    this.canvas.style.height = `${size}px`;
    this.ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    this.render();
  }

  render() {
    const size = this.canvas.clientWidth;
    const cell = size / GRID_SIZE;
    const ctx = this.ctx;
    ctx.clearRect(0, 0, size, size);
    ctx.fillStyle = '#0b1220';
    ctx.fillRect(0, 0, size, size);
    ctx.strokeStyle = 'rgba(153, 180, 205, 0.08)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= GRID_SIZE; i += 1) {
      ctx.beginPath(); ctx.moveTo(i * cell, 0); ctx.lineTo(i * cell, size); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(0, i * cell); ctx.lineTo(size, i * cell); ctx.stroke();
    }
    this.drawFood(ctx, cell);
    this.drawSnake(ctx, this.player.snake, cell, '#d8ff52', '#9bcf37', this.player.alive);
    if (this.currentMode !== 'solo') this.drawSnake(ctx, this.opponent.snake, cell, '#ff7b61', '#c84b4b', this.opponent.alive);
    if (this.status === 'ready' || this.status === 'paused') {
      ctx.fillStyle = 'rgba(11, 18, 32, 0.74)'; ctx.fillRect(0, 0, size, size);
      ctx.fillStyle = '#edf3f7'; ctx.textAlign = 'center'; ctx.font = '700 18px Manrope, sans-serif';
      ctx.fillText(this.status === 'ready' ? '按开始进入竞技场' : '对局已暂停', size / 2, size / 2);
      ctx.fillStyle = '#9bb0bf'; ctx.font = '500 12px Manrope, sans-serif';
      ctx.fillText(this.status === 'ready' ? '方向键 / WASD 控制移动' : '按 P 或暂停按钮继续', size / 2, size / 2 + 26);
    }
  }

  drawFood(ctx, cell) {
    const cx = this.food.x * cell + cell / 2; const cy = this.food.y * cell + cell / 2;
    ctx.fillStyle = 'rgba(255, 123, 97, 0.16)'; ctx.beginPath(); ctx.arc(cx, cy, cell * 0.46, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#ff7b61'; ctx.beginPath(); ctx.arc(cx, cy, cell * 0.22, 0, Math.PI * 2); ctx.fill();
  }

  drawSnake(ctx, snake, cell, headColor, bodyColor, alive) {
    snake.forEach((part, index) => {
      const inset = index === 0 ? 2 : 3;
      ctx.fillStyle = alive ? (index === 0 ? headColor : bodyColor) : 'rgba(155, 176, 191, 0.32)';
      ctx.beginPath(); ctx.roundRect(part.x * cell + inset, part.y * cell + inset, cell - inset * 2, cell - inset * 2, 4); ctx.fill();
      if (index === 0 && alive) { ctx.fillStyle = '#0b1220'; ctx.beginPath(); ctx.arc(part.x * cell + cell * 0.38, part.y * cell + cell * 0.38, 2, 0, Math.PI * 2); ctx.fill(); }
    });
  }
}

if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    const game = new SnakeArena();
    game.renderLeaderboard();
    game.resizeCanvas();
  });
}

export { GRID_SIZE, createSnake, nextHead, isOutOfBounds };
