import { writable } from 'svelte/store';

/**
 * Store mixer: stato UI + inoltro comandi all'AudioEngine.
 * @param {import('../audio/AudioEngine.js').AudioEngine} engine
 * @param {{mediaSession?: {setScene:Function,setPlaybackState:Function,setHandlers:Function}}} [deps]
 */
const PREFS_KEY = 'bardo.prefs';

export function createMixer(engine, deps = {}) {
  const mediaSession = deps.mediaSession ?? null;
  const wakeLock = deps.wakeLock ?? null;
  const storage = deps.storage ?? (typeof localStorage !== 'undefined' ? localStorage : null);

  // preferenze globali persistite (valgono tra le scene): master + schermo acceso
  const readPrefs = () => {
    if (!storage) return {};
    try { return JSON.parse(storage.getItem(PREFS_KEY)) || {}; } catch { return {}; }
  };
  let prefs = readPrefs();
  const savePrefs = () => { if (storage) { try { storage.setItem(PREFS_KEY, JSON.stringify(prefs)); } catch { /* quota */ } } };

  const { subscribe, set, update } = writable({
    scene: null,
    playing: false,
    master: typeof prefs.master === 'number' ? prefs.master : 1, // globale, persistito
    intensity: 'explore',
    /** @type {Record<string, number>} layerId -> volume */
    layers: {},
    keepAwake: !!prefs.keepAwake // globale, persistito
  });

  // l'engine avvisa quando l'intensità torna da sola a 'explore' (fine jingle vittoria)
  if (engine) engine.onIntensity = (level) => update((s) => ({ ...s, intensity: level }));

  function load(scene) {
    engine.loadScene(scene);
    _playing = false;
    const layers = {};
    for (const l of scene.ambient) layers[l.id] = 0;
    const master = typeof prefs.master === 'number' ? prefs.master : 1;
    const keepAwake = !!prefs.keepAwake;
    engine.setMasterVolume(master); // allinea l'engine al master persistito
    set({ scene, playing: false, master, intensity: 'explore', layers, keepAwake });
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
      if (wakeLock) { (playing && s.keepAwake) ? wakeLock.enable() : wakeLock.disable(); }
      return { ...s, playing };
    });
  }

  function stop() {
    engine.stop();
    _playing = false;
    wakeLock?.disable();
    mediaSession?.setPlaybackState('none');
    update((s) => ({ ...s, playing: false }));
  }

  /** Smontaggio scena: ferma e scarica tutto l'audio, rilascia wake lock / media session. */
  function teardown() {
    engine.destroy();
    _playing = false;
    wakeLock?.disable();
    mediaSession?.setPlaybackState('none');
  }

  function setKeepAwake(on) {
    prefs.keepAwake = on; savePrefs();
    update((s) => {
      if (wakeLock) { (on && s.playing) ? wakeLock.enable() : wakeLock.disable(); }
      return { ...s, keepAwake: on };
    });
  }

  function setMaster(v) {
    prefs.master = v; savePrefs();
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

  return { subscribe, load, togglePlay, setMaster, setLayerVolume, setIntensity, oneShot, stop, setKeepAwake, teardown };
}
