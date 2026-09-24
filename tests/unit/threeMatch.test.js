import { describe, it, expect } from 'vitest';
import { GAME } from '../../src/games/three-match/config.js';
import {
  createBoard,
  cloneBoard,
  findMatches,
  collapse,
  hasPossibleMove,
  shuffleBoard,
  areAdjacent,
  pickSafeKind,
} from '../../src/games/three-match/board.js';
import { GameState, PHASE } from '../../src/games/three-match/game.js';

function boardFrom(rows) {
  return rows.map((row) =>
    row.split(' ').map((v) => (v === 'null' ? null : Number(v)))
  );
}

function matchBoard() {
  return boardFrom([
    '0 3 0 2 3 4 5 1',
    '5 0 3 4 1 2 0 5',
    '2 3 4 5 0 1 2 3',
    '3 4 5 0 1 2 3 4',
    '4 5 0 1 2 3 4 5',
    '5 0 1 2 3 4 5 0',
    '0 1 2 3 4 5 0 1',
    '1 2 3 4 5 0 1 2',
  ]);
}

describe('three-match config', () => {
  it('exposes the shipped constants', () => {
    expect(GAME.BOARD_SIZE).toBe(8);
    expect(GAME.GEM_KINDS).toBe(6);
    expect(GAME.BASE_SCORE).toBe(10);
  });
});

describe('createBoard', () => {
  it('builds an 8x8 board of valid gem kinds', () => {
    const board = createBoard();
    expect(board.length).toBe(8);
    expect(board.every((row) => row.length === 8)).toBe(true);
    expect(board.flat().every((v) => v >= 0 && v < GAME.GEM_KINDS)).toBe(true);
  });

  it('never starts with a ready match', () => {
    for (let i = 0; i < 40; i++) {
      const board = createBoard();
      expect(findMatches(board).cells.length).toBe(0);
    }
  });
});

describe('findMatches', () => {
  it('detects a horizontal run of three', () => {
    const board = boardFrom([
      '0 0 0 1 2 3 4 5',
      '1 2 3 4 5 0 1 2',
      '2 3 4 5 0 1 2 3',
      '3 4 5 0 1 2 3 4',
      '4 5 0 1 2 3 4 5',
      '5 0 1 2 3 4 5 0',
      '0 1 2 3 4 5 0 1',
      '1 2 3 4 5 0 1 2',
    ]);
    const { cells, groups } = findMatches(board);
    expect(groups.some((g) => g.orientation === 'row' && g.cells.length === 3)).toBe(true);
    expect(cells.some((c) => c.row === 0 && c.col === 0)).toBe(true);
  });

  it('detects a vertical run of four', () => {
    const board = boardFrom([
      '0 1 2 3 4 5 0 1',
      '0 2 3 4 5 0 1 2',
      '0 3 4 5 0 1 2 3',
      '0 4 5 0 1 2 3 4',
      '5 5 0 1 2 3 4 5',
      '0 0 1 2 3 4 5 0',
      '1 1 2 3 4 5 0 1',
      '2 2 3 4 5 0 1 2',
    ]);
    const { groups } = findMatches(board);
    expect(groups.some((g) => g.orientation === 'col' && g.cells.length === 4)).toBe(true);
  });

  it('returns nothing on a board with no run of three', () => {
    const board = boardFrom([
      '0 1 0 1 0 1 0 1',
      '1 0 1 0 1 0 1 0',
      '0 1 0 1 0 1 0 1',
      '1 0 1 0 1 0 1 0',
      '0 1 0 1 0 1 0 1',
      '1 0 1 0 1 0 1 0',
      '0 1 0 1 0 1 0 1',
      '1 0 1 0 1 0 1 0',
    ]);
    expect(findMatches(board).cells.length).toBe(0);
  });
});

describe('areAdjacent', () => {
  it('accepts orthogonal neighbours only', () => {
    expect(areAdjacent({ row: 1, col: 1 }, { row: 1, col: 2 })).toBe(true);
    expect(areAdjacent({ row: 1, col: 1 }, { row: 2, col: 1 })).toBe(true);
    expect(areAdjacent({ row: 1, col: 1 }, { row: 1, col: 1 })).toBe(false);
    expect(areAdjacent({ row: 1, col: 1 }, { row: 2, col: 2 })).toBe(false);
    expect(areAdjacent({ row: 1, col: 1 }, { row: 1, col: 3 })).toBe(false);
  });
});

describe('collapse', () => {
  it('drops survivors down and refills every hole from the top', () => {
    const board = boardFrom([
      '1 2',
      'null 4',
      '3 5',
    ]);
    const { falls, spawns } = collapse(board);
    expect(falls).toEqual([{ from: { row: 0, col: 0 }, to: { row: 1, col: 0 } }]);
    expect(spawns.length).toBe(1);
    expect(board.flat().every((v) => v !== null)).toBe(true);
    expect(board[2]).toEqual([3, 5]);
    expect(board[1][1]).toBe(4);
  });

  it('refills the top of a column that was already bottom-packed', () => {
    const board = boardFrom([
      'null null',
      '1 2',
      '3 4',
    ]);
    const { falls, spawns } = collapse(board);
    expect(falls.length).toBe(0);
    expect(spawns.length).toBe(2);
    expect(board.flat().every((v) => v !== null)).toBe(true);
  });
});

describe('hasPossibleMove', () => {
  it('is false on a genuine deadlock board', () => {
    const board = [];
    for (let r = 0; r < 8; r++) {
      board.push([]);
      for (let c = 0; c < 8; c++) board[r].push(((r % 2) * 3 + (c % 2)) % GAME.GEM_KINDS);
    }
    expect(findMatches(board).cells.length).toBe(0);
    expect(hasPossibleMove(board)).toBe(false);
  });

  it('is true when one swap creates a match', () => {
    const board = matchBoard();
    expect(findMatches(board).cells.length).toBe(0);
    expect(hasPossibleMove(board)).toBe(true);
  });
});

describe('shuffleBoard', () => {
  it('produces a board with no immediate match and at least one move', () => {
    const board = [];
    for (let r = 0; r < 8; r++) {
      board.push([]);
      for (let c = 0; c < 8; c++) board[r].push(((r % 2) * 3 + (c % 2)) % GAME.GEM_KINDS);
    }
    expect(findMatches(board).cells.length).toBe(0);
    expect(hasPossibleMove(board)).toBe(false);
    expect(shuffleBoard(board)).toBe(true);
    expect(findMatches(board).cells.length).toBe(0);
    expect(hasPossibleMove(board)).toBe(true);
  });
});

describe('pickSafeKind', () => {
  it('avoids completing a horizontal triple', () => {
    const board = [[0, 0, undefined]];
    const kind = pickSafeKind(board, 0, 2, 6, () => 0);
    expect(kind).not.toBe(0);
  });

  it('avoids completing a vertical triple', () => {
    const board = [[1], [1], [undefined]];
    const kind = pickSafeKind(board, 2, 0, 6, () => 0);
    expect(kind).not.toBe(1);
  });
});

describe('GameState', () => {
  it('starts in the menu with an idle phase', () => {
    const game = new GameState();
    expect(game.scene).toBe('menu');
    expect(game.phase).toBe(PHASE.IDLE);
    expect(game.score).toBe(0);
  });

  it('start() resets score, combo and activates playing', () => {
    const game = new GameState();
    game.score = 99;
    game.start();
    expect(game.scene).toBe('playing');
    expect(game.score).toBe(0);
    expect(game.combo).toBe(0);
    expect(findMatches(game.board).cells.length).toBe(0);
  });

  it('rejects swaps that are not adjacent', () => {
    const game = new GameState();
    game.start();
    const result = game.trySwap({ row: 0, col: 0 }, { row: 3, col: 3 });
    expect(result.accepted).toBe(false);
    expect(result.reason).toBe('not-adjacent');
  });

  it('rejects swaps that create no match and keeps the board', () => {
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 7; col++) {
        const game = new GameState();
        game.start();
        game.board = matchBoard();
        const before = cloneBoard(game.board);
        const result = game.trySwap({ row, col }, { row, col: col + 1 });
        if (result.accepted) continue;
        expect(['not-adjacent', 'no-match']).toContain(result.reason);
        expect(game.board).toEqual(before);
      }
    }
  });

  it('accepts a swap that creates a match and scores after tick', () => {
    const game = new GameState();
    game.start();
    game.board = matchBoard();
    const result = game.trySwap({ row: 0, col: 1 }, { row: 1, col: 1 });
    expect(result.accepted).toBe(true);
    expect(game.phase).toBe(PHASE.SWAPPING);
    const events = game.tick();
    expect(events.some((e) => e.type === 'clear')).toBe(true);
    expect(game.score).toBeGreaterThan(0);
    expect(game.combo).toBe(1);
    expect(game.busy).toBe(true);
  });

  it('runs the full resolve loop back to idle', () => {
    const game = new GameState();
    game.start();
    game.board = matchBoard();
    game.trySwap({ row: 0, col: 1 }, { row: 1, col: 1 });
    let guard = 0;
    while (game.busy && guard < 2000) {
      game.tick();
      guard += 1;
    }
    expect(game.phase).toBe(PHASE.IDLE);
    expect(findMatches(game.board).cells.length).toBe(0);
    expect(hasPossibleMove(game.board)).toBe(true);
  });

  it('only allows interaction while idle and playing', () => {
    const game = new GameState();
    expect(game.canInteract()).toBe(false);
    game.start();
    expect(game.canInteract()).toBe(true);
    game.phase = PHASE.SWAPPING;
    expect(game.canInteract()).toBe(false);
  });
});
