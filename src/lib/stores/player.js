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

  const currentId = () => get(mixer).scene?.id;
  function _ensure(scene) { if (currentId() !== scene.id) mixer.load(scene); }

  function playScene(scene) {
    _ensure(scene);
    if (!get(mixer).playing) mixer.togglePlay();
  }
  function togglePlay() { if (get(mixer).scene) mixer.togglePlay(); }
  function setLayer(scene, id, v) { _ensure(scene); mixer.setLayerVolume(id, v); }
  function oneShot(scene, id) { _ensure(scene); mixer.oneShot(id); }
  function setIntensity(level) { mixer.setIntensity(level); }
  function setMaster(v) { mixer.setMaster(v); }
  function setKeepAwake(on) { mixer.setKeepAwake(on); }
  function stop() { mixer.stop(); }

  return {
    subscribe: mixer.subscribe,
    wakeSupported: wake.supported,
    playScene, togglePlay, setLayer, oneShot, setIntensity, setMaster, setKeepAwake, stop
  };
}

/** Singleton dell'app. */
export const player = createPlayer();
