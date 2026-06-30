import { describe, it, expect, vi, beforeEach } from 'vitest';
import { get } from 'svelte/store';
import { createMixer } from './mixer.js';
import { demoScene } from '../data/scenes.js';

function fakeEngine() {
  return {
    loadScene: vi.fn(),
    play: vi.fn(),
    stop: vi.fn(),
    setLayerVolume: vi.fn(),
    setMasterVolume: vi.fn(),
    setIntensity: vi.fn(),
    playOneShot: vi.fn(),
    intensity: 'explore'
  };
}

describe('mixer store', () => {
  let engine, mixer;
  beforeEach(() => {
    engine = fakeEngine();
    mixer = createMixer(engine);
    mixer.load(demoScene);
  });

  it('load imposta scena e stato iniziale layer', () => {
    expect(engine.loadScene).toHaveBeenCalledWith(demoScene);
    const state = get(mixer);
    expect(state.scene.id).toBe('tavern');
    expect(state.master).toBe(1);
    expect(state.intensity).toBe('explore');
    expect(state.layers.crowd).toBe(0);
  });

  it('setLayerVolume aggiorna stato e chiama engine', () => {
    mixer.setLayerVolume('crowd', 0.7);
    expect(engine.setLayerVolume).toHaveBeenCalledWith('crowd', 0.7);
    expect(get(mixer).layers.crowd).toBe(0.7);
  });

  it('setIntensity aggiorna stato e chiama engine', () => {
    mixer.setIntensity('combat');
    expect(engine.setIntensity).toHaveBeenCalledWith('combat');
    expect(get(mixer).intensity).toBe('combat');
  });

  it('toggle play aggiorna playing e chiama engine', () => {
    mixer.togglePlay();
    expect(engine.play).toHaveBeenCalled();
    expect(get(mixer).playing).toBe(true);
    mixer.togglePlay();
    expect(engine.stop).toHaveBeenCalled();
    expect(get(mixer).playing).toBe(false);
  });
});
