# Bardo — Fase 6: Playback globale, Play Mix, e audio completo

**Data:** 2026-07-03
**Stato:** Design approvato, pronto per piano implementativo
**Base:** app live su GitHub Pages con 21 scene in 4 categorie, scene builder, offline, background audio.

## Obiettivo

Cinque migliorie richieste dall'utente:
1. Riproduzione **globale e persistente** (l'audio continua navigando) + **tasto fluttuante** play/pausa.
2. Tasto **"Play Mix"** per scena: atmosfera automatica (ambient a volumi casuali + effetti a caso).
3. **Foresta Antica**: traccia esplora più adatta (eterea/mistica).
4. **Combattimento + Vittoria** per tutte le 17 scene semplici.
5. **+2 effetti singoli** per ognuna delle 21 scene.

Eseguite in fasi sequenziali; deploy dopo le fasi utili.

---

## Fase 1 — Player globale persistente + tasto fluttuante

**Problema attuale:** ogni `GameScreen` crea il proprio `AudioEngine`+`mixer` e li distrugge allo smontaggio (`onDestroy`), quindi uscendo da una scena l'audio si ferma. L'utente vuole che continui.

**Soluzione — singleton a livello app.**
- Nuovo modulo `src/lib/stores/player.js` che esporta un **singleton** `player`, creato una volta sola: un `AudioEngine`, un `media-session`, un `wake-lock`, e lo stato reattivo (store) del mixer. Vive per tutta la sessione, indipendente dal ciclo di vita dei componenti.
- Il player traccia la **scena attiva** (`state.scene`). Una sola scena alla volta.
- Metodi (quelli legati a una scena la ricevono e la "attivano" se non è quella corrente):
  - `_ensure(scene)` (interno): se `scene.id` ≠ scena attiva → `engine.loadScene(scene)` (ferma la precedente, carica la nuova, non suona) + aggiorna store + MediaSession.
  - `playScene(scene)`: `_ensure(scene)` + play. (Sostituisce la scena in corso se diversa.)
  - `playMixScene(scene)`: Fase 2.
  - `togglePlay()`: pausa/riprendi la scena attiva (usato dal tasto fluttuante). Pausa = ferma tutti i suoni, riprende da dov'era.
  - `setMaster(v)`, `setIntensity(level)`, `setKeepAwake(on)`: sulla scena attiva.
  - `setLayer(scene, id, v)`, `oneShot(scene, id)`: `_ensure(scene)` + azione (così toccare i controlli di una scena la rende attiva).
  - `stop()`: ferma e resetta.
- **`AudioEngine` invariato** (già ha destroy/stop/pause). Il player NON fa teardown alla navigazione.

**GameScreen** non crea più engine/mixer: usa `player`.
- `active = $player.scene && $player.scene.id === scene.id`.
- Play / Play Mix → `player.playScene(scene)` / `player.playMixScene(scene)`.
- Tab intensità: `player.setIntensity` (solo se `active`; le tab compaiono se la scena ha `combat`).
- Mixer slider: valore = `active ? $player.layers[id] : 0`; `on:input` → `player.setLayer(scene, id, v)`.
- SFX: `player.oneShot(scene, id)`.
- Toggle "tieni schermo acceso": `player.setKeepAwake`.
- **Rimuovere `onDestroy(mixer.teardown)`** (l'audio non si ferma più uscendo).

**Tasto fluttuante** — nuovo `FloatingControls.svelte`, montato in `App.svelte` **fuori** dalle viste di route (sempre presente). Mostrato solo quando `$player.scene` esiste. In basso a destra, fisso: bottone ▶/⏸ (`player.togglePlay`), con il nome della scena attiva. Tocca = pausa/riprendi globale.

**MediaSession**: metadata = scena attiva; play/pause/stop dal lock screen pilotano il player globale.

**Testing:** unit sul `player` (con engine mockato): `playScene` attiva+suona; attivare una scena diversa ferma la precedente (una alla volta); `togglePlay` pausa/riprende; `setLayer(scene,…)` attiva la scena. `AudioEngine`/`mixer` esistenti restano; `createMixer` può essere riusato internamente o sostituito dal player (scelta nel piano). Verifica browser: play scena A → vai in Home/scena B → A continua; tasto fluttuante mette in pausa; Play su B sostituisce A.

## Fase 2 — Play Mix (atmosfera automatica)

`player.playMixScene(scene)`:
- `_ensure(scene)` + play della musica.
- Imposta **ogni** ambient a un volume **casuale** (es. 0.3–0.9) via `setLayerVolume`.
- Avvia un **timer** che ogni intervallo casuale (es. 8–20s) fa partire un **effetto one-shot casuale** tra `scene.oneshots`.
- Stato `mix: true` nello store (per evidenziare la modalità). Il timer si ferma su pausa/stop/cambio scena; riparte su riprendi se `mix`.
- **Generico**: itera `scene.ambient` e `scene.oneshots` di qualsiasi lunghezza → funziona anche con ambient/effetti aggiunti in futuro.

UI: secondo bottone **"Play Mix"** accanto a "Play" nel GameScreen. Testing: unit con timer finti (`vi.useFakeTimers`): playMix alza gli ambient (volume>0) e allo scadere dell'intervallo chiama `playOneShot`; su pausa il timer si ferma.

## Fase 3 — Foresta Antica: traccia esplora migliore

Ricerca già fatta (mood: etereo/mistico, cori/flauti, magia antica). Rimpiazzare `public/audio/forest/explore.{webm,m4a}` con una traccia Pixabay adatta; aggiornare l'entry in `licenses.json`. Nessun cambio codice.

## Fase 4 — Combattimento + Vittoria per le 17 scene semplici

Scene semplici attuali (combat/victory vuoti): `battle, inn, harbor, temple, mountains, swamp, graveyard, cave` (fantasy) + `starship, cyber, lab, haunted, asylum, ritual, deepspace, station, alien`.
- Per ognuna: sourcing di **combat** + **victory** a tema (34 tracce Pixabay), in `public/audio/<scene>/{combat,victory}.{webm,m4a}`.
- `scenes.js`: riempire `music.combat` e `music.victory` con `{ id:'<scene>-combat'|'-victory', name, src, loop:true }`. (L'esplora esistente resta `music` → conviene rinominare i file a `explore.*` per coerenza, OPPURE puntare explore all'attuale `music.*`; il piano sceglie — mantenere i test verdi.)
- Le tab intensità compaiono in automatico (condizione `combat.length>0` già presente).
- `licenses.json` aggiornato. Fallback come nelle fasi audio precedenti (documentare eventuali GAP).

## Fase 5 — +2 effetti singoli per scena

- Per ognuna delle 21 scene: **2 nuovi one-shot** a tema (id globalmente unici), in `public/audio/<scene>/<sfx>.{webm,m4a}` (42 nuovi SFX).
- `scenes.js`: aggiungere i 2 ref agli array `oneshots` di ogni scena.
- Beneficio automatico: la `OneShotBar` e il **Play Mix** li includono senza modifiche (sono generici).
- `licenses.json` aggiornato.

## File (sintesi)

Nuovi: `src/lib/stores/player.js` (+test), `src/components/FloatingControls.svelte`, molti file audio.
Modificati: `src/components/GameScreen.svelte` (usa player, +Play Mix, rimuove teardown), `src/App.svelte` (monta FloatingControls + usa player per aprire scene), `src/lib/data/scenes.js` (combat/victory + oneshots), `licenses.json`. `AudioEngine.js` invariato o esteso minimamente.

## Testing generale

- Unit (Vitest, engine/timer mockati): player (attivazione singola scena, togglePlay, setLayer attiva scena, playMix alza ambient + timer one-shot), regressioni.
- Manuale (browser, controller): persistenza audio navigando; tasto fluttuante; Play Mix (musica + ambient su + effetti random); intensità sulle scene completate; nuovi SFX; verifica live dopo deploy.

## Definition of Done

- Audio globale persistente; il teardown all'uscita è rimosso; tasto fluttuante play/pausa ovunque; una scena alla volta.
- Play Mix funzionante e generico.
- Foresta con traccia esplora adatta.
- 17 scene semplici con combat+victory (tab intensità) — o GAP documentati.
- +2 SFX per ognuna delle 21 scene — o GAP documentati.
- Test verdi; build pulita; deploy live verificato.

## Note / rischi

- **Persistenza**: l'audio continua solo entro la sessione; chiudendo la PWA si ferma (normale).
- **Fasi 4+5 audio pesante** (~76 file): curatela lunga a lotti, con fallback (meno tracce / GAP documentati) come nelle fasi precedenti.
- Deploy Pages: evitare push troppo ravvicinati (concurrency → "try again later"); usare `gh workflow run` per un run pulito se serve.
