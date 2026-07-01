# Bardo — Fase 2: Home, libreria scene e audio in background

**Data:** 2026-07-01
**Stato:** Design approvato, pronto per piano implementativo
**Fase precedente:** Fase 1 (core giocabile) unita in `master`.

## Obiettivo

Rendere Bardo davvero usabile al tavolo: una **Home** con più scene tra cui
scegliere, **audio CC0 reale** per un mini-pacchetto, e riproduzione che
**continua a schermo spento / in background** (uso primario Android). Include il
fix del lifecycle audio emerso nella review della Fase 1 (pausa vera).

## Scope

Dentro:
- Home con griglia delle 4 scene + navigazione Home ↔ Gioco con tasto Indietro Android.
- Mini-pacchetto di 4 scene con audio CC0 reale, precache per uso offline.
- Refactor audio engine: pausa/riprendi reali; Web Audio per ambient/SFX, HTML5 per la musica.
- Background / lock screen: MediaSession API + Wake Lock (toggle).

Fuori (fasi successive):
- Download di pacchetti *aggiuntivi* + gestione spazio → Fase 3.
- Scene builder + preset in IndexedDB → Fase 4.
- Curatela audio ampia, credits, grafica/icone finali, QA iOS → Fase 5.

## 1. Navigazione (History API)

Store `route` con stato `{ view: 'home' }` oppure `{ view: 'game', sceneId }`.

- Aprire una scena: `route.open(sceneId)` → aggiorna lo store + `history.pushState({ sceneId }, '')`.
- Tasto Indietro Android / browser: listener `popstate` → riporta lo store a `{ view: 'home' }`.
- Tornare a Home dalla UI: `route.home()` → `history.back()` (così lo stack resta coerente).
- `App.svelte` mostra `Home` o `GameScreen` in base a `$route.view`.

Nessuna libreria di routing (2 sole viste).

## 2. Refactor audio engine

Chiude il backlog tecnico della Fase 1.

**Pausa/riprendi reali**
- Aggiungere `pause()` (Howler `howl.pause()` su tutti i layer, mantiene il playhead)
  e `resume()` (`howl.play()` riprende da dov'era).
- Lo store `mixer.togglePlay()` usa `pause()`/`resume()` invece di `stop()`/`play()`.
  `stop()` resta per il reset completo (cambio scena).
- Introdurre uno stato `playing`/`paused` distinto da "mai avviato".

**Modalità audio per tipo di layer**
- Musica: `html5: true` (necessario alla continuità in background).
- Ambient e SFX one-shot: Web Audio (default Howler, `html5: false`).
- Elimina il warning "HTML5 Audio pool exhausted" e regge più layer simultanei.
- `_makeHowl(ref, { volume, html5 })` riceve il flag; `loadScene`/`setIntensity`
  passano `html5:true` per la musica, `false` per ambient; `playOneShot` usa `false`.

**Pulizia SFX one-shot**
- `playOneShot` fa `unload()` dell'eventuale Howl precedente con lo stesso id prima
  di crearne uno nuovo (evita il piccolo leak notato in Fase 1).

## 3. Background / lock screen

**MediaSession API**
- Alla riproduzione: impostare `navigator.mediaSession.metadata` (title = nome scena,
  artwork = copertina scena) e `playbackState`.
- Action handler: `play` → resume, `pause` → pause, `stop` → stop+Home.
- Wrapper isolato `media-session.js` con guardia di feature-detection (assente su
  alcuni browser), così è testabile mockando `navigator.mediaSession`.

**Wake Lock API**
- Toggle UI "Tieni schermo acceso". Quando attivo e in riproduzione: richiede
  `navigator.wakeLock.request('screen')`; rilascia al pausa/stop o toggle off.
- Feature-detection (assente su alcuni browser/iOS vecchi): se non disponibile,
  il toggle è disabilitato con nota.
- Wrapper isolato `wake-lock.js`.

**Aspettativa (invariata):** Android schermo spento = ok; iOS best-effort.

## 4. Home e libreria scene

- `Home.svelte`: griglia di tessere scena (stile pastello già approvato: copertina
  con gradiente/illustrazione + nome). Tap → `route.open(sceneId)`.
- Dati: `src/lib/data/scenes.js` passa da una singola `demoScene` a un elenco
  `scenes` (4 scene) + helper `getScene(id)`. La `Scene` guadagna un campo
  `cover` (colore/gradiente o percorso illustrazione) usato dalle tessere e da
  NowPlaying/MediaSession.
- Le 4 scene: **Taverna, Foresta, Città, Dungeon**. Ognuna:
  `music.{explore,combat,victory}` (1 traccia ciascuna), 1-2 `ambient`, 2-3 `oneshots`.

## 5. Audio reale CC0

- File in `public/audio/<sceneId>/...`, formato preferito `.webm` (Opus) con
  fallback `.m4a` dove utile per iOS.
- `src/lib/data/licenses.json` (o export in `scenes.js`): per ogni file
  `{ file, source, license, author? }`. Solo CC0/CC-BY; CC-BY richiede credits
  (schermata Credits può arrivare in Fase 5, ma il registro si compila ora).
- Loop musicali/ambient il più possibile seamless (ritaglio in curatela).
- **Rischio sourcing:** alcune fonti (Freesound, Pixabay) richiedono login/API per
  il download automatico; OpenGameArt e alcuni endpoint diretti no. Mitigazioni,
  in ordine: (a) usare fonti a download diretto CC0; (b) ridurre i file per scena;
  (c) l'utente droppa manualmente i file mancanti nelle cartelle indicate. Il piano
  deve rendere i test indipendenti dagli asset reali (Howler mockato), così lo
  sviluppo non si blocca se un download fallisce.

## 6. Offline

- Il mini-pacchetto audio è servito come asset statici e **incluso nel precache**
  del service worker (Workbox `globPatterns` esteso agli audio) → offline immediato
  senza download manager. Attenzione alla dimensione del precache: tenere i file
  compressi (Opus a bitrate contenuto). Il download di pacchetti aggiuntivi resta
  Fase 3.

## 7. Architettura / file

Nuovi:
- `src/lib/stores/route.js` (+ test) — routing Home/Game su History API.
- `src/lib/audio/media-session.js` (+ test) — wrapper MediaSession.
- `src/lib/audio/wake-lock.js` (+ test) — wrapper Wake Lock.
- `src/components/Home.svelte`, `src/components/SceneCard.svelte`.
- `public/audio/<sceneId>/*`, `src/lib/data/licenses.json`.

Modificati:
- `src/lib/audio/AudioEngine.js` — pause/resume, flag html5 per layer, unload oneshot,
  hook per MediaSession/Wake Lock (o orchestrati nello store).
- `src/lib/stores/mixer.js` — togglePlay usa pause/resume; espone metadata scena.
- `src/lib/data/scenes.js` — elenco `scenes` + `getScene` + campo `cover`.
- `src/App.svelte` — mostra Home o GameScreen in base a `$route`.
- `vite.config.js` — precache degli audio.

## 8. Testing

Unit (Vitest, mock):
- `route`: open/home aggiornano stato + pushState/back; popstate riporta a Home.
- AudioEngine: `pause()` chiama `howl.pause()` (non stop) e mantiene i layer;
  `resume()` riavvia; musica creata con `html5:true`, ambient con `html5:false`;
  `playOneShot` fa unload del precedente.
- `media-session.js`: imposta metadata + registra gli handler su un
  `navigator.mediaSession` mockato; no-op se assente.
- `wake-lock.js`: richiede/rilascia su `navigator.wakeLock` mockato; no-op se assente.
- `mixer`: togglePlay instrada su pause/resume.

Manuale (browser, controller): Home→scena→back Android, audio reale che suona,
crossfade intensità, pausa vera (riprende da dov'era), controlli su lock screen
Android, Wake Lock.

## Definition of Done (Fase 2)

- `npm test` verde (nuovi unit test inclusi).
- Home con 4 scene navigabili; tasto Indietro torna a Home.
- Audio CC0 reale che suona nelle 4 scene (o fallback documentato se un download
  è fallito), offline via precache.
- Pausa vera; nessun warning "pool exhausted".
- MediaSession attivo su Android (controlli lock screen); Wake Lock toggle funzionante.
