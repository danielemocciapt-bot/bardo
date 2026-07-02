# Bardo — Fase 5a (Intensità vere) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ogni scena di libreria ottiene 3 tracce musicali distinte (esplora/combatti/vittoria) così le tab intensità cambiano davvero musica con crossfade.

**Architecture:** Cambio di soli asset + dati. Gli id dei layer musicali restano `<scena>-explore/combat/victory` (già così); cambia solo il file `src`. Nessuna modifica alla logica di `AudioEngine`/`mixer`/UI. Le scene custom (una traccia, tab nascoste) restano invariate.

**Tech Stack:** Svelte 4, Vite 5, Vitest 1.6, Howler, vite-plugin-pwa. Audio: Pixabay CDN + ffmpeg (già disponibili). Nessuna nuova dipendenza.

**Spec:** `docs/superpowers/specs/2026-07-01-bardo-fase5-intensita-design.md`
**Base:** Fase 1+2+4 su `master`. `scenes.js` attuale usa una traccia condivisa `music.*` per scena; `public/audio/<scena>/music.{webm,m4a}` esistono; `licenses.json` ha 12 entry.

---

## Task 1: Audio — esplora (rinomina) + combatti/vittoria (sourcing) + licenze

**Files:**
- Rename: `public/audio/<scena>/music.{webm,m4a}` → `explore.{webm,m4a}` (4 scene)
- Create: `public/audio/<scena>/combat.{webm,m4a}`, `public/audio/<scena>/victory.{webm,m4a}` (4 scene = 8 tracce = 16 file)
- Modify: `src/lib/data/licenses.json`

Nessun unit test (asset). Verifica = file presenti + build.

- [ ] **Step 1: Rinomina le tracce esistenti a `explore`** (sono già mood calmo/esplorazione):
```bash
cd "C:/Users/danie/Dev/pocketbard-clone"
for s in tavern forest city dungeon; do
  for ext in webm m4a; do
    [ -f "public/audio/$s/music.$ext" ] && git mv "public/audio/$s/music.$ext" "public/audio/$s/explore.$ext"
  done
done
ls -R public/audio
```
(Usa `git mv` per preservare la history; se un file `.m4a` non esiste, ignora.)

- [ ] **Step 2: Scarica e converti le tracce `combat` e `victory` per ogni scena.**
Fonti: Pixabay CDN (Content License, royalty-free) — trova gli URL via WebSearch/scrape con User-Agent browser (come in Fase 2), VERIFICA ogni download (`curl -sL -o /tmp/x.mp3 -w "%{http_code} %{size_download} %{content_type}\n" "<URL>"` → http 200, audio, >20KB) PRIMA di convertire.

Mood per scena:
- **tavern/combat**: rissa da taverna concitata / bar fight lively. **tavern/victory**: brindisi trionfale, folk allegro.
- **forest/combat**: agguato/battaglia tesa orchestrale. **forest/victory**: quiete trionfale, natura serena.
- **city/combat**: guardie/inseguimento urgente. **city/victory**: fanfara regale/di corte.
- **dungeon/combat**: orrore/boss incalzante. **dungeon/victory**: tesoro, sollievo cupo-calmo.

Converti ciascuna (cap durata ~50s per contenere il precache):
```bash
ffmpeg -y -i /tmp/x.mp3 -t 50 -c:a libopus -b:a 72k -ac 1 public/audio/<scena>/<combat|victory>.webm
ffmpeg -y -i /tmp/x.mp3 -t 50 -c:a aac    -b:a 96k -ac 2 public/audio/<scena>/<combat|victory>.m4a
```

**Fallback** (se una traccia non è recuperabile in automatico): usa la stessa `explore` copiata come `victory` (meno grave), o lascia il ref mancante e segnala il buco nel report. NON inventare audio. L'app tollera un 404 silenzioso.

- [ ] **Step 3: Aggiorna `src/lib/data/licenses.json`.**
  - Cambia i 4 path `audio/<scena>/music.webm` → `audio/<scena>/explore.webm`.
  - Aggiungi una entry per ognuna delle 8 nuove tracce: `{ "file":"audio/<scena>/combat.webm", "source":"<URL>", "license":"Pixabay", "author":"<nome o ''>" }` (idem victory).
  - JSON valido: verifica `node -e "JSON.parse(require('fs').readFileSync('src/lib/data/licenses.json'))"`.

- [ ] **Step 4: Verifica asset.**
```bash
ls -R public/audio        # atteso: explore/combat/victory + ambient + oneshot per scena
for s in tavern forest city dungeon; do for k in explore combat victory; do
  ffprobe -v error -show_entries format=duration -of csv=p=0 "public/audio/$s/$k.webm" 2>/dev/null | xargs printf "$s/$k %ss\n";
done; done
```
Paste l'albero e le durate nel report. Elenca esplicitamente eventuali GAP.

- [ ] **Step 5: Commit** (solo se almeno le rinomine + alcune tracce sono a posto):
```bash
git add public/audio src/lib/data/licenses.json
git commit -m "assets: tracce musicali distinte esplora/combatti/vittoria per le 4 scene"
```

---

## Task 2: Dati — scenes.js con src distinti per intensità

**Files:**
- Modify: `src/lib/data/scenes.js`

- [ ] **Step 1: Sostituisci `src/lib/data/scenes.js`** con la versione a tracce distinte (id invariati; cambia solo il `src` della musica; ambient/oneshots invariati):

```js
/** @typedef {import('../types.js').Scene} Scene */

const fmt = (base, name) => [`/audio/${base}/${name}.webm`, `/audio/${base}/${name}.m4a`];

/** @type {Scene[]} */
export const scenes = [
  {
    id: 'tavern',
    name: 'Taverna del Drago',
    cover: 'linear-gradient(160deg,#f3c98a,#b98a4a)',
    music: {
      explore: [{ id: 'tavern-explore', name: 'Calma', src: fmt('tavern', 'explore'), loop: true }],
      combat:  [{ id: 'tavern-combat',  name: 'Rissa', src: fmt('tavern', 'combat'),  loop: true }],
      victory: [{ id: 'tavern-victory', name: 'Brindisi', src: fmt('tavern', 'victory'), loop: true }]
    },
    ambient: [
      { id: 'crowd', name: 'Brusio', src: fmt('tavern', 'crowd'), loop: true }
    ],
    oneshots: [
      { id: 'door', name: 'Porta', src: fmt('tavern', 'door') }
    ]
  },
  {
    id: 'forest',
    name: 'Foresta Antica',
    cover: 'linear-gradient(160deg,#a9d18a,#6fa15a)',
    music: {
      explore: [{ id: 'forest-explore', name: 'Sentiero', src: fmt('forest', 'explore'), loop: true }],
      combat:  [{ id: 'forest-combat',  name: 'Agguato',  src: fmt('forest', 'combat'),  loop: true }],
      victory: [{ id: 'forest-victory', name: 'Radura',   src: fmt('forest', 'victory'), loop: true }]
    },
    ambient: [
      { id: 'wind', name: 'Vento', src: fmt('forest', 'wind'), loop: true }
    ],
    oneshots: [
      { id: 'twig', name: 'Ramo', src: fmt('forest', 'twig') }
    ]
  },
  {
    id: 'city',
    name: 'Città Reale',
    cover: 'linear-gradient(160deg,#8fa6d1,#5d6fa1)',
    music: {
      explore: [{ id: 'city-explore', name: 'Vie', src: fmt('city', 'explore'), loop: true }],
      combat:  [{ id: 'city-combat',  name: 'Guardie', src: fmt('city', 'combat'), loop: true }],
      victory: [{ id: 'city-victory', name: 'Corte', src: fmt('city', 'victory'), loop: true }]
    },
    ambient: [
      { id: 'market', name: 'Mercato', src: fmt('city', 'market'), loop: true }
    ],
    oneshots: [
      { id: 'bell', name: 'Campana', src: fmt('city', 'bell') }
    ]
  },
  {
    id: 'dungeon',
    name: 'Sotterranei',
    cover: 'linear-gradient(160deg,#6b5563,#3a2c38)',
    music: {
      explore: [{ id: 'dungeon-explore', name: 'Cripta', src: fmt('dungeon', 'explore'), loop: true }],
      combat:  [{ id: 'dungeon-combat',  name: 'Orrore', src: fmt('dungeon', 'combat'), loop: true }],
      victory: [{ id: 'dungeon-victory', name: 'Tesoro', src: fmt('dungeon', 'victory'), loop: true }]
    },
    ambient: [
      { id: 'drip', name: 'Gocce', src: fmt('dungeon', 'drip'), loop: true }
    ],
    oneshots: [
      { id: 'chain', name: 'Catene', src: fmt('dungeon', 'chain') }
    ]
  }
];

/** @param {string} id @returns {Scene|undefined} */
export const getScene = (id) => scenes.find((s) => s.id === id);

/** Prima scena, usata come default in test e avvio. */
export const demoScene = scenes[0];
```

- [ ] **Step 2: Esegui i test** — la shape è invariata (music.{explore,combat,victory} con 1 traccia ciascuna, ambient 1, oneshots 1) e gli id sono invariati, quindi i test restano verdi.

Run: `npm test`
Expected: 39 test verdi (nessuna modifica ai test).

- [ ] **Step 3: Build.**

Run: `npm run build`
Expected: pulita; il precache ora include le tracce combat/victory (precache sale a ~14-15MB / ~30+ entry a seconda dei GAP). Paste la riga PWA precache.

- [ ] **Step 4: Commit.**
```bash
git add src/lib/data/scenes.js
git commit -m "feat: scene con tracce musicali distinte per intensità"
```

---

## Definition of Done (Fase 5a)

- Ogni scena ha file `explore/combat/victory` (o fallback documentato) in `public/audio/<scena>/`.
- `scenes.js` referenzia le tracce distinte; `licenses.json` aggiornato e valido.
- `npm test` verde; `npm run build` pulita; precache include i nuovi file.
- (Controller) In browser: Play in una scena → tab **Combatti** carica `combat.*` (200/206) e la musica cambia in crossfade → tab **Vittoria** carica `victory.*`. Nessun 404 sui file presenti.

## Verifica manuale (controller, browser)

- Apri una scena (es. Sotterranei) → Play → tab **Combatti**: `dungeon/combat.webm` in rete (200/206), crossfade dalla traccia esplora → tab **Vittoria**: `dungeon/victory.webm`. Ripeti su almeno 2 scene.
- Le scene custom continuano a non mostrare le tab e a suonare la loro traccia.

## Note / carry-over

- Precache ~15MB: se cresce ancora, riprendere il download-manager (Fase 3).
- Loop/seam combat/victory: cura ragionevole.
- Eventuali GAP di sourcing documentati nel report di Task 1 → l'utente può droppare i file mancanti in `public/audio/<scena>/`.
