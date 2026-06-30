import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AudioEngine } from './AudioEngine.js';
import { demoScene } from '../data/scenes.js';

/** Crea un Howl finto che registra le chiamate. */
function makeFakeHowl() {
  const created = [];
  const factory = (opts) => {
    const howl = {
      opts,
      _vol: opts.volume ?? 1,
      play: vi.fn(),
      stop: vi.fn(),
      unload: vi.fn(),
      fade: vi.fn(),
      once: vi.fn(),
      volume: vi.fn(function (v) {
        if (v === undefined) return this._vol;
        this._vol = v;
        return this;
      })
    };
    created.push(howl);
    return howl;
  };
  return { factory, created };
}

describe('AudioEngine volumi', () => {
  let fake, engine;
  beforeEach(() => {
    fake = makeFakeHowl();
    engine = new AudioEngine({ howlFactory: fake.factory });
    engine.loadScene(demoScene);
  });

  it('setLayerVolume applica master*layer al Howl del layer', () => {
    engine.setMasterVolume(0.5);
    engine.setLayerVolume('crowd', 0.4);
    const howl = engine._layerHowl('crowd');
    expect(howl.volume).toHaveBeenLastCalledWith(0.2); // 0.5 * 0.4
  });

  it('setMasterVolume riscala tutti i layer attivi', () => {
    engine.setLayerVolume('crowd', 1);
    engine.setLayerVolume('fire', 0.5);
    engine.setMasterVolume(0.6);
    expect(engine._layerHowl('crowd').volume).toHaveBeenLastCalledWith(0.6);
    expect(engine._layerHowl('fire').volume).toHaveBeenLastCalledWith(0.3);
  });
});
