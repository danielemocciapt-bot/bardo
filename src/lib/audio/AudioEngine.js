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

  get intensity() { return this._intensity; }

  play() {
    for (const { howl } of this._layers.values()) howl.play();
  }

  /** @param {'explore'|'combat'|'victory'} level */
  setIntensity(level) {
    if (!this._scene || level === this._intensity) return;
    const oldId = this._musicLayerId;
    const oldLayer = this._layers.get(oldId);
    const newRef = this._scene.music[level][0];

    // crea (o riusa) il layer musicale nuovo a volume 0
    if (!this._layers.has(newRef.id)) {
      this._layers.set(newRef.id, { howl: this._makeHowl(newRef, { volume: 0 }), volume: 1 });
    }
    const newLayer = this._layers.get(newRef.id);

    newLayer.howl.play();
    newLayer.howl.fade(0, this._master * newLayer.volume, CROSSFADE_MS);
    if (oldLayer) {
      oldLayer.howl.fade(this._master * oldLayer.volume, 0, CROSSFADE_MS);
      oldLayer.howl.once('fade', () => oldLayer.howl.stop());
      this._layers.delete(oldId);
    }

    this._musicLayerId = newRef.id;
    this._intensity = level;
  }

  /** @param {string} sfxId */
  playOneShot(sfxId) {
    if (!this._scene) return;
    const ref = this._scene.oneshots.find((s) => s.id === sfxId);
    if (!ref) return;
    const howl = this._factory({ src: ref.src, loop: false, html5: true, volume: this._master });
    this._oneshots.set(sfxId, howl);
    howl.play();
  }
}
