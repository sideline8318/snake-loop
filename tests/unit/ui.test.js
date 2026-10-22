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

function makeClickable(element, disabled) {
  const listeners = [];
  element.disabled = disabled;
  element.addEventListener = (type, listener) => listeners.push(listener);
  element.click = () => {
    if (element.disabled) return;
    for (const listener of listeners) listener();
  };
  return element;
}

function makeDomStub() {
  const dom = {
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
    finalReason: { textContent: '' },
    rankingList: makeListStub(),
  };
  makeClickable(dom.playAgainBtn, false);
  return dom;
}

function makeListStub() {
  const children = [];
  const list = {
    children,
    replaceChildren(...nodes) {
      children.length = 0;
      children.push(...nodes);
    },
    append(node) {
      children.push(node);
    },
  };
  return list;
}

beforeEach(() => {
  localStorage.clear();
});

describe('UI game-over flow [regression for bug B: finalScore/finalLevel wired into DOM map]', () => {
  it('a new record renders final score/level, shows modal + badge and persists', () => {
    const engine = new Engine();
    Object.assign(engine, { scene: SCENES.GAME_OVER, score: 130, level: 2, collisionReason: '撞墙' });
    const dom = makeDomStub();
    const ui = new UI({ engine, dom });
    ui.highScore = 0;

    expect(() => ui.onGameOver()).not.toThrow();

    expect(dom.finalScore.textContent).toBe('130');
    expect(dom.finalLevel.textContent).toBe('2');
    expect(dom.finalReason.textContent).toBe('结束原因：撞墙');
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
    expect(dom.gameOverModal.classList.calls).toContainEqual(['add', 'hidden']);
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

describe('UI settlement ranking', () => {
  it('renders ranking rows in snapshot order using textContent only', () => {
    const engine = new Engine();
    Object.assign(engine, { scene: SCENES.GAME_OVER, scores: { player1: 10, player2: 40 }, collisionReason: '撞墙' });
    engine.score = 50;
    const dom = makeDomStub();
    const ui = new UI({ engine, dom });
    ui.onGameOver();
    const rows = dom.rankingList.children;
    expect(rows).toHaveLength(2);
    expect(rows[0].getAttribute('data-rank')).toBe('1');
    expect(rows[0].getAttribute('data-player')).toBe('player2');
    expect(rows[0].querySelector('.rank-name').textContent).toBe('玩家 2');
    expect(rows[0].querySelector('.rank-score').textContent).toBe('40');
    expect(rows[1].getAttribute('data-rank')).toBe('2');
    expect(rows[1].getAttribute('aria-label')).toContain('第 2 名');
    expect(rows[0].querySelector('.rank-name').children).toHaveLength(0);
  });

  it('marks tied rows with data-tied and aria-label', () => {
    const engine = new Engine();
    Object.assign(engine, { scene: SCENES.GAME_OVER, scores: { player1: 0, player2: 0 } });
    const dom = makeDomStub();
    const ui = new UI({ engine, dom });
    ui.onGameOver();
    const rows = dom.rankingList.children;
    expect(rows).toHaveLength(2);
    for (const row of rows) {
      expect(row.getAttribute('data-tied')).toBe('true');
      expect(row.getAttribute('aria-label')).toContain('并列');
    }
  });

  it('does not throw when ranking DOM is absent', () => {
    const engine = new Engine();
    Object.assign(engine, { scene: SCENES.GAME_OVER, scores: { player1: 5, player2: 1 } });
    const dom = makeDomStub();
    delete dom.rankingList;
    const ui = new UI({ engine, dom });
    expect(() => ui.onGameOver()).not.toThrow();
    expect(() => ui.startGame()).not.toThrow();
  });

  it('play again resets scores and clears ranking rows', () => {
    const engine = new Engine();
    Object.assign(engine, { scene: SCENES.GAME_OVER, scores: { player1: 5, player2: 1 } });
    const dom = makeDomStub();
    const ui = new UI({ engine, dom });
    ui.onGameOver();
    expect(dom.rankingList.children).toHaveLength(2);
    ui.startGame();
    expect(engine.scene).toBe(SCENES.PLAYING);
    expect(engine.scores).toEqual({ player1: 0, player2: 0 });
    expect(dom.rankingList.children).toHaveLength(0);
  });

  it('ignores a repeated play-again click while the button stays disabled', () => {
    const engine = new Engine();
    Object.assign(engine, { scene: SCENES.GAME_OVER, scores: { player1: 5, player2: 1 } });
    const dom = makeDomStub();
    const ui = new UI({ engine, dom });
    ui.init();
    const button = dom.playAgainBtn;
    button.click();
    expect(engine.scene).toBe(SCENES.PLAYING);
    expect(dom.rankingList.children).toHaveLength(0);
    button.click();
    expect(engine.scene).toBe(SCENES.PLAYING);
    expect(dom.rankingList.children).toHaveLength(0);
  });
});
