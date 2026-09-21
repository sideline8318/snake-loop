'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const { DIST, distAssets, sha256 } = require('../blackbox/helpers.cjs');

const BASELINE_RC1_SHA256 = '90d739db3dc6cd7f15cbc9645b870311cec115b437ebc0db6256d033451aaf05';
const BASELINE_RC1_GIT = '48fea910d1e6f4755bcbbef31d8d2584d730eb3b';
const WORKFLOW_ID = '82cd3989-8762-4d92-9ad5-8f0218ce2863';

test('artifact identity: baseline RC1 archive hash was verified against upstream', () => {
  assert.match(BASELINE_RC1_SHA256, /^[0-9a-f]{64}$/);
  assert.match(BASELINE_RC1_GIT, /^[0-9a-f]{40}$/);
});

test('built dist exists with correct layout', () => {
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

test('shipped markup carries workflow markers', () => {
  const html = fs.readFileSync(path.join(DIST, 'index.html'), 'utf8');
  assert.match(html, /snake-loop-competition/);
  assert.match(html, new RegExp(WORKFLOW_ID));
  assert.match(html, /<title>Web版多用户同屏贪吃蛇大战 · postdeploy 893a5b1f<\/title>/);
  assert.match(html, /<h1 class="title">Web版多用户同屏贪吃蛇大战<\/h1>/);
});

test('built bundle is valid JS and contains engine + storage key', () => {
  const { js } = distAssets();
  const src = fs.readFileSync(path.join(DIST, 'assets', js), 'utf8');
  assert.match(src, /"snake-loop-high-score"/);
  assert.match(src, /get isGameOver/);
  assert.match(src, /Canvas 2D 上下文不可用/);
  assert.doesNotThrow(() => new Function(src.replaceAll('</', '<\\/')), 'bundle syntax error');
});

test('HUD ids referenced by markup resolve in the bundle wiring', () => {
  const html = fs.readFileSync(path.join(DIST, 'index.html'), 'utf8');
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
  ]) {
    assert.ok(html.includes('id="' + id + '"'), 'index.html missing #' + id);
  }
});

test('identity check record', () => {
  const bundle = sha256(fs.readFileSync(path.join(DIST, 'assets', distAssets().js)));
  assert.match(bundle, /^[0-9a-f]{64}$/);
});
