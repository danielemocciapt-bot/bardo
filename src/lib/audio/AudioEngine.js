import { Howl, Howler } from 'howler';

/** @typedef {import('../types.js').Scene} Scene */
/** @typedef {import('../types.js').AudioRef} AudioRef */

// Non sospendere il contesto audio: altrimenti a schermo spento/in background
// Howler mette in pausa l'audio dopo un po' di inattività.
Howler.autoSuspend = false;

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
    this._playing = false;
    /** callback quando l'intensità cambia da sola (jingle vittoria -> esplora) */
    this.onIntensity = deps.onIntensity ?? null;
  }

  /** @param {AudioRef} ref */
  _makeHowl(ref, { volume, html5 = true }) {
    return this._factory({ src: ref.src, loop: !!ref.loop, html5, volume });
  }

  /** Carica la scena: crea i Howl ambient + il Howl musicale dell'intensità iniziale. */
  loadScene(scene) {
    this.destroy(); // ferma e SCARICA la scena precedente (evita Howl orfani in memoria)
    this._scene = scene;
    this._intensity = 'explore';
    this._master = 1; // ogni scena riparte da master pieno (allineato allo store mixer)

    for (const ref of scene.ambient) {
      this._layers.set(ref.id, { howl: this._makeHowl(ref, { volume: 0, html5: false }), volume: 0 });
    }
    const musicRef = scene.music.explore[0];
    this._musicLayerId = musicRef.id;
    this._layers.set(musicRef.id, { howl: this._makeHowl(musicRef, { volume: this._master }), volume: 1 });

    // precarica gli one-shot: il primo tap parte subito, senza latenza di decode
    for (const ref of scene.oneshots) {
      this._oneshots.set(ref.id, this._factory({ src: ref.src, loop: false, html5: false, preload: true, volume: this._master }));
    }
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
    this._playing = false;
    for (const { howl } of this._layers.values()) howl.stop();
    for (const howl of this._oneshots.values()) howl.stop();
  }

  /** Ferma e scarica tutto l'audio (uso: uscita dalla scena / smontaggio). */
  destroy() {
    this._playing = false;
    for (const { howl } of this._layers.values()) { howl.stop(); howl.unload(); }
    for (const howl of this._oneshots.values()) { howl.stop(); howl.unload(); }
    this._layers.clear();
    this._oneshots.clear();
  }

  pause() {
    this._playing = false;
    for (const { howl } of this._layers.values()) howl.pause();
  }

  get intensity() { return this._intensity; }

  play() {
    this._playing = true;
    for (const { howl } of this._layers.values()) howl.play();
  }

  /** @param {'explore'|'combat'|'victory'} level */
  setIntensity(level) {
    if (!this._scene || level === this._intensity) return;
    const newRefEarly = this._scene.music[level][0];
    // Vittoria = jingle una tantum: suona una volta e poi torna a Esplora.
    // (per le scene custom victory ha loop:true -> usa il percorso normale)
    if (level === 'victory' && newRefEarly && newRefEarly.loop === false) {
      this._playVictoryJingle(newRefEarly);
      return;
    }
    const oldId = this._musicLayerId;
    const oldLayer = this._layers.get(oldId);
    const newRef = this._scene.music[level][0];

    // scene custom: stessa traccia per tutte le intensità -> nessun crossfade, solo aggiorna lo stato
    if (newRef.id === oldId) {
      this._intensity = level;
      return;
    }

    // crea (o riusa) il layer musicale nuovo a volume 0
    if (!this._layers.has(newRef.id)) {
      this._layers.set(newRef.id, { howl: this._makeHowl(newRef, { volume: 0 }), volume: 1 });
    }
    const newLayer = this._layers.get(newRef.id);

    if (this._playing) {
      // crossfade dal vecchio al nuovo mentre si suona
      newLayer.howl.play();
      newLayer.howl.fade(0, this._master * newLayer.volume, CROSSFADE_MS);
      if (oldLayer) {
        oldLayer.howl.fade(this._master * oldLayer.volume, 0, CROSSFADE_MS);
        oldLayer.howl.once('fade', () => oldLayer.howl.stop());
      }
    } else {
      // in pausa/mai avviato: solo swap, senza far partire l'audio
      newLayer.howl.volume(this._master * newLayer.volume);
      if (oldLayer) oldLayer.howl.stop();
    }
    if (oldLayer) this._layers.delete(oldId);

    this._musicLayerId = newRef.id;
    this._intensity = level;
  }

  /** Suona il jingle di vittoria una volta, poi torna automaticamente a Esplora. @param {AudioRef} vRef */
  _playVictoryJingle(vRef) {
    const oldLayer = this._layers.get(this._musicLayerId);
    if (oldLayer && oldLayer !== this._layers.get(vRef.id)) {
      if (this._playing) {
        oldLayer.howl.fade(this._master * oldLayer.volume, 0, 400);
        oldLayer.howl.once('fade', () => oldLayer.howl.stop());
      } else {
        oldLayer.howl.stop();
      }
      this._layers.delete(this._musicLayerId);
    }
    let vLayer = this._layers.get(vRef.id);
    if (!vLayer) { vLayer = { howl: this._makeHowl(vRef, { volume: this._master }), volume: 1 }; this._layers.set(vRef.id, vLayer); }
    this._musicLayerId = vRef.id;
    this._intensity = 'victory';
    vLayer.howl.volume(this._master);
    vLayer.howl.once('end', () => this._afterVictory(vRef.id));
    if (this._playing) vLayer.howl.play();
  }

  /** Fine del jingle: carica e (se in play) avvia la musica di Esplora. @param {string} vId */
  _afterVictory(vId) {
    if (this._intensity !== 'victory') return; // l'utente ha già cambiato intensità
    const v = this._layers.get(vId);
    if (v) { v.howl.stop(); v.howl.unload(); this._layers.delete(vId); }
    const eRef = this._scene.music.explore[0];
    const eLayer = { howl: this._makeHowl(eRef, { volume: this._master }), volume: 1 };
    this._layers.set(eRef.id, eLayer);
    this._musicLayerId = eRef.id;
    this._intensity = 'explore';
    if (this._playing) eLayer.howl.play();
    this.onIntensity && this.onIntensity('explore');
  }

  /** @param {string} sfxId */
  playOneShot(sfxId) {
    if (!this._scene) return;
    let howl = this._oneshots.get(sfxId); // di norma già precaricato in loadScene
    if (!howl) {
      const ref = this._scene.oneshots.find((s) => s.id === sfxId);
      if (!ref) return;
      howl = this._factory({ src: ref.src, loop: false, html5: false, volume: this._master });
      this._oneshots.set(sfxId, howl);
    } else {
      howl.stop();               // re-tap: riparte da capo
      howl.volume(this._master); // allinea al master corrente
    }
    howl.play();
  }
}
