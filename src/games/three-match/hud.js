import { HUD } from './config.js';

const BEST_KEY = 'three-match-best-score';

export function loadBest() {
  try {
    const raw = globalThis.localStorage?.getItem(BEST_KEY);
    if (!raw) return 0;
    const value = Number.parseInt(raw, 10);
    return Number.isFinite(value) && value > 0 ? value : 0;
  } catch {
    return 0;
  }
}

export function saveBest(score) {
  const current = loadBest();
  if (score > current) {
    try {
      globalThis.localStorage?.setItem(BEST_KEY, String(score));
    } catch {
      // storage unavailable, ignore
    }
    return score;
  }
  return current;
}

export class Hud {
  constructor({ game, doc = globalThis.document }) {
    this.game = game;
    this.doc = doc;
    this.best = loadBest();
    this.el = {
      score: doc.getElementById(HUD.SCORE_ID),
      best: doc.getElementById(HUD.BEST_ID),
      combo: doc.getElementById(HUD.COMBO_ID),
      toast: doc.getElementById(HUD.TOAST_ID),
      restart: doc.getElementById(HUD.RESTART_ID),
      start: doc.getElementById(HUD.START_ID),
      overlay: doc.getElementById(HUD.OVERLAY_ID),
    };
    this.toastTimer = null;
  }

  bind({ onStart, onRestart }) {
    this.el.start?.addEventListener('click', () => {
      onStart?.();
      this.hideOverlay();
    });
    this.el.restart?.addEventListener('click', () => {
      onRestart?.();
      this.hideOverlay();
    });
    this.refresh();
  }

  hideOverlay() {
    // Menu overlay can be dismissed from the start button or from the input layer.
    const overlay = this.el.overlay;
    if (!overlay) return;
    overlay.classList.add('hidden');
    this.el.start?.setAttribute('aria-pressed', 'true');
  }

  addScore(points) {
    this.game.score += points;
    this.refresh();
  }

  refresh() {
    if (this.el.score) this.el.score.textContent = String(this.game.score);
    if (this.el.best) this.el.best.textContent = String(this.best);
    if (this.el.combo) {
      this.el.combo.textContent = this.game.combo > 1 ? `x${this.game.combo}` : '—';
    }
    if (this.game.score > this.best) {
      this.best = saveBest(this.game.score);
    }
  }

  toast(text, tone = 'info') {
    const el = this.el.toast;
    if (!el) return;
    el.textContent = text;
    el.dataset.tone = tone;
    el.classList.remove('hidden');
    el.classList.add('show');
    if (this.toastTimer) clearTimeout(this.toastTimer);
    this.toastTimer = setTimeout(() => {
      el.classList.remove('show');
    }, 1600);
  }

  reset() {
    this.game.score = 0;
    this.game.combo = 0;
    this.refresh();
    this.toast('新的一局，开始吧！', 'start');
  }
}
