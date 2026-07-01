# Bardo — Fase 4: Scene builder (scene custom)

**Data:** 2026-07-01
**Stato:** Design approvato, pronto per piano implementativo
**Fasi precedenti:** Fase 1 (core) + Fase 2 (Home, audio reale, background) unite in `master`.

## Obiettivo

Permettere all'utente di creare le proprie scene combinando i layer della libreria
(anche mescolando scene diverse), dando nome e colore, e salvarle sul device. Le
scene custom compaiono in Home sotto "Le mie scene", si aprono come le altre (ma
senza tab intensità) e sono eliminabili. È la feature "mixer personale" prevista
fin dall'inizio.

## Scope

Dentro:
- Schermata builder: scelta 1 musica + N ambient + N SFX dalla libreria, nome, colore, salva.
- Persistenza scene custom su localStorage.
- Home: sezione "Le mie scene" + tile "+ Crea scena" + eliminazione.
- Apertura di una scena custom nel GameScreen esistente, senza tab intensità.

Fuori (YAGNI / fasi successive):
- Modifica di una scena custom (v1: si elimina e si ricrea).
- Preset per-scena (l'utente ha scelto solo scene custom).
- Download di pacchetti aggiuntivi → fase separata.
- Curatela audio ampia, tracce distinte per intensità → Fase 5.

## 1. Modello dati (UserScene)

Una scena custom riusa la shape `Scene` (così GameScreen/engine restano quasi
invariati), con un flag `custom`:

```
UserScene = {
  id: 'u-<timestamp>',          // prefisso 'u-' per distinguerle dalla libreria
  name: string,
  cover: string,                // gradiente CSS scelto da una palette
  custom: true,
  music:   { explore: [track], combat: [track], victory: [track] }, // stessa traccia
  ambient: AudioRef[],          // riferimenti agli AudioRef scelti dalla libreria
  oneshots: AudioRef[]
}
```

- La musica scelta (un AudioRef dalla libreria) viene messa in tutte e tre le
  intensità così l'engine (`loadScene` usa `music.explore[0]`) funziona invariato;
  le tab sono comunque nascoste (custom), quindi `setIntensity` non viene chiamato.
- Gli AudioRef dei layer sono copiati per riferimento (id/nome/src) dalla libreria.
  Gli id restano unici dentro la scena custom (crowd/wind/market/drip; door/twig/
  bell/chain; <scene>-explore per la musica).
- `custom` assente/false sulle scene di libreria.

## 2. Assemblaggio (funzione pura)

`buildUserScene({ name, cover, musicRef, ambientRefs, oneshotRefs })` → UserScene.
Funzione pura e testabile: genera l'id, replica `musicRef` nelle tre intensità,
compone ambient/oneshots. Nessun effetto collaterale.

## 3. Persistenza

Store `userScenes` su **localStorage** (JSON piccolo, sincrono; niente async
IndexedDB per pochi KB):
- `createUserScenes(storage = localStorage)` → `{ subscribe, add(scene), remove(id), all() }`.
- Chiave localStorage: `bardo.userScenes` (array serializzato).
- Store Svelte reattivo così la Home si aggiorna.

`getScene(id)` in `scenes.js` cerca prima nella libreria, poi — se non trova —
delega a un lookup nelle user scenes. Per evitare un import ciclico, la Home/App
compone: `getScene(id) ?? userScenes.all().find(s => s.id === id)`. (Il piano
sceglierà il punto esatto; la libreria resta la fonte primaria.)

## 4. Builder UI (`SceneBuilder.svelte`)

Sezioni:
- **Musica** — scelta singola tra le 4 tracce di libreria (una per scena).
- **Ambienti** — multi-selezione tra i 4 ambient di libreria.
- **Effetti** — multi-selezione tra i 4 SFX di libreria.
- **Nome** — campo testo.
- **Colore** — palette di 4-6 gradienti preset (default il primo).
- **Salva** — disabilitato finché mancano nome o musica; al salvataggio:
  `userScenes.add(buildUserScene(...))` e ritorno a Home.
- **Annulla / indietro** — torna a Home senza salvare.

Le opzioni selezionabili derivano dalla libreria `scenes` (musica = ogni
`scene.music.explore[0]`; ambient = ogni `scene.ambient`; oneshots = ogni
`scene.oneshots`), con etichette "Nome (Scena)".

## 5. Home

- Nuova sezione **"Le mie scene"** che elenca le user scenes come `SceneCard`.
- Tile **"+ Crea scena"** che apre il builder.
- **Eliminazione**: pulsante/gesto su ogni tessera custom (con conferma) →
  `userScenes.remove(id)`.
- Se non ci sono user scenes, la sezione mostra solo il tile "+ Crea scena".

## 6. GameScreen

- Se `scene.custom` è true → **non renderizza `IntensityTabs`** e non chiama
  `setIntensity`. Tutto il resto (NowPlaying, Play/Pausa, Mixer sugli ambient,
  OneShotBar, MediaSession, Wake Lock) invariato.
- Nessuna modifica all'`AudioEngine`.

## 7. Routing

- Store `route` guadagna una vista builder: `route.builder()` → `{ view: 'builder' }`
  (con `history.pushState`), gestita da `App.svelte`; il tasto Indietro torna a Home.
- `route.open(id)` funziona già per gli id custom, purché `App`/`Home` risolvano la
  scena anche tra le user scenes (vedi §3).

## 8. Componenti / file

Nuovi:
- `src/lib/stores/userScenes.js` (+ test) — persistenza localStorage.
- `src/lib/data/buildUserScene.js` (+ test) — assemblaggio puro UserScene.
- `src/components/SceneBuilder.svelte` — schermata builder.
- `src/components/MyScenes.svelte` (opzionale) o sezione dentro `Home.svelte`.

Modificati:
- `src/lib/stores/route.js` — vista `builder`.
- `src/components/Home.svelte` — sezione "Le mie scene" + tile "+ Crea scena".
- `src/components/SceneCard.svelte` — supporto pulsante elimina (solo custom).
- `src/components/GameScreen.svelte` — nasconde intensità se `scene.custom`.
- `src/App.svelte` — vista builder + risoluzione scene custom in `getScene`.

## 9. Testing

Unit (Vitest, mock localStorage):
- `buildUserScene`: id con prefisso `u-`, musica replicata nelle 3 intensità,
  ambient/oneshots composti, `custom:true`.
- `userScenes`: add persiste su storage e aggiorna lo store; remove elimina;
  reidratazione da storage esistente all'avvio; all() ritorna la lista.
- risoluzione: apertura di un id custom trova la scena.
- `route`: `builder()` imposta la vista e pusha lo stato; popstate torna a Home.

Manuale (browser, controller): crea scena (musica foresta + brusio taverna +
gocce dungeon), salva, appare in "Le mie scene", si apre e suona senza tab
intensità, elimina.

## Definition of Done (Fase 4)

- `npm test` verde (nuovi unit test inclusi).
- Home mostra "Le mie scene" + "+ Crea scena".
- Builder crea una scena custom da layer misti; salvata su localStorage; persiste
  al reload.
- La scena custom si apre nel GameScreen senza tab intensità e riproduce i layer.
- Eliminazione funziona con conferma.

## Note / carry-over

- Edit di una scena custom → fase successiva (v1 solo crea/elimina).
- Nomi/cover: nessuna validazione oltre "nome non vuoto"; nomi duplicati permessi
  (id univoco per timestamp).
- Le user scenes referenziano audio di libreria (già in precache) → funzionano
  offline senza download aggiuntivo.
