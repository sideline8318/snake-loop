'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const { DIST, distAssetsFor } = require('../blackbox/helpers.cjs');
const { JSDOM } = require('jsdom');

const PAGE = 'three-match/index.html';

// 一个宽松的 WebGL stub：让 three.js 的 WebGLRenderer 能在 jsdom 中完成初始化，
// 从而真正执行三消的 view / input 层代码（棋盘构建、相机投影、事件状态机）。
// 未显式定义的方法统一返回 no-op；字符串常量由 Proxy 兜底。
function createGlStub() {
  const gl = {
    VERSION: 0x1f02,
    SHADING_LANGUAGE_VERSION: 0x8b8c,
    VENDOR: 0x1f00,
    RENDERER: 0x1f01,
    MAX_COMBINED_TEXTURE_IMAGE_UNITS: 0x8b4d,
    MAX_TEXTURE_IMAGE_UNITS: 0x8872,
    MAX_VERTEX_TEXTURE_IMAGE_UNITS: 0x8b4c,
    MAX_TEXTURE_SIZE: 0x0d33,
    MAX_VERTEX_ATTRIBS: 0x8869,
    MAX_VERTEX_UNIFORM_VECTORS: 0x8dfb,
    MAX_VARYING_VECTORS: 0x8dfc,
    MAX_FRAGMENT_UNIFORM_VECTORS: 0x8dfd,
    MAX_CUBE_MAP_TEXTURE_SIZE: 0x851c,
    MAX_VIEWPORT_DIMS: 0x0d3a,
    MAX_RENDERBUFFER_SIZE: 0x84e8,
    MAX_SAMPLES: 0x8d57,
    ACTIVE_UNIFORMS: 0x8b86,
    ACTIVE_ATTRIBUTES: 0x8b89,
    getParameter(pname) {
      if (pname === gl.VERSION) return 'WebGL 1.0 (stub)';
      if (pname === gl.SHADING_LANGUAGE_VERSION) return 'WebGL GLSL ES 1.0 (stub)';
      if (pname === gl.VENDOR || pname === gl.RENDERER) return 'stub';
      if (pname === gl.MAX_VIEWPORT_DIMS) return [16384, 16384];
      if (pname === gl.MAX_COMBINED_TEXTURE_IMAGE_UNITS) return 32;
      return 16384;
    },
    getShaderPrecisionFormat: () => ({ rangeMin: 127, rangeMax: 127, precision: 23 }),
    getExtension: () => null,
    getUniformLocation: () => ({}),
    getAttribLocation: () => 0,
    getProgramParameter: (_program, pname) =>
      pname === gl.ACTIVE_UNIFORMS || pname === gl.ACTIVE_ATTRIBUTES ? 0 : true,
    getShaderParameter: () => true,
    getProgramInfoLog: () => '',
    getShaderInfoLog: () => '',
    getError: () => 0,
  };
  return new Proxy(gl, {
    get(target, prop) {
      if (prop in target) return target[prop];
      if (typeof prop === 'string' && /^[A-Z0-9_]+$/.test(prop)) return 0;
      return () => undefined;
    },
  });
}

function createWindow() {
  const { html } = distAssetsFor(PAGE);
  const dom = new JSDOM(html, {
    url: 'http://127.0.0.1/three-match/',
    runScripts: 'outside-only',
    pretendToBeVisual: true,
  });
  const window = dom.window;
  window.HTMLCanvasElement.prototype.getContext = function getContext(type) {
    return type === 'webgl' || type === 'webgl2' || type === 'experimental-webgl' ? createGlStub() : null;
  };
  const canvas = window.document.getElementById('gameCanvas');
  Object.defineProperty(canvas, 'clientWidth', { value: 640, configurable: true });
  Object.defineProperty(canvas, 'clientHeight', { value: 640, configurable: true });
  canvas.getBoundingClientRect = () => ({ left: 0, top: 0, width: 640, height: 640 });

  const { jsFiles } = distAssetsFor(PAGE);
  const primary = jsFiles.filter((f) => !f.startsWith('modulepreload'))[0] || jsFiles[0];
  const raw = fs.readFileSync(path.join(DIST, 'assets', primary), 'utf8');
  // 冻结渲染循环：只跑初始化，不进入无限 requestAnimationFrame。
  window.requestAnimationFrame = () => 0;
  window.cancelAnimationFrame = () => {};
  window.eval(raw.replace(/^import[^;]+;/gm, '').replaceAll('</', '<\\/'));
  // JSDOM 已处于 loaded 状态，手动派发 DOMContentLoaded 以启动游戏。
  window.document.dispatchEvent(new window.Event('DOMContentLoaded', { bubbles: true }));
  return { window, canvas };
}

const KNOWN_BOARD = [
  [0, 3, 0, 2, 3, 4, 5, 1],
  [5, 0, 3, 4, 1, 2, 0, 5],
  [2, 3, 4, 5, 0, 1, 2, 3],
  [3, 4, 5, 0, 1, 2, 3, 4],
  [4, 5, 0, 1, 2, 3, 4, 5],
  [5, 0, 1, 2, 3, 4, 5, 0],
  [0, 1, 2, 3, 4, 5, 0, 1],
  [1, 2, 3, 4, 5, 0, 1, 2],
];

function prepareGame(api) {
  const game = api.game;
  game.board = KNOWN_BOARD.map((row) => row.slice());
  game.scene = 'playing';
  game.phase = 'idle';
  api.boardView.syncFromBoard(game.board);
  return game;
}

function pointForCell(api, row, col) {
  for (let px = -1600; px <= 2200; px += 2) {
    for (let py = -1600; py <= 2200; py += 2) {
      const cell = api.input.cellFromEvent({ clientX: px, clientY: py });
      if (cell && cell.row === row && cell.col === col) return { x: px, y: py };
    }
  }
  return null;
}

function dispatch(window, canvas, type, x, y) {
  const ev = new window.MouseEvent(type, { clientX: x, clientY: y, bubbles: true, cancelable: true });
  ev.pointerId = 1;
  canvas.dispatchEvent(ev);
}

test('AC-002: two clicks on adjacent gems swap through the real pointer/click event chain', () => {
  const { window, canvas } = createWindow();
  const api = window.__THREE_MATCH__;
  assert.ok(api, 'bundle must expose window.__THREE_MATCH__ runtime hook');
  assert.ok(api.game, 'runtime must expose game state');
  assert.ok(api.boardView, 'runtime must expose board view');

  const game = prepareGame(api);
  const before = JSON.stringify(game.board);
  const pSource = pointForCell(api, 0, 1);
  const pTarget = pointForCell(api, 1, 1);
  assert.ok(pSource, 'must be able to hit cell (0,1) through the camera projection');
  assert.ok(pTarget, 'must be able to hit cell (1,1) through the camera projection');

  dispatch(window, canvas, 'pointerdown', pSource.x, pSource.y);
  dispatch(window, canvas, 'pointerup', pSource.x, pSource.y);
  dispatch(window, canvas, 'click', pSource.x, pSource.y);

  dispatch(window, canvas, 'pointerdown', pTarget.x, pTarget.y);
  dispatch(window, canvas, 'pointerup', pTarget.x, pTarget.y);
  dispatch(window, canvas, 'click', pTarget.x, pTarget.y);

  assert.notEqual(JSON.stringify(game.board), before, 'two adjacent clicks must swap the gems');
  assert.equal(game.phase, 'swapping', 'accepted swap must enter the swapping phase');
  assert.equal(game.swapCount, 1, 'exactly one swap accepted');
});

test('AC-002: dragging from a gem to an adjacent gem swaps as well', () => {
  const { window, canvas } = createWindow();
  const api = window.__THREE_MATCH__;
  const game = prepareGame(api);
  const before = JSON.stringify(game.board);
  const pSource = pointForCell(api, 0, 1);
  const pTarget = pointForCell(api, 1, 1);
  assert.ok(pSource && pTarget);

  dispatch(window, canvas, 'pointerdown', pSource.x, pSource.y);
  dispatch(window, canvas, 'pointermove', pTarget.x, pTarget.y);

  assert.notEqual(JSON.stringify(game.board), before, 'drag beyond threshold must swap the gems');
  assert.equal(game.phase, 'swapping');
});

test('AC-003: a rejected click swap keeps the board and surfaces a toast', () => {
  const { window, canvas } = createWindow();
  const api = window.__THREE_MATCH__;
  const game = prepareGame(api);
  const before = JSON.stringify(game.board);
  const p00 = pointForCell(api, 0, 0);
  const p01 = pointForCell(api, 0, 1);
  // (0,0)<->(0,1) 在已知棋盘上不能形成三连，属于无效交换：棋盘必须回退且给出提示。
  dispatch(window, canvas, 'pointerdown', p00.x, p00.y);
  dispatch(window, canvas, 'pointerup', p00.x, p00.y);
  dispatch(window, canvas, 'click', p00.x, p00.y);
  dispatch(window, canvas, 'pointerdown', p01.x, p01.y);
  dispatch(window, canvas, 'pointerup', p01.x, p01.y);
  dispatch(window, canvas, 'click', p01.x, p01.y);
  assert.equal(game.phase, 'idle', 'invalid swap must not start resolution');
  assert.equal(JSON.stringify(game.board), before, 'rejected swap must keep the board unchanged');
  assert.equal(game.board.length, 8);
  assert.equal(game.board.every((row) => row.length === 8), true);
});

test('bundle exposes the click-swap visual hook and spawn kind after the fix', () => {
  const { jsFiles } = distAssetsFor(PAGE);
  const primary = jsFiles.filter((f) => !f.startsWith('modulepreload'))[0] || jsFiles[0];
  const src = fs.readFileSync(path.join(DIST, 'assets', primary), 'utf8');
  assert.match(src, /__THREE_MATCH__/);
  assert.match(src, /swapVisual/);
});
