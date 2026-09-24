import { GAME, SCENES } from './config.js';
import {
  createBoard,
  cloneBoard,
  findMatches,
  collapse,
  hasPossibleMove,
  shuffleBoard,
  areAdjacent,
  swapCells,
  pickSafeKind,
} from './board.js';

export const PHASE = {
  IDLE: 'idle',
  SWAPPING: 'swapping',
  CLEARING: 'clearing',
  FALLING: 'falling',
  SHUFFLING: 'shuffling',
};

export class GameState {
  constructor({ random = Math.random, size = GAME.BOARD_SIZE, kinds = GAME.GEM_KINDS } = {}) {
    this.random = random;
    this.size = size;
    this.kinds = kinds;
    this.board = createBoard(size, kinds, random);
    this.score = 0;
    this.best = 0;
    this.combo = 0;
    this.scene = SCENES.MENU;
    this.phase = PHASE.IDLE;
    this.pendingAction = null;
    this.toasts = [];
    this.lastEvents = [];
    this.swapCount = 0;
    this.shuffleCount = 0;
    this.matchCount = 0;
  }

  start() {
    this.board = createBoard(this.size, this.kinds, this.random);
    this.score = 0;
    this.combo = 0;
    this.scene = SCENES.PLAYING;
    this.phase = PHASE.IDLE;
    this.pendingAction = null;
    this.swapCount = 0;
    this.shuffleCount = 0;
    this.matchCount = 0;
    this.lastEvents = [];
    if (!hasPossibleMove(this.board)) this.ensurePlayable(true);
    return this.lastEvents;
  }

  canInteract() {
    return this.scene === SCENES.PLAYING && this.phase === PHASE.IDLE;
  }

  trySwap(from, to) {
    if (!this.canInteract()) {
      return { accepted: false, reason: 'busy' };
    }
    if (!areAdjacent(from, to)) {
      return { accepted: false, reason: 'not-adjacent' };
    }
    const board = cloneBoard(this.board);
    swapCells(board, from, to);
    const matches = findMatches(board);
    if (matches.cells.length === 0) {
      return { accepted: false, reason: 'no-match' };
    }
    this.swapCount += 1;
    this.board = board;
    this.phase = PHASE.SWAPPING;
    this.pendingAction = { type: 'swap', from, to, matches };
    return { accepted: true, from, to, matches };
  }

  step() {
    return this.tick();
  }

  tick() {
    this.lastEvents = [];
    if (this.phase === PHASE.SWAPPING) {
      const matches = findMatches(this.board);
      this.matchCount += 1;
      this.combo += 1;
      this.score += scoreOf(matches.groups, this.combo - 1);
      const cleared = applyClears(this.board, matches.cells);
      this.phase = PHASE.CLEARING;
      this.lastEvents.push({
        type: 'clear',
        cells: matches.cells,
        groups: matches.groups,
        combo: this.combo,
        score: this.score,
      });
      this.pendingAction = { type: 'clearing', cleared };
      return this.lastEvents;
    }

    if (this.phase === PHASE.CLEARING) {
      const result = collapse(this.board, this.kinds, this.random);
      this.phase = PHASE.FALLING;
      this.lastEvents.push({ type: 'fall', falls: result.falls, spawns: result.spawns });
      this.pendingAction = { type: 'falling' };
      return this.lastEvents;
    }

    if (this.phase === PHASE.FALLING) {
      const matches = findMatches(this.board);
      if (matches.cells.length > 0) {
        this.matchCount += 1;
        this.combo += 1;
        this.score += scoreOf(matches.groups, this.combo - 1);
        const cleared = applyClears(this.board, matches.cells);
        this.phase = PHASE.CLEARING;
        this.lastEvents.push({
          type: 'clear',
          cells: matches.cells,
          groups: matches.groups,
          combo: this.combo,
          score: this.score,
        });
        this.pendingAction = { type: 'clearing', cleared };
      } else {
        this.combo = 0;
        this.phase = PHASE.IDLE;
        this.pendingAction = null;
        if (!hasPossibleMove(this.board)) {
          this.ensurePlayable(false);
        }
      }
      return this.lastEvents;
    }

    if (this.phase === PHASE.SHUFFLING) {
      this.phase = PHASE.IDLE;
      this.pendingAction = null;
      return this.lastEvents;
    }

    return this.lastEvents;
  }

  ensurePlayable(silent) {
    shuffleBoard(this.board, this.kinds, this.random);
    this.shuffleCount += 1;
    const toast = { type: 'shuffle', text: '没有可消除的组合，已自动洗牌' };
    this.toasts.push(toast);
    if (!silent) this.lastEvents.push(toast);
    return toast;
  }

  get busy() {
    return this.phase !== PHASE.IDLE;
  }

  toMenu() {
    this.scene = SCENES.MENU;
    this.phase = PHASE.IDLE;
    this.pendingAction = null;
    this.combo = 0;
  }
}

function scoreOf(groups, cascade) {
  let cells = 0;
  for (const group of groups) cells += group.cells.length;
  return Math.round(cells * GAME.BASE_SCORE * (1 + cascade * GAME.CASCADE_BONUS));
}

function applyClears(board, cells) {
  const cleared = [];
  for (const cell of cells) {
    cleared.push({ row: cell.row, col: cell.col, kind: board[cell.row][cell.col] });
    board[cell.row][cell.col] = null;
  }
  return cleared;
}

export { pickSafeKind };
