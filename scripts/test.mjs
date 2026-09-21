import assert from 'node:assert/strict';
import { GRID_SIZE, createSnake, nextHead, isOutOfBounds } from '../game.js';

const snake = createSnake(5, 10);
assert.equal(GRID_SIZE, 20);
assert.deepEqual(snake[0], { x: 5, y: 10 });
assert.deepEqual(nextHead(snake, 'right'), { x: 6, y: 10 });
assert.deepEqual(nextHead(snake, 'up'), { x: 5, y: 9 });
assert.equal(isOutOfBounds({ x: -1, y: 2 }), true);
assert.equal(isOutOfBounds({ x: 19, y: 19 }), false);
console.log('unit tests passed: movement and boundary rules');
