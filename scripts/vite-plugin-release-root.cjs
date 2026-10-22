'use strict';

const fs = require('node:fs');
const path = require('node:path');

const THREE_MATCH_WORKFLOW_ID = 'a3d16e35-bd65-41e1-b430-995f7151e2a6';
const RELEASE_WORKFLOW_ID = '86ed0cf8-a021-46c5-9639-81871d2b2463';
const LEGACY_WORKFLOW_ID = '82cd3989-8762-4d92-9ad5-8f0218ce2863';
// 交付 workflow：结算排名与再来一局体验（development.work.1 attempt 6）。
// 发布根与 legacy 页面都携带该标记，供 preview/部署门禁比对当前 Workflow。
const DELIVERY_WORKFLOW_ID = '4685ae3a-d06a-4da9-aee8-63a819398d73';

// Vite 对多个 HTML 入口会同时输出 `index.html`（源文件根 index.html，贪吃蛇）
// 与 `three-match/index.html`（三消）。发布契约要求根路径 `/` 呈现三消，
// 因此这个插件在三消构建的 closeBundle 阶段，把三消页作为发布根
// `dist/index.html` 写回，并同步其资源引用指向三消构建产物；
// 贪吃蛇身份只保留在 `legacy-snake/`。
function releaseRootPlugin() {
  return {
    name: 'release-root-three-match',
    apply: 'build',
    enforce: 'post',
    closeBundle() {
      const distDir = path.resolve(__dirname, '..', 'dist');
      const threeIndex = path.join(distDir, 'three-match', 'index.html');
      if (!fs.existsSync(threeIndex)) return;

      const threeHtml = fs.readFileSync(threeIndex, 'utf8');
      const threeJs = firstAsset(threeHtml, 'js');
      const threeCss = firstAsset(threeHtml, 'css');
      if (!threeJs) {
        throw new Error('three-match build produced no JS asset for the release root');
      }

      // 以三消页为唯一事实来源生成发布根，天然带齐其 HUD 契约 id 与身份标记。
      let rootHtml = threeHtml;

      const meta = {
        'workflow-marker': `消消乐 · 3D 三消 | workflow ${THREE_MATCH_WORKFLOW_ID}`,
        'workflow-id': THREE_MATCH_WORKFLOW_ID,
        'workflow-release': `${RELEASE_WORKFLOW_ID} / release-root-fix`,
        description:
          '消消乐 · 3D 三消 Web 小游戏，交换相邻宝石连成三个以上即可消除得分',
        'workflow-marker-current': `消消乐 · 3D 三消 | workflow ${DELIVERY_WORKFLOW_ID} | development.work.1 attempt 6`,
        'workflow-id-current': DELIVERY_WORKFLOW_ID,
      };
      for (const [name, content] of Object.entries(meta)) {
        rootHtml = rewriteMeta(rootHtml, name, content);
      }
      rootHtml = rootHtml.replace(
        /<title>[^<]*<\/title>/,
        '<title>消消乐 · 3D 三消</title>'
      );

      if (threeCss) {
        rootHtml = rootHtml.replace(
          /<link rel="stylesheet"[^>]*href="[^"]*"[^>]*>/g,
          `<link rel="stylesheet" crossorigin href="/assets/${threeCss}">`
        );
      }
      rootHtml = rootHtml.replace(
        /<script type="module"[^>]*src="[^"]*"[^>]*><\/script>/g,
        `<script type="module" crossorigin src="/assets/${threeJs}"></script>`
      );

      assertNoIdentityLeak(rootHtml);
      fs.writeFileSync(path.join(distDir, 'index.html'), rootHtml);
    },
  };
}

function firstAsset(html, kind) {
  const re = kind === 'js'
    ? /<script[^>]*src="\/assets\/([^"]+\.js)"/g
    : /<link[^>]*href="\/assets\/([^"]+\.css)"/g;
  const all = [...html.matchAll(re)].map((m) => m[1]);
  return all.find((f) => !f.startsWith('modulepreload')) || all[0] || null;
}

function rewriteMeta(html, name, content) {
  const tag = `<meta name="${name}" content="${content}" />`;
  const re = new RegExp(`<meta name="${name}" content="[^"]*"[^>]*/>`);
  return re.test(html) ? html.replace(re, tag) : html.replace('</head>', `  ${tag}\n</head>`);
}

function assertNoIdentityLeak(html) {
  const banned = [
    'Web版多用户同屏贪吃蛇大战',
    'snake-loop-competition',
    LEGACY_WORKFLOW_ID,
    'postdeploy',
  ];
  for (const needle of banned) {
    if (html.includes(needle)) {
      throw new Error(`release root leaks forbidden legacy identity: ${needle}`);
    }
  }
}

module.exports = { releaseRootPlugin };
