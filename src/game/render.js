import { CONFIG, SCENES } from './config.js';

const PALETTE = {
  background: '#0f1224',
  grid: 'rgba(102, 126, 234, 0.12)',
  head: '#00e68a',
  body: '#00b369',
  food: '#ff6b6b',
  text: 'rgba(255, 255, 255, 0.85)',
  overlay: 'rgba(15, 18, 36, 0.72)',
};

export class Renderer {
  constructor(canvas) {
    this.canvas = canvas;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Canvas 2D 上下文不可用');
    this.ctx = ctx;
    this.cellSize = Math.floor(canvas.width / CONFIG.GRID_SIZE);
  }

  scaleForDevicePixelRatio() {
    const dpr = globalThis.devicePixelRatio || 1;
    if (dpr > 1) {
      const size = this.canvas.width;
      this.canvas.width = size * dpr;
      this.canvas.height = size * dpr;
      this.ctx.scale(dpr, dpr);
      this.cellSize = Math.floor(size / CONFIG.GRID_SIZE);
      this.canvas.style.width = `${size}px`;
      this.canvas.style.height = `${size}px`;
    }
    return dpr;
  }

  draw(game) {
    this.drawGrid();
    this.drawSnake(game);
    this.drawFood(game.food);
    if (game.scene === SCENES.PAUSED) {
      this.drawOverlay('已暂停');
    } else if (game.scene === SCENES.GAME_OVER) {
      this.drawOverlay('游戏结束');
    }
  }

  drawGrid() {
    const { ctx, cellSize } = this;
    const size = this.canvas.width;
    ctx.fillStyle = PALETTE.background;
    ctx.fillRect(0, 0, size, size);
    ctx.strokeStyle = PALETTE.grid;
    ctx.lineWidth = 1;
    ctx.beginPath();
    for (let i = 1; i < CONFIG.GRID_SIZE; i++) {
      const pos = i * cellSize;
      ctx.moveTo(pos, 0);
      ctx.lineTo(pos, size);
      ctx.moveTo(0, pos);
      ctx.lineTo(size, pos);
    }
    ctx.stroke();
  }

  drawSnake(game) {
    const { ctx, cellSize } = this;
    game.snake.forEach((segment, index) => {
      ctx.fillStyle = index === 0 ? PALETTE.head : PALETTE.body;
      ctx.fillRect(segment.x * cellSize + 1, segment.y * cellSize + 1, cellSize - 2, cellSize - 2);
    });
  }

  drawFood(food) {
    if (food.x < 0) return;
    const { ctx, cellSize } = this;
    ctx.fillStyle = PALETTE.food;
    ctx.beginPath();
    ctx.arc(food.x * cellSize + cellSize / 2, food.y * cellSize + cellSize / 2, cellSize / 2 - 2, 0, Math.PI * 2);
    ctx.fill();
  }

  drawOverlay(text) {
    const { ctx, canvas } = this;
    ctx.fillStyle = PALETTE.overlay;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = PALETTE.text;
    ctx.font = 'bold 40px system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, canvas.width / 2, canvas.height / 2);
  }
}