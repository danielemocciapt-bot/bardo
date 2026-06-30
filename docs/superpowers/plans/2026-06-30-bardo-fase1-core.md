# Bardo — Fase 1 (Core giocabile) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** PWA Svelte installabile che riproduce una scena demo con musica in loop, intensità adattiva (Esplora/Combatti/Vittoria) in crossfade, layer ambient mixabili a slider e SFX one-shot.

**Architecture:** App 100% client-side. Un `AudioEngine` (wrapper su Howler) gestisce istanze Howl per layer, volume per-layer × master, e crossfade tra tracce di intensità. Uno store Svelte (`mixer`) tiene lo stato e pilota l'engine; i componenti UI leggono/scrivono lo store. Dati scena statici in un modulo JS. PWA via `vite-plugin-pwa` (Workbox) per precache dell'app shell.

**Tech Stack:** Svelte + Vite, Howler.js, Vitest (test unit con Howl mockato), vite-plugin-pwa (Workbox). Deploy: build statica su Cloudflare Pages.

**Spec di riferimento:** `docs/superpowers/specs/2026-06-30-pocketbard-clone-design.md`

---

## File Structure (Fase 1)

```
pocketbard-clone/
  index.html                       # entry HTML, monta src/main.js
  package.json                     # deps + script dev/build/test
  vite.config.js                   # Vite + svelte + PWA plugin + vitest config
  public/
    audio/demo/                    # file audio CC0 demo (loop seamless)
    icons/                         # icone PWA 192/512
  src/
    main.js                        # bootstrap app Svelte
    App.svelte                     # root: monta GameScreen sulla scena demo
    app.css                        # variabili tema pastello/ambra
    lib/
      types.js                     # JSDoc typedef del modello dati
      data/scenes.js               # definizione scena demo + registro licenze
      audio/AudioEngine.js         # core audio (layer, volumi, crossfade, oneshot)
      audio/AudioEngine.test.js
      stores/mixer.js              # store Svelte: stato mixer + ponte verso engine
      stores/mixer.test.js
    components/
      NowPlaying.svelte            # nome scena + sfondo
      IntensityTabs.svelte         # pillole Esplora/Combatti/Vittoria
      Mixer.svelte                 # slider master + per-layer
      OneShotBar.svelte            # pulsanti SFX one-shot
      GameScreen.svelte            # compone i 4 sopra
```

**Convenzioni:** JS + JSDoc (no TypeScript). Volume effettivo di un layer = `masterVolume * layerVolume`, entrambi in `[0,1]`. ID stringa per scene/layer/sfx.

---

## Task 1: Scaffold progetto (Vite + Svelte + Vitest + PWA)

**Files:**
- Create: `package.json`, `vite.config.js`, `index.html`, `src/main.js`, `src/App.svelte`, `src/app.css`

- [ ] **Step 1: Inizializza il progetto e installa le dipendenze**

Dalla cartella `pocketbard-clone`:

```bash
npm init -y
npm install svelte@^4 howler
npm install -D vite @sveltejs/vite-plugin-svelte@^3 vitest jsdom @vitest/ui vite-plugin-pwa
```

> Versioni pinnate a **Svelte 4** (con `@sveltejs/vite-plugin-svelte@^3`): tutto il codice del piano usa la sintassi Svelte 4 (`export let`, `new App({ target })`). Svelte 5 cambierebbe l'API di istanziazione (`mount`) e dei props (`$props()`). Restare su Svelte 4 per questa fase; l'eventuale upgrade è una scelta separata.

- [ ] **Step 2: Scrivi `package.json` script**

Sostituisci la sezione `"scripts"` di `package.json` con:

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "test": "vitest run",
    "test:watch": "vitest"
  },
  "type": "module"
}
```

- [ ] **Step 3: Scrivi `vite.config.js`**

```js
import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    svelte(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Bardo',
        short_name: 'Bardo',
        description: 'Colonne sonore per giochi di ruolo',
        theme_color: '#ecb14c',
        background_color: '#f6ecd6',
        display: 'standalone',
        orientation: 'portrait',
        icons: [
          { src: 'icons/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icons/icon-512.png', sizes: '512x512', type: 'image/png' }
        ]
      }
    })
  ],
  test: {
    environment: 'jsdom',
    globals: true
  }
});
```

- [ ] **Step 4: Scrivi `index.html`**

```html
<!doctype html>
<html lang="it">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
    <title>Bardo</title>
  </head>
  <body>
    <div id="app"></div>
    <script type="module" src="/src/main.js"></script>
  </body>
</html>
```

- [ ] **Step 5: Scrivi `src/app.css` (tema pastello/ambra)**

```css
:root {
  --bg: #f6ecd6;
  --panel: #fbf3e1;
  --ink: #5a4326;
  --ink-soft: #9a7f52;
  --amber: #ecb14c;
  --amber-deep: #b97a25;
  --shadow: 0 4px 12px #00000022;
  --radius: 16px;
}
* { box-sizing: border-box; }
body {
  margin: 0;
  font-family: system-ui, sans-serif;
  background: var(--bg);
  color: var(--ink);
}
```

- [ ] **Step 6: Scrivi `src/main.js`**

```js
import './app.css';
import App from './App.svelte';

const app = new App({ target: document.getElementById('app') });
export default app;
```

- [ ] **Step 7: Scrivi `src/App.svelte` segnaposto**

```svelte
<script>
  // Verrà sostituito in Task 6 con GameScreen sulla scena demo
</script>

<main style="padding:16px">
  <h1>Bardo</h1>
  <p>Scaffold ok.</p>
</main>
```

- [ ] **Step 8: Verifica dev server e test runner**

Run: `npm run dev`
Expected: server Vite parte, la pagina mostra "Bardo / Scaffold ok." senza errori in console. Fermalo con Ctrl+C.

Run: `npm test`
Expected: Vitest gira con "No test files found" (nessun test ancora) ed esce senza errori di config.

- [ ] **Step 9: Commit**

```bash
git add -A
git commit -m "chore: scaffold Svelte+Vite+Vitest+PWA per Bardo"
```

---

## Task 2: Modello dati + scena demo

**Files:**
- Create: `src/lib/types.js`, `src/lib/data/scenes.js`
- Test: `src/lib/data/scenes.test.js`

- [ ] **Step 1: Scrivi il test che fallisce**

`src/lib/data/scenes.test.js`:

```js
import { describe, it, expect } from 'vitest';
import { demoScene } from './scenes.js';

describe('demoScene', () => {
  it('ha id, nome e le tre intensità musicali', () => {
    expect(demoScene.id).toBeTypeOf('string');
    expect(demoScene.name).toBeTypeOf('string');
    expect(demoScene.music.explore.length).toBeGreaterThan(0);
    expect(demoScene.music.combat.length).toBeGreaterThan(0);
    expect(demoScene.music.victory.length).toBeGreaterThan(0);
  });

  it('ha layer ambient e oneshot con campi obbligatori', () => {
    for (const layer of demoScene.ambient) {
      expect(layer.id).toBeTypeOf('string');
      expect(layer.src.length).toBeGreaterThan(0);
    }
    for (const sfx of demoScene.oneshots) {
      expect(sfx.id).toBeTypeOf('string');
      expect(sfx.src.length).toBeGreaterThan(0);
    }
  });
});
```

- [ ] **Step 2: Esegui il test e verifica che fallisca**

Run: `npm test`
Expected: FAIL — `demoScene` non esiste / import fallisce.

- [ ] **Step 3: Scrivi `src/lib/types.js` (typedef)**

```js
/**
 * @typedef {Object} AudioRef
 * @property {string} id
 * @property {string} name
 * @property {string[]} src     // url candidati (es. ['/audio/demo/x.webm','/audio/demo/x.m4a'])
 * @property {boolean} [loop]
 */

/**
 * @typedef {Object} Scene
 * @property {string} id
 * @property {string} name
 * @property {{explore: AudioRef[], combat: AudioRef[], victory: AudioRef[]}} music
 * @property {AudioRef[]} ambient
 * @property {AudioRef[]} oneshots
 */

export {};
```

- [ ] **Step 4: Scrivi `src/lib/data/scenes.js`**

```js
/** @typedef {import('../types.js').Scene} Scene */

/** @type {Scene} */
export const demoScene = {
  id: 'tavern',
  name: 'Taverna del Drago',
  music: {
    explore: [{ id: 'tavern-explore', name: 'Calma', src: ['/audio/demo/tavern-explore.webm', '/audio/demo/tavern-explore.m4a'], loop: true }],
    combat:  [{ id: 'tavern-combat',  name: 'Rissa', src: ['/audio/demo/tavern-combat.webm',  '/audio/demo/tavern-combat.m4a'],  loop: true }],
    victory: [{ id: 'tavern-victory', name: 'Brindisi', src: ['/audio/demo/tavern-victory.webm', '/audio/demo/tavern-victory.m4a'], loop: true }]
  },
  ambient: [
    { id: 'crowd', name: 'Brusio', src: ['/audio/demo/crowd.webm', '/audio/demo/crowd.m4a'], loop: true },
    { id: 'fire',  name: 'Fuoco',  src: ['/audio/demo/fire.webm',  '/audio/demo/fire.m4a'],  loop: true }
  ],
  oneshots: [
    { id: 'door',    name: 'Porta',     src: ['/audio/demo/door.webm',    '/audio/demo/door.m4a'] },
    { id: 'thunder', name: 'Tuono',     src: ['/audio/demo/thunder.webm', '/audio/demo/thunder.m4a'] },
    { id: 'cheers',  name: 'Applausi',  src: ['/audio/demo/cheers.webm',  '/audio/demo/cheers.m4a'] }
  ]
};

/**
 * Registro licenze degli asset (CC0/CC-BY). Compilare con fonte reale.
 * @type {{file: string, source: string, license: string, author?: string}[]}
 */
export const licenses = [];
```

- [ ] **Step 5: Procura i file audio demo CC0**

Scarica file CC0/royalty-free brevi (loop musicali e SFX) e mettili in `public/audio/demo/` con i nomi usati sopra (`.webm` Opus + opzionale `.m4a`). Fonti: Pixabay (pixabay.com/sound-effects, license CC0-like), Freesound (filtra CC0), OpenGameArt (CC0). Annota ogni file in `licenses` con fonte e licenza.

> I test NON dipendono da questi file (Howler è mockato), ma servono per la verifica manuale in Task 6. Per sbloccare lo sviluppo vanno bene anche 3–5 file qualsiasi rinominati; la curatela definitiva è Fase 5.

- [ ] **Step 6: Esegui i test e verifica che passino**

Run: `npm test`
Expected: PASS (2 test verdi).

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "feat: modello dati e scena demo Taverna"
```

---

## Task 3: AudioEngine — layer e volumi

**Files:**
- Create: `src/lib/audio/AudioEngine.js`
- Test: `src/lib/audio/AudioEngine.test.js`

L'engine non importa Howler direttamente: riceve una `howlFactory` iniettabile (default = `new Howl`), così i test la mockano senza audio reale.

- [ ] **Step 1: Scrivi il test che fallisce**

`src/lib/audio/AudioEngine.test.js`:

```js
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
```

- [ ] **Step 2: Esegui il test e verifica che fallisca**

Run: `npm test`
Expected: FAIL — `AudioEngine` non esiste.

- [ ] **Step 3: Scrivi `src/lib/audio/AudioEngine.js` (parte volumi)**

```js
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
```

- [ ] **Step 4: Esegui i test e verifica che passino**

Run: `npm test`
Expected: PASS (i due test volumi verdi).

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: AudioEngine con layer e volume master/per-layer"
```

---

## Task 4: AudioEngine — play, intensità con crossfade, oneshot

**Files:**
- Modify: `src/lib/audio/AudioEngine.js`
- Modify: `src/lib/audio/AudioEngine.test.js`

- [ ] **Step 1: Aggiungi i test che falliscono**

Aggiungi in fondo a `AudioEngine.test.js` (dopo il describe esistente):

```js
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
});
```

- [ ] **Step 2: Esegui e verifica fallimento**

Run: `npm test`
Expected: FAIL — `play`, `setIntensity`, `playOneShot`, getter `intensity` non esistono.

- [ ] **Step 3: Estendi `AudioEngine.js`**

Aggiungi questi metodi/getter dentro la classe `AudioEngine` (dopo `stop()`):

```js
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
```

- [ ] **Step 4: Esegui i test e verifica che passino**

Run: `npm test`
Expected: PASS (tutti i test, vecchi + nuovi, verdi).

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: AudioEngine play, crossfade intensità e oneshot"
```

---

## Task 5: Store mixer (Svelte) come ponte verso l'engine

**Files:**
- Create: `src/lib/stores/mixer.js`
- Test: `src/lib/stores/mixer.test.js`

Lo store espone lo stato per la UI e inoltra i comandi all'engine.

- [ ] **Step 1: Scrivi il test che fallisce**

`src/lib/stores/mixer.test.js`:

```js
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { get } from 'svelte/store';
import { createMixer } from './mixer.js';
import { demoScene } from '../data/scenes.js';

function fakeEngine() {
  return {
    loadScene: vi.fn(),
    play: vi.fn(),
    stop: vi.fn(),
    setLayerVolume: vi.fn(),
    setMasterVolume: vi.fn(),
    setIntensity: vi.fn(),
    playOneShot: vi.fn(),
    intensity: 'explore'
  };
}

describe('mixer store', () => {
  let engine, mixer;
  beforeEach(() => {
    engine = fakeEngine();
    mixer = createMixer(engine);
    mixer.load(demoScene);
  });

  it('load imposta scena e stato iniziale layer', () => {
    expect(engine.loadScene).toHaveBeenCalledWith(demoScene);
    const state = get(mixer);
    expect(state.scene.id).toBe('tavern');
    expect(state.master).toBe(1);
    expect(state.intensity).toBe('explore');
    expect(state.layers.crowd).toBe(0);
  });

  it('setLayerVolume aggiorna stato e chiama engine', () => {
    mixer.setLayerVolume('crowd', 0.7);
    expect(engine.setLayerVolume).toHaveBeenCalledWith('crowd', 0.7);
    expect(get(mixer).layers.crowd).toBe(0.7);
  });

  it('setIntensity aggiorna stato e chiama engine', () => {
    mixer.setIntensity('combat');
    expect(engine.setIntensity).toHaveBeenCalledWith('combat');
    expect(get(mixer).intensity).toBe('combat');
  });

  it('toggle play aggiorna playing e chiama engine', () => {
    mixer.togglePlay();
    expect(engine.play).toHaveBeenCalled();
    expect(get(mixer).playing).toBe(true);
    mixer.togglePlay();
    expect(engine.stop).toHaveBeenCalled();
    expect(get(mixer).playing).toBe(false);
  });
});
```

- [ ] **Step 2: Esegui e verifica fallimento**

Run: `npm test`
Expected: FAIL — `createMixer` non esiste.

- [ ] **Step 3: Scrivi `src/lib/stores/mixer.js`**

```js
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
```

- [ ] **Step 4: Esegui i test e verifica che passino**

Run: `npm test`
Expected: PASS (tutti verdi).

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: store mixer come ponte UI<->AudioEngine"
```

---

## Task 6: UI — GameScreen e componenti

**Files:**
- Create: `src/components/NowPlaying.svelte`, `IntensityTabs.svelte`, `Mixer.svelte`, `OneShotBar.svelte`, `GameScreen.svelte`
- Modify: `src/App.svelte`

Questi componenti sono verificati manualmente nel browser (non TDD: la logica testabile è già coperta da engine+store).

- [ ] **Step 1: `NowPlaying.svelte`**

```svelte
<script>
  export let name = '';
</script>

<header style="background:linear-gradient(160deg,#f3c98a,#b98a4a);padding:16px;border-radius:0 0 20px 20px;">
  <div style="font-size:10px;letter-spacing:2px;text-transform:uppercase;color:#7a5a2e;">In riproduzione</div>
  <div style="font-family:Georgia,serif;font-size:22px;font-weight:700;color:#fff;text-shadow:0 1px 3px #00000055;">{name}</div>
</header>
```

- [ ] **Step 2: `IntensityTabs.svelte`**

```svelte
<script>
  export let value = 'explore';
  export let onChange = (_l) => {};
  const tabs = [
    { id: 'explore', label: 'Esplora' },
    { id: 'combat', label: 'Combatti' },
    { id: 'victory', label: 'Vittoria' }
  ];
</script>

<div style="display:flex;gap:6px;padding:14px 16px;">
  {#each tabs as t}
    <button
      on:click={() => onChange(t.id)}
      style="flex:1;border:none;cursor:pointer;font-size:13px;padding:10px 0;border-radius:20px;font-weight:700;
             background:{value === t.id ? '#fff' : '#ffffff55'};
             color:{value === t.id ? 'var(--amber-deep)' : 'var(--ink)'};
             box-shadow:{value === t.id ? '0 2px 0 #d9a85a' : 'none'};">
      {t.label}
    </button>
  {/each}
</div>
```

- [ ] **Step 3: `Mixer.svelte`**

```svelte
<script>
  export let scene;
  export let state;     // oggetto stato dello store mixer
  export let onMaster = (_v) => {};
  export let onLayer = (_id, _v) => {};
</script>

<div style="background:var(--panel);margin:0 16px;border-radius:var(--radius);padding:14px;box-shadow:var(--shadow);">
  <div style="font-size:10px;color:var(--ink-soft);text-transform:uppercase;letter-spacing:1px;margin-bottom:10px;">Mixer</div>

  <label style="display:flex;align-items:center;gap:10px;font-size:13px;margin-bottom:12px;">
    🎚 Master
    <input type="range" min="0" max="1" step="0.01" value={state.master}
           on:input={(e) => onMaster(+e.target.value)} style="flex:1;" />
  </label>

  {#each scene.ambient as layer}
    <label style="display:flex;align-items:center;gap:10px;font-size:13px;margin-bottom:10px;">
      {layer.name}
      <input type="range" min="0" max="1" step="0.01" value={state.layers[layer.id]}
             on:input={(e) => onLayer(layer.id, +e.target.value)} style="flex:1;" />
    </label>
  {/each}
</div>
```

- [ ] **Step 4: `OneShotBar.svelte`**

```svelte
<script>
  export let scene;
  export let onPlay = (_id) => {};
</script>

<div style="display:flex;gap:8px;flex-wrap:wrap;padding:16px;">
  {#each scene.oneshots as sfx}
    <button on:click={() => onPlay(sfx.id)}
      style="flex:1;min-width:80px;border:none;cursor:pointer;background:#fff;border-radius:12px;
             padding:12px 8px;font-size:13px;font-weight:600;color:var(--ink);box-shadow:0 2px 0 #d9a85a;">
      {sfx.name}
    </button>
  {/each}
</div>
```

- [ ] **Step 5: `GameScreen.svelte`**

```svelte
<script>
  import { onMount } from 'svelte';
  import { AudioEngine } from '../lib/audio/AudioEngine.js';
  import { createMixer } from '../lib/stores/mixer.js';
  import NowPlaying from './NowPlaying.svelte';
  import IntensityTabs from './IntensityTabs.svelte';
  import Mixer from './Mixer.svelte';
  import OneShotBar from './OneShotBar.svelte';

  export let scene;

  const engine = new AudioEngine();
  const mixer = createMixer(engine);

  onMount(() => mixer.load(scene));
</script>

<NowPlaying name={scene.name} />
<IntensityTabs value={$mixer.intensity} onChange={(l) => mixer.setIntensity(l)} />

<div style="text-align:center;margin:4px 0 12px;">
  <button on:click={() => mixer.togglePlay()}
    style="border:none;cursor:pointer;background:var(--amber);color:#4a3410;font-weight:700;
           padding:12px 28px;border-radius:24px;font-size:15px;box-shadow:0 3px 0 #d9a85a;">
    {$mixer.playing ? '⏸ Pausa' : '▶ Play'}
  </button>
</div>

<Mixer {scene} state={$mixer} onMaster={(v) => mixer.setMaster(v)} onLayer={(id, v) => mixer.setLayerVolume(id, v)} />
<OneShotBar {scene} onPlay={(id) => mixer.oneShot(id)} />
```

- [ ] **Step 6: Riscrivi `src/App.svelte`**

```svelte
<script>
  import GameScreen from './components/GameScreen.svelte';
  import { demoScene } from './lib/data/scenes.js';
</script>

<GameScreen scene={demoScene} />
```

- [ ] **Step 7: Verifica manuale nel browser**

Run: `npm run dev`
Expected, aprendo l'URL su telefono o desktop (serve gesto utente per l'audio):
- Si vede "Taverna del Drago", le tre pillole intensità, Play, Mixer con Master + Brusio + Fuoco, e i pulsanti SFX.
- Tap **Play** → parte la musica esplorazione + (se alzi gli slider) brusio/fuoco.
- Alza slider **Fuoco** → il fuoco sale di volume.
- Tap **Combatti** → crossfade verso la traccia combattimento senza stacco netto.
- Tap **Tuono** → effetto one-shot suona sopra al mix.
- Console senza errori.

> Se non hai ancora file audio reali, la UI deve comunque funzionare e i controlli rispondere; sentirai audio solo con i file in `public/audio/demo/`.

- [ ] **Step 8: Esegui i test (regressione) e commit**

Run: `npm test`
Expected: PASS (tutti i test esistenti restano verdi).

```bash
git add -A
git commit -m "feat: schermata di gioco con intensità, mixer e SFX"
```

---

## Task 7: PWA installabile + app shell offline

**Files:**
- Create: `public/icons/icon-192.png`, `public/icons/icon-512.png`
- Modify: `src/main.js` (registrazione SW del plugin)

Il plugin PWA è già configurato in Task 1. Qui aggiungiamo le icone e verifichiamo install + precache dell'app shell.

- [ ] **Step 1: Aggiungi le icone**

Metti due PNG quadrati in `public/icons/`: `icon-192.png` (192×192) e `icon-512.png` (512×512). Anche un'icona segnaposto ambra va bene per ora; la grafica finale è Fase 5.

- [ ] **Step 2: Registra il service worker in `src/main.js`**

Aggiorna `src/main.js`:

```js
import './app.css';
import App from './App.svelte';
import { registerSW } from 'virtual:pwa-register';

registerSW({ immediate: true });

const app = new App({ target: document.getElementById('app') });
export default app;
```

- [ ] **Step 3: Build e preview**

Run: `npm run build`
Expected: build ok; in output compaiono `sw.js` e `manifest.webmanifest`, nessun errore.

Run: `npm run preview`
Expected: l'app si apre dall'URL di preview.

- [ ] **Step 4: Verifica installabilità e precache (DevTools)**

In Chrome DevTools → Application:
- **Manifest**: nome "Bardo", icone presenti, nessun errore. Compare il prompt/icona di installazione.
- **Service Workers**: SW "activated and running".
- Spunta **Offline** in Network, ricarica: l'app shell (HTML/JS/CSS) si carica ancora. (L'audio offline è Fase 3.)

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: PWA installabile con precache app shell"
```

---

## Task 8: Build di deploy per Cloudflare Pages

**Files:**
- Create: `README.md` (sezione deploy)

- [ ] **Step 1: Verifica output di build statico**

Run: `npm run build`
Expected: cartella `dist/` con `index.html`, asset, `sw.js`, `manifest.webmanifest`.

- [ ] **Step 2: Documenta il deploy in `README.md`**

```markdown
# Bardo

PWA gratuita per colonne sonore di giochi di ruolo.

## Sviluppo
- `npm run dev` — server di sviluppo
- `npm test` — test unit (Vitest)
- `npm run build` — build di produzione in `dist/`

## Deploy (Cloudflare Pages, gratis)
- Comando di build: `npm run build`
- Cartella di output: `dist`
- Banda illimitata nel piano gratuito (adatto a servire audio).
```

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "docs: README con istruzioni di deploy su Cloudflare Pages"
```

- [ ] **Step 4 (manuale, opzionale ora): Primo deploy**

Pusha il repo su GitHub e collegalo a Cloudflare Pages con build command `npm run build` e output `dist`. Verifica che l'URL pubblico carichi l'app e sia installabile come PWA.

---

## Definition of Done (Fase 1)

- `npm test` verde (engine + store).
- `npm run dev`: scena demo riproducibile, intensità in crossfade, mixer e SFX funzionanti.
- `npm run build`: produce `dist/` con SW e manifest; app installabile; app shell offline.
- Spec coperto per la parte core: ambienti in loop, SFX one-shot, ambient mixabili, intensità adattiva.

## Rinviato alle fasi successive (non in questo piano)

- **Fase 2:** Home con griglia scene, più scene/pack, navigazione, MediaSession + background audio (html5 già attivo) + Wake Lock.
- **Fase 3:** download pacchetti + Cache API + audio offline + gestione spazio.
- **Fase 4:** scene builder + salvataggio UserScene/Preset in IndexedDB.
- **Fase 5:** curatela audio CC0 definitiva, registro licenze/credits, grafica/icone finali, QA iOS.

## Backlog tecnico (emerso nelle review della Fase 1)

Da affrontare nel lavoro audio della Fase 2 (stessa radice: lifecycle dei Howl):

- **"Pausa" in realtà ferma** (`engine.stop()` → `howl.stop()` resetta il playhead): premendo Pausa→Play i loop ripartono da capo. Implementare `pause()`/`resume()` reali (Howler li supporta) per far combaciare l'etichetta.
- **`html5:true` su tutti i layer** esaurisce il pool HTML5 di Howler ("HTML5 Audio pool exhausted"). `html5` serve solo alla *musica* (continuità in background); ambient/oneshot meglio Web Audio, oppure alzare `Howler.html5PoolSize`.
- **Race su toggle rapido intensità**: mitigato dal fix che rimuove il vecchio layer da `_layers` (ricreazione fresca), da riverificare quando si aggiunge MediaSession.
- **`playOneShot` sovrascrive `_oneshots[id]`** senza `unload()` del Howl precedente: piccolo leak con SFX ripetuti.

Polish minori:
- **manifest `lang:"en"`** mentre `index.html` è `lang="it"` → aggiungere `lang:'it'` al manifest (Fase 5).
- Pulire boilerplate `npm init` in `package.json` (main/directories/keywords/license ISC).
- Flash 1-frame degli slider ambient prima di `onMount` (valore default range finché `mixer.load` non popola `layers`).
