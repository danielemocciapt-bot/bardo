import { describe, it, expect } from 'vitest';
import { scenes, getScene, demoScene } from './scenes.js';

describe('scenes library', () => {
  it('contiene 4 scene con id/nome/cover e tre intensità', () => {
    expect(scenes.length).toBe(4);
    for (const s of scenes) {
      expect(s.id).toBeTypeOf('string');
      expect(s.name).toBeTypeOf('string');
      expect(s.cover).toBeTypeOf('string');
      expect(s.music.explore.length).toBeGreaterThan(0);
      expect(s.music.combat.length).toBeGreaterThan(0);
      expect(s.music.victory.length).toBeGreaterThan(0);
      expect(s.ambient.length).toBeGreaterThan(0);
      expect(s.oneshots.length).toBeGreaterThan(0);
    }
  });

  it('ha id scena unici', () => {
    const ids = scenes.map((s) => s.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('getScene ritorna la scena per id, undefined se assente', () => {
    expect(getScene('tavern')).toBe(scenes.find((s) => s.id === 'tavern'));
    expect(getScene('nope')).toBeUndefined();
  });

  it('demoScene è la prima scena', () => {
    expect(demoScene).toBe(scenes[0]);
  });
});
