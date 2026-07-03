import { describe, it, expect, vi, beforeEach } from 'vitest';
import { get } from 'svelte/store';
import { createPlayer } from './player.js';
import { scenes } from '../data/scenes.js';

const A = scenes[0]; // tavern
const B = scenes.find((s) => s.id === 'forest');

function fakeEngine() {
  return {
    loadScene: vi.fn(), play: vi.fn(), pause: vi.fn(), stop: vi.fn(),
    setLayerVolume: vi.fn(), setMasterVolume: vi.fn(), setIntensity: vi.fn(),
    playOneShot: vi.fn(), destroy: vi.fn(), intensity: 'explore'
  };
}

describe('player globale', () => {
  let engine, player;
  beforeEach(() => { engine = fakeEngine(); player = createPlayer({ engine }); });

  it('playScene attiva la scena e suona', () => {
    player.playScene(A);
    expect(engine.loadScene).toHaveBeenCalledWith(A);
    expect(engine.play).toHaveBeenCalled();
    expect(get(player).scene.id).toBe('tavern');
    expect(get(player).playing).toBe(true);
  });

  it('una scena alla volta: playScene di un\'altra ricarica (ferma la precedente)', () => {
    player.playScene(A);
    engine.loadScene.mockClear();
    player.playScene(B);
    expect(engine.loadScene).toHaveBeenCalledWith(B);
    expect(get(player).scene.id).toBe('forest');
  });

  it('togglePlay mette in pausa la scena attiva', () => {
    player.playScene(A);
    player.togglePlay();
    expect(engine.pause).toHaveBeenCalled();
    expect(get(player).playing).toBe(false);
  });

  it('setLayer su una scena non attiva la attiva prima', () => {
    player.playScene(A);
    engine.loadScene.mockClear();
    player.setLayer(B, 'wind', 0.5);
    expect(engine.loadScene).toHaveBeenCalledWith(B);
    expect(engine.setLayerVolume).toHaveBeenCalledWith('wind', 0.5);
  });

  it('oneShot su una scena non attiva la attiva prima', () => {
    player.playScene(A);
    player.oneShot(B, 'twig');
    expect(engine.playOneShot).toHaveBeenCalledWith('twig');
    expect(get(player).scene.id).toBe('forest');
  });
});
