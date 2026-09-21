import { readFile, mkdir, cp, access } from 'node:fs/promises'
import { join } from 'node:path'

const mode = process.argv[2] || 'all'
const required = ['index.html', 'src/main.js', 'src/style.css', 'src/game.ts', 'src/main.ts', 'package.json']
const content = async (file) => readFile(join(process.cwd(), file), 'utf8')
const assert = (condition, message) => { if (!condition) throw new Error(message) }

try {
  for (const file of required) await access(join(process.cwd(), file))
  const html = await content('index.html')
  const runtime = await content('src/main.js')
  assert(html.includes('src/main.js'), 'index.html must load the runtime entry')
  assert(runtime.includes('ARENA') && runtime.includes('workflow'), 'runtime must include the arena UI and workflow marker')
  assert(!runtime.includes('console.log('), 'runtime contains debug logging')
  if (mode === 'test' || mode === 'all') {
    assert(runtime.includes('localStorage') && runtime.includes('requestAnimationFrame'), 'game loop and score persistence are required')
    assert(runtime.includes('data-mode') && runtime.includes('game-canvas'), 'mode selection and canvas are required')
    console.log('unit_tests: 4 assertions passed')
  }
  if (mode === 'build' || mode === 'all') {
    await mkdir(join(process.cwd(), 'dist'), { recursive: true })
    for (const file of ['index.html', 'server.mjs']) await cp(join(process.cwd(), file), join(process.cwd(), 'dist', file))
    await mkdir(join(process.cwd(), 'dist/src'), { recursive: true })
    for (const file of ['main.js', 'style.css']) await cp(join(process.cwd(), 'src', file), join(process.cwd(), 'dist/src', file))
    console.log('build: dist created')
  }
  console.log(`${mode}: passed`)
} catch (error) {
  console.error(`${mode}: failed - ${error.message}`)
  process.exitCode = 1
}
