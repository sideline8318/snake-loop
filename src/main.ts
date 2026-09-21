import './style.css'
import { canTurn, createSnake, DIRECTIONS, GameMode, GRID_SIZE, hitsBody, hitsWall, moveHead, nextAiDirection, Point, randomFood, Snake, samePoint, Difficulty } from './game'
import { getScores, saveScore, ScoreEntry } from './storage'

const WORKFLOW_MARKER = '6b06ba62-a7bf-471c-90ec-9acd37811162'
const app = document.querySelector<HTMLDivElement>('#app')!

type Screen = 'lobby' | 'game'
type GameState = { mode: GameMode; difficulty: Difficulty; running: boolean; paused: boolean; tick: number; food: Point; snakes: Snake[]; lastScoreSaved: boolean }

let screen: Screen = 'lobby'
let selectedMode: GameMode = 'solo'
let selectedDifficulty: Difficulty = 'pro'
let playerName = 'PLAYER 01'
let scores = getScores()
let state: GameState | undefined
let animation = 0
let lastFrame = 0

function renderLobby(): void {
  app.innerHTML = `<main class="shell lobby-shell" data-workflow="${WORKFLOW_MARKER}">
    <header class="topbar"><div class="brand"><span class="brand-mark">+</span><span>ARENA<span class="brand-dim"> // SNAKE CIRCUIT</span></span></div><div class="top-meta"><span class="live-dot"></span> LIVE SYSTEM <span class="divider"></span> SEASON 04</div></header>
    <section class="hero"><div class="eyebrow">WELCOME TO THE GRID <span>///</span> 2026.09</div><h1>成为<span>最快的蛇</span></h1><p>在霓虹网格中生存、成长、制霸排行榜。每一次转向，都是一场决策。</p><div class="hero-actions"><button class="primary-btn" id="enter-btn">进入赛场 <span>→</span></button><button class="ghost-btn" id="how-btn">操作说明 <span>⌁</span></button></div><div class="hero-stats"><div><strong>20 × 20</strong><small>竞技网格</small></div><div><strong>03</strong><small>游戏模式</small></div><div><strong>∞</strong><small>无限可能</small></div></div></section>
    <section class="lobby-grid"><div class="panel modes-panel"><div class="panel-heading"><span><i class="section-index">01</i> 选择赛制</span><span class="panel-note">SELECT MODE</span></div><div class="mode-list">${modeCard('solo', '单人冲刺', 'SOLO SPRINT', '与时间赛跑，刷新你的个人纪录。', '01', '⌁')} ${modeCard('versus', '双人对决', 'DUO DUEL', '同屏竞技，最后存活者获胜。', '02', '◉')} ${modeCard('ai', 'AI 猎手', 'AI HUNTER', '挑战三档智能，测试你的极限。', '03', '✦')}</div><div class="player-input"><label>参赛代号</label><input id="name-input" maxlength="14" value="${playerName}" placeholder="输入你的名字" /></div></div><div class="panel leaderboard-panel"><div class="panel-heading"><span><i class="section-index">02</i> 荣誉榜</span><span class="panel-note">TOP RUNNERS</span></div><div class="leaderboard">${scores.map((score, index) => scoreRow(score, index)).join('')}</div><div class="leaderboard-footer"><span><span class="live-dot"></span> 记录实时同步</span><span>查看全部 →</span></div></div></section>
    <footer class="footer"><span>ARENA SYSTEMS <b>·</b> BUILT FOR THE BOLD</span><span>键盘方向键 / WASD 控制 <b>·</b> SPACE 暂停</span></footer>
  </main>`
  document.querySelector('#enter-btn')?.addEventListener('click', startGame)
  document.querySelector('#how-btn')?.addEventListener('click', () => alert('方向键或 WASD 移动，SPACE 暂停，R 重新开始。双人模式使用方向键与 WASD 分别控制两条蛇。'))
  document.querySelector('#name-input')?.addEventListener('input', (event) => { playerName = (event.target as HTMLInputElement).value.toUpperCase() || 'PLAYER 01' })
  document.querySelectorAll<HTMLButtonElement>('[data-mode]').forEach((button) => button.addEventListener('click', () => { selectedMode = button.dataset.mode as GameMode; renderLobby() }))
}

function modeCard(mode: GameMode, title: string, label: string, description: string, number: string, icon: string): string {
  return `<button class="mode-card ${selectedMode === mode ? 'selected' : ''}" data-mode="${mode}"><span class="mode-icon">${icon}</span><span class="mode-copy"><b>${title}</b><small>${label}</small><em>${description}</em></span><span class="mode-number">${number}</span></button>`
}

function scoreRow(score: ScoreEntry, index: number): string {
  return `<div class="score-row"><span class="rank ${index === 0 ? 'gold' : ''}">${String(index + 1).padStart(2, '0')}</span><span class="avatar">${score.name.slice(0, 1)}</span><span class="score-name"><b>${score.name}</b><small>${score.mode}</small></span><strong>${score.score.toLocaleString()}</strong><span class="score-date">${score.date}</span></div>`
}

function startGame(): void {
  screen = 'game'
  const first = selectedMode === 'versus' ? createSnake({ x: 5, y: 10 }, DIRECTIONS.right, '#d5ff55') : createSnake({ x: 6, y: 10 }, DIRECTIONS.right, '#d5ff55')
  const snakes = [first]
  if (selectedMode === 'versus' || selectedMode === 'ai') snakes.push(createSnake({ x: 14, y: 10 }, DIRECTIONS.left, selectedMode === 'ai' ? '#f58cff' : '#55d8ff'))
  state = { mode: selectedMode, difficulty: selectedDifficulty, running: true, paused: false, tick: 0, food: randomFood(snakes), snakes, lastScoreSaved: false }
  renderGame()
  animation = requestAnimationFrame(loop)
}

function renderGame(): void {
  app.innerHTML = `<main class="shell game-shell" data-workflow="${WORKFLOW_MARKER}"><header class="topbar"><button class="back-btn" id="back-btn">← 返回大厅</button><div class="brand"><span class="brand-mark">+</span><span>ARENA<span class="brand-dim"> // ${state?.mode === 'solo' ? 'SOLO SPRINT' : state?.mode === 'ai' ? 'AI HUNTER' : 'DUO DUEL'}</span></span></div><div class="top-meta"><span class="live-dot"></span> MATCH IN PROGRESS</div></header><section class="game-layout"><aside class="game-sidebar"><div class="match-label">MATCH 04 / ${state?.mode === 'ai' ? 'AI HUNTER' : state?.mode === 'versus' ? 'DUO DUEL' : 'SOLO SPRINT'}</div><div class="big-score"><small>YOUR SCORE</small><strong id="score-value">0000</strong><span><i class="trend">↑</i> 当前连胜中</span></div><div class="side-rule"></div><div class="stat-pair"><span>长度</span><b id="length-value">03</b></div><div class="stat-pair"><span>速度</span><b id="speed-value">1.0x</b></div><div class="stat-pair"><span>最佳</span><b>${scores[0]?.score.toLocaleString() ?? '0000'}</b></div><div class="control-card"><span class="control-title">控制方式</span><div class="key-hint"><kbd>W</kbd><kbd>A</kbd><kbd>S</kbd><kbd>D</kbd><small>移动蛇身</small></div><div class="key-hint"><kbd>SPACE</kbd><small>暂停 / 继续</small></div></div><button class="pause-btn" id="pause-btn">暂停游戏 <span>Ⅱ</span></button></aside><section class="board-wrap"><div class="board-top"><div><span class="eyebrow">LIVE ARENA</span><h2 id="board-title">最后一条蛇站立</h2></div><div class="round-info"><span>ROUND <b>04</b></span><span>TIME <b id="time-value">00:00</b></span></div></div><div class="canvas-frame"><canvas id="game-canvas" width="600" height="600" aria-label="贪吃蛇竞技场"></canvas><div class="canvas-overlay" id="overlay"></div></div><div class="board-bottom"><span><i class="legend-dot food-dot"></i> 能量核心</span><span><i class="legend-dot player-dot"></i> ${playerName}</span>${state?.snakes.length === 2 ? '<span><i class="legend-dot rival-dot"></i> 对手</span>' : ''}<span class="tip">吃到核心获得 10 分 · 撞墙即出局</span></div></section></section></main>`
  document.querySelector('#back-btn')?.addEventListener('click', () => { cancelAnimationFrame(animation); screen = 'lobby'; renderLobby() })
  document.querySelector('#pause-btn')?.addEventListener('click', togglePause)
}

function loop(timestamp: number): void {
  if (screen !== 'game' || !state) return
  if (!lastFrame) lastFrame = timestamp
  if (timestamp - lastFrame > (state.paused ? 999999 : 130)) { step(); lastFrame = timestamp }
  draw()
  animation = requestAnimationFrame(loop)
}

function step(): void {
  if (!state) return
  state.tick++
  const occupied = state.snakes.flatMap((snake) => snake.body)
  state.snakes.forEach((snake, index) => {
    if (!snake.alive) return
    if (state?.mode === 'ai' && index === 1) snake.nextDirection = nextAiDirection(snake, state.food, state.difficulty, state.snakes[0].body)
    const next = moveHead(snake.body[0], snake.nextDirection)
    const rivalBody = state.snakes.filter((_, rivalIndex) => rivalIndex !== index).flatMap((rival) => rival.body)
    if (hitsWall(next) || hitsBody(next, snake.body, false) || rivalBody.some((point) => samePoint(point, next))) { snake.alive = false; return }
    snake.direction = snake.nextDirection
    snake.body.unshift(next)
    if (samePoint(next, state.food)) { snake.score += 10; state.food = randomFood(state.snakes) } else snake.body.pop()
  })
  const alive = state.snakes.filter((snake) => snake.alive)
  if (alive.length <= 1 && state.mode !== 'solo' || state.mode === 'solo' && !state.snakes[0].alive) endGame()
}

function draw(): void {
  const canvas = document.querySelector<HTMLCanvasElement>('#game-canvas')
  if (!canvas || !state) return
  const ctx = canvas.getContext('2d')!
  const cell = canvas.width / GRID_SIZE
  ctx.fillStyle = '#101721'; ctx.fillRect(0, 0, canvas.width, canvas.height)
  ctx.strokeStyle = 'rgba(125, 153, 176, .11)'; ctx.lineWidth = 1
  for (let i = 1; i < GRID_SIZE; i++) { ctx.beginPath(); ctx.moveTo(i * cell, 0); ctx.lineTo(i * cell, canvas.height); ctx.stroke(); ctx.beginPath(); ctx.moveTo(0, i * cell); ctx.lineTo(canvas.width, i * cell); ctx.stroke() }
  ctx.shadowBlur = 18; ctx.shadowColor = '#f58cff'; ctx.fillStyle = '#f58cff'; ctx.beginPath(); ctx.arc(state.food.x * cell + cell / 2, state.food.y * cell + cell / 2, cell * .27, 0, Math.PI * 2); ctx.fill(); ctx.shadowBlur = 0
  state.snakes.forEach((snake) => snake.body.forEach((part, index) => { ctx.fillStyle = snake.alive ? snake.color : '#495466'; ctx.globalAlpha = index === 0 ? 1 : Math.max(.35, 1 - index / 30); roundRect(ctx, part.x * cell + 3, part.y * cell + 3, cell - 6, cell - 6, index === 0 ? 7 : 4); ctx.fill(); if (index === 0 && snake.alive) { ctx.fillStyle = '#101721'; ctx.beginPath(); ctx.arc(part.x * cell + cell * .37, part.y * cell + cell * .38, 2.5, 0, Math.PI * 2); ctx.arc(part.x * cell + cell * .63, part.y * cell + cell * .38, 2.5, 0, Math.PI * 2); ctx.fill() } }))
  ctx.globalAlpha = 1
  const player = state.snakes[0]
  document.querySelector('#score-value')!.textContent = String(player.score).padStart(4, '0')
  document.querySelector('#length-value')!.textContent = String(player.body.length).padStart(2, '0')
  document.querySelector('#speed-value')!.textContent = `${(1 + Math.min(1.5, state.tick / 150)).toFixed(1)}x`
  document.querySelector('#time-value')!.textContent = new Date(state.tick * 130).toISOString().substring(14, 19)
}

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, radius: number): void { ctx.beginPath(); ctx.roundRect(x, y, width, height, radius) }

function togglePause(): void { if (!state) return; state.paused = !state.paused; document.querySelector('#pause-btn')!.innerHTML = state.paused ? '继续游戏 <span>▶</span>' : '暂停游戏 <span>Ⅱ</span>'; document.querySelector('#overlay')!.innerHTML = state.paused ? '<div class="paused-label">PAUSED<span>按 SPACE 继续</span></div>' : '' }

function endGame(): void {
  if (!state || !state.running) return
  state.running = false
  const player = state.snakes[0]
  if (!state.lastScoreSaved && player.score > 0) { scores = saveScore({ name: playerName, score: player.score, mode: state.mode === 'solo' ? '单人' : state.mode === 'ai' ? 'AI 对战' : '双人', date: '刚刚' }); state.lastScoreSaved = true }
  document.querySelector('#overlay')!.innerHTML = `<div class="game-over"><span class="eyebrow">MATCH COMPLETE</span><h3>${player.alive ? '你赢了' : '继续训练'}</h3><strong>${player.score.toLocaleString()}</strong><small>最终得分</small><button class="primary-btn" id="retry-btn">再来一局 <span>→</span></button></div>`
  document.querySelector('#retry-btn')?.addEventListener('click', startGame)
}

document.addEventListener('keydown', (event) => {
  if (screen !== 'game' || !state) return
  if (event.key === ' ') { event.preventDefault(); togglePause(); return }
  if (event.key.toLowerCase() === 'r') { startGame(); return }
  const map: Record<string, Point> = { ArrowUp: DIRECTIONS.up, ArrowDown: DIRECTIONS.down, ArrowLeft: DIRECTIONS.left, ArrowRight: DIRECTIONS.right, w: DIRECTIONS.up, s: DIRECTIONS.down, a: DIRECTIONS.left, d: DIRECTIONS.right }
  const direction = map[event.key] ?? map[event.key.toLowerCase()]
  if (direction && canTurn(state.snakes[0].direction, direction)) { event.preventDefault(); state.snakes[0].nextDirection = direction }
  if (state.mode === 'versus') { const secondMap: Record<string, Point> = { i: DIRECTIONS.up, k: DIRECTIONS.down, j: DIRECTIONS.left, l: DIRECTIONS.right }; const secondDirection = secondMap[event.key.toLowerCase()]; if (secondDirection && canTurn(state.snakes[1].direction, secondDirection)) state.snakes[1].nextDirection = secondDirection }
})

renderLobby()
