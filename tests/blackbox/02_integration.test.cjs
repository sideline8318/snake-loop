'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const {
  createGameWindow,
  createStaticServer,
  lastHeadDraw,
  sleep,
  waitFor,
} = require('../blackbox/helpers.cjs');

let server;
const BASE = 'http://127.0.0.1:8541';

test.before(async () => {
  server = await createStaticServer(8541);
});

test.after(() => {
  if (server) server.close();
});

function press(dom, key) {
  dom.window.document.dispatchEvent(
    new dom.window.KeyboardEvent('keydown', { key, bubbles: true, cancelable: true })
  );
}

function headCell(dom) {
  const canvas = dom.window.document.getElementById('gameCanvas');
  const r = lastHeadDraw(canvas._ctxLog);
  if (!r) return null;
  return { x: (r.x - 1) / 24, y: (r.y - 1) / 24 };
}

function doc(dom) {
  return dom.window.document;
}

test('page loads with all required controls and workflow markers', async () => {
  const dom = await createGameWindow({ base: BASE });
  try {
    const { document } = dom.window;
    for (const id of [
      'gameCanvas',
      'score',
      'level',
      'highScore',
      'pauseBtn',
      'restartBtn',
      'playBtn',
      'playAgainBtn',
      'menuScreen',
      'gameOverModal',
      'recordBadge',
    ]) assert.ok(document.getElementById(id), 'missing #' + id);
    assert.ok(document.getElementById('gameCanvas') instanceof dom.window.HTMLCanvasElement);
    assert.match(document.title, /贪吃蛇竞赛/);
    assert.match(document.querySelector('footer').textContent, /snake-loop-competition/);
    assert.match(
      document
        .querySelector('meta[name="workflow-marker"]')
        .getAttribute('content'),
      /snake-loop-competition/
    );
  } finally {
    dom.window.close();
  }
});

test('menu is the initial screen; HUD defaults 0/1/0', async () => {
  const dom = await createGameWindow({ base: BASE });
  try {
    const d = doc(dom);
    assert.equal(d.getElementById('menuScreen').classList.contains('hidden'), false);
    assert.equal(d.getElementById('gameOverModal').classList.contains('show'), false);
    assert.ok(d.getElementById('recordBadge').classList.contains('hidden'));
    assert.equal(d.getElementById('score').textContent, '0');
    assert.equal(d.getElementById('level').textContent, '1');
    assert.equal(d.getElementById('highScore').textContent, '0');
  } finally {
    dom.window.close();
  }
});

test('start game hides menu and begins loop', async () => {
  const dom = await createGameWindow({ base: BASE });
  try {
    const d = doc(dom);
    d.getElementById('playBtn').click();
    assert.ok(d.getElementById('menuScreen').classList.contains('hidden'));
    const c = await waitFor(() => headCell(dom));
    assert.ok(c && c.y === 10 && c.x >= 10);
    assert.equal(d.getElementById('pauseBtn').textContent, '暂停');
  } finally {
    dom.window.close();
  }
});

test('arrow keys steer (ArrowUp -> head y decreases)', async () => {
  const dom = await createGameWindow({ base: BASE });
  try {
    doc(dom).getElementById('playBtn').click();
    await waitFor(() => headCell(dom));
    const before = headCell(dom);
    press(dom, 'ArrowUp');
    const after = await waitFor(() => {
      const c = headCell(dom);
      return c && c.y < before.y ? c : null;
    });
    assert.ok(after && after.x === before.x && after.y === before.y - 1);
  } finally {
    dom.window.close();
  }
});

test('WASD keys steer correctly [regression: bug A fixed]', async () => {
  const cases = [
    { key: 'w', expect: (before, after) => after.y === before.y - 1 && after.x === before.x },
    { key: 's', expect: (before, after) => after.y === before.y + 1 && after.x === before.x },
  ];
  for (const { key, expect } of cases) {
    const dom = await createGameWindow({ base: BASE });
    try {
      doc(dom).getElementById('playBtn').click();
      await waitFor(() => headCell(dom));
      const before = headCell(dom);
      press(dom, key);
      const after = await waitFor(() => {
        const c = headCell(dom);
        return c && (c.x !== before.x || c.y !== before.y) ? c : null;
      });
      assert.ok(after, "w/s should move the head within a tick");
      const ok = expect(before, after);
      assert.ok(ok, `key ${key} should move head from (${before.x},${before.y}) to (${after.x},${after.y})`);
    } finally {
      dom.window.close();
    }
  }
});

test('a and d steer left and right respectively [regression: bug A fixed]', async () => {
  const dom = await createGameWindow({ base: BASE });
  try {
    const d = doc(dom);
    d.getElementById('playBtn').click();
    await waitFor(() => headCell(dom));
    const before = headCell(dom);
    press(dom, 'd');
    const after = await waitFor(() => {
      const c = headCell(dom);
      return c && c.x > before.x ? c : null;
    });
    assert.ok(after, 'd should move right');
  } finally {
    dom.window.close();
  }
});

test('pause/resume toggles label and freezes movement', async () => {
  const dom = await createGameWindow({ base: BASE });
  try {
    const d = doc(dom);
    d.getElementById('playBtn').click();
    await waitFor(() => headCell(dom));
    d.getElementById('pauseBtn').click();
    assert.equal(d.getElementById('pauseBtn').textContent, '继续');
    await sleep(400);
    const frozen = headCell(dom);
    await sleep(400);
    assert.deepEqual(headCell(dom), frozen, 'no movement while paused');
    d.getElementById('pauseBtn').click();
    assert.equal(d.getElementById('pauseBtn').textContent, '暂停');
  } finally {
    dom.window.close();
  }
});

test('wall collision shows game-over modal with final score; play-again resets [regression: bug B fixed]', async () => {
  const dom = await createGameWindow({ base: BASE });
  try {
    const d = doc(dom);
    d.getElementById('playBtn').click();
    await waitFor(() => headCell(dom));
    press(dom, 'ArrowUp');
    const shown = await waitFor(() => {
      const m = d.getElementById('gameOverModal');
      return m.classList.contains('show') ? m : null;
    });
    assert.ok(shown, 'game-over modal must appear (bug B fix)');
    assert.equal(d.getElementById('finalScore').textContent, '0');
    assert.equal(d.getElementById('finalLevel').textContent, '1');
    assert.ok(d.getElementById('recordBadge').classList.contains('hidden'));
    d.getElementById('playAgainBtn').click();
    assert.ok(!d.getElementById('gameOverModal').classList.contains('show'));
    assert.ok(d.getElementById('menuScreen').classList.contains('hidden'));
    assert.equal(d.getElementById('score').textContent, '0');
  } finally {
    dom.window.close();
  }
});

test('restart button returns to menu', async () => {
  const dom = await createGameWindow({ base: BASE });
  try {
    const d = doc(dom);
    d.getElementById('playBtn').click();
    await waitFor(() => headCell(dom));
    press(dom, 'ArrowUp');
    await waitFor(() => {
      const m = d.getElementById('gameOverModal');
      return m.classList.contains('show') ? m : null;
    });
    d.getElementById('restartBtn').click();
    assert.ok(!d.getElementById('menuScreen').classList.contains('hidden'));
    assert.ok(!d.getElementById('gameOverModal').classList.contains('show'));
    assert.equal(d.getElementById('score').textContent, '0');
  } finally {
    dom.window.close();
  }
});

test('eating raises score/level, records and persists the new high score end-to-end', async () => {
  const foodQueue = [];
  for (let k = 0; k < 20; k++) foodQueue.push((211 + k) / 400);
  const dom = await createGameWindow({ base: BASE, mathRandom: foodQueue });
  try {
    const d = doc(dom);
    d.getElementById('playBtn').click();
    const leveled = await waitFor(() => {
      const lvl = Number(d.getElementById('level').textContent);
      return lvl >= 2 ? lvl : null;
    });
    assert.ok(leveled, 'level should reach 2 after 5 foods');
    const shown = await waitFor(() =>
      d.getElementById('gameOverModal').classList.contains('show')
        ? d.getElementById('gameOverModal')
        : null
    );
    assert.ok(shown, 'game over after reaching the right wall');
    const finalScore = Number(d.getElementById('finalScore').textContent);
    assert.ok(finalScore >= 50, 'final score reflects food eaten (' + finalScore + ')');
    assert.equal(
      Number(dom.window.localStorage.getItem('snake-loop-high-score')),
      finalScore,
      'high score persisted'
    );
    assert.equal(d.getElementById('highScore').textContent, String(finalScore));
    assert.ok(!d.getElementById('recordBadge').classList.contains('hidden'), 'record badge shown');
  } finally {
    dom.window.close();
  }
});

test('pre-existing high score restored on load', async () => {
  const dom = await createGameWindow({ base: BASE, localStorageSeed: { 'snake-loop-high-score': 42 } });
  try {
    assert.equal(doc(dom).getElementById('highScore').textContent, '42');
  } finally {
    dom.window.close();
  }
});

test('space toggles pause and R restarts from keyboard', async () => {
  const dom = await createGameWindow({ base: BASE });
  try {
    const d = doc(dom);
    d.getElementById('playBtn').click();
    await waitFor(() => headCell(dom));
    press(dom, ' ');
    assert.equal(d.getElementById('pauseBtn').textContent, '继续');
    press(dom, ' ');
    assert.equal(d.getElementById('pauseBtn').textContent, '暂停');
    press(dom, 'r');
    assert.ok(!d.getElementById('menuScreen').classList.contains('hidden'));
  } finally {
    dom.window.close();
  }
});