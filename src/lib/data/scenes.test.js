import { describe, it, expect } from 'vitest';
import { scenes, getScene, demoScene } from './scenes.js';

describe('scenes library', () => {
  it('contiene 21 scene con id/nome/cover/categoria e musica esplora', () => {
    expect(scenes.length).toBe(21);
    for (const s of scenes) {
      expect(s.id).toBeTypeOf('string');
      expect(s.name).toBeTypeOf('string');
      expect(s.cover).toBeTypeOf('string');
      expect(s.category).toBeTypeOf('string');
      expect(s.music.explore.length).toBeGreaterThan(0);
      expect(Array.isArray(s.music.combat)).toBe(true);
      expect(Array.isArray(s.music.victory)).toBe(true);
      expect(s.ambient.length).toBeGreaterThan(0);
      expect(s.oneshots.length).toBeGreaterThan(0);
    }
  });

  it('ha 4 categorie con scene', () => {
    const cats = new Set(scenes.map((s) => s.category));
    expect([...cats].sort()).toEqual(['fantasy', 'horror', 'scifi', 'space']);
  });

  it('tutte le scene fantasy hanno le 3 intensità', () => {
    const fantasy = scenes.filter((s) => s.category === 'fantasy');
    expect(fantasy.length).toBeGreaterThan(0);
    for (const s of fantasy) {
      expect(s.music.combat.length).toBeGreaterThan(0);
      expect(s.music.victory.length).toBeGreaterThan(0);
    }
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
