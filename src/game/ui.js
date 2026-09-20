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
    playAgainBtn.addEventListener('click', () => this.startGame());
    gameOverModal.addEventListener('click', (event) => {
      if (event.target === gameOverModal) this.startGame();
    });
    this.refreshScores();
  }

  startGame() {
    this.engine.start();
    this.dom.gameOverModal.classList.remove('show', 'hidden');
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
    if (this.engine.score > this.highScore) {
      this.highScore = saveHighScore(this.engine.score);
      this.dom.recordBadge.classList.remove('hidden');
    } else {
      this.dom.recordBadge.classList.add('hidden');
    }
    this.dom.gameOverModal.classList.remove('hidden');
    this.dom.gameOverModal.classList.add('show');
    this.dom.pauseBtn.textContent = '暂停';
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
