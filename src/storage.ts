export type ScoreEntry = { name: string; score: number; mode: string; date: string }
const KEY = 'arena-snake-leaderboard'
const defaults: ScoreEntry[] = [
  { name: 'NOVA', score: 1240, mode: '单人', date: '今日' },
  { name: 'BYTE', score: 980, mode: 'AI 对战', date: '昨日' },
  { name: 'KAI', score: 760, mode: '双人', date: '09/18' },
]

export function getScores(): ScoreEntry[] {
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? JSON.parse(raw) as ScoreEntry[] : defaults
  } catch {
    return defaults
  }
}

export function saveScore(entry: ScoreEntry): ScoreEntry[] {
  const scores = [...getScores(), entry].sort((a, b) => b.score - a.score).slice(0, 8)
  try { localStorage.setItem(KEY, JSON.stringify(scores)) } catch { /* memory fallback */ }
  return scores
}
