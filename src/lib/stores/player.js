import { get } from 'svelte/store';
import { AudioEngine } from '../audio/AudioEngine.js';
import { createMixer } from './mixer.js';
import { createMediaSession } from '../audio/media-session.js';
import { createWakeLock } from '../audio/wake-lock.js';

/**
 * Player audio globale (singleton). Una sola scena attiva alla volta; persiste
 * durante la navigazione. Toccare i controlli di una scena la rende attiva.
 * @param {{engine?, mediaSession?, wakeLock?}} [deps]
 */
export function createPlayer(deps = {}) {
  const engine = deps.engine ?? new AudioEngine();
  const wake = deps.wakeLock ?? createWakeLock();
  const mixer = createMixer(engine, {
    mediaSession: deps.mediaSession ?? createMediaSession(),
    wakeLock: wake
  });

  // --- modalità "mix": ambient casuali + one-shot random a intervalli ---
  let _mixScene = null;
  let _mixTimer = null;
  function _stopMixTimer() { if (_mixTimer) { clearTimeout(_mixTimer); _mixTimer = null; } }
  function _clearMix() { _stopMixTimer(); _mixScene = null; }
  function _scheduleMix(scene) {
    const delay = 8000 + Math.random() * 12000; // 8–20s
    _mixTimer = setTimeout(() => {
      const os = scene.oneshots;
      if (os.length) mixer.oneShot(os[Math.floor(Math.random() * os.length)].id);
      _scheduleMix(scene);
    }, delay);
  }

  const currentId = () => get(mixer).scene?.id;
  function _ensure(scene) {
    if (currentId() !== scene.id) { mixer.load(scene); _clearMix(); }
  }

  function playScene(scene) {
    _ensure(scene);
    _clearMix(); // play normale: niente auto-mix
    if (!get(mixer).playing) mixer.togglePlay();
  }

  /** Avvia la scena in modalità "mix": ambient a volumi casuali + effetti random. */
  function playMixScene(scene) {
    _ensure(scene);
    for (const a of scene.ambient) mixer.setLayerVolume(a.id, 0.3 + Math.random() * 0.6);
    if (!get(mixer).playing) mixer.togglePlay();
    _clearMix();
    _mixScene = scene;
    _scheduleMix(scene);
  }

  function togglePlay() {
    if (!get(mixer).scene) return;
    mixer.togglePlay();
    if (get(mixer).playing) { if (_mixScene) _scheduleMix(_mixScene); }
    else { _stopMixTimer(); }
  }

  function setLayer(scene, id, v) { _ensure(scene); mixer.setLayerVolume(id, v); }
  function oneShot(scene, id) { _ensure(scene); mixer.oneShot(id); }
  function setIntensity(level) { mixer.setIntensity(level); }
  function setMaster(v) { mixer.setMaster(v); }
  function setKeepAwake(on) { mixer.setKeepAwake(on); }
  function stop() { _clearMix(); mixer.stop(); }

  return {
    subscribe: mixer.subscribe,
    wakeSupported: wake.supported,
    playScene, playMixScene, togglePlay, setLayer, oneShot, setIntensity, setMaster, setKeepAwake, stop
  };
}

/** Singleton dell'app. */
export const player = createPlayer();
