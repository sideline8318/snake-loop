'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const { DIST, DIST_LEGACY, distAssets, distAssetsFor, sha256 } = require('../blackbox/helpers.cjs');

const BASELINE_RC1_SHA256 = '90d739db3dc6cd7f15cbc9645b870311cec115b437ebc0db6256d033451aaf05';
const BASELINE_RC1_GIT = '48fea910d1e6f4755bcbbef31d8d2584d730eb3b';
const SNAKE_WORKFLOW_ID = '82cd3989-8762-4d92-9ad5-8f0218ce2863';
const THREE_MATCH_WORKFLOW_ID = 'a3d16e35-bd65-41e1-b430-995f7151e2a6';
const RELEASE_WORKFLOW_ID = '86ed0cf8-a021-46c5-9639-81871d2b2463';
const LEGACY_PAGE = 'legacy-snake/index.html';

test('artifact identity: baseline RC1 archive hash was verified against upstream', () => {
  assert.match(BASELINE_RC1_SHA256, /^[0-9a-f]{64}$/);
  assert.match(BASELINE_RC1_GIT, /^[0-9a-f]{40}$/);
});

test('release root dist exists with three-match layout', () => {
  const { html, js, css } = distAssets();
  const jsFile = path.join(DIST, 'assets', js);
  const cssFile = path.join(DIST, 'assets', css);
  assert.ok(fs.statSync(jsFile).size > 5000);
  assert.ok(fs.statSync(cssFile).size > 1000);
  assert.ok(html.length > 2000);
  console.log('[dist] js=' + js + ' css=' + css);
  console.log('[dist] js_sha256=' + sha256(fs.readFileSync(jsFile)));
  console.log('[dist] css_sha256=' + sha256(fs.readFileSync(cssFile)));
});

test('release root markup is the three-match app, free of any other app identity', () => {
  const html = fs.readFileSync(path.join(DIST, 'index.html'), 'utf8');
  assert.match(html, /<title>消消乐 · 3D 三消<\/title>/);
  assert.match(html, /消消乐 · 3D 三消/);
  assert.match(html, new RegExp(THREE_MATCH_WORKFLOW_ID));
  assert.match(html, new RegExp(RELEASE_WORKFLOW_ID));
  assert.doesNotMatch(html, /Web版多用户同屏贪吃蛇大战/);
  assert.doesNotMatch(html, /snake-loop-competition/);
  assert.doesNotMatch(html, new RegExp(SNAKE_WORKFLOW_ID));
  assert.doesNotMatch(html, /postdeploy/);
});

test('release root markup carries the three-match HUD contract ids', () => {
  const html = fs.readFileSync(path.join(DIST, 'index.html'), 'utf8');
  for (const id of ['gameCanvas', 'score', 'bestScore', 'combo', 'toast', 'restartBtn', 'startBtn', 'menuOverlay']) {
    assert.ok(html.includes('id="' + id + '"'), 'dist/index.html missing #' + id);
  }
});

test('release root bundle is valid JS and carries the three-match engine', () => {
  const { jsFiles } = distAssetsFor('index.html');
  const primary = jsFiles.find((f) => !f.startsWith('modulepreload')) || jsFiles[0];
  const buf = fs.readFileSync(path.join(DIST, 'assets', primary));
  const src = buf.toString('utf8');
  assert.match(src, /BOARD_SIZE/);
  assert.match(src, /three-match-best-score/);
  assert.match(src, /没有可消除的组合，已自动洗牌/);
  assert.ok(buf.length > 100000, 'bundle should embed three.js');
  const evaluable = src.replace(/^import[^;]+;/gm, '');
  assert.doesNotThrow(() => new Function(evaluable.replaceAll('</', '<\\/')), 'bundle syntax error');
});

test('legacy snake page is preserved off the release root with its own identity', () => {
  const { html } = distAssetsFor(LEGACY_PAGE);
  assert.match(html, /Web版多用户同屏贪吃蛇大战 · postdeploy 893a5b1f/);
  assert.match(html, new RegExp(SNAKE_WORKFLOW_ID));
  assert.match(html, /<title>Web版多用户同屏贪吃蛇大战 · postdeploy 893a5b1f<\/title>/);
  for (const id of [
    'gameCanvas',
    'score',
    'player1Score',
    'player2Score',
    'level',
    'highScore',
    'pauseBtn',
    'restartBtn',
    'playBtn',
    'playAgainBtn',
    'menuScreen',
    'gameOverModal',
    'recordBadge',
    'finalScore',
    'finalLevel',
    'finalReason',
  ]) {
    assert.ok(html.includes('id="' + id + '"'), LEGACY_PAGE + ' missing #' + id);
  }
  const legacyDir = path.join(DIST_LEGACY);
  assert.ok(fs.existsSync(path.join(legacyDir, 'index.html')), 'legacy-snake/index.html must be built');
});

test('legacy snake bundle is valid JS and contains engine + storage key', () => {
  const { jsFiles } = distAssetsFor(LEGACY_PAGE);
  const primary = jsFiles.find((f) => !f.startsWith('modulepreload')) || jsFiles[0];
  const src = fs.readFileSync(path.join(DIST, 'assets', primary), 'utf8');
  assert.match(src, /"snake-loop-high-score"/);
  assert.match(src, /get isGameOver/);
  assert.match(src, /Canvas 2D 上下文不可用/);
  const evaluable = src.replace(/^import[^;]+;/gm, '');
  assert.doesNotThrow(() => new Function(evaluable.replaceAll('</', '<\\/')), 'bundle syntax error');
});

test('release root is the only index.html at the static service root', () => {
  const rootIndexes = fs
    .readdirSync(DIST, { withFileTypes: true })
    .filter((e) => e.isFile() && e.name === 'index.html');
  assert.equal(rootIndexes.length, 1, 'dist/ must expose exactly one root index.html');
});

test('identity check record', () => {
  const bundle = sha256(fs.readFileSync(path.join(DIST, 'assets', distAssets().js)));
  assert.match(bundle, /^[0-9a-f]{64}$/);
});
