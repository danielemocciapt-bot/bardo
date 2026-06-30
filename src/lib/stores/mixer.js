import { writable } from 'svelte/store';

/**
 * Store mixer: stato UI + inoltro comandi all'AudioEngine.
 * @param {import('../audio/AudioEngine.js').AudioEngine} engine
 */
export function createMixer(engine) {
  const { subscribe, set, update } = writable({
    scene: null,
    playing: false,
    master: 1,
    intensity: 'explore',
    /** @type {Record<string, number>} layerId -> volume */
    layers: {}
  });

  function load(scene) {
    engine.loadScene(scene);
    const layers = {};
    for (const l of scene.ambient) layers[l.id] = 0;
    set({ scene, playing: false, master: 1, intensity: 'explore', layers });
  }

  function togglePlay() {
    update((s) => {
      const playing = !s.playing;
      if (playing) engine.play(); else engine.stop();
      return { ...s, playing };
    });
  }

  function setMaster(v) {
    engine.setMasterVolume(v);
    update((s) => ({ ...s, master: v }));
  }

  function setLayerVolume(id, v) {
    engine.setLayerVolume(id, v);
    update((s) => ({ ...s, layers: { ...s.layers, [id]: v } }));
  }

  function setIntensity(level) {
    engine.setIntensity(level);
    update((s) => ({ ...s, intensity: level }));
  }

  function oneShot(id) {
    engine.playOneShot(id);
  }

  return { subscribe, load, togglePlay, setMaster, setLayerVolume, setIntensity, oneShot };
}
