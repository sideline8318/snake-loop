import { describe, it, expect } from 'vitest';
import { buildSettlement } from '../../src/game/settlement.js';

describe('buildSettlement', () => {
  it('player 1 leading yields rank 1 top and correct margin', () => {
    const s = buildSettlement({ player1: 30, player2: 10 });
    expect(s.entries.map((e) => e.playerId)).toEqual(['player1', 'player2']);
    expect(s.entries[0]).toMatchObject({ rank: 1, playerId: 'player1', label: '玩家 1', score: 30, tied: false });
    expect(s.entries[1].rank).toBe(2);
    expect(s.topPlayerId).toBe('player1');
    expect(s.draw).toBe(false);
    expect(s.margin).toBe(20);
  });

  it('player 2 leading sorts descending', () => {
    const s = buildSettlement({ player1: 10, player2: 50 });
    expect(s.entries[0]).toMatchObject({ rank: 1, playerId: 'player2', score: 50 });
    expect(s.topPlayerId).toBe('player2');
    expect(s.margin).toBe(40);
  });

  it('draw with equal scores marks both tied at rank 1', () => {
    const s = buildSettlement({ player1: 0, player2: 0 });
    expect(s.entries).toHaveLength(2);
    expect(s.entries.every((e) => e.rank === 1 && e.tied === true)).toBe(true);
    expect(s.draw).toBe(true);
    expect(s.topPlayerId).toBeNull();
    expect(s.margin).toBe(0);
  });

  it('single player keeps one entry', () => {
    const s = buildSettlement({ player1: 20 });
    expect(s.entries).toHaveLength(1);
    expect(s.entries[0]).toMatchObject({ rank: 1, playerId: 'player1', score: 20, tied: false });
    expect(s.draw).toBe(false);
    expect(s.topPlayerId).toBe('player1');
  });

  it('empty input yields empty entries', () => {
    const s = buildSettlement({});
    expect(s.entries).toEqual([]);
    expect(s.topPlayerId).toBeNull();
    expect(s.draw).toBe(false);
    expect(s.margin).toBe(0);
  });

  it('output is deterministic regardless of input key order', () => {
    const a = buildSettlement({ player2: 20, player1: 20 });
    const b = buildSettlement({ player1: 20, player2: 20 });
    expect(a).toEqual(b);
    expect(a.entries.map((e) => e.playerId)).toEqual(['player1', 'player2']);
  });

  it('mid-table tie yields competition ranks 1, 2, 2, 4', () => {
    const s = buildSettlement({ player1: 30, player2: 40, player3: 30, player4: 10 });
    expect(s.entries.map((e) => [e.playerId, e.rank, e.tied])).toEqual([
      ['player2', 1, false],
      ['player1', 2, true],
      ['player3', 2, true],
      ['player4', 4, false],
    ]);
    expect(s.draw).toBe(false);
    expect(s.topPlayerId).toBe('player2');
    expect(s.margin).toBe(30);
  });

  it('ranks stay monotonic when the leading scores are tied', () => {
    const s = buildSettlement({ player1: 50, player2: 50, player3: 20 });
    expect(s.entries.map((e) => e.rank)).toEqual([1, 1, 3]);
    expect(s.entries.map((e) => e.tied)).toEqual([true, true, false]);
    expect(s.topPlayerId).not.toBeNull();
  });
});
