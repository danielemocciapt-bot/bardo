# Bardo — Fase 5b/A (8 scene nuove) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Aggiungere 8 scene "semplici" (1 musica + 1 ambient + 1 SFX, senza tab intensità) portando la libreria a 12 scene.

**Architecture:** Solo audio + dati + un ramo di rendering. Le scene semplici hanno `music.combat`/`music.victory` vuoti; `GameScreen` mostra le tab solo se ci sono tracce combat. Nessuna modifica ad `AudioEngine`/`mixer`.

**Tech Stack:** Svelte 4, Vite 5, Vitest 1.6, Howler, Pixabay CDN + ffmpeg. Nessuna nuova dipendenza.

**Spec:** `docs/superpowers/specs/2026-07-02-bardo-fase5b-contenuti-grafica-deploy-design.md`
**Base:** Fase 1/2/4/5a su `master`. `scenes.js` ha 4 scene con 3 intensità distinte. `scenes.test.js` verifica `music.combat.length>0` per tutte (da rilassare).

---

## Task 1: Audio per le 8 scene nuove (24 suoni) + licenze

**Files:**
- Create: `public/audio/<id>/{music,<ambient>,<sfx>}.{webm,m4a}` per 8 scene
- Modify: `src/lib/data/licenses.json`

Task procedurale (asset), nessun unit test. Fallback come nelle fasi audio precedenti.

Scene + id layer (ids ambient/SFX **globalmente unici**, non collidono con esistenti crowd/wind/market/drip, door/twig/bell/chain):

| scene id | nome | music mood | ambient id | ambient mood | sfx id | sfx mood |
|---|---|---|---|---|---|---|
| battle | Battaglia campale | epico/percussivo battaglia | warcries | urla/mischia lontana (loop) | sword | cozzo di spade |
| inn | Locanda | folk caldo tranquillo | hearth | camino che crepita (loop) | mug | boccale sul tavolo |
| harbor | Porto sul mare | musica marinaresca calma | waves | onde sul molo (loop) | gull | gabbiano |
| temple | Tempio in rovina | ambient sacro/misterioso | chant | eco/canto lontano (loop) | gong | gong/campana grave |
| mountains | Montagne innevate | ambient freddo epico | gale | vento gelido (loop) | rockfall | frana di sassi |
| swamp | Palude | ambient cupo umido | frogs | rane e insetti (loop) | splash | tonfo in acqua |
| graveyard | Cimitero | ambient inquietante | moan | vento spettrale (loop) | crow | corvo |
| cave | Caverna/Miniera | ambient scuro risonante | echo | riverbero grotta (loop) | pickaxe | colpo di piccone |

- [ ] **Step 1: Crea le cartelle** `mkdir -p public/audio/{battle,inn,harbor,temple,mountains,swamp,graveyard,cave}`.

- [ ] **Step 2: Scarica e converti 24 suoni** (music+ambient+sfx per ognuna delle 8 scene) da **Pixabay** (Content License). Tecnica (come Fase 2/5a): curl la pagina Pixabay con User-Agent browser per estrarre l'URL `cdn.pixabay.com/download/audio/...`, oppure WebSearch per trovare le pagine. VERIFICA ogni download prima di convertire:
`curl -sL -o /tmp/x.mp3 -w "%{http_code} %{size_download} %{content_type}\n" "<URL>"` → http 200, audio/*, >20000 byte.

Conversione (music/ambient loop cap 50s; sfx corti):
```bash
# music / ambient (loop)
ffmpeg -y -i /tmp/x.mp3 -t 50 -c:a libopus -b:a 72k -ac 1 public/audio/<scene>/<name>.webm
ffmpeg -y -i /tmp/x.mp3 -t 50 -c:a aac    -b:a 96k -ac 2 public/audio/<scene>/<name>.m4a
# sfx (short, cap se >8s)
ffmpeg -y -i /tmp/x.wav -c:a libopus -b:a 96k -ac 1 public/audio/<scene>/<sfx>.webm
ffmpeg -y -i /tmp/x.wav -c:a aac    -b:a 128k       public/audio/<scene>/<sfx>.m4a
```
File attesi per scena: `music.{webm,m4a}`, `<ambient>.{webm,m4a}`, `<sfx>.{webm,m4a}` (nomi = colonna id della tabella).

**Fallback** (per slot non recuperabile): riduci (salta l'SFX, o riusa un ambient simile), o lascia il ref e SEGNALA il GAP nel report. Non inventare audio; non falsificare licenze.

- [ ] **Step 3: Aggiorna `src/lib/data/licenses.json`** — aggiungi una entry per ogni file scaricato: `{ "file":"audio/<scene>/<name>.webm", "source":"<pagina Pixabay>", "license":"Pixabay", "author":"<uploader o ''>" }`. Valida: `node -e "JSON.parse(require('fs').readFileSync('src/lib/data/licenses.json'))" && echo OK`.

- [ ] **Step 4: Verifica.** `ls -R public/audio` e durate:
```bash
for s in battle inn harbor temple mountains swamp graveyard cave; do
  for f in public/audio/$s/*.webm; do d=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$f" 2>/dev/null); echo "$f ${d:-MISSING}"; done
done
```
Paste l'albero e le durate nel report; elenca esplicitamente i GAP.

- [ ] **Step 5: Commit** (se almeno la maggior parte è a posto):
```bash
git add public/audio src/lib/data/licenses.json
git commit -m "assets: audio per 8 scene nuove (Pixabay) + licenze"
```

---

## Task 2: Dati scene + rendering scene semplici

**Files:**
- Modify: `src/lib/types.js`, `src/lib/data/scenes.js`, `src/components/GameScreen.svelte`
- Modify test: `src/lib/data/scenes.test.js`

- [ ] **Step 1: Aggiorna `src/lib/data/scenes.test.js`** (sostituisci l'intero file) — 12 scene, `explore` obbligatorio, `combat`/`victory` opzionali, id unici, ambient/oneshots non vuoti:
```js
import { describe, it, expect } from 'vitest';
import { scenes, getScene, demoScene } from './scenes.js';

describe('scenes library', () => {
  it('contiene 12 scene con id/nome/cover e musica esplora', () => {
    expect(scenes.length).toBe(12);
    for (const s of scenes) {
      expect(s.id).toBeTypeOf('string');
      expect(s.name).toBeTypeOf('string');
      expect(s.cover).toBeTypeOf('string');
      expect(s.music.explore.length).toBeGreaterThan(0);
      expect(Array.isArray(s.music.combat)).toBe(true);
      expect(Array.isArray(s.music.victory)).toBe(true);
      expect(s.ambient.length).toBeGreaterThan(0);
      expect(s.oneshots.length).toBeGreaterThan(0);
    }
  });

  it('le 4 scene originali hanno le 3 intensità, le altre sono semplici', () => {
    const withIntensity = scenes.filter((s) => s.music.combat.length > 0).map((s) => s.id);
    expect(withIntensity.sort()).toEqual(['city', 'dungeon', 'forest', 'tavern']);
  });

  it('ha id scena unici', () => {
    const ids = scenes.map((s) => s.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('getScene ritorna la scena per id, undefined se assente', () => {
    expect(getScene('battle')).toBe(scenes.find((s) => s.id === 'battle'));
    expect(getScene('nope')).toBeUndefined();
  });

  it('demoScene è la prima scena (tavern, con intensità)', () => {
    expect(demoScene).toBe(scenes[0]);
    expect(demoScene.id).toBe('tavern');
    expect(demoScene.music.combat.length).toBeGreaterThan(0);
  });
});
```

- [ ] **Step 2: Esegui** `npm test` → FAIL (scenes.length è 4, non 12).

- [ ] **Step 3: Aggiorna `src/lib/types.js`** — `Scene` typedef: aggiungi `image?` e chiarisci che combat/victory possono essere vuoti. Sostituisci il typedef `Scene`:
```js
/**
 * @typedef {Object} Scene
 * @property {string} id
 * @property {string} name
 * @property {string} cover        // gradiente CSS (fallback / scene custom)
 * @property {string} [image]      // path illustrazione (scene di libreria)
 * @property {boolean} [custom]    // true per le scene create dall'utente
 * @property {{explore: AudioRef[], combat: AudioRef[], victory: AudioRef[]}} music  // combat/victory vuoti = scena semplice
 * @property {AudioRef[]} ambient
 * @property {AudioRef[]} oneshots
 */
```

- [ ] **Step 4: Aggiorna `src/lib/data/scenes.js`** — mantieni le 4 scene esistenti INVARIATE (tavern/forest/city/dungeon con le 3 intensità) e AGGIUNGI in fondo all'array `scenes` (prima della chiusura `]`) le 8 scene semplici. Usa l'helper `fmt` già presente. Il campo `image` per ORA punta al path illustrazione (le immagini arrivano in Fase B; se il file non esiste, la tessera userà il gradiente — vedi Fase B). Aggiungi anche `image` alle 4 scene esistenti.

Per le 4 esistenti, aggiungi la riga `image: '/img/scenes/<id>.webp',` dopo `cover:`.

Le 8 nuove (semplici: combat/victory vuoti), esempio per `battle` — replica lo schema per tutte con gli id della tabella di Task 1:
```js
  {
    id: 'battle',
    name: 'Battaglia campale',
    cover: 'linear-gradient(160deg,#d98a6a,#8a3a2a)',
    image: '/img/scenes/battle.webp',
    music: {
      explore: [{ id: 'battle-explore', name: 'Fronte', src: fmt('battle', 'music'), loop: true }],
      combat: [],
      victory: []
    },
    ambient: [{ id: 'warcries', name: 'Mischia', src: fmt('battle', 'warcries'), loop: true }],
    oneshots: [{ id: 'sword', name: 'Spade', src: fmt('battle', 'sword') }]
  },
```
Le altre 7 (cover = gradiente a tema, scegline uno coerente):
- `inn` "Locanda" — cover `linear-gradient(160deg,#e8c48a,#a8763e)`, ambient `hearth`/"Camino", sfx `mug`/"Boccale", music name "Focolare".
- `harbor` "Porto sul mare" — cover `linear-gradient(160deg,#8ec5d6,#3a7a9a)`, ambient `waves`/"Onde", sfx `gull`/"Gabbiano", music name "Marea".
- `temple` "Tempio in rovina" — cover `linear-gradient(160deg,#cdbfa0,#7a6a4a)`, ambient `chant`/"Eco", sfx `gong`/"Gong", music name "Sacrario".
- `mountains` "Montagne innevate" — cover `linear-gradient(160deg,#cfe0ea,#7a90a8)`, ambient `gale`/"Bufera", sfx `rockfall`/"Frana", music name "Vetta".
- `swamp` "Palude" — cover `linear-gradient(160deg,#8a9a6a,#3a4a2a)`, ambient `frogs`/"Rane", sfx `splash`/"Tonfo", music name "Acquitrino".
- `graveyard` "Cimitero" — cover `linear-gradient(160deg,#9a9aa8,#4a4a58)`, ambient `moan`/"Lamento", sfx `crow`/"Corvo", music name "Requiem".
- `cave` "Caverna" — cover `linear-gradient(160deg,#8a7a6a,#3a2f28)`, ambient `echo`/"Eco", sfx `pickaxe`/"Piccone", music name "Cunicolo".

Per ognuna: `music.explore = [{ id:'<id>-explore', name:'<music name>', src: fmt('<id>','music'), loop:true }]`, `combat:[]`, `victory:[]`, `ambient:[{ id:'<ambient id>', name:'<nome>', src: fmt('<id>','<ambient id>'), loop:true }]`, `oneshots:[{ id:'<sfx id>', name:'<nome>', src: fmt('<id>','<sfx id>') }]`, `image:'/img/scenes/<id>.webp'`.

- [ ] **Step 5: Aggiorna `src/components/GameScreen.svelte`** — mostra le tab intensità solo per scene con tracce combat (non semplici, non custom). Sostituisci il blocco:
```svelte
{#if !scene.custom}
  <IntensityTabs value={$mixer.intensity} onChange={(l) => mixer.setIntensity(l)} />
{/if}
```
con:
```svelte
{#if !scene.custom && scene.music.combat.length > 0}
  <IntensityTabs value={$mixer.intensity} onChange={(l) => mixer.setIntensity(l)} />
{/if}
```

- [ ] **Step 6: Esegui** `npm test` → PASS (40 test verdi: scenes.test passa da 4 a 5 test; gli altri invariati). `scenes.test.js` ora valida 12 scene. Paste il sommario.

- [ ] **Step 7: Build** `npm run build` → pulita. (Il precache crescerà con i nuovi audio — la strategia runtime caching è Fase C; per ora accettiamo il precache più grande.) Paste la riga PWA precache.

- [ ] **Step 8: Commit**
```bash
git add src/lib/types.js src/lib/data/scenes.js src/lib/data/scenes.test.js src/components/GameScreen.svelte
git commit -m "feat: 8 scene semplici (libreria a 12) + tab solo con intensità + campo image"
```

---

## Definition of Done (Fase 5b/A)

- 12 scene in `scenes.js`; le 8 nuove semplici (combat/victory vuoti), le 4 originali con intensità.
- Audio nuovo presente in `public/audio/<id>/` (o GAP documentati); `licenses.json` aggiornato e valido.
- `GameScreen` nasconde le tab per le scene semplici e custom.
- `npm test` verde; `npm run build` pulita.

## Verifica manuale (controller, browser)

- Home mostra 12 tessere (le 8 nuove ancora a gradiente finché non arrivano le immagini in Fase B).
- Apri una scena nuova (es. Porto) → nessuna tab intensità → Play carica `harbor/music.webm` + ambient; SFX funziona. Nessun 404 sui file presenti.
- Apri Taverna → le tab intensità ci sono ancora.

## Note / carry-over verso Fase B/C/D

- `image` punta a `/img/scenes/<id>.webp` non ancora esistenti → in Fase B genero le immagini e la `SceneCard` userà l'immagine (fallback gradiente finché mancano).
- Precache grande (audio) → risolto in Fase C (runtime caching).
- Percorsi audio assoluti `/audio/...`: la base `/bardo/` di Fase D andrà gestita (relativizzare) — non toccare ora.
