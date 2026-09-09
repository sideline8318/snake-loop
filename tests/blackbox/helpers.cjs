'use strict';
const fs = require('fs');
const path = require('path');
const http = require('http');
const crypto = require('crypto');
const { JSDOM } = require('jsdom');

const ROOT = path.join(__dirname, '..', '..');
const DIST = path.join(ROOT, 'dist');

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
};

function sha256(buf) {
  return crypto.createHash('sha256').update(buf).digest('hex');
}

function distAssets() {
  const html = fs.readFileSync(path.join(DIST, 'index.html'), 'utf8');
  const js = html.match(/\/assets\/(index-[^"]+\.js)/)[1];
  const css = html.match(/\/assets\/(index-[^"]+\.css)/)[1];
  return { html, js, css };
}

function createStaticServer(port, distDir = DIST) {
  const server = http.createServer((req, res) => {
    let p = decodeURIComponent(req.url.split('?')[0]);
    if (p === '/') p = '/index.html';
    const file = path.join(distDir, p);
    if (!file.startsWith(distDir) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('not found');
      return;
    }
    const ext = path.extname(file);
    res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream' });
    fs.createReadStream(file).pipe(res);
  });
  return new Promise((resolve) => server.listen(port, '127.0.0.1', () => resolve(server)));
}

function createCtxStub() {
  const log = [];
  const ctx = {
    _log: log,
    fillStyle: '#000',
    strokeStyle: '#000',
    lineWidth: 1,
    font: '',
    textAlign: '',
    textBaseline: '',
    fillRect(x, y, w, h) {
      log.push({ op: 'fillRect', x, y, w, h, fillStyle: this.fillStyle });
    },
    strokeRect() {},
    clearRect() {},
    beginPath() {},
    moveTo() {},
    lineTo() {},
    arc(x, y, r) {
      log.push({ op: 'arc', x, y, r, fillStyle: this.fillStyle });
    },
    stroke() {},
    fill() {},
    fillText() {},
    scale() {},
  };
  return ctx;
}

function pageHtmlForJsdom() {
  let html = fs.readFileSync(path.join(DIST, 'index.html'), 'utf8');
  html = html.replace(
    /<script\s+type="module"\s+crossorigin\s+src="\/assets\/[^"]+\.js"/,
    '<script src="/assets/' + distAssets().js + '"'
  );
  return html;
}

async function createGameWindow({ base = 'http://127.0.0.1:8541', mathRandom, localStorageSeed } = {}) {
  const html = pageHtmlForJsdom();
  const dom = await new Promise((resolve, reject) => {
    const d = new JSDOM(html, {
      url: base + '/index.html',
      runScripts: 'dangerously',
      resources: 'usable',
      pretendToBeVisual: true,
      beforeParse(window) {
        window.HTMLCanvasElement.prototype.getContext = function getContext() {
          if (!this._ctxLog) {
            const stub = createCtxStub();
            this._ctxLog = stub._log;
            this._ctx = stub;
          }
          return this._ctx;
        };
        if (localStorageSeed) {
          for (const [k, v] of Object.entries(localStorageSeed)) {
            window.localStorage.setItem(k, String(v));
          }
        }
        if (mathRandom !== undefined) {
          let i = 0;
          const queue = [...mathRandom];
          window.Math.random = () =>
            i < queue.length ? queue[i++] : queue.length ? queue[queue.length - 1] : 0.5;
        }
      },
    });
    d.window.addEventListener('load', () => resolve(d));
    d.window.addEventListener('error', (e) => reject(new Error('window error: ' + e.message)));
  });
  return dom;
}

function lastHeadDraw(ctxLog) {
  for (let i = ctxLog.length - 1; i >= 0; i--) {
    const r = ctxLog[i];
    if (r.op === 'fillRect' && r.fillStyle === '#00e68a') return r;
  }
  return null;
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function waitFor(fn, { timeout = 4000, interval = 30 } = {}) {
  const start = Date.now();
  for (;;) {
    const v = fn();
    if (v) return v;
    if (Date.now() - start > timeout) return null;
    await sleep(interval);
  }
}

module.exports = {
  ROOT,
  DIST,
  distAssets,
  createStaticServer,
  createGameWindow,
  createCtxStub,
  lastHeadDraw,
  sleep,
  waitFor,
  pageHtmlForJsdom,
  sha256,
};