export const RANK_MAX = 2;

const LABELS = {
  player1: '玩家 1',
  player2: '玩家 2',
};

/**
 * 构建结算排名快照（纯函数，不触碰 DOM 与 localStorage）。
 *
 * @param {{player1?: number, player2?: number}} [scores]
 * @returns {{entries: Array<{rank: number, playerId: string, label: string, score: number, tied: boolean}>, topPlayerId: string|null, draw: boolean, margin: number}}
 */
export function buildSettlement(scores = {}) {
  const players = Object.keys(LABELS).filter((playerId) =>
    Object.prototype.hasOwnProperty.call(scores, playerId) && Number.isFinite(scores[playerId])
  );

  const sorted = players
    .map((playerId) => ({ playerId, label: LABELS[playerId], score: scores[playerId] }))
    .sort((a, b) => b.score - a.score || a.playerId.localeCompare(b.playerId));

  const entries = sorted.map((row, index) => ({
    rank: competitionRank(sorted, index),
    playerId: row.playerId,
    label: row.label,
    score: row.score,
    tied: sorted.some((other, otherIndex) => otherIndex !== index && other.score === row.score),
  }));

  const draw = entries.length > 1 && entries.every((entry) => entry.score === entries[0].score);
  const topPlayerId = draw || entries.length === 0 ? null : entries[0].playerId;
  const margin = entries.length > 1 ? entries[0].score - entries[entries.length - 1].score : 0;

  return { entries, topPlayerId, draw, margin };
}

function competitionRank(sorted, index) {
  let rank = index + 1;
  while (rank > 1 && sorted[rank - 2].score === sorted[index].score) {
    rank -= 1;
  }
  return rank;
}
