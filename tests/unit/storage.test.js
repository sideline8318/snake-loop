// @vitest-environment jsdom
import { describe, it, expect, beforeEach } from 'vitest';
import { loadHighScore, saveHighScore } from '../../src/game/storage.js';

beforeEach(() => {
  localStorage.clear();
});

describe('high-score storage', () => {
  it('reads 0 when nothing is stored or stored value is invalid', () => {
    expect(loadHighScore()).toBe(0);
    localStorage.setItem('snake-loop-high-score', 'not-a-number');
    expect(loadHighScore()).toBe(0);
    localStorage.setItem('snake-loop-high-score', '-5');
    expect(loadHighScore()).toBe(0);
  });

  it('reads a stored score', () => {
    localStorage.setItem('snake-loop-high-score', '128');
    expect(loadHighScore()).toBe(128);
  });

  it('persists only when the new score is higher', () => {
    localStorage.setItem('snake-loop-high-score', '100');
    expect(saveHighScore(50)).toBe(100);
    expect(localStorage.getItem('snake-loop-high-score')).toBe('100');
    expect(saveHighScore(150)).toBe(150);
    expect(localStorage.getItem('snake-loop-high-score')).toBe('150');
  });

  it('survives storage errors without throwing', () => {
    const original = globalThis.localStorage.getItem.bind(globalThis.localStorage);
    globalThis.localStorage.getItem = () => {
      throw new Error('denied');
    };
    try {
      expect(loadHighScore()).toBe(0);
    } finally {
      globalThis.localStorage.getItem = original;
    }
  });
});