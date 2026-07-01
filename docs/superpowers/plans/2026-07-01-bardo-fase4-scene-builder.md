# Bardo — Fase 4 (Scene builder) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** L'utente crea scene custom combinando i layer della libreria (musica + ambient + SFX, anche da scene diverse), le salva su localStorage, le vede in "Le mie scene" nella Home, le apre (senza tab intensità) e le elimina.

**Architecture:** Una funzione pura `buildUserScene` assembla una `UserScene` (stessa shape di `Scene`, con `custom:true`) dai layer scelti. Uno store `userScenes` (localStorage) le persiste in modo reattivo. Un componente `SceneBuilder` raccoglie le scelte; la Home elenca le custom e apre il builder; `App` risolve gli id custom e mostra la vista builder; `GameScreen` nasconde le tab intensità per le scene custom. Nessuna modifica all'`AudioEngine`.

**Tech Stack:** Svelte 4, Vite 5, Vitest 1.6 (localStorage/History mockati). Riusa engine/mixer/media-session/wake-lock esistenti.

**Spec:** `docs/superpowers/specs/2026-07-01-bardo-fase4-scene-builder-design.md`
**Base:** Fase 1+2 su `master`. File esistenti: `route.js`, `scenes.js` (scenes + getScene + demoScene), `Home.svelte`, `SceneCard.svelte`, `GameScreen.svelte`, `App.svelte`.

---

## File Structure (Fase 4)

```
Nuovi:
  src/lib/data/buildUserScene.js        # assemblaggio puro UserScene
  src/lib/data/buildUserScene.test.js
  src/lib/stores/userScenes.js          # persistenza localStorage (store reattivo)
  src/lib/stores/userScenes.test.js
  src/components/SceneBuilder.svelte     # schermata builder

Modificati:
  src/lib/stores/route.js               # + vista 'builder'
  src/lib/stores/route.test.js          # + test builder
  src/components/GameScreen.svelte       # nasconde IntensityTabs se scene.custom
  src/components/SceneCard.svelte        # + pulsante elimina opzionale
  src/components/Home.svelte             # sezione "Le mie scene" + tile "+ Crea scena"
  src/App.svelte                         # vista builder + risoluzione scene custom
```

**Convenzioni invariate:** Svelte 4, JS+JSDoc, Vitest globals. UserScene id con prefisso `u-`.

---

## Task 1: Route — vista builder

**Files:**
- Modify: `src/lib/stores/route.js`
- Modify test: `src/lib/stores/route.test.js`

- [ ] **Step 1: Aggiungi test** — appendi in fondo al `describe('route store', ...)` di `src/lib/stores/route.test.js`:
```js
  it('builder passa alla vista builder + pushState', () => {
    route.builder();
    expect(get(route)).toEqual({ view: 'builder' });
    expect(history.pushState).toHaveBeenCalledWith({ builder: true }, '', expect.anything());
  });

  it('popstate con state.builder ripristina la vista builder', () => {
    route.builder();
    win._emit('popstate', { state: { builder: true } });
    expect(get(route).view).toBe('builder');
  });
```

- [ ] **Step 2: Esegui** `npm test` → FAIL (`route.builder` non esiste).

- [ ] **Step 3: Modifica `src/lib/stores/route.js`**. Aggiungi la funzione `builder` e aggiorna il listener popstate. Sostituisci il corpo da `function home()` fino al `return`:
```js
  function home() {
    // torna indietro nello stack così lo stato history resta coerente
    history?.back();
  }

  function builder() {
    set({ view: 'builder' });
    history?.pushState({ builder: true }, '', '#/builder');
  }

  // il tasto Indietro (o back()) emette popstate: ripristina la vista dallo stato
  target?.addEventListener('popstate', (ev) => {
    const st = ev?.state;
    if (st?.sceneId) set({ view: 'game', sceneId: st.sceneId });
    else if (st?.builder) set({ view: 'builder' });
    else set({ view: 'home' });
  });

  return { subscribe, open, home, builder };
```

- [ ] **Step 4: Esegui** `npm test` → PASS (31 test: 29 + 2 nuovi).

- [ ] **Step 5: Commit**
```bash
git add src/lib/stores/route.js src/lib/stores/route.test.js
git commit -m "feat: route vista builder"
```

---

## Task 2: buildUserScene (funzione pura)

**Files:**
- Create: `src/lib/data/buildUserScene.js`
- Test: `src/lib/data/buildUserScene.test.js`

- [ ] **Step 1: Scrivi il test** `src/lib/data/buildUserScene.test.js`:
```js
import { describe, it, expect } from 'vitest';
import { buildUserScene } from './buildUserScene.js';

const musicRef = { id: 'forest-explore', name: 'Sentiero', src: ['/audio/forest/music.webm', '/audio/forest/music.m4a'], loop: true };
const crowd = { id: 'crowd', name: 'Brusio', src: ['/audio/tavern/crowd.webm'], loop: true };
const door = { id: 'door', name: 'Porta', src: ['/audio/tavern/door.webm'] };

describe('buildUserScene', () => {
  it('assembla una UserScene con id u-, custom true e musica nelle tre intensità', () => {
    const s = buildUserScene(
      { name: 'La mia taverna', cover: 'linear-gradient(1)', musicRef, ambientRefs: [crowd], oneshotRefs: [door] },
      () => 'u-fixed'
    );
    expect(s.id).toBe('u-fixed');
    expect(s.custom).toBe(true);
    expect(s.name).toBe('La mia taverna');
    expect(s.cover).toBe('linear-gradient(1)');
    expect(s.music.explore[0].id).toBe('forest-explore');
    expect(s.music.combat[0].id).toBe('forest-explore');
    expect(s.music.victory[0].id).toBe('forest-explore');
    expect(s.ambient.map((a) => a.id)).toEqual(['crowd']);
    expect(s.oneshots.map((o) => o.id)).toEqual(['door']);
  });

  it('default: ambient/oneshots vuoti se non passati', () => {
    const s = buildUserScene({ name: 'x', cover: 'c', musicRef }, () => 'u-1');
    expect(s.ambient).toEqual([]);
    expect(s.oneshots).toEqual([]);
  });

  it('genera id diversi con il generatore di default', () => {
    const a = buildUserScene({ name: 'a', cover: 'c', musicRef });
    const b = buildUserScene({ name: 'b', cover: 'c', musicRef });
    expect(a.id.startsWith('u-')).toBe(true);
    expect(a.id).not.toBe(b.id);
  });
});
```

- [ ] **Step 2: Esegui** `npm test` → FAIL (`buildUserScene` non esiste).

- [ ] **Step 3: Scrivi `src/lib/data/buildUserScene.js`**:
```js
/** @typedef {import('../types.js').AudioRef} AudioRef */
/** @typedef {import('../types.js').Scene} Scene */

let _seq = 0;
const defaultId = () => `u-${Date.now()}-${(_seq++).toString(36)}`;

/**
 * Assembla una scena custom (stessa shape di Scene, con custom:true) dai layer scelti.
 * La musica scelta è usata per tutte e tre le intensità (le tab sono nascoste per le custom).
 * @param {{name:string, cover:string, musicRef:AudioRef, ambientRefs?:AudioRef[], oneshotRefs?:AudioRef[]}} sel
 * @param {() => string} [idGen]
 * @returns {Scene}
 */
export function buildUserScene(sel, idGen = defaultId) {
  const { name, cover, musicRef, ambientRefs = [], oneshotRefs = [] } = sel;
  const track = { ...musicRef };
  return {
    id: idGen(),
    name,
    cover,
    custom: true,
    music: { explore: [track], combat: [track], victory: [track] },
    ambient: ambientRefs.map((r) => ({ ...r })),
    oneshots: oneshotRefs.map((r) => ({ ...r }))
  };
}
```

- [ ] **Step 4: Esegui** `npm test` → PASS.

- [ ] **Step 5: Commit**
```bash
git add src/lib/data/buildUserScene.js src/lib/data/buildUserScene.test.js
git commit -m "feat: buildUserScene (assemblaggio puro scena custom)"
```

---

## Task 3: Store userScenes (localStorage)

**Files:**
- Create: `src/lib/stores/userScenes.js`
- Test: `src/lib/stores/userScenes.test.js`

- [ ] **Step 1: Scrivi il test** `src/lib/stores/userScenes.test.js`:
```js
import { describe, it, expect, beforeEach } from 'vitest';
import { get } from 'svelte/store';
import { createUserScenes } from './userScenes.js';

function memStorage(initial) {
  const m = { ...(initial || {}) };
  return {
    getItem: (k) => (k in m ? m[k] : null),
    setItem: (k, v) => { m[k] = String(v); },
    removeItem: (k) => { delete m[k]; },
    _dump: () => m
  };
}
const scene = (id) => ({ id, name: id, cover: 'c', custom: true, music: { explore: [], combat: [], victory: [] }, ambient: [], oneshots: [] });

describe('userScenes store', () => {
  it('parte vuoto se storage vuoto', () => {
    const us = createUserScenes(memStorage());
    expect(get(us)).toEqual([]);
    expect(us.all()).toEqual([]);
  });

  it('add persiste su storage e aggiorna lo store', () => {
    const st = memStorage();
    const us = createUserScenes(st);
    us.add(scene('u-1'));
    expect(get(us).map((s) => s.id)).toEqual(['u-1']);
    expect(JSON.parse(st.getItem('bardo.userScenes')).map((s) => s.id)).toEqual(['u-1']);
  });

  it('remove elimina e persiste', () => {
    const st = memStorage();
    const us = createUserScenes(st);
    us.add(scene('u-1'));
    us.add(scene('u-2'));
    us.remove('u-1');
    expect(us.all().map((s) => s.id)).toEqual(['u-2']);
    expect(JSON.parse(st.getItem('bardo.userScenes')).map((s) => s.id)).toEqual(['u-2']);
  });

  it('reidrata da storage esistente all avvio', () => {
    const st = memStorage({ 'bardo.userScenes': JSON.stringify([scene('u-9')]) });
    const us = createUserScenes(st);
    expect(us.all().map((s) => s.id)).toEqual(['u-9']);
  });
});
```

- [ ] **Step 2: Esegui** `npm test` → FAIL (`createUserScenes` non esiste).

- [ ] **Step 3: Scrivi `src/lib/stores/userScenes.js`**:
```js
import { writable } from 'svelte/store';

const KEY = 'bardo.userScenes';

/**
 * Store delle scene custom, persistite su localStorage.
 * @param {Storage|Object} [storage]
 */
export function createUserScenes(storage = typeof localStorage !== 'undefined' ? localStorage : null) {
  const read = () => {
    if (!storage) return [];
    try { return JSON.parse(storage.getItem(KEY)) || []; } catch { return []; }
  };
  let current = read();
  const { subscribe, set } = writable(current);

  const persist = () => {
    if (!storage) return;
    try { storage.setItem(KEY, JSON.stringify(current)); } catch { /* quota/serialize */ }
  };

  function add(scene) { current = [...current, scene]; persist(); set(current); }
  function remove(id) { current = current.filter((s) => s.id !== id); persist(); set(current); }
  function all() { return current; }

  return { subscribe, add, remove, all };
}

/** Singleton dell'app (usa il vero localStorage). */
export const userScenes = createUserScenes();
```

- [ ] **Step 4: Esegui** `npm test` → PASS.

- [ ] **Step 5: Commit**
```bash
git add src/lib/stores/userScenes.js src/lib/stores/userScenes.test.js
git commit -m "feat: store userScenes persistito su localStorage"
```

---

## Task 4: GameScreen — nasconde intensità per scene custom

**Files:**
- Modify: `src/components/GameScreen.svelte`

Verifica manuale (nessun test unit: è un ramo di rendering). Cambio minimo: avvolgere `IntensityTabs` in `{#if !scene.custom}`.

- [ ] **Step 1: Modifica `src/components/GameScreen.svelte`** — sostituisci la riga:
```svelte
<IntensityTabs value={$mixer.intensity} onChange={(l) => mixer.setIntensity(l)} />
```
con:
```svelte
{#if !scene.custom}
  <IntensityTabs value={$mixer.intensity} onChange={(l) => mixer.setIntensity(l)} />
{/if}
```

- [ ] **Step 2: Verifica**

Run: `npm test` → 38 test verdi (nessuna regressione; nessun nuovo test).
Run: `npm run build` → pulita. Paste tail.

- [ ] **Step 3: Commit**
```bash
git add src/components/GameScreen.svelte
git commit -m "feat: GameScreen nasconde le tab intensità per le scene custom"
```

---

## Task 5: SceneBuilder + creazione end-to-end

**Files:**
- Create: `src/components/SceneBuilder.svelte`
- Modify: `src/App.svelte`, `src/components/Home.svelte`

Verifica manuale nel browser (logica pura già coperta da T2/T3). Al termine di questa task si può: Home → "+ Crea scena" → builder → salva → la scena è in localStorage (visibile/eliminabile in T6).

- [ ] **Step 1: Crea `src/components/SceneBuilder.svelte`**:
```svelte
<script>
  import { scenes } from '../lib/data/scenes.js';
  import { buildUserScene } from '../lib/data/buildUserScene.js';
  import { userScenes } from '../lib/stores/userScenes.js';

  export let onDone = () => {};   // torna a Home (salvato o annullato)

  const palette = [
    'linear-gradient(160deg,#f3c98a,#b98a4a)',
    'linear-gradient(160deg,#a9d18a,#6fa15a)',
    'linear-gradient(160deg,#8fa6d1,#5d6fa1)',
    'linear-gradient(160deg,#6b5563,#3a2c38)',
    'linear-gradient(160deg,#c9a0dc,#7d5a9c)',
    'linear-gradient(160deg,#e79a9a,#b95a5a)'
  ];

  const musicOptions = scenes.map((s) => ({ ref: s.music.explore[0], label: `${s.music.explore[0].name} (${s.name})` }));
  const ambientOptions = scenes.flatMap((s) => s.ambient.map((a) => ({ ref: a, label: `${a.name} (${s.name})` })));
  const oneshotOptions = scenes.flatMap((s) => s.oneshots.map((o) => ({ ref: o, label: `${o.name} (${s.name})` })));

  let name = '';
  let cover = palette[0];
  let musicId = musicOptions[0]?.ref.id ?? '';
  let ambientIds = new Set();
  let oneshotIds = new Set();

  function toggle(set, id) {
    const next = new Set(set);
    next.has(id) ? next.delete(id) : next.add(id);
    return next;
  }

  $: canSave = name.trim().length > 0 && musicId;

  function save() {
    const musicRef = musicOptions.find((o) => o.ref.id === musicId).ref;
    const ambientRefs = ambientOptions.filter((o) => ambientIds.has(o.ref.id)).map((o) => o.ref);
    const oneshotRefs = oneshotOptions.filter((o) => oneshotIds.has(o.ref.id)).map((o) => o.ref);
    userScenes.add(buildUserScene({ name: name.trim(), cover, musicRef, ambientRefs, oneshotRefs }));
    onDone();
  }
</script>

<div style="padding:10px 16px 24px;">
  <button on:click={onDone}
    style="border:none;cursor:pointer;background:#ffffff88;color:var(--ink);padding:8px 14px;border-radius:20px;font-size:13px;font-weight:600;">← Home</button>

  <h2 style="font-family:Georgia,serif;color:#7a5a2e;">Crea scena</h2>

  <label style="display:block;font-size:12px;color:var(--ink-soft);text-transform:uppercase;letter-spacing:1px;">Nome</label>
  <input bind:value={name} placeholder="La mia scena"
    style="width:100%;padding:10px;border-radius:10px;border:1px solid #d3b985;background:var(--panel);margin:4px 0 14px;" />

  <div style="font-size:12px;color:var(--ink-soft);text-transform:uppercase;letter-spacing:1px;margin-bottom:6px;">Colore</div>
  <div style="display:flex;gap:8px;margin-bottom:14px;">
    {#each palette as g}
      <button on:click={() => (cover = g)} aria-label="colore"
        style="width:34px;height:34px;border-radius:8px;cursor:pointer;background:{g};border:{cover === g ? '3px solid var(--amber-deep)' : '1px solid #d3b985'};"></button>
    {/each}
  </div>

  <div style="font-size:12px;color:var(--ink-soft);text-transform:uppercase;letter-spacing:1px;margin-bottom:6px;">Musica</div>
  <select bind:value={musicId} style="width:100%;padding:10px;border-radius:10px;border:1px solid #d3b985;background:var(--panel);margin-bottom:14px;">
    {#each musicOptions as o}
      <option value={o.ref.id}>{o.label}</option>
    {/each}
  </select>

  <div style="font-size:12px;color:var(--ink-soft);text-transform:uppercase;letter-spacing:1px;margin-bottom:6px;">Ambienti</div>
  <div style="display:flex;flex-wrap:wrap;gap:8px;margin-bottom:14px;">
    {#each ambientOptions as o}
      <button on:click={() => (ambientIds = toggle(ambientIds, o.ref.id))}
        style="border:none;cursor:pointer;border-radius:20px;padding:8px 12px;font-size:12px;
               background:{ambientIds.has(o.ref.id) ? 'var(--amber)' : '#ffffff88'};color:var(--ink);">{o.label}</button>
    {/each}
  </div>

  <div style="font-size:12px;color:var(--ink-soft);text-transform:uppercase;letter-spacing:1px;margin-bottom:6px;">Effetti</div>
  <div style="display:flex;flex-wrap:wrap;gap:8px;margin-bottom:18px;">
    {#each oneshotOptions as o}
      <button on:click={() => (oneshotIds = toggle(oneshotIds, o.ref.id))}
        style="border:none;cursor:pointer;border-radius:20px;padding:8px 12px;font-size:12px;
               background:{oneshotIds.has(o.ref.id) ? 'var(--amber)' : '#ffffff88'};color:var(--ink);">{o.label}</button>
    {/each}
  </div>

  <button on:click={save} disabled={!canSave}
    style="width:100%;border:none;cursor:pointer;background:var(--amber);color:#4a3410;font-weight:700;
           padding:14px;border-radius:24px;font-size:15px;box-shadow:0 3px 0 #d9a85a;opacity:{canSave ? 1 : 0.5};">Salva scena</button>
</div>
```

- [ ] **Step 2: Modifica `src/App.svelte`** — aggiungi la vista builder. Sostituisci l'intero file:
```svelte
<script>
  import { createRoute } from './lib/stores/route.js';
  import { getScene } from './lib/data/scenes.js';
  import { userScenes } from './lib/stores/userScenes.js';
  import Home from './components/Home.svelte';
  import GameScreen from './components/GameScreen.svelte';
  import SceneBuilder from './components/SceneBuilder.svelte';

  const route = createRoute();

  // libreria prima, poi scene custom
  $: resolve = (id) => getScene(id) ?? $userScenes.find((s) => s.id === id);
</script>

{#if $route.view === 'game'}
  {#key $route.sceneId}
    <GameScreen scene={resolve($route.sceneId)} onBack={() => route.home()} />
  {/key}
{:else if $route.view === 'builder'}
  <SceneBuilder onDone={() => route.home()} />
{:else}
  <Home onOpen={(id) => route.open(id)} onCreate={() => route.builder()} />
{/if}
```

- [ ] **Step 3: Modifica `src/components/Home.svelte`** — aggiungi la tile "+ Crea scena" (la sezione "Le mie scene" arriva in T6). Sostituisci l'intero file:
```svelte
<script>
  import SceneCard from './SceneCard.svelte';
  import { scenes } from '../lib/data/scenes.js';
  export let onOpen = (_id) => {};
  export let onCreate = () => {};
</script>

<header style="padding:16px 16px 6px;display:flex;align-items:center;gap:8px;">
  <div style="font-family:Georgia,serif;font-size:22px;font-weight:700;color:#7a5a2e;">⚜ Bardo</div>
</header>

<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;padding:10px 16px 24px;">
  {#each scenes as scene}
    <SceneCard {scene} {onOpen} />
  {/each}
  <button on:click={onCreate}
    style="border:2px dashed #d3b985;cursor:pointer;background:#efe1c4;border-radius:14px;height:96px;
           color:#a98f5e;font-size:13px;font-weight:600;">+ Crea scena</button>
</div>
```

- [ ] **Step 4: Verifica**

Run: `npm test` → 38 verdi (nessuna regressione; l'import di userScenes usa localStorage reale che in jsdom esiste — se un test fallisse per storage, segnala BLOCKED).
Run: `npm run build` → pulita. Paste tail.

- [ ] **Step 5: Commit**
```bash
git add src/components/SceneBuilder.svelte src/App.svelte src/components/Home.svelte
git commit -m "feat: SceneBuilder + creazione scena custom (Home -> builder -> salva)"
```

---

## Task 6: "Le mie scene" — elenco, apertura, eliminazione

**Files:**
- Modify: `src/components/SceneCard.svelte`, `src/components/Home.svelte`

Verifica manuale nel browser. La risoluzione degli id custom in `App` è già stata fatta in T5, quindi aprire una custom funziona; qui la rendiamo visibile ed eliminabile.

- [ ] **Step 1: Modifica `src/components/SceneCard.svelte`** — aggiungi un pulsante elimina opzionale. Sostituisci l'intero file:
```svelte
<script>
  export let scene;
  export let onOpen = (_id) => {};
  export let onDelete = null;   // se fornito, mostra la ✕ (solo scene custom)
</script>

<div style="position:relative;">
  <button
    on:click={() => onOpen(scene.id)}
    style="width:100%;border:none;cursor:pointer;padding:0;border-radius:14px;overflow:hidden;
           height:96px;position:relative;background:{scene.cover};box-shadow:0 3px 0 #d9b877;">
    <span style="position:absolute;left:10px;bottom:8px;color:#fff;font-weight:700;
                 font-size:14px;text-shadow:0 1px 3px #00000088;">{scene.name}</span>
  </button>
  {#if onDelete}
    <button on:click|stopPropagation={() => onDelete(scene.id)} aria-label="elimina"
      style="position:absolute;top:6px;right:6px;border:none;cursor:pointer;width:26px;height:26px;
             border-radius:50%;background:#00000055;color:#fff;font-size:14px;line-height:1;">✕</button>
  {/if}
</div>
```

- [ ] **Step 2: Modifica `src/components/Home.svelte`** — aggiungi la sezione "Le mie scene". Sostituisci l'intero file:
```svelte
<script>
  import SceneCard from './SceneCard.svelte';
  import { scenes } from '../lib/data/scenes.js';
  import { userScenes } from '../lib/stores/userScenes.js';
  export let onOpen = (_id) => {};
  export let onCreate = () => {};

  function del(id) {
    if (confirm('Eliminare questa scena?')) userScenes.remove(id);
  }
</script>

<header style="padding:16px 16px 6px;display:flex;align-items:center;gap:8px;">
  <div style="font-family:Georgia,serif;font-size:22px;font-weight:700;color:#7a5a2e;">⚜ Bardo</div>
</header>

<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;padding:10px 16px 8px;">
  {#each scenes as scene}
    <SceneCard {scene} {onOpen} />
  {/each}
</div>

<div style="font-size:11px;color:var(--ink-soft);text-transform:uppercase;letter-spacing:1px;padding:6px 16px 0;">Le mie scene</div>
<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;padding:6px 16px 24px;">
  {#each $userScenes as scene (scene.id)}
    <SceneCard {scene} {onOpen} onDelete={del} />
  {/each}
  <button on:click={onCreate}
    style="border:2px dashed #d3b985;cursor:pointer;background:#efe1c4;border-radius:14px;height:96px;
           color:#a98f5e;font-size:13px;font-weight:600;">+ Crea scena</button>
</div>
```

- [ ] **Step 3: Verifica**

Run: `npm test` → 38 verdi (nessuna regressione).
Run: `npm run build` → pulita. Paste tail.

- [ ] **Step 4: Commit**
```bash
git add src/components/SceneCard.svelte src/components/Home.svelte
git commit -m "feat: sezione 'Le mie scene' con apertura ed eliminazione"
```

---

## Definition of Done (Fase 4)

- `npm test` verde (route builder, buildUserScene, userScenes + regressioni).
- Home mostra le scene libreria, "Le mie scene", e "+ Crea scena".
- Builder crea una scena custom da layer misti (musica + ambient + SFX), salvata su localStorage; persiste al reload.
- La scena custom si apre nel GameScreen **senza** tab intensità e riproduce i layer scelti.
- Eliminazione con conferma funziona e aggiorna la Home.

## Verifiche manuali (controller, browser)

- Home → "+ Crea scena" → scegli musica (es. Foresta) + ambient (es. Brusio taverna + Gocce dungeon) + un SFX + nome + colore → Salva.
- La scena appare in "Le mie scene"; aprila → niente tab intensità; Play → suona la musica scelta; alza gli ambient scelti; SFX funziona.
- Torna in Home, ricarica la pagina → la scena custom è ancora lì (localStorage).
- Elimina la scena (✕ + conferma) → sparisce dalla Home.

## Note / carry-over

- Edit di una scena custom → fase successiva.
- Nessuna validazione oltre "nome non vuoto"; nomi duplicati permessi (id univoco).
- Le user scenes referenziano audio di libreria (già in precache) → offline senza download.
- `confirm()` nativo per l'eliminazione: semplice; sostituibile con un dialog custom in una fase di polish.

### Emerso nella final review (non bloccante)

- **Invariante id globalmente unici:** builder e engine assumono che gli id dei layer di libreria siano unici. Vero oggi (crowd/wind/market/drip; door/twig/bell/chain; <scene>-explore). Se in Fase 5 la libreria cresce, mantenere l'unicità o aggiungere un guard. Le `{#each}` dei chip nel builder sono unkeyed.
- **popstate non rimosso** in `createRoute` (istanza singola in App → innocuo; conta solo in scenari multi-istanza).
- **a11y label "Nome"** ora associata all'input (`for`/`id`) → build senza warning.
- Deep-link a `#/scene/u-...` a freddo mostra Home (il route parte da home).
