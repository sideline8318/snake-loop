'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');
const { ROOT, DIST, distAssetsFor, sha256 } = require('../blackbox/helpers.cjs');

const PAGE = 'three-match/index.html';

// 通过 node 子进程导入 ESM 源码模块，避免在 blackbox（CJS）中直接 import。
function runEsm(script) {
  const tmp = path.join(ROOT, 'tests', 'blackbox', '.acceptance-tmp.mjs');
  fs.writeFileSync(tmp, script);
  const result = spawnSync(process.execPath, [tmp], { cwd: ROOT, encoding: 'utf8' });
  fs.unlinkSync(tmp);
  if (result.status !== 0) {
    throw new Error('esm probe failed: ' + result.stderr + result.stdout);
  }
  return JSON.parse(result.stdout.trim().split('\n').pop());
}

test('AC-001: page opens directly with no build step and exposes start/restart controls', () => {
  const { html } = distAssetsFor(PAGE);
  assert.match(html, /<button id="restartBtn"/);
  assert.match(html, /<button id="startBtn"/);
  assert.match(html, /id="gameCanvas"/);
  // 入口页面独立可访问，不依赖外部构建命令
  assert.ok(fs.existsSync(path.join(DIST, PAGE)));
});

test('AC-002: deterministic 8x8 board starts without any ready match and provides a move', () => {
  const out = runEsm(`
    import { createBoard, findMatches, hasPossibleMove } from '${ROOT}/src/games/three-match/board.js';
    // 固定随机源：以确定性序列构造棋盘
    const seq = [0.1, 0.4, 0.7, 0.2, 0.9, 0.33, 0.55, 0.88];
    let i = 0;
    const random = () => seq[(i++) % seq.length];
    const results = [];
    for (let n = 0; n < 25; n++) {
      i = 0;
      const board = createBoard(8, 6, random);
      results.push({ rows: board.length, cols: board[0].length, matches: findMatches(board).cells.length, movable: hasPossibleMove(board) });
    }
    console.log(JSON.stringify({ results }));
  `);
  for (const r of out.results) {
    assert.equal(r.rows, 8);
    assert.equal(r.cols, 8);
    assert.equal(r.matches, 0, 'initial board must not contain a ready three-run');
    assert.equal(r.movable, true, 'initial board must contain at least one move');
  }
});

test('AC-003/AC-004: accepted swap clears, cascades, scores and refills back to idle', () => {
  const out = runEsm(`
    import { GameState, PHASE } from '${ROOT}/src/games/three-match/game.js';
    import { findMatches, hasPossibleMove } from '${ROOT}/src/games/three-match/board.js';
    const boardFrom = (rows) => rows.map((row) => row.split(' ').map((v) => (v === 'null' ? null : Number(v))));
    const matchBoard = () => boardFrom([
      '0 3 0 2 3 4 5 1',
      '5 0 3 4 1 2 0 5',
      '2 3 4 5 0 1 2 3',
      '3 4 5 0 1 2 3 4',
      '4 5 0 1 2 3 4 5',
      '5 0 1 2 3 4 5 0',
      '0 1 2 3 4 5 0 1',
      '1 2 3 4 5 0 1 2',
    ]);
    const game = new GameState();
    game.start();
    game.board = matchBoard();
    const rejected = game.trySwap({ row: 0, col: 0 }, { row: 4, col: 4 });
    const noMatch = game.trySwap({ row: 0, col: 0 }, { row: 0, col: 1 });
    const accepted = game.trySwap({ row: 0, col: 1 }, { row: 1, col: 1 });
    const events = [];
    let guard = 0;
    while (game.busy && guard < 5000) {
      const batch = game.tick();
      events.push(...batch.map((e) => e.type));
      guard += 1;
    }
    console.log(JSON.stringify({
      rejected: rejected.accepted,
      noMatchAccepted: noMatch.accepted,
      noMatchReason: noMatch.reason,
      accepted: accepted.accepted,
      score: game.score,
      combo: game.combo,
      matchCount: game.matchCount,
      phase: game.phase,
      residualMatches: findMatches(game.board).cells.length,
      playable: hasPossibleMove(game.board),
      hasClear: events.includes('clear'),
      hasFall: events.includes('fall'),
      hasCascadeClear: events.filter((t) => t === 'clear').length >= 1,
    }));
  `);
  assert.equal(out.rejected, false, 'not-adjacent swap must be rejected');
  assert.equal(out.noMatchAccepted, false, 'swap creating no match must be rejected');
  assert.equal(out.noMatchReason, 'no-match');
  assert.equal(out.accepted, true, 'swap creating a match must be accepted');
  assert.ok(out.score > 0, 'accepted match must add score');
  assert.equal(out.hasClear, true, 'resolution must emit a clear event');
  assert.equal(out.hasFall, true, 'resolution must emit a fall/refill event');
  assert.equal(out.phase, 'idle', 'resolution must settle back to idle');
  assert.equal(out.residualMatches, 0, 'no residual matches after resolution');
  assert.equal(out.playable, true, 'board remains playable after resolution');
});

test('AC-005: deadlock board is detected and shuffled into a playable state', () => {
  const out = runEsm(`
    import { GameState } from '${ROOT}/src/games/three-match/game.js';
    import { findMatches, hasPossibleMove } from '${ROOT}/src/games/three-match/board.js';
    const dead = [];
    for (let r = 0; r < 8; r++) {
      dead.push([]);
      for (let c = 0; c < 8; c++) dead[r].push(((r % 2) * 3 + (c % 2)) % 6);
    }
    const game = new GameState();
    game.start();
    game.board = dead;
    const before = { matches: findMatches(game.board).cells.length, movable: hasPossibleMove(game.board) };
    game.phase = 'falling';
    game.lastEvents = [];
    game.tick();
    console.log(JSON.stringify({
      before,
      afterMatches: findMatches(game.board).cells.length,
      afterMovable: hasPossibleMove(game.board),
      shuffleCount: game.shuffleCount,
      toasts: game.toasts.map((t) => t.text),
      events: game.lastEvents.map((e) => e.type),
    }));
  `);
  assert.equal(out.before.matches, 0);
  assert.equal(out.before.movable, false, 'fixture must be a genuine deadlock');
  assert.equal(out.shuffleCount, 1, 'deadlock must trigger one shuffle');
  assert.equal(out.afterMatches, 0, 'shuffled board must not contain ready matches');
  assert.equal(out.afterMovable, true, 'shuffled board must be playable');
  assert.ok(
    out.toasts.some((t) => t.includes('没有可消除的组合，已自动洗牌')),
    'shuffle must surface the required toast copy'
  );
});

test('AC-006: shipped bundle carries HUD wiring, score persistence key and auto-shuffle copy', () => {
  const { jsFiles } = distAssetsFor(PAGE);
  const primary = jsFiles.find((f) => !f.startsWith('modulepreload')) || jsFiles[0];
  const buf = fs.readFileSync(path.join(DIST, 'assets', primary));
  const src = buf.toString('utf8');
  assert.match(src, /three-match-best-score/);
  assert.match(src, /没有可消除的组合，已自动洗牌/);
  assert.match(src, /只能交换相邻的宝石/);
  assert.match(src, /这样换不能消除哦/);
  assert.match(src, /BOARD_SIZE/);
  console.log('[acceptance] three-match bundle sha256=' + sha256(buf) + ' size=' + buf.length);
});
