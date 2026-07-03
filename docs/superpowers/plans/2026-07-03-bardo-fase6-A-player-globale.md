# Bardo — Fase 6/A (Player globale + tasto fluttuante) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** L'audio diventa globale e persistente (continua navigando), controllabile da un tasto fluttuante play/pausa; una scena alla volta.

**Architecture:** Un singleton `player` (a livello modulo) possiede un unico `AudioEngine` + `mixer` + media-session + wake-lock, e vive per tutta la sessione. I componenti non creano più engine propri: `GameScreen` e `FloatingControls` pilotano il `player` condiviso. Aprire/toccare i controlli di una scena la "attiva" (fermando la precedente).

**Tech Stack:** Svelte 4, Vite 5, Vitest 1.6. Riusa `AudioEngine`, `createMixer`, `media-session`, `wake-lock`.

**Spec:** `docs/superpowers/specs/2026-07-03-bardo-fase6-playback-globale-mix-audio.md`
**Base:** app live, 21 scene. `GameScreen` attualmente crea `new AudioEngine()` + `createMixer` e fa `onDestroy(() => mixer.teardown())`.

---

## Task 1: Store `player` singleton

**Files:**
- Create: `src/lib/stores/player.js`
- Test: `src/lib/stores/player.test.js`

- [ ] **Step 1: Scrivi il test** `src/lib/stores/player.test.js`:
```js
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { get } from 'svelte/store';
import { createPlayer } from './player.js';
import { scenes } from '../data/scenes.js';

const A = scenes[0]; // tavern
const B = scenes.find((s) => s.id === 'forest');

function fakeEngine() {
  return {
    loadScene: vi.fn(), play: vi.fn(), pause: vi.fn(), stop: vi.fn(),
    setLayerVolume: vi.fn(), setMasterVolume: vi.fn(), setIntensity: vi.fn(),
    playOneShot: vi.fn(), destroy: vi.fn(), intensity: 'explore'
  };
}

describe('player globale', () => {
  let engine, player;
  beforeEach(() => { engine = fakeEngine(); player = createPlayer({ engine }); });

  it('playScene attiva la scena e suona', () => {
    player.playScene(A);
    expect(engine.loadScene).toHaveBeenCalledWith(A);
    expect(engine.play).toHaveBeenCalled();
    expect(get(player).scene.id).toBe('tavern');
    expect(get(player).playing).toBe(true);
  });

  it('una scena alla volta: playScene di un\'altra ricarica (ferma la precedente)', () => {
    player.playScene(A);
    engine.loadScene.mockClear();
    player.playScene(B);
    expect(engine.loadScene).toHaveBeenCalledWith(B);
    expect(get(player).scene.id).toBe('forest');
  });

  it('togglePlay mette in pausa la scena attiva', () => {
    player.playScene(A);
    player.togglePlay();
    expect(engine.pause).toHaveBeenCalled();
    expect(get(player).playing).toBe(false);
  });

  it('setLayer su una scena non attiva la attiva prima', () => {
    player.playScene(A);
    engine.loadScene.mockClear();
    player.setLayer(B, 'wind', 0.5);
    expect(engine.loadScene).toHaveBeenCalledWith(B);
    expect(engine.setLayerVolume).toHaveBeenCalledWith('wind', 0.5);
  });

  it('oneShot su una scena non attiva la attiva prima', () => {
    player.playScene(A);
    player.oneShot(B, 'twig');
    expect(engine.playOneShot).toHaveBeenCalledWith('twig');
    expect(get(player).scene.id).toBe('forest');
  });
});
```

- [ ] **Step 2: Esegui** `npm test` → FAIL (`createPlayer` non esiste).

- [ ] **Step 3: Scrivi `src/lib/stores/player.js`**:
```js
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
```

- [ ] **Step 4: Esegui** `npm test` → PASS (51 test: 46 + 5 nuovi). Paste il sommario.

- [ ] **Step 5: Commit**
```bash
git add src/lib/stores/player.js src/lib/stores/player.test.js
git commit -m "feat: store player globale (audio persistente, una scena alla volta)"
```

---

## Task 2: GameScreen usa il player (rimuove engine locale + teardown)

**Files:**
- Modify: `src/components/GameScreen.svelte`

Verifica: build pulita + regressioni. (Nessun test nuovo; logica coperta dal player.)

- [ ] **Step 1: Sostituisci l'intero `src/components/GameScreen.svelte`**:
```svelte
<script>
  import { player } from '../lib/stores/player.js';
  import NowPlaying from './NowPlaying.svelte';
  import IntensityTabs from './IntensityTabs.svelte';
  import Mixer from './Mixer.svelte';
  import OneShotBar from './OneShotBar.svelte';

  export let scene;
  export let onBack = () => {};

  // questa scena è quella attualmente attiva nel player?
  $: active = $player.scene && $player.scene.id === scene.id;
  // stato mostrato: reale se attiva, altrimenti default (0)
  $: shown = active ? $player : { playing: false, master: 1, intensity: 'explore', layers: {}, keepAwake: false };
</script>

<div style="padding:10px 16px 0;">
  <button on:click={onBack}
    style="border:none;cursor:pointer;background:#ffffff88;color:var(--ink);
           padding:8px 14px;border-radius:20px;font-size:13px;font-weight:600;">← Home</button>
</div>

<NowPlaying name={scene.name} image={scene.image ?? ''} />

{#if scene.music.combat.length > 0}
  <IntensityTabs value={shown.intensity} onChange={(l) => { if (active) player.setIntensity(l); }} />
{/if}

<div style="text-align:center;margin:4px 0 12px;">
  <button on:click={() => (active ? player.togglePlay() : player.playScene(scene))}
    style="border:none;cursor:pointer;background:var(--amber);color:#4a3410;font-weight:700;
           padding:12px 28px;border-radius:24px;font-size:15px;box-shadow:0 3px 0 #d9a85a;">
    {active && shown.playing ? '⏸ Pausa' : '▶ Play'}
  </button>
</div>

{#if player.wakeSupported}
  <div style="text-align:center;margin:-4px 0 10px;">
    <label style="font-size:12px;color:var(--ink-soft);cursor:pointer;">
      <input type="checkbox" checked={shown.keepAwake}
             on:change={(e) => player.setKeepAwake(e.target.checked)} />
      Tieni schermo acceso
    </label>
  </div>
{/if}

<Mixer {scene} state={shown} onMaster={(v) => player.setMaster(v)} onLayer={(id, v) => player.setLayer(scene, id, v)} />
<OneShotBar {scene} onPlay={(id) => player.oneShot(scene, id)} />
```

Note: rimosso `onMount(mixer.load)` e `onDestroy(mixer.teardown)` — l'audio è globale e NON si ferma uscendo. `IntensityTabs`, `Mixer`, `OneShotBar` invariati (ricevono `state`/callback come prima).

- [ ] **Step 2: Verifica**

Run: `npm test` → 51 test verdi (nessuna regressione; i test mixer/engine restano).
Run: `npm run build` → pulita, nessun errore Svelte. Paste il tail.

- [ ] **Step 3: Commit**
```bash
git add src/components/GameScreen.svelte
git commit -m "feat: GameScreen pilota il player globale (niente engine locale, niente stop all'uscita)"
```

---

## Task 3: FloatingControls + montaggio in App

**Files:**
- Create: `src/components/FloatingControls.svelte`
- Modify: `src/App.svelte`

- [ ] **Step 1: Crea `src/components/FloatingControls.svelte`**:
```svelte
<script>
  import { player } from '../lib/stores/player.js';
</script>

{#if $player.scene}
  <button on:click={() => player.togglePlay()} aria-label="play o pausa"
    style="position:fixed;right:16px;bottom:16px;z-index:50;border:none;cursor:pointer;
           background:var(--amber);color:#4a3410;border-radius:28px;height:56px;padding:0 20px;
           box-shadow:0 6px 16px #00000055;font-weight:700;display:flex;align-items:center;gap:10px;">
    <span style="font-size:18px;line-height:1;">{$player.playing ? '⏸' : '▶'}</span>
    <span style="font-size:12px;max-width:130px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">{$player.scene.name}</span>
  </button>
{/if}
```

- [ ] **Step 2: Modifica `src/App.svelte`** — monta `FloatingControls` fuori dalle viste di route (sempre presente). Sostituisci l'intero file:
```svelte
<script>
  import { createRoute } from './lib/stores/route.js';
  import { getScene } from './lib/data/scenes.js';
  import { userScenes } from './lib/stores/userScenes.js';
  import Home from './components/Home.svelte';
  import GameScreen from './components/GameScreen.svelte';
  import SceneBuilder from './components/SceneBuilder.svelte';
  import Credits from './components/Credits.svelte';
  import FloatingControls from './components/FloatingControls.svelte';

  const route = createRoute();
  $: resolve = (id) => getScene(id) ?? $userScenes.find((s) => s.id === id);
</script>

{#if $route.view === 'game'}
  {#key $route.sceneId}
    <GameScreen scene={resolve($route.sceneId)} onBack={() => route.home()} />
  {/key}
{:else if $route.view === 'builder'}
  <SceneBuilder onDone={() => route.home()} />
{:else if $route.view === 'credits'}
  <Credits onDone={() => route.home()} />
{:else}
  <Home onOpen={(id) => route.open(id)} onCreate={() => route.builder()} onCredits={() => route.credits()} />
{/if}

<FloatingControls />
```

- [ ] **Step 3: Verifica**

Run: `npm test` → 51 verdi.
Run: `npm run build` → pulita. Paste il tail.
(Il controller farà la verifica live: play scena A → Home → A continua → tasto fluttuante mette in pausa → Play su B sostituisce A.)

- [ ] **Step 4: Commit**
```bash
git add src/components/FloatingControls.svelte src/App.svelte
git commit -m "feat: tasto fluttuante play/pausa globale sempre visibile"
```

---

## Definition of Done (Fase 6/A)

- `player` singleton: una scena alla volta, persiste alla navigazione; test verdi.
- `GameScreen` senza engine locale e senza stop-all'uscita; usa il player.
- Tasto fluttuante play/pausa visibile quando c'è una scena attiva, controlla il player globale.
- `npm test` verde; `npm run build` pulita.

## Verifica manuale (controller, browser)

- Apri scena A → Play → torna in Home: l'audio **continua**. Compare il tasto fluttuante col nome scena.
- Tasto fluttuante → pausa (tutti i suoni si fermano) → play (riprende).
- Apri scena B → Play: sostituisce A (una alla volta). Torna in Home: B continua.
- Apri A mentre B suona, senza premere Play: B continua (aprire non ferma). Premi Play su A → passa ad A.

## Note

- `IntensityTabs` compaiono solo per scene con `combat` (le 4 fantasy originali per ora; le altre dopo la Fase 4).
- Il bottone **Play Mix** arriva nella Fase 6/B.
- L'audio persiste nella sessione; chiudendo la PWA si ferma (normale).
