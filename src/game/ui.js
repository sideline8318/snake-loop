import { SCENES } from './config.js';
import { loadHighScore, saveHighScore } from './storage.js';

export class UI {
  constructor({ engine, dom }) {
    this.engine = engine;
    this.dom = dom;
    this.highScore = loadHighScore();
  }

  init() {
    const { pauseBtn, restartBtn, playBtn, playAgainBtn, gameOverModal } = this.dom;
    pauseBtn.addEventListener('click', () => this.togglePause());
    restartBtn.addEventListener('click', () => this.restart());
    playBtn.addEventListener('click', () => this.startGame());
    playAgainBtn.addEventListener('click', () => {
      if (playAgainBtn.disabled) return;
      playAgainBtn.disabled = true;
      this.startGame();
    });
    gameOverModal.addEventListener('click', (event) => {
      if (event.target === gameOverModal) this.startGame();
    });
    this.refreshScores();
  }

  startGame() {
    if (this.dom.playAgainBtn) this.dom.playAgainBtn.disabled = false;
    this.clearRanking();
    this.engine.start();
    this.dom.gameOverModal.classList.remove('show');
    this.dom.gameOverModal.classList.add('hidden');
    this.dom.menuScreen.classList.add('hidden');
    this.dom.pauseBtn.textContent = '暂停';
    this.refreshScores();
  }

  togglePause() {
    const { engine } = this;
    if (engine.scene === SCENES.PLAYING) {
      engine.pause();
      this.dom.pauseBtn.textContent = '继续';
    } else if (engine.scene === SCENES.PAUSED) {
      engine.resume();
      this.dom.pauseBtn.textContent = '暂停';
    }
  }

  restart() {
    this.engine.resetState();
    this.engine.toMenu();
    this.dom.gameOverModal.classList.remove('show');
    this.dom.gameOverModal.classList.add('hidden');
    this.dom.menuScreen.classList.remove('hidden');
    this.dom.pauseBtn.textContent = '暂停';
    this.refreshScores();
  }

  onGameOver() {
    this.dom.finalScore.textContent = String(this.engine.score);
    this.dom.finalLevel.textContent = String(this.engine.level);
    if (this.dom.finalWinner) this.dom.finalWinner.textContent = this.engine.winner || '对战结束';
    if (this.dom.finalReason) this.dom.finalReason.textContent = `结束原因：${this.engine.collisionReason || '比赛结束'}`;
    if (this.engine.score > this.highScore) {
      this.highScore = saveHighScore(this.engine.score);
      this.dom.recordBadge.classList.remove('hidden');
    } else {
      this.dom.recordBadge.classList.add('hidden');
    }
    this.renderRanking(this.engine.getSettlement());
    this.dom.gameOverModal.classList.remove('hidden');
    this.dom.gameOverModal.classList.add('show');
    this.dom.pauseBtn.textContent = '暂停';
  }

  renderRanking(settlement) {
    const list = this.dom.rankingList;
    if (!list) return;
    if (typeof list.replaceChildren === 'function') list.replaceChildren();
    else while (list.firstChild) list.removeChild(list.firstChild);
    if (!settlement || !Array.isArray(settlement.entries)) return;
    const doc = list.ownerDocument || (typeof document !== 'undefined' ? document : null);
    if (!doc) return;
    for (const entry of settlement.entries) {
      const row = doc.createElement('li');
      row.className = 'ranking-row';
      row.setAttribute('data-rank', String(entry.rank));
      row.setAttribute('data-player', entry.playerId);
      if (entry.tied) {
        row.setAttribute('data-tied', 'true');
        row.classList.add('rank-tied');
        row.setAttribute('aria-label', `第 ${entry.rank} 名 · 并列 · ${entry.label} · ${entry.score} 分`);
      } else {
        row.setAttribute('aria-label', `第 ${entry.rank} 名 · ${entry.label} · ${entry.score} 分`);
      }
      const rankNo = doc.createElement('span');
      rankNo.className = 'rank-no';
      rankNo.textContent = String(entry.rank);
      const name = doc.createElement('span');
      name.className = 'rank-name';
      name.textContent = entry.label;
      const score = doc.createElement('span');
      score.className = 'rank-score';
      score.textContent = String(entry.score);
      row.append(rankNo, name, score);
      list.append(row);
    }
  }

  clearRanking() {
    const list = this.dom.rankingList;
    if (!list) return;
    if (typeof list.replaceChildren === 'function') list.replaceChildren();
    else while (list.firstChild) list.removeChild(list.firstChild);
  }

  refreshScores() {
    const { engine, dom } = this;
    dom.score.textContent = String(engine.score);
    dom.level.textContent = String(engine.level);
    dom.highScore.textContent = String(this.highScore);
    if (dom.player1Score) dom.player1Score.textContent = String(engine.scores.player1);
    if (dom.player2Score) dom.player2Score.textContent = String(engine.scores.player2);
  }
}
