// @vitest-environment jsdom
import { describe, it, expect, beforeEach } from 'vitest';
import { UI } from '../../src/game/ui.js';
import { Engine } from '../../src/game/engine.js';
import { SCENES } from '../../src/game/config.js';

function classListSpy() {
  const calls = [];
  return {
    calls,
    contains() {
      return false;
    },
    add(name) {
      calls.push(['add', name]);
    },
    remove(name) {
      calls.push(['remove', name]);
    },
  };
}

function makeDomStub() {
  return {
    score: { textContent: '0' },
    level: { textContent: '1' },
    highScore: { textContent: '0' },
    pauseBtn: { textContent: '暂停', addEventListener() {} },
    restartBtn: { addEventListener() {} },
    playBtn: { addEventListener() {} },
    playAgainBtn: { addEventListener() {} },
    gameOverModal: { classList: classListSpy(), addEventListener() {} },
    menuScreen: { classList: classListSpy() },
    recordBadge: { classList: classListSpy() },
    finalScore: { textContent: '0' },
    finalLevel: { textContent: '1' },
  };
}

beforeEach(() => {
  localStorage.clear();
});

describe('UI game-over flow [regression for bug B: finalScore/finalLevel wired into DOM map]', () => {
  it('a new record renders final score/level, shows modal + badge and persists', () => {
    const engine = new Engine();
    Object.assign(engine, { scene: SCENES.GAME_OVER, score: 130, level: 2 });
    const dom = makeDomStub();
    const ui = new UI({ engine, dom });
    ui.highScore = 0;

    expect(() => ui.onGameOver()).not.toThrow();

    expect(dom.finalScore.textContent).toBe('130');
    expect(dom.finalLevel.textContent).toBe('2');
    ui.refreshScores();
    expect(dom.highScore.textContent).toBe('130');
    expect(localStorage.getItem('snake-loop-high-score')).toBe('130');
    expect(dom.gameOverModal.classList.calls).toContainEqual(['add', 'show']);
    expect(dom.recordBadge.classList.calls).toContainEqual(['remove', 'hidden']);
    expect(dom.pauseBtn.textContent).toBe('暂停');
  });

  it('a non-record game over hides the badge and keeps the stored high score', () => {
    const engine = new Engine();
    Object.assign(engine, { scene: SCENES.GAME_OVER, score: 5, level: 1 });
    localStorage.setItem('snake-loop-high-score', '100');
    const dom = makeDomStub();
    const ui = new UI({ engine, dom });
    ui.highScore = 100;

    expect(() => ui.onGameOver()).not.toThrow();

    expect(dom.finalScore.textContent).toBe('5');
    expect(dom.recordBadge.classList.calls).toContainEqual(['add', 'hidden']);
    expect(localStorage.getItem('snake-loop-high-score')).toBe('100');
    ui.refreshScores();
    expect(dom.highScore.textContent).toBe('100');
  });

  it('startGame resets the modal/menu state and scene', () => {
    const engine = new Engine();
    const dom = makeDomStub();
    const ui = new UI({ engine, dom });
    ui.init();
    ui.startGame();
    expect(engine.scene).toBe(SCENES.PLAYING);
    expect(dom.menuScreen.classList.calls).toContainEqual(['add', 'hidden']);
    expect(dom.pauseBtn.textContent).toBe('暂停');
  });

  it('togglePause and restart drive scene transitions', () => {
    const engine = new Engine();
    engine.scene = SCENES.PLAYING;
    const dom = makeDomStub();
    const ui = new UI({ engine, dom });
    ui.init();
    ui.togglePause();
    expect(engine.scene).toBe(SCENES.PAUSED);
    expect(dom.pauseBtn.textContent).toBe('继续');
    ui.togglePause();
    expect(engine.scene).toBe(SCENES.PLAYING);
    expect(dom.pauseBtn.textContent).toBe('暂停');
    ui.restart();
    expect(engine.scene).toBe(SCENES.MENU);
  });
});