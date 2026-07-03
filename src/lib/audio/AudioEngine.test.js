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
      pause: vi.fn(),
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
    engine.setLayerVolume('tavern-explore', 0.5);
    engine.setMasterVolume(0.6);
    expect(engine._layerHowl('crowd').volume).toHaveBeenLastCalledWith(0.6);
    expect(engine._layerHowl('tavern-explore').volume).toHaveBeenLastCalledWith(0.3);
  });
});

describe('AudioEngine play / intensità / oneshot', () => {
  let fake, engine;
  beforeEach(() => {
    fake = makeFakeHowl();
    engine = new AudioEngine({ howlFactory: fake.factory });
    engine.loadScene(demoScene);
  });

  it('play() avvia tutti i layer', () => {
    engine.play();
    expect(engine._layerHowl('crowd').play).toHaveBeenCalled();
    expect(engine._layerHowl('tavern-explore').play).toHaveBeenCalled();
  });

  it('setIntensity crea il nuovo layer musicale e fa il crossfade', () => {
    engine.play();
    const oldMusic = engine._layerHowl('tavern-explore');
    engine.setIntensity('combat');
    // nuovo layer musicale combat presente e in play
    const newMusic = engine._layerHowl('tavern-combat');
    expect(newMusic).toBeTruthy();
    expect(newMusic.play).toHaveBeenCalled();
    // fade: vecchio verso 0, nuovo verso master
    expect(oldMusic.fade).toHaveBeenCalled();
    expect(newMusic.fade).toHaveBeenCalled();
    expect(engine.intensity).toBe('combat');
  });

  it('playOneShot crea e riproduce un Howl non-loop una sola volta', () => {
    engine.playOneShot('door');
    const created = fake.created.at(-1);
    expect(created.opts.loop).toBe(false);
    expect(created.play).toHaveBeenCalled();
  });

  it('setIntensity rimuove il vecchio layer musicale (no doppia traccia su replay)', () => {
    engine.play();
    const oldMusic = engine._layerHowl('tavern-explore');
    engine.setIntensity('combat');
    // il vecchio layer non è più nella mappa
    expect(engine._layerHowl('tavern-explore')).toBeNull();
    // un play() successivo NON deve riavviare la vecchia traccia
    oldMusic.play.mockClear();
    engine.stop();
    engine.play();
    expect(oldMusic.play).not.toHaveBeenCalled();
  });

  it('pause() mette in pausa tutti i layer senza stop', () => {
    engine.play();
    engine.pause();
    for (const id of ['tavern-explore', 'crowd']) {
      expect(engine._layerHowl(id).pause).toHaveBeenCalled();
    }
  });

  it('musica creata html5:true, ambient html5:false', () => {
    expect(engine._layerHowl('tavern-explore').opts.html5).toBe(true);
    expect(engine._layerHowl('crowd').opts.html5).toBe(false);
  });

  it('playOneShot fa unload del precedente stesso id', () => {
    engine.playOneShot('door');
    const first = fake.created.at(-1);
    engine.playOneShot('door');
    expect(first.unload).toHaveBeenCalled();
  });

  it('setIntensity mentre NON in riproduzione non avvia la musica', () => {
    // non chiamiamo play(): l'engine non sta suonando
    engine.setIntensity('combat');
    const newMusic = engine._layerHowl('tavern-combat');
    expect(newMusic).toBeTruthy();
    expect(newMusic.play).not.toHaveBeenCalled();
    expect(engine.intensity).toBe('combat');
    // il vecchio layer è comunque rimosso
    expect(engine._layerHowl('tavern-explore')).toBeNull();
    // un play() successivo avvia il nuovo layer musicale
    engine.play();
    expect(newMusic.play).toHaveBeenCalled();
  });

  it('pause() ferma lo stato playing (setIntensity dopo la pausa non riparte)', () => {
    engine.play();
    engine.pause();
    const explore = engine._layerHowl('tavern-explore');
    engine.setIntensity('combat');
    const combat = engine._layerHowl('tavern-combat');
    expect(combat.play).not.toHaveBeenCalled();
  });

  it('setIntensity verso una musica con lo stesso id è un no-op sicuro (scene custom)', () => {
    // scena custom: stessa traccia (stesso id) per tutte le intensità
    const track = { id: 'u-music', name: 'Mix', src: ['/audio/x.webm'], loop: true };
    const custom = {
      id: 'u-1', name: 'Custom', cover: 'c', custom: true,
      music: { explore: [track], combat: [track], victory: [track] },
      ambient: [], oneshots: []
    };
    engine.loadScene(custom);
    engine.play();
    const music = engine._layerHowl('u-music');
    engine.setIntensity('combat');
    // il layer musicale è ancora tracciato (non orfano) e non è stato fermato/rifadato
    expect(engine._layerHowl('u-music')).toBe(music);
    expect(music.stop).not.toHaveBeenCalled();
    expect(engine.intensity).toBe('combat');
  });

  it('loadScene scarica la scena precedente (no Howl orfani)', () => {
    const first = engine._layerHowl('tavern-explore');
    engine.loadScene(demoScene);
    expect(first.unload).toHaveBeenCalled();
  });

  it('stop() ferma anche gli one-shot', () => {
    engine.playOneShot('door');
    const os = fake.created.at(-1);
    engine.stop();
    expect(os.stop).toHaveBeenCalled();
  });

  it('destroy() ferma e scarica layer + one-shot e svuota le mappe', () => {
    engine.play();
    engine.playOneShot('door');
    const music = engine._layerHowl('tavern-explore');
    const os = fake.created.at(-1);
    engine.destroy();
    expect(music.stop).toHaveBeenCalled();
    expect(music.unload).toHaveBeenCalled();
    expect(os.unload).toHaveBeenCalled();
    expect(engine._layerHowl('tavern-explore')).toBeNull();
  });
});
