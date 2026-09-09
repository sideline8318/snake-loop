import { describe, it, expect } from 'vitest';
import { mapKey } from '../../src/game/input.js';

describe('mapKey (WASD + arrow + control key normalisation) [regression for bug A]', () => {
  it('maps arrow keys to directions', () => {
    expect(mapKey('ArrowUp')).toBe('up');
    expect(mapKey('ArrowDown')).toBe('down');
    expect(mapKey('ArrowLeft')).toBe('left');
    expect(mapKey('ArrowRight')).toBe('right');
  });

  it('maps WASD (any case) to real directions instead of "right"', () => {
    expect(mapKey('w')).toBe('up');
    expect(mapKey('W')).toBe('up');
    expect(mapKey('a')).toBe('left');
    expect(mapKey('A')).toBe('left');
    expect(mapKey('s')).toBe('down');
    expect(mapKey('S')).toBe('down');
    expect(mapKey('d')).toBe('right');
    expect(mapKey('D')).toBe('right');
  });

  it('maps space and p/P to pause, r/R to restart', () => {
    expect(mapKey(' ')).toBe('space');
    expect(mapKey('p')).toBe('space');
    expect(mapKey('P')).toBe('space');
    expect(mapKey('r')).toBe('restart');
    expect(mapKey('R')).toBe('restart');
  });

  it('passes unrelated keys through lowercased', () => {
    expect(mapKey('G')).toBe('g');
    expect(mapKey('?')).toBe('?');
  });
});