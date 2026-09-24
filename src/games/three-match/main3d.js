import { SCENES } from './config.js';
import { buildScene } from './scene3d.js';
import { BoardView } from './boardView.js';
import { createInput } from './input3d.js';
import { Hud } from './hud.js';
import { GameState, PHASE } from './game.js';

export function bootstrap({ canvas, doc = globalThis.document }) {
  const { renderer, scene, camera, boardGroup } = buildScene(canvas);
  const game = new GameState();
  const boardView = new BoardView({ scene, boardGroup, size: game.size });
  const hud = new Hud({ game, doc });

  let resolveTimer = 0;
  let identicalFrames = 0;

  function onAttempt(from, to) {
    const result = game.trySwap(from, to);
    if (!result.accepted) {
      if (result.reason === 'not-adjacent') hud.toast('只能交换相邻的宝石', 'warn');
      else if (result.reason === 'no-match') hud.toast('这样换不能消除哦', 'warn');
      return;
    }
    boardView.swapVisual(from, to);
    resolveTimer = 0;
  }

  const input = createInput({ canvas, camera, boardView, game, onAttempt, onRestart });
  input.attach();

  function onRestart() {
    game.start();
    boardView.syncFromBoard(game.board);
    hud.reset();
    resize();
  }

  hud.bind({
    onStart: () => {
      game.start();
      boardView.syncFromBoard(game.board);
      hud.reset();
      resize();
    },
    onRestart,
  });
  game.start();
  boardView.syncFromBoard(game.board);
  hud.refresh();

  function resize() {
    const width = canvas.clientWidth || 1;
    const height = canvas.clientHeight || 1;
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  }
  globalThis.addEventListener?.('resize', resize);
  resize();

  let last = performance.now();
  function frame(now) {
    const dt = Math.min(0.05, (now - last) / 1000 || 0.016);
    last = now;

    if (game.scene === SCENES.PLAYING) {
      if (game.busy) {
        resolveTimer += dt;
        if (resolveTimer > 0.22) {
          const events = game.tick();
          boardView.applyEvents(events);
          hud.refresh();
          if (events.some((e) => e.type === 'shuffle')) {
            hud.toast('没有可消除的组合，已自动洗牌', 'shuffle');
          } else if (game.combo > 1 && events.some((e) => e.type === 'clear')) {
            hud.toast(`连锁 x${game.combo}`, 'combo');
          }
          resolveTimer = 0;
        }
      } else {
        identicalFrames += 1;
        if (identicalFrames % 240 === 0 && !game.canInteract()) {
          const shuffleToast = game.ensurePlayable(false);
          if (shuffleToast) hud.toast(shuffleToast.text, 'shuffle');
        }
      }
    } else {
      game.scene = SCENES.PLAYING;
    }

    boardView.update(dt);
    renderer.render(scene, camera);
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);

  const api = { game, boardView, hud, input, dispose: () => input.detach() };
  globalThis.__THREE_MATCH__ = api;
  return api;
}

export { PHASE };
