import { Howl } from 'howler';

/** @typedef {import('../types.js').Scene} Scene */
/** @typedef {import('../types.js').AudioRef} AudioRef */

const CROSSFADE_MS = 1500;

export class AudioEngine {
  /** @param {{howlFactory?: (opts:any)=>any}} [deps] */
  constructor(deps = {}) {
    this._factory = deps.howlFactory ?? ((opts) => new Howl(opts));
    /** @type {Scene|null} */
    this._scene = null;
    this._master = 1;
    /** mappa layerId -> {howl, volume} (musica corrente + ambient) */
    this._layers = new Map();
    /** mappa oneshotId -> howl */
    this._oneshots = new Map();
    /** id del layer musicale attualmente attivo */
    this._musicLayerId = null;
    /** @type {'explore'|'combat'|'victory'} */
    this._intensity = 'explore';
  }

  /** @param {AudioRef} ref */
  _makeHowl(ref, { volume }) {
    return this._factory({ src: ref.src, loop: !!ref.loop, html5: true, volume });
  }

  /** Carica la scena: crea i Howl ambient + il Howl musicale dell'intensità iniziale. */
  loadScene(scene) {
    this.stop();
    this._layers.clear();
    this._oneshots.clear();
    this._scene = scene;
    this._intensity = 'explore';

    for (const ref of scene.ambient) {
      this._layers.set(ref.id, { howl: this._makeHowl(ref, { volume: 0 }), volume: 0 });
    }
    const musicRef = scene.music.explore[0];
    this._musicLayerId = musicRef.id;
    this._layers.set(musicRef.id, { howl: this._makeHowl(musicRef, { volume: this._master }), volume: 1 });
  }

  _layerHowl(id) {
    const l = this._layers.get(id);
    return l ? l.howl : null;
  }

  _applyVolume(id) {
    const l = this._layers.get(id);
    if (l) l.howl.volume(this._master * l.volume);
  }

  setLayerVolume(id, v) {
    const l = this._layers.get(id);
    if (!l) return;
    l.volume = Math.max(0, Math.min(1, v));
    this._applyVolume(id);
  }

  setMasterVolume(v) {
    this._master = Math.max(0, Math.min(1, v));
    for (const id of this._layers.keys()) this._applyVolume(id);
  }

  stop() {
    for (const { howl } of this._layers.values()) howl.stop();
  }
}
