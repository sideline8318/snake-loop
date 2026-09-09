import { STORAGE_KEY } from './config.js';

export function loadHighScore() {
  try {
    const raw = globalThis.localStorage.getItem(STORAGE_KEY);
    if (raw === null) return 0;
    const value = Number.parseInt(raw, 10);
    return Number.isFinite(value) && value > 0 ? value : 0;
  } catch {
    return 0;
  }
}

export function saveHighScore(score) {
  const current = loadHighScore();
  if (score > current) {
    try {
      globalThis.localStorage.setItem(STORAGE_KEY, String(score));
    } catch {
      // ignore storage failures
    }
    return score;
  }
  return current;
}