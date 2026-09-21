import { describe, expect, it } from 'vitest'
import { canTurn, createSnake, DIRECTIONS, hitsBody, hitsWall, moveHead, randomFood } from './game'

describe('snake game rules', () => {
  it('blocks a 180 degree turn', () => {
    expect(canTurn(DIRECTIONS.right, DIRECTIONS.left)).toBe(false)
    expect(canTurn(DIRECTIONS.right, DIRECTIONS.up)).toBe(true)
  })

  it('moves a point by direction', () => {
    expect(moveHead({ x: 2, y: 3 }, DIRECTIONS.down)).toEqual({ x: 2, y: 4 })
  })

  it('detects board and body collisions', () => {
    expect(hitsWall({ x: -1, y: 2 })).toBe(true)
    expect(hitsBody({ x: 3, y: 3 }, [{ x: 3, y: 3 }])).toBe(true)
  })

  it('creates a valid food point outside snakes', () => {
    const snake = createSnake({ x: 1, y: 1 }, DIRECTIONS.right, '#fff')
    const food = randomFood([snake], () => 0.99)
    expect(hitsBody(food, snake.body)).toBe(false)
    expect(hitsWall(food)).toBe(false)
  })
})
