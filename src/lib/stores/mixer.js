import { writable } from 'svelte/store';

/**
 * Store mixer: stato UI + inoltro comandi all'AudioEngine.
 * @param {import('../audio/AudioEngine.js').AudioEngine} engine
 * @param {{mediaSession?: {setScene:Function,setPlaybackState:Function,setHandlers:Function}}} [deps]
 */
export function createMixer(engine, deps = {}) {
  const mediaSession = deps.mediaSession ?? null;
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
    _playing = false;
    const layers = {};
    for (const l of scene.ambient) layers[l.id] = 0;
    set({ scene, playing: false, master: 1, intensity: 'explore', layers });
    if (mediaSession) {
      mediaSession.setScene(scene);
      mediaSession.setHandlers({
        onPlay: () => { if (!isPlaying()) togglePlay(); },
        onPause: () => { if (isPlaying()) togglePlay(); },
        onStop: () => stop()
      });
    }
  }

  let _playing = false;
  function isPlaying() { return _playing; }

  function togglePlay() {
    update((s) => {
      const playing = !s.playing;
      if (playing) engine.play(); else engine.pause();
      _playing = playing;
      mediaSession?.setPlaybackState(playing ? 'playing' : 'paused');
      return { ...s, playing };
    });
  }

  function stop() {
    engine.stop();
    _playing = false;
    mediaSession?.setPlaybackState('none');
    update((s) => ({ ...s, playing: false }));
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

  return { subscribe, load, togglePlay, setMaster, setLayerVolume, setIntensity, oneShot, stop };
}
