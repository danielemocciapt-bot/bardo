# Bardo — PWA soundboard per GdR (clone gratuito di PocketBard)

**Data:** 2026-06-30
**Stato:** Design approvato, pronto per piano implementativo

## Obiettivo

Web app (PWA, installabile su telefono) per mettere colonne sonore e effetti
durante sessioni di gioco di ruolo. Ogni ambientazione ha la sua musica, con più
tracce per la stessa ambientazione ma scene/intensità diverse, più effetti sonori
attivabili (pioggia, passi, brusio, fulmine, fuoco, esplosione, ecc).

Replica funzionale e visiva di [PocketBard](https://www.pocketbard.app/), ma
**completamente gratuita** e senza costi ricorrenti.

## Vincoli

- **Costo zero**, sempre: nessun server, nessun account, nessun servizio a pagamento.
- **Offline pieno**: dopo il download iniziale deve funzionare senza rete al tavolo.
- **Audio CC0 / royalty-free**: solo contenuti liberi e ridistribuibili.
- **Mobile-first**, uso primario su **Android**; deve girare anche su desktop e iOS.

## Stack

- **UI**: Svelte + Vite
- **Audio**: Howler.js
- **PWA / offline**: Workbox (service worker), Cache API, manifest
- **Storage dati utente**: IndexedDB (scene custom, preset) + localStorage (impostazioni)
- **Hosting**: Cloudflare Pages — gratis e **banda illimitata** (scelta chiave: l'audio
  pesa; GitHub Pages limita la banda mensile). Build statica, deploy da git.

## Architettura

PWA 100% client-side. Nessun backend.

```
Browser
 ├─ Svelte app (UI: home, schermata gioco, mixer, scene builder)
 ├─ Audio engine (wrapper su Howler: layer, crossfade, mixer)
 ├─ Service worker (Workbox): cache app shell + audio scaricato
 ├─ Cache API: blob audio dei pacchetti scaricati
 └─ IndexedDB: scene utente, preset, stato download pacchetti
```

## Modello dati

```
Pack            // pacchetto scaricabile, es. "Fantasy Essentials"
 ├─ id, nome, copertina, dimensione
 └─ scenes: Scene[]

Scene           // ambientazione pronta, es. "Taverna"
 ├─ id, nome, illustrazione
 ├─ music:   { explore: Track[], combat: Track[], victory: Track[] }
 ├─ ambient: Layer[]    // loop mixabili: pioggia, fuoco, brusio, vento...
 └─ oneshots: Sfx[]     // effetti a pulsante: tuono, esplosione, porta...

Track / Layer / Sfx
 └─ id, nome, file (url relativo), durata, loop:bool

UserScene       // creata dall'utente nel mixer
 ├─ id, nome
 ├─ layerRefs: { layerId, volume, attivo }[]
 └─ basata su una o più scene/pack

Preset          // snapshot salvato di un mix (volumi + layer attivi)
```

Registro licenze: ogni file audio ha una entry con fonte e licenza (CC0/CC-BY)
in un file `licenses.json`, per credits e conformità.

## Motore audio

- Ogni layer attivo = istanza `Howl` in `loop`. Mix simultaneo (musica + N ambient).
- **Intensità adattiva**: per la stessa scena, switch Esplora → Combatti → Vittoria
  con **crossfade** (fade-out traccia corrente / fade-in nuova, durata ~1.5–2s).
  Nessuno stacco udibile.
- **One-shot SFX**: riproduzione singola sopra al mix corrente, non in loop.
- **Mixer**: volume per-layer (slider) + volume master. Stato persistito.
- **Formati**: `.webm/opus` (piccolo) con **fallback `.m4a/aac`** per compatibilità
  iOS Safari. Howler riceve array `[opus, m4a]` e sceglie il supportato.
- **Loop seamless**: i file loop vanno preparati senza gap (ritaglio in fase di
  curatela asset). Howler `loop:true`.

## Riproduzione in background / schermo spento

Obiettivo: audio continua a schermo spento o app in background.

- **MediaSession API**: espone metadata (titolo scena, copertina) e gestisce
  play/pausa dalla lock screen e dalla notifica media.
- **Modalità HTML5 audio** (`html5:true` su Howler) per la traccia musicale
  principale: l'OS la tratta come un media element e tende a mantenerla attiva in
  background, a differenza di Web Audio puro (che iOS sospende a schermo bloccato).
- **Wake Lock API** come fallback opzionale: tiene lo schermo acceso quando serve.

**Aspettativa realistica:**
- **Android (Chrome)**: riproduzione in background / schermo spento **funziona**,
  con controlli in notifica.
- **iOS (Safari/PWA)**: **best-effort** — può ancora mettere in pausa a schermo
  bloccato. Limite del sistema operativo, non aggirabile dal web. Mitigazione:
  Wake Lock per tenere schermo acceso.

## Offline / pacchetti scaricabili

- Audio organizzato in **pacchetti**. L'app shell e i metadata si caricano subito;
  l'audio si scarica su richiesta per pacchetto.
- Tap "Scarica pacchetto" → fetch dei file → salvataggio in **Cache API** →
  poi disponibile offline. Service worker serve cache-first.
- UI mostra stato per pacchetto: non scaricato / in download / pronto offline,
  con dimensione e opzione "rimuovi dal device".

## UI

Stile **pastello / storybook** come PocketBard: panna/pergamena, illustrazioni
morbide, accenti ambra-arancio, angoli arrotondati, ombre soffici.

Schermate (mockup approvato):
1. **Home** — griglia di scene come tessere illustrate (Taverna, Foresta, Città,
   Dungeon...) + sezione "Le mie scene" con "+ Crea scena".
2. **In gioco** — sfondo caldo, nome scena, pillole intensità
   (Esplora / Combatti / Vittoria), card **Mixer** con slider per-layer, riga
   **SFX one-shot** a pulsante.
3. **Scene builder** — combina layer (musica + ambient + sfx) e salva come
   UserScene / Preset.
4. **Pacchetti** — lista pacchetti con stato download e gestione spazio.

## Funzioni v1 (MVP)

Tutte e quattro le core:
1. Ambienti in loop (musica continua per scena).
2. Layer SFX one-shot (pulsanti effetti istantanei).
3. SFX ambientali in loop mixabili con volume singolo.
4. Intensità adattiva (Esplora/Combatti/Vittoria con crossfade).

Più: mixer personale + salvataggio scene/preset; offline pieno a pacchetti;
riproduzione background (Android pieno, iOS best-effort).

## Fuori scope (per ora)

- Account / sync cloud (resta tutto locale).
- Upload di file audio propri da parte dell'utente (scelto: solo libreria CC0 curata).
- Streaming online-only.
- App store nativo (è una PWA installabile).

## Rischi e note

- **Curatela audio CC0** è il lavoro più grande e va fatto con cura: qualità,
  loop seamless, coerenza, licenze. Fonti: Freesound, Pixabay, OpenGameArt,
  Tabletopaudio (parti libere), Kevin MacLeod (Incompetech, CC-BY).
- **Attribuzione CC-BY**: se si usano contenuti CC-BY (non solo CC0), serve una
  schermata Credits con autori/licenze.
- **iOS background audio**: limite noto, comunicato all'utente.
- **Dimensione cache**: tenere d'occhio lo spazio; dare controllo all'utente.
```
