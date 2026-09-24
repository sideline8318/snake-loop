import { GAME } from './config.js';

export function createBoard(size = GAME.BOARD_SIZE, kinds = GAME.GEM_KINDS, random = Math.random) {
  const board = [];
  for (let row = 0; row < size; row++) {
    board.push([]);
    for (let col = 0; col < size; col++) {
      board[row].push(pickSafeKind(board, row, col, kinds, random));
    }
  }
  return board;
}

export function pickSafeKind(board, row, col, kinds, random = Math.random) {
  const blocked = new Set();
  const left2 = board[row] && board[row][col - 1];
  const left1 = board[row] && board[row][col - 2];
  if (left1 !== undefined && left1 === left2) blocked.add(left1);
  const up1 = board[row - 1] && board[row - 1][col];
  const up2 = board[row - 2] && board[row - 2][col];
  if (up2 !== undefined && up2 === up1) blocked.add(up1);
  const candidates = [];
  for (let k = 0; k < kinds; k++) {
    if (!blocked.has(k)) candidates.push(k);
  }
  if (candidates.length === 0) return 0;
  return candidates[Math.floor(random() * candidates.length) % candidates.length];
}

export function cloneBoard(board) {
  return board.map((row) => row.slice());
}

export function inBounds(board, row, col) {
  return row >= 0 && row < board.length && col >= 0 && col < board[0].length;
}

export function areAdjacent(a, b) {
  if (!a || !b) return false;
  const dr = Math.abs(a.row - b.row);
  const dc = Math.abs(a.col - b.col);
  return dr + dc === 1;
}

export function swapCells(board, a, b) {
  const tmp = board[a.row][a.col];
  board[a.row][a.col] = board[b.row][b.col];
  board[b.row][b.col] = tmp;
}

export function findMatches(board) {
  const size = board.length;
  const matched = new Set();
  const groups = [];

  for (let row = 0; row < size; row++) {
    let runStart = 0;
    for (let col = 1; col <= size; col++) {
      const same = col < size && board[row][col] !== null && board[row][col] === board[row][runStart];
      if (!same) {
        const length = col - runStart;
        if (board[row][runStart] !== null && length >= 3) {
          const cells = [];
          for (let c = runStart; c < col; c++) {
            cells.push({ row, col: c });
            matched.add(`${row}:${c}`);
          }
          groups.push({ orientation: 'row', cells });
        }
        runStart = col;
      }
    }
  }

  for (let col = 0; col < size; col++) {
    let runStart = 0;
    for (let row = 1; row <= size; row++) {
      const same = row < size && board[row][col] !== null && board[row][col] === board[runStart][col];
      if (!same) {
        const length = row - runStart;
        if (board[runStart][col] !== null && length >= 3) {
          const cells = [];
          for (let r = runStart; r < row; r++) {
            cells.push({ row: r, col });
            matched.add(`${r}:${col}`);
          }
          groups.push({ orientation: 'col', cells });
        }
        runStart = row;
      }
    }
  }

  const cells = [...matched].map((key) => {
    const [row, col] = key.split(':').map(Number);
    return { row, col };
  });
  return { cells, groups };
}

export function collapse(board, kinds = GAME.GEM_KINDS, random = Math.random) {
  const size = board.length;
  const falls = [];
  const spawns = [];
  for (let col = 0; col < size; col++) {
    let writeRow = size - 1;
    for (let row = size - 1; row >= 0; row--) {
      if (board[row][col] !== null) {
        if (writeRow !== row) {
          board[writeRow][col] = board[row][col];
          board[row][col] = null;
          falls.push({ from: { row, col }, to: { row: writeRow, col } });
        }
        writeRow--;
      }
    }
    let spawnOffset = 1;
    for (let row = writeRow; row >= 0; row--) {
      board[row][col] = Math.floor(random() * kinds) % kinds;
      spawns.push({ row, col, offset: spawnOffset++ });
    }
  }
  return { falls, spawns };
}

export function hasPossibleMove(board) {
  const size = board.length;
  const test = cloneBoard(board);
  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      if (col + 1 < size) {
        swapCells(test, { row, col }, { row, col: col + 1 });
        const has = findMatches(test).cells.length > 0;
        swapCells(test, { row, col }, { row, col: col + 1 });
        if (has) return true;
      }
      if (row + 1 < size) {
        swapCells(test, { row, col }, { row: row + 1, col });
        const has = findMatches(test).cells.length > 0;
        swapCells(test, { row, col }, { row: row + 1, col });
        if (has) return true;
      }
    }
  }
  return false;
}

export function shuffleBoard(board, kinds = GAME.GEM_KINDS, random = Math.random) {
  const size = board.length;
  const flat = [];
  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) flat.push(board[row][col]);
  }
  for (let attempt = 0; attempt < 200; attempt++) {
    for (let i = flat.length - 1; i > 0; i--) {
      const j = Math.floor(random() * (i + 1));
      const tmp = flat[i];
      flat[i] = flat[j];
      flat[j] = tmp;
    }
    let index = 0;
    for (let row = 0; row < size; row++) {
      for (let col = 0; col < size; col++) board[row][col] = flat[index++];
    }
    if (findMatches(board).cells.length === 0 && hasPossibleMove(board)) {
      return true;
    }
  }
  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      board[row][col] = pickSafeKind(board, row, col, kinds, random);
    }
  }
  if (!hasPossibleMove(board)) {
    for (let row = 0; row < size; row++) {
      for (let col = 0; col < size; col++) {
        board[row][col] = (row + col) % kinds;
      }
    }
  }
  return true;
}

export function scoreFor(groups, cascade = 0) {
  let cells = 0;
  for (const group of groups) cells += group.cells.length;
  const base = Math.round(cells * GAME.BASE_SCORE * (1 + cascade * GAME.CASCADE_BONUS));
  return base;
}
