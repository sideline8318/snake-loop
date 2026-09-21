import { describe, it, expect } from 'vitest';
import { Engine } from '../../src/game/engine.js';
import { CONFIG, SCENES, isReverse } from '../../src/game/config.js';

function fresh() {
  const engine = new Engine();
  engine.start();
  return engine;
}

describe('config', () => {
  it('exposes the shipped constants', () => {
    expect(CONFIG.GRID_SIZE).toBe(20);
    expect(CONFIG.INITIAL_SNAKE_LENGTH).toBe(3);
    expect(CONFIG.INITIAL_SPEED).toBe(120);
    expect(CONFIG.MIN_SPEED).toBe(60);
    expect(CONFIG.SPEED_STEP).toBe(8);
    expect(CONFIG.FOODS_PER_LEVEL).toBe(5);
    expect(CONFIG.FOOD_SCORE).toBe(10);
  });

  it('detects opposing direction vectors', () => {
    expect(isReverse({ x: 1, y: 0 }, { x: -1, y: 0 })).toBe(true);
    expect(isReverse({ x: 0, y: -1 }, { x: 0, y: 1 })).toBe(true);
    expect(isReverse({ x: 1, y: 0 }, { x: 0, y: 1 })).toBe(false);
  });
});

describe('Engine', () => {
  it('constructs a clean MENU-state engine', () => {
    const engine = new Engine();
    expect(engine.scene).toBe(SCENES.MENU);
    expect(engine.gridSize).toBe(CONFIG.GRID_SIZE);
    expect(engine.snake).toEqual([]);
    expect(engine.direction).toEqual({ x: 1, y: 0 });
    expect(engine.score).toBe(0);
    expect(engine.level).toBe(1);
    expect(engine.foodEaten).toBe(0);
    expect(engine.totalFoodEaten).toBe(0);
    expect(engine.speed).toBe(CONFIG.INITIAL_SPEED);
    expect(engine.pendingDirection).toBeNull();
  });

  it('start() lays the snake at centre heading right', () => {
    const engine = fresh();
    expect(engine.scene).toBe(SCENES.PLAYING);
    expect(engine.snake).toEqual([
      { x: 10, y: 10 },
      { x: 9, y: 10 },
      { x: 8, y: 10 },
    ]);
    expect(engine.direction).toEqual({ x: 1, y: 0 });
  });

  it('step() on non-playing scene is inert', () => {
    const engine = new Engine();
    expect(engine.step()).toBe('not-playing');
    expect(engine.scene).toBe(SCENES.MENU);
  });

  it('forward step advances head and slides the tail', () => {
    const engine = fresh();
    expect(engine.step()).toBe('none');
    expect(engine.snake.length).toBe(3);
    expect(engine.snake[0]).toEqual({ x: 11, y: 10 });
    expect(engine.snake[2]).toEqual({ x: 9, y: 10 });
    expect(engine.score).toBe(0);
  });

  it('rejects a 180 degree reversal while moving', () => {
    const engine = fresh();
    engine.setDirection({ x: -1, y: 0 });
    expect(engine.pendingDirection).toBeNull();
    expect(engine.direction).toEqual({ x: 1, y: 0 });
  });

  it('queues turns and applies them on the next step', () => {
    const engine = fresh();
    engine.setDirection({ x: 0, y: -1 });
    expect(engine.pendingDirection).toEqual({ x: 0, y: -1 });
    expect(engine.direction).toEqual({ x: 1, y: 0 });
    engine.step();
    expect(engine.snake[0]).toEqual({ x: 10, y: 9 });
  });

  it('keeps player two movement and score independent', () => {
    const engine = fresh();
    engine.setPlayerDirection('player2', { x: 0, y: 1 });
    expect(engine.rivalPendingDirection).toEqual({ x: 0, y: 1 });
    engine.food = { x: 10, y: 16 };

    expect(engine.step()).toBe('ate');
    expect(engine.rivalSnake[0]).toEqual({ x: 10, y: 16 });
    expect(engine.scores).toEqual({ player1: 0, player2: 10 });
    expect(engine.score).toBe(10);
  });

  it('ends the match when the two snakes collide', () => {
    const engine = fresh();
    engine.snake = [{ x: 5, y: 5 }];
    engine.rivalSnake = [{ x: 7, y: 5 }];
    engine.direction = { x: 1, y: 0 };
    engine.rivalDirection = { x: -1, y: 0 };

    expect(engine.step()).toBe('dead');
    expect(engine.collisionReason).toBe('蛇身相撞');
    expect(engine.scene).toBe(SCENES.GAME_OVER);
  });

  it('ignores setDirection outside the playing scene', () => {
    const idle = new Engine();
    idle.setDirection({ x: 0, y: -1 });
    expect(idle.pendingDirection).toBeNull();
    const paused = fresh();
    paused.pause();
    paused.setDirection({ x: 0, y: -1 });
    expect(paused.pendingDirection).toBeNull();
  });

  it('eating grows the snake, awards FOOD_SCORE * level and respawns food off-body', () => {
    const engine = fresh();
    engine.food = { x: 11, y: 10 };
    expect(engine.step()).toBe('ate');
    expect(engine.snake.length).toBe(4);
    expect(engine.score).toBe(10);
    expect(engine.foodEaten).toBe(1);
    expect(engine.totalFoodEaten).toBe(1);
    expect(engine.level).toBe(1);
    const onSnake = engine.snake.some((s) => s.x === engine.food.x && s.y === engine.food.y);
    expect(onSnake).toBe(false);
  });

  it('levels up after FOODS_PER_LEVEL foods and slows the tick', () => {
    const engine = fresh();
    engine.foodEaten = 4;
    engine.level = 1;
    engine.eatFood();
    expect(engine.level).toBe(2);
    expect(engine.speed).toBe(112);
  });

  it('clamps speed at MIN_SPEED', () => {
    const engine = fresh();
    engine.foodEaten = 39;
    engine.level = 8;
    engine.eatFood();
    expect(engine.level).toBe(9);
    expect(engine.speed).toBe(CONFIG.MIN_SPEED);
  });

  it('eatScore scales with level', () => {
    const engine = fresh();
    expect(engine.eatScore()).toBe(10);
    engine.level = 3;
    expect(engine.eatScore()).toBe(30);
  });

  it('wall collision ends the game', () => {
    const engine = fresh();
    engine.setDirection({ x: 0, y: -1 });
    let result;
    for (let i = 0; i < 11; i++) result = engine.step();
    expect(result).toBe('dead');
    expect(engine.scene).toBe(SCENES.GAME_OVER);
    expect(engine.isGameOver).toBe(true);
  });

  it('self collision ends the game', () => {
    const engine = fresh();
    engine.pendingDirection = null;
    engine.snake = [
      { x: 5, y: 5 },
      { x: 4, y: 5 },
      { x: 3, y: 5 },
    ];
    engine.direction = { x: -1, y: 0 };
    expect(engine.step()).toBe('dead');
    expect(engine.scene).toBe(SCENES.GAME_OVER);
  });

  it('player two self collision ends the game against its own body', () => {
    const engine = fresh();
    engine.pendingDirection = null;
    // Player one is far away and harmless; player two is about to run into itself.
    engine.snake = [{ x: 1, y: 1 }];
    engine.rivalSnake = [
      { x: 15, y: 10 },
      { x: 16, y: 10 },
      { x: 16, y: 9 },
      { x: 15, y: 9 },
    ];
    engine.rivalDirection = { x: -1, y: 0 };
    engine.rivalPendingDirection = { x: -1, y: 0 };
    // next head of player two is (14,10); force a turn so the next head lands on (16,10)
    engine.rivalSnake = [
      { x: 15, y: 10 },
      { x: 15, y: 11 },
      { x: 16, y: 11 },
      { x: 16, y: 10 },
    ];
    engine.rivalDirection = { x: 1, y: 0 };
    engine.rivalPendingDirection = { x: 1, y: 0 };
    expect(engine.step()).toBe('dead');
    expect(engine.collisionReason).toBe('撞到自己');
    expect(engine.scene).toBe(SCENES.GAME_OVER);
  });

  it('player two is not declared dead by player one body when it moves away', () => {
    const engine = fresh();
    engine.pendingDirection = null;
    engine.snake = [
      { x: 5, y: 5 },
      { x: 5, y: 6 },
      { x: 5, y: 7 },
    ];
    // player two sits next to, but not on, player one and moves away from it
    engine.rivalSnake = [
      { x: 8, y: 8 },
      { x: 9, y: 8 },
      { x: 10, y: 8 },
    ];
    engine.rivalDirection = { x: 0, y: 1 };
    engine.rivalPendingDirection = { x: 0, y: 1 };
    expect(engine.step()).not.toBe('dead');
  });

  it('generateFood stays on-grid and never on the snake', () => {
    const engine = fresh();
    for (let i = 0; i < 200; i++) {
      const food = engine.generateFood();
      const bad = engine.snake.some((s) => s.x === food.x && s.y === food.y);
      expect(bad).toBe(false);
      expect(food.x).toBeGreaterThanOrEqual(0);
      expect(food.x).toBeLessThan(CONFIG.GRID_SIZE);
      expect(food.y).toBeGreaterThanOrEqual(0);
      expect(food.y).toBeLessThan(CONFIG.GRID_SIZE);
    }
  });

  it('generateFood reports a full board', () => {
    const engine = fresh();
    const all = [];
    for (let y = 0; y < CONFIG.GRID_SIZE; y++)
      for (let x = 0; x < CONFIG.GRID_SIZE; x++) all.push({ x, y });
    engine.snake = all;
    expect(engine.generateFood()).toEqual({ x: -1, y: -1 });
  });

  it('pause/resume respect the current scene', () => {
    const engine = fresh();
    engine.pause();
    expect(engine.scene).toBe(SCENES.PAUSED);
    expect(engine.step()).toBe('not-playing');
    engine.resume();
    expect(engine.scene).toBe(SCENES.PLAYING);
  });

  it('toMenu returns to the menu scene', () => {
    const engine = fresh();
    engine.pause();
    engine.toMenu();
    expect(engine.scene).toBe(SCENES.MENU);
    expect(engine.pendingDirection).toBeNull();
  });
});
