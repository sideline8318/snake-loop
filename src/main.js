import { Engine } from './game/engine.js';
import { Renderer } from './game/render.js';
import { UI } from './game/ui.js';
import { createInput } from './game/input.js';
import { SCENES } from './game/config.js';

function byId(id) {
  const element = document.getElementById(id);
  if (!element) throw new Error(`missing element: #${id}`);
  return element;
}

function initGame() {
  const canvas = byId('gameCanvas');
  if (!(canvas instanceof HTMLCanvasElement)) throw new Error('invalid canvas element');

  const engine = new Engine();
  const renderer = new Renderer(canvas);
  renderer.scaleForDevicePixelRatio();

  const ui = new UI({
    engine,
    dom: {
      score: byId('score'),
      player1Score: byId('player1Score'),
      player2Score: byId('player2Score'),
      level: byId('level'),
      highScore: byId('highScore'),
      pauseBtn: byId('pauseBtn'),
      restartBtn: byId('restartBtn'),
      playBtn: byId('playBtn'),
      playAgainBtn: byId('playAgainBtn'),
      gameOverModal: byId('gameOverModal'),
      menuScreen: byId('menuScreen'),
      recordBadge: byId('recordBadge'),
      finalScore: byId('finalScore'),
      finalLevel: byId('finalLevel'),
      finalWinner: byId('finalWinner'),
    },
  });
  ui.init();
  createInput({ engine, ui }).attach();

  let justEnded = false;

  function loop() {
    if (engine.step() === 'dead' && !justEnded) {
      ui.onGameOver();
      justEnded = true;
    } else if (engine.scene === SCENES.PLAYING || engine.scene === SCENES.PAUSED) {
      justEnded = false;
    }
    ui.refreshScores();
    renderer.draw(engine);
     const delay = engine.scene === SCENES.PLAYING ? engine.speed : 200;
    setTimeout(loop, delay);
  }
  loop();
}

document.addEventListener('DOMContentLoaded', () => {
  initGame();
});
