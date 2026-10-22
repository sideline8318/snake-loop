export const RANK_MAX = 2;

const LABELS = {
  player1: '玩家 1',
  player2: '玩家 2',
  player3: '玩家 3',
  player4: '玩家 4',
};

/**
 * 构建结算排名快照（纯函数，不触碰 DOM 与 localStorage）。
 *
 * @param {Record<string, number>} [scores]
 * @returns {{entries: Array<{rank: number, playerId: string, label: string, score: number, tied: boolean}>, topPlayerId: string|null, draw: boolean, margin: number}}
 */
export function buildSettlement(scores = {}) {
  const players = Object.keys(LABELS).filter((playerId) =>
    Object.prototype.hasOwnProperty.call(scores, playerId) && Number.isFinite(scores[playerId])
  );

  const sorted = players
    .map((playerId) => ({ playerId, label: LABELS[playerId], score: scores[playerId] }))
    .sort((a, b) => b.score - a.score || a.playerId.localeCompare(b.playerId));

  const ranks = competitionRanks(sorted);
  const entries = sorted.map((row, index) => ({
    rank: ranks[index],
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

function competitionRanks(sorted) {
  const ranks = [];
  let rank = 0;
  for (let index = 0; index < sorted.length; index++) {
    if (index > 0 && sorted[index - 1].score === sorted[index].score) ranks.push(rank);
    else {
      rank = index + 1;
      ranks.push(rank);
    }
  }
  return ranks;
}
