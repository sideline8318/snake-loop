import { CONFIG, SCENES } from './config.js';

const PALETTE = {
  background: '#0f1224',
  grid: 'rgba(102, 126, 234, 0.12)',
  playerOneHead: '#7cf7c5',
  playerOneBody: '#1bbf82',
  playerTwoHead: '#ffcf70',
  playerTwoBody: '#e9873d',
  food: '#ff6b8a',
  text: 'rgba(255, 255, 255, 0.85)',
  overlay: 'rgba(15, 18, 36, 0.72)',
};

export class Renderer {
  constructor(canvas) {
    this.canvas = canvas;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Canvas 2D 上下文不可用');
    this.ctx = ctx;
    this.logicalSize = canvas.width;
    this.cellSize = Math.floor(this.logicalSize / CONFIG.GRID_SIZE);
  }

  scaleForDevicePixelRatio() {
    const dpr = globalThis.devicePixelRatio || 1;
    if (dpr > 1) {
      const size = this.logicalSize;
      this.canvas.width = size * dpr;
      this.canvas.height = size * dpr;
      this.ctx.scale(dpr, dpr);
      this.cellSize = Math.floor(size / CONFIG.GRID_SIZE);
      this.canvas.style.width = '100%';
      this.canvas.style.height = 'auto';
    }
    return dpr;
  }

  draw(game) {
    this.drawGrid();
    this.drawSnake(game.snake, PALETTE.playerOneHead, PALETTE.playerOneBody);
    this.drawSnake(game.rivalSnake, PALETTE.playerTwoHead, PALETTE.playerTwoBody);
    this.drawFood(game.food);
    if (game.scene === SCENES.PAUSED) {
      this.drawOverlay('已暂停');
    } else if (game.scene === SCENES.GAME_OVER) {
      this.drawOverlay(game.winner ? `${game.winner} · ${game.collisionReason}` : '游戏结束');
    }
  }

  drawGrid() {
    const { ctx, cellSize } = this;
    const size = this.logicalSize;
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

  drawSnake(snake, headColor, bodyColor) {
    const { ctx, cellSize } = this;
    snake.forEach((segment, index) => {
      ctx.fillStyle = index === 0 ? headColor : bodyColor;
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
    const { ctx } = this;
    ctx.fillStyle = PALETTE.overlay;
    ctx.fillRect(0, 0, this.logicalSize, this.logicalSize);
    ctx.fillStyle = PALETTE.text;
    ctx.font = 'bold 40px system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, this.logicalSize / 2, this.logicalSize / 2);
  }
}
