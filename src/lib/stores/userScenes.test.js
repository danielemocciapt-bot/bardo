import { describe, it, expect } from 'vitest';
import { get } from 'svelte/store';
import { createUserScenes } from './userScenes.js';

function memStorage(initial) {
  const m = { ...(initial || {}) };
  return {
    getItem: (k) => (k in m ? m[k] : null),
    setItem: (k, v) => { m[k] = String(v); },
    removeItem: (k) => { delete m[k]; },
    _dump: () => m
  };
}
const scene = (id) => ({ id, name: id, cover: 'c', custom: true, music: { explore: [], combat: [], victory: [] }, ambient: [], oneshots: [] });

describe('userScenes store', () => {
  it('parte vuoto se storage vuoto', () => {
    const us = createUserScenes(memStorage());
    expect(get(us)).toEqual([]);
    expect(us.all()).toEqual([]);
  });

  it('add persiste su storage e aggiorna lo store', () => {
    const st = memStorage();
    const us = createUserScenes(st);
    us.add(scene('u-1'));
    expect(get(us).map((s) => s.id)).toEqual(['u-1']);
    expect(JSON.parse(st.getItem('bardo.userScenes')).map((s) => s.id)).toEqual(['u-1']);
  });

  it('remove elimina e persiste', () => {
    const st = memStorage();
    const us = createUserScenes(st);
    us.add(scene('u-1'));
    us.add(scene('u-2'));
    us.remove('u-1');
    expect(us.all().map((s) => s.id)).toEqual(['u-2']);
    expect(JSON.parse(st.getItem('bardo.userScenes')).map((s) => s.id)).toEqual(['u-2']);
  });

  it('reidrata da storage esistente all avvio', () => {
    const st = memStorage({ 'bardo.userScenes': JSON.stringify([scene('u-9')]) });
    const us = createUserScenes(st);
    expect(us.all().map((s) => s.id)).toEqual(['u-9']);
  });
});
