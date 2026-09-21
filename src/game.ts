export const GRID_SIZE = 20
export type Point = { x: number; y: number }
export type Direction = Point

export const DIRECTIONS = {
  up: { x: 0, y: -1 },
  down: { x: 0, y: 1 },
  left: { x: -1, y: 0 },
  right: { x: 1, y: 0 },
} as const

export type GameMode = 'solo' | 'versus' | 'ai'
export type Difficulty = 'rookie' | 'pro' | 'master'
export type Snake = { body: Point[]; direction: Direction; nextDirection: Direction; alive: boolean; score: number; color: string }

export function samePoint(a: Point, b: Point): boolean {
  return a.x === b.x && a.y === b.y
}

export function isOpposite(a: Direction, b: Direction): boolean {
  return a.x + b.x === 0 && a.y + b.y === 0
}

export function canTurn(current: Direction, next: Direction): boolean {
  return !isOpposite(current, next) && (current.x !== next.x || current.y !== next.y)
}

export function moveHead(head: Point, direction: Direction): Point {
  return { x: head.x + direction.x, y: head.y + direction.y }
}

export function hitsWall(point: Point): boolean {
  return point.x < 0 || point.y < 0 || point.x >= GRID_SIZE || point.y >= GRID_SIZE
}

export function hitsBody(point: Point, body: Point[], includeTail = true): boolean {
  const segments = includeTail ? body : body.slice(0, -1)
  return segments.some((segment) => samePoint(segment, point))
}

export function createSnake(start: Point, direction: Direction, color: string): Snake {
  return {
    body: [start, { x: start.x - direction.x, y: start.y - direction.y }, { x: start.x - direction.x * 2, y: start.y - direction.y * 2 }],
    direction,
    nextDirection: direction,
    alive: true,
    score: 0,
    color,
  }
}

export function randomFood(snakes: Snake[], random = Math.random): Point {
  const occupied = snakes.flatMap((snake) => snake.body)
  const open = Array.from({ length: GRID_SIZE * GRID_SIZE }, (_, index) => ({ x: index % GRID_SIZE, y: Math.floor(index / GRID_SIZE) }))
    .filter((point) => !occupied.some((segment) => samePoint(segment, point)))
  return open[Math.floor(random() * open.length)] ?? { x: 0, y: 0 }
}

export function nextAiDirection(snake: Snake, food: Point, difficulty: Difficulty, occupied: Point[]): Direction {
  const options = Object.values(DIRECTIONS).filter((direction) => canTurn(snake.direction, direction))
  const safe = options.filter((direction) => {
    const next = moveHead(snake.body[0], direction)
    return !hitsWall(next) && !hitsBody(next, [...snake.body, ...occupied])
  })
  if (safe.length === 0) return snake.direction
  if (difficulty === 'rookie') return safe[Math.floor(Math.random() * safe.length)]
  const ranked = safe.sort((a, b) => distance(moveHead(snake.body[0], a), food) - distance(moveHead(snake.body[0], b), food))
  if (difficulty === 'pro') return ranked[0]
  return ranked.find((direction) => hasEscape(moveHead(snake.body[0], direction), snake.body, occupied)) ?? ranked[0]
}

function distance(a: Point, b: Point): number {
  return Math.abs(a.x - b.x) + Math.abs(a.y - b.y)
}

function hasEscape(start: Point, ownBody: Point[], occupied: Point[]): boolean {
  const blocked = new Set([...ownBody, ...occupied].map((point) => `${point.x},${point.y}`))
  const queue = [start]
  const visited = new Set<string>()
  while (queue.length > 0 && visited.size < 80) {
    const point = queue.shift()!
    const key = `${point.x},${point.y}`
    if (visited.has(key) || hitsWall(point) || blocked.has(key)) continue
    visited.add(key)
    for (const direction of Object.values(DIRECTIONS)) queue.push(moveHead(point, direction))
  }
  return visited.size > 18
}
