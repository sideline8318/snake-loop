'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const { DIST, distAssets } = require('../blackbox/helpers.cjs');

const SNAPSHOT = path.join(__dirname, 'dist-snapshot', 'engine.shipped.cjs');

function detectInsideSegment(seg) {
  const m = (re, label) => {
    const x = seg.match(re);
    assert.ok(x, 'pattern not found: ' + label);
    return x;
  };
  const cfgMatch = m(/const ([a-zA-Z])=\{GRID_SIZE:20/, 'cfg const');
  const scenesMatch = m(/([a-zA-Z])=\{MENU:"menu",PLAYING:"playing",PAUSED:"paused",GAME_OVER:"gameOver"\}/, 'scenes const');
  const dirsMatch = m(/([a-zA-Z])=\{LEFT:\{x:-1,y:0\},RIGHT:\{x:1,y:0\}\}/, 'dirs const');
  const keyMatch = m(/([a-zA-Z])="snake-loop-high-score"/, 'storage key');
  const revMatch = m(/function ([a-zA-Z])\([a-zA-Z],[a-zA-Z]\)\{return [a-zA-Z]\.x\+[a-zA-Z]\.x===0&&[a-zA-Z]\.y\+[a-zA-Z]\.y===0\}/, 'isReverse fn');
  const engMatch = m(/class ([a-zA-Z])\{constructor\(\)\{this\.gridSize=/, 'engine class');
  return {
    cfgName: cfgMatch[1],
    scenesName: scenesMatch[1],
    dirsName: dirsMatch[1],
    keyName: keyMatch[1],
    revName: revMatch[1],
    engName: engMatch[1],
  };
}

function regenerateSnapshot() {
  fs.mkdirSync(path.dirname(SNAPSHOT), { recursive: true });
  const raw = fs.readFileSync(path.join(DIST, 'assets', distAssets().js), 'utf8');
  const src = raw.replace(/^import[^;]+;/gm, '');

  const cfgIdx = src.lastIndexOf('const ', src.indexOf('GRID_SIZE:20'));
  assert.ok(cfgIdx >= 0, 'cfg segment start not found');
  const endNeedle = /get isGameOver\(\)\{return this\.scene===[a-zA-Z]\.GAME_OVER\}\}/;
  const endMatch = endNeedle.exec(src);
  assert.ok(endMatch, 'engine class end not found');
  const seg = src.slice(cfgIdx, endMatch.index + endMatch[0].length);

  const names = detectInsideSegment(seg);

  const moduleSrc =
    '// Auto-extracted from the built bundle at test time (testing the shipped engine verbatim)\n' +
    seg +
    `\nmodule.exports={cfg:${names.cfgName},scene:${names.scenesName},dirs:${names.dirsName},key:${names.keyName},isReverse:${names.revName},Engine:${names.engName}};\n`;
  fs.writeFileSync(SNAPSHOT, moduleSrc);
}

test.before(() => {
  regenerateSnapshot();
});

test('shipped engine snapshot regenerated from current dist', () => {
  assert.ok(fs.existsSync(SNAPSHOT));
  const text = fs.readFileSync(SNAPSHOT, 'utf8');
  assert.ok(text.includes('get isGameOver'));
  assert.ok(text.includes('module.exports'));
});

function fresh() {
  const { Engine } = require(SNAPSHOT);
  const e = new Engine();
  e.start();
  return e;
}

test('shipped engine matches config constants', () => {
  const { cfg } = require(SNAPSHOT);
  assert.equal(cfg.GRID_SIZE, 20);
  assert.equal(cfg.INITIAL_SPEED, 120);
  assert.equal(cfg.FOODS_PER_LEVEL, 5);
  assert.equal(cfg.FOOD_SCORE, 10);
});

test('shipped engine: start lays snake right at centre; step keeps length moving right', () => {
  const e = fresh();
  assert.equal(e.snake.length, 3);
  assert.deepEqual(e.snake[0], { x: 10, y: 10 });
  assert.equal(e.step(), 'none');
  assert.deepEqual(e.snake[0], { x: 11, y: 10 });
  assert.equal(e.snake.length, 3);
});

test('shipped engine: reverse rejected; turn queued then applied', () => {
  const e = fresh();
  e.setDirection({ x: -1, y: 0 });
  assert.equal(e.pendingDirection, null);
  e.setDirection({ x: 0, y: -1 });
  assert.deepEqual(e.pendingDirection, { x: 0, y: -1 });
  e.step();
  assert.deepEqual(e.snake[0], { x: 10, y: 9 });
});

test('shipped engine: eating grows + scores and levels after 5 foods (speed slows)', () => {
  const e = fresh();
  e.food = { x: 11, y: 10 };
  assert.equal(e.step(), 'ate');
  assert.equal(e.snake.length, 4);
  assert.equal(e.score, 10);
  e.foodEaten = 4;
  e.level = 1;
  e.eatFood();
  assert.equal(e.level, 2);
  assert.equal(e.speed, 112);
});

test('shipped engine: wall and self collision end the game', () => {
  const wall = fresh();
  wall.setDirection({ x: 0, y: -1 });
  let r;
  for (let i = 0; i < 11; i++) r = wall.step();
  assert.equal(r, 'dead');
  assert.equal(wall.isGameOver, true);

  const self = fresh();
  self.pendingDirection = null;
  self.snake = [
    { x: 5, y: 5 },
    { x: 4, y: 5 },
    { x: 3, y: 5 },
  ];
  self.direction = { x: -1, y: 0 };
  assert.equal(self.step(), 'dead');
});

test('shipped engine: food off-body and bounded', () => {
  const e = fresh();
  for (let i = 0; i < 100; i++) {
    const f = e.generateFood();
    assert.ok(f.x >= 0 && f.x < 20 && f.y >= 0 && f.y < 20);
    assert.ok(!e.snake.some((s) => s.x === f.x && s.y === f.y));
  }
});

test('shipped engine: pause/resume/toMenu scene transitions', () => {
  const e = fresh();
  e.pause();
  assert.equal(e.scene, 'paused');
  assert.equal(e.step(), 'not-playing');
  e.resume();
  assert.equal(e.scene, 'playing');
  e.toMenu();
  assert.equal(e.scene, 'menu');
});
