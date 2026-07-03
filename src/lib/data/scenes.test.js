import { describe, it, expect } from 'vitest';
import { scenes, getScene, demoScene } from './scenes.js';

describe('scenes library', () => {
  it('contiene 12 scene con id/nome/cover e musica esplora', () => {
    expect(scenes.length).toBe(12);
    for (const s of scenes) {
      expect(s.id).toBeTypeOf('string');
      expect(s.name).toBeTypeOf('string');
      expect(s.cover).toBeTypeOf('string');
      expect(s.music.explore.length).toBeGreaterThan(0);
      expect(Array.isArray(s.music.combat)).toBe(true);
      expect(Array.isArray(s.music.victory)).toBe(true);
      expect(s.ambient.length).toBeGreaterThan(0);
      expect(s.oneshots.length).toBeGreaterThan(0);
    }
  });

  it('le 4 scene originali hanno le 3 intensità, le altre sono semplici', () => {
    const withIntensity = scenes.filter((s) => s.music.combat.length > 0).map((s) => s.id);
    expect(withIntensity.sort()).toEqual(['city', 'dungeon', 'forest', 'tavern']);
  });

  it('ha id scena unici', () => {
    const ids = scenes.map((s) => s.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('getScene ritorna la scena per id, undefined se assente', () => {
    expect(getScene('battle')).toBe(scenes.find((s) => s.id === 'battle'));
    expect(getScene('nope')).toBeUndefined();
  });

  it('demoScene è la prima scena (tavern, con intensità)', () => {
    expect(demoScene).toBe(scenes[0]);
    expect(demoScene.id).toBe('tavern');
    expect(demoScene.music.combat.length).toBeGreaterThan(0);
  });
});
