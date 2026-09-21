'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const http = require('http');
const { createStaticServer, distAssets } = require('../blackbox/helpers.cjs');

let server;
const BASE = 'http://127.0.0.1:8542';

test.before(async () => {
  server = await createStaticServer(8542);
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
          resolve({
            status: res.statusCode,
            type: res.headers['content-type'],
            body: Buffer.concat(chunks),
          })
        );
      })
      .on('error', reject);
  });
}

test('serves the single-page application over HTTP with correct types', async () => {
  const { js, css } = distAssets();
  const html = await get('/');
  assert.equal(html.status, 200);
  assert.match(html.type, /text\/html/);
  const jsRes = await get('/assets/' + js);
  assert.equal(jsRes.status, 200);
  assert.match(jsRes.type, /javascript/);
  const cssRes = await get('/assets/' + css);
  assert.equal(cssRes.status, 200);
  assert.match(cssRes.type, /text\/css/);
  const body = html.body.toString('utf8');
  assert.match(body, /snake-loop-competition/);
    assert.match(body, /82cd3989-8762-4d92-9ad5-8f0218ce2863/);
    assert.match(body, /Web版多用户同屏贪吃蛇大战 · postdeploy 893a5b1f/);
});

test('all assets referenced by index.html resolve 200', async () => {
  const html = (await get('/')).body.toString('utf8');
  const refs = [...html.matchAll(/(?:src|href)="\/(assets\/[^"]+)"/g)].map((m) => m[1]);
  assert.ok(refs.length >= 2);
  for (const ref of refs) {
    const r = await get('/' + ref);
    assert.equal(r.status, 200, ref + ' 200');
  }
});

test('unknown routes 404', async () => {
  assert.equal((await get('/nope.js')).status, 404);
});

test('deployment smoke: marker present in the served HTML head', async () => {
  const html = await get('/index.html');
  assert.equal(html.status, 200);
  const body = html.body.toString('utf8');
  assert.match(body, /<meta name="workflow-marker" content="Web版多用户同屏贪吃蛇大战 · postdeploy 893a5b1f"/);
});
