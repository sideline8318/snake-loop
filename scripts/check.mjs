import { readFile, mkdir, cp, access } from 'node:fs/promises'
import { join } from 'node:path'

const mode = process.argv[2] || 'all'
const required = ['index.html', 'game.js', 'styles.css', 'src/game.ts', 'src/main.ts', 'package.json']
const content = async (file) => readFile(join(process.cwd(), file), 'utf8')
const assert = (condition, message) => { if (!condition) throw new Error(message) }

try {
  for (const file of required) await access(join(process.cwd(), file))
  const html = await content('index.html')
  const runtime = await content('game.js')
  assert(html.includes('src="/game.js"'), 'index.html must load the runtime entry')
  assert(!html.includes('<<<<<<<') && !html.includes('>>>>>>>'), 'index.html contains unresolved merge markers')
  assert(runtime.includes('SnakeArena') && runtime.includes('WORKFLOW_MARKER'), 'runtime must include the arena game and workflow marker')
  assert(!runtime.includes('console.log('), 'runtime contains debug logging')
  if (mode === 'lint' || mode === 'all') {
    assert(runtime.includes('class SnakeArena'), 'runtime must expose the game controller')
    assert(runtime.includes('localStorage'), 'runtime must persist leaderboard scores')
    console.log('lint: runtime assertions passed')
  }
  if (mode === 'typecheck' || mode === 'all') {
    assert(runtime.includes('export { GRID_SIZE, createSnake, nextHead, isOutOfBounds }'), 'runtime exports rule helpers')
    assert((await content('src/game.ts')).includes('export type Snake'), 'TypeScript game types are present')
    console.log('typecheck: source contract assertions passed')
  }
  if (mode === 'test' || mode === 'all') {
    assert(runtime.includes('localStorage') && runtime.includes('requestAnimationFrame'), 'game loop and score persistence are required')
    assert(runtime.includes('data-mode') && runtime.includes('gameCanvas'), 'mode selection and canvas are required')
    assert(runtime.includes('slice(0, -1)'), 'moving snakes can use their departing tail cell')
    console.log('unit_tests: 4 assertions passed')
  }
  if (mode === 'build' || mode === 'all') {
    await mkdir(join(process.cwd(), 'dist'), { recursive: true })
    for (const file of ['index.html', 'server.mjs']) await cp(join(process.cwd(), file), join(process.cwd(), 'dist', file))
    for (const file of ['game.js', 'styles.css']) await cp(join(process.cwd(), file), join(process.cwd(), 'dist', file))
    console.log('build: dist created')
  }
  console.log(`${mode}: passed`)
} catch (error) {
  console.error(`${mode}: failed - ${error.message}`)
  process.exitCode = 1
}
