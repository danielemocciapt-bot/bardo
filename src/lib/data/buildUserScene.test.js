import { describe, it, expect } from 'vitest';
import { buildUserScene } from './buildUserScene.js';

const musicRef = { id: 'forest-explore', name: 'Sentiero', src: ['/audio/forest/music.webm', '/audio/forest/music.m4a'], loop: true };
const crowd = { id: 'crowd', name: 'Brusio', src: ['/audio/tavern/crowd.webm'], loop: true };
const door = { id: 'door', name: 'Porta', src: ['/audio/tavern/door.webm'] };

describe('buildUserScene', () => {
  it('assembla una UserScene con id u-, custom true e musica nelle tre intensità', () => {
    const s = buildUserScene(
      { name: 'La mia taverna', cover: 'linear-gradient(1)', musicRef, ambientRefs: [crowd], oneshotRefs: [door] },
      () => 'u-fixed'
    );
    expect(s.id).toBe('u-fixed');
    expect(s.custom).toBe(true);
    expect(s.name).toBe('La mia taverna');
    expect(s.cover).toBe('linear-gradient(1)');
    expect(s.music.explore[0].id).toBe('forest-explore');
    expect(s.music.combat[0].id).toBe('forest-explore');
    expect(s.music.victory[0].id).toBe('forest-explore');
    expect(s.ambient.map((a) => a.id)).toEqual(['crowd']);
    expect(s.oneshots.map((o) => o.id)).toEqual(['door']);
  });

  it('default: ambient/oneshots vuoti se non passati', () => {
    const s = buildUserScene({ name: 'x', cover: 'c', musicRef }, () => 'u-1');
    expect(s.ambient).toEqual([]);
    expect(s.oneshots).toEqual([]);
  });

  it('genera id diversi con il generatore di default', () => {
    const a = buildUserScene({ name: 'a', cover: 'c', musicRef });
    const b = buildUserScene({ name: 'b', cover: 'c', musicRef });
    expect(a.id.startsWith('u-')).toBe(true);
    expect(a.id).not.toBe(b.id);
  });
});
