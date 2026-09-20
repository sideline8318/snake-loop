import { SCENES } from './config.js';

const DIRECTIONS = {
  up: { x: 0, y: -1 },
  down: { x: 0, y: 1 },
  left: { x: -1, y: 0 },
  right: { x: 1, y: 0 },
};

const DIRECTION_KEYS = new Set(['up', 'down', 'left', 'right']);

export function mapKey(key) {
  switch (key) {
    case 'ArrowUp':
      return 'up';
    case 'ArrowDown':
      return 'down';
    case 'ArrowLeft':
      return 'left';
    case 'ArrowRight':
      return 'right';
    case ' ':
      return 'space';
    case 'p':
    case 'P':
      return 'space';
    case 'r':
    case 'R':
      return 'restart';
    default:
      switch (key.toLowerCase()) {
        case 'w':
          return 'up';
        case 'a':
          return 'left';
        case 's':
          return 'down';
        case 'd':
          return 'right';
        default:
          return key.toLowerCase();
      }
  }
}

export function createInput({ engine, ui }) {
  function onKeyDown(event) {
    const code = mapKey(event.key);
    if (code !== null) {
      const isDirection = DIRECTION_KEYS.has(code);
      if (isDirection) {
        event.preventDefault();
        if (engine.scene === SCENES.PLAYING) {
          engine.setDirection(DIRECTIONS[code]);
        }
        return;
      }
      if (code === 'space') {
        event.preventDefault();
        ui.togglePause();
        return;
      }
      if (code === 'restart') {
        ui.restart();
      }
    }
  }

  function attach() {
    document.addEventListener('keydown', onKeyDown);
    document.querySelectorAll('[data-direction]').forEach((button) => {
      button.addEventListener('click', () => {
        const code = button.dataset.direction;
        if (DIRECTION_KEYS.has(code)) engine.setDirection(DIRECTIONS[code]);
      });
    });
  }

  function detach() {
    document.removeEventListener('keydown', onKeyDown);
  }

  return { attach, detach };
}
