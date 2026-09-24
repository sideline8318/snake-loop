'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const http = require('http');
const { DIST, createStaticServer, distAssetsFor, sha256 } = require('../blackbox/helpers.cjs');

const PORT = 8543;
const BASE = 'http://127.0.0.1:' + PORT;
const PAGE = 'three-match/index.html';

let server;

test.before(async () => {
  server = await createStaticServer(PORT);
});

test.after(() => {
  if (server) server.close();
});

function get(rel) {
  return new Promise((resolve, reject) => {
    http
      .get(BASE + rel, (res) => {
        const chunks = [];
        res.on('data', (c) => chunks.push(c));
        res.on('end', () =>
          resolve({ status: res.statusCode, type: res.headers['content-type'], body: Buffer.concat(chunks) })
        );
      })
      .on('error', reject);
  });
}

test('three-match page is built to dist with the required controls', () => {
  const { html } = distAssetsFor(PAGE);
  for (const id of ['gameCanvas', 'score', 'bestScore', 'combo', 'toast', 'restartBtn', 'startBtn', 'menuOverlay']) {
    assert.ok(html.includes('id="' + id + '"'), PAGE + ' missing #' + id);
  }
  assert.match(html, /<title>消消乐 · 3D 三消<\/title>/);
  assert.match(html, /消消乐 · 3D 三消/);
  assert.match(html, /a3d16e35-bd65-41e1-b430-995f7151e2a6/);
  assert.match(html, /type="module"/);
});

test('three-match HTML references resolvable built assets', () => {
  const { jsFiles, css } = distAssetsFor(PAGE);
  assert.ok(jsFiles.length >= 1, 'expected at least one JS asset');
  assert.ok(css, 'expected a CSS asset');
  const primary = jsFiles.find((f) => !f.startsWith('modulepreload')) || jsFiles[0];
  for (const file of [primary, css]) {
    const full = path.join(DIST, 'assets', file);
    assert.ok(fs.existsSync(full), 'missing built asset ' + file);
    assert.ok(fs.statSync(full).size > 0);
  }
});

test('shipped three-match bundle carries the engine and three.js identifiers', () => {
  const { jsFiles } = distAssetsFor(PAGE);
  const primary = jsFiles.find((f) => !f.startsWith('modulepreload')) || jsFiles[0];
  const src = fs.readFileSync(path.join(DIST, 'assets', primary), 'utf8');
  assert.match(src, /BOARD_SIZE/);
  assert.match(src, /没有可消除的组合，已自动洗牌/);
  assert.match(src, /three-match-best-score/);
  assert.ok(src.length > 100000, 'bundle should embed three.js');
  const evaluable = src.replace(/^import[^;]+;/gm, '');
  assert.doesNotThrow(() => new Function(evaluable.replaceAll('</', '<\\/')), 'bundle syntax error');
  console.log('[three-match] js=' + primary + ' sha256=' + sha256(fs.readFileSync(path.join(DIST, 'assets', primary))));
});

test('serves the three-match page and its assets over HTTP', async () => {
  const res = await get('/three-match/');
  assert.equal(res.status, 200);
  assert.match(res.type, /text\/html/);
  const body = res.body.toString('utf8');
  assert.match(body, /消消乐 · 3D 三消/);

  const { jsFiles, css } = distAssetsFor(PAGE);
  const primary = jsFiles.find((f) => !f.startsWith('modulepreload')) || jsFiles[0];
  const jsRes = await get('/assets/' + primary);
  assert.equal(jsRes.status, 200);
  assert.match(jsRes.type, /javascript/);
  const cssRes = await get('/assets/' + css);
  assert.equal(cssRes.status, 200);
  assert.match(cssRes.type, /text\/css/);
});

test('three-match page keeps the snake entry reachable (multi-page build)', async () => {
  const root = await get('/');
  assert.equal(root.status, 200);
  assert.match(root.body.toString('utf8'), /Web版多用户同屏贪吃蛇大战/);
  const legacy = await get('/three-match/index.html');
  assert.equal(legacy.status, 200);
});
