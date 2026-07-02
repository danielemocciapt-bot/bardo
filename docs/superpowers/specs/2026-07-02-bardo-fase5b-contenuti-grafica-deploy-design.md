# Bardo — Fase 5b: Contenuti, grafica e pubblicazione

**Data:** 2026-07-02
**Stato:** Design approvato, pronto per piano implementativo
**Fasi precedenti:** Fase 1, 2, 4, 5a unite in `master`. App con 4 scene (3 intensità), builder, offline precache, background audio.

## Obiettivo

Portare Bardo a una versione "pubblicabile e ricca": 12 scene totali, illustrazioni
vere in stile PocketBard su tessere e schermata di gioco, icona PWA decente,
schermata Credits, UI rifinita, e **deploy pubblico** con link installabile sul
telefono.

## Scope e fasi

Il lavoro è grande: eseguito in 4 fasi sequenziali, ognuna testata/verificata.

- **Fase A — Contenuti (8 scene nuove):** audio + dati.
- **Fase B — Grafica:** illustrazioni (12 scene) + icona (ComfyUI), UI/tessere/banner con immagini, Credits, polish.
- **Fase C — Offline a scala:** runtime caching audio (Workbox) al posto del precache totale.
- **Fase D — Pubblicazione:** repo GitHub pubblico + GitHub Pages (Actions) + link.

Fuori: download-manager esplicito (runtime caching lo copre a sufficienza), edit scene custom, QA iOS approfondito.

---

## Fase A — 8 scene nuove (semplici)

Nuove scene (id): `battle` (Battaglia campale), `inn` (Locanda), `harbor`
(Porto/Mare), `temple` (Tempio in rovina), `mountains` (Montagne innevate),
`swamp` (Palude), `graveyard` (Cimitero), `cave` (Caverna/Miniera).

Ognuna **semplice**: 1 traccia musicale (niente esplora/combatti/vittoria), 1
ambient, 1 SFX. Audio royalty-free Pixabay (come Fase 2/5a), mood a tema.

**Dati:** in `scenes.js` una scena semplice ha `music.explore = [track]`,
`music.combat = []`, `music.victory = []`, `ambient:[1]`, `oneshots:[1]`.

**Niente tab intensità per le semplici:** `GameScreen` mostra `IntensityTabs`
solo se `!scene.custom && scene.music.combat.length > 0`. Le 4 scene originali
(combat non vuoto) mantengono le tab; le nuove no; le custom no.

**Test:** `scenes.test.js` aggiornato — richiede sempre `music.explore.length>0`,
`ambient`/`oneshots` non vuoti, id unici; `combat`/`victory` opzionali (≥0). Le 4
scene originali continuano ad avere le 3 intensità. `demoScene` resta `scenes[0]`
(tavern, con intensità) → test engine/mixer invariati.

## Fase B — Grafica (immagini generate + UI)

**Illustrazioni (12 scene):** generate con la skill locale ComfyUI
(`superpowers:genera-immagine`, Z-Image Turbo). Stile: **storybook painterly
fantasy caldo** coerente con PocketBard (illustrazione d'ambiente, niente testo,
niente personaggi in primo piano). Una per scena, ~1024×768 poi ridimensionata/
compressa (webp) in `public/img/scenes/<id>.webp`, tenendo i file piccoli
(~40-80KB) per il precache.

**Icona PWA:** nuova icona a tema (liuto/⚜ su fondo ambra), generata e/o composta,
esportata `public/icons/icon-192.png` e `icon-512.png`.

**Modello dati:** `Scene.image` (path illustrazione) per le scene di libreria. Le
scene custom non hanno `image` → restano a gradiente `cover`.

**UI:**
- `SceneCard`: se `scene.image`, sfondo = immagine (con overlay scuro in basso per
  leggibilità del nome); altrimenti gradiente `cover` (custom). Angoli, ombra morbida.
- `NowPlaying`: banner con l'immagine della scena come sfondo (overlay per il testo).
- Rifinitura: header, tab intensità, bottoni Play/SFX, spaziature — palette calda
  coerente, transizioni leggere. Nessuna ristrutturazione dell'architettura.
- **Credits** (`Credits.svelte`): schermata raggiunta da un link in Home; elenca le
  fonti audio da `licenses.json` (file, autore, fonte, licenza) e i credits immagini
  (generati con ComfyUI/Z-Image Turbo — dichiarazione). `route` guadagna vista `credits`.

**Fallback grafica:** se ComfyUI non è raggiungibile, le tessere restano a gradiente
(l'app funziona comunque); si segnala e si generano le immagini in un secondo momento.

## Fase C — Offline a scala (runtime caching)

Con 12 scene, precaricare tutto l'audio è impraticabile (40MB+). Nuova strategia
Workbox in `vite.config.js`:
- **Precache**: solo app-shell (JS/CSS/HTML), manifest, icone e **illustrazioni**
  (piccole) → install leggero. Rimuovere `webm,m4a` da `globPatterns`.
- **Runtime caching**: richieste a `/audio/**` → strategia **CacheFirst** con cache
  dedicata (es. `bardo-audio`) ed eventuale limite/espirazione. Effetto: l'audio si
  scarica alla prima riproduzione e resta disponibile offline dopo.

**Conseguenza (documentata):** una scena è pienamente offline solo dopo averla
suonata almeno una volta online. Accettato in fase di design.

## Fase D — Pubblicazione (GitHub Pages)

- **Repo:** creare repo GitHub **pubblico** `bardo` (account `danielemocciapt-bot`,
  `gh` già autenticato con scope repo+workflow). Push di `master`.
- **Base path:** Vite `base: '/bardo/'` (project pages servono sotto `/<repo>/`); il
  manifest e il service worker devono rispettare la base (vite-plugin-pwa gestisce
  `base`/`scope`). Verificare che gli asset e gli audio siano referenziati con la base
  corretta (usare percorsi relativi o `import.meta.env.BASE_URL`).
- **Deploy:** GitHub Actions workflow `.github/workflows/deploy.yml` — checkout,
  setup-node, `npm ci`, `npm run build`, `upload-pages-artifact` (da `dist`),
  `deploy-pages`; ambiente `github-pages`. Abilitare Pages (build type "GitHub
  Actions") via `gh api` o dashboard.
- **Nota licenza/privacy:** repo pubblico ⇒ audio Pixabay scaricabili pubblicamente.
  Accettato dall'utente per uso personale.
- **Output:** link `https://danielemocciapt-bot.github.io/bardo/` da aprire e
  installare come PWA sul telefono.

## Architettura / file (sintesi)

Nuovi:
- `public/img/scenes/<id>.webp` (12), icone rigenerate.
- `src/components/Credits.svelte`.
- `.github/workflows/deploy.yml`.

Modificati:
- `src/lib/data/scenes.js` (8 scene nuove + campo `image` sulle 12), `types.js`
  (`image?`, e `music.combat/victory` possono essere vuoti), `licenses.json` (audio nuovi).
- `src/lib/stores/route.js` (vista `credits`).
- `src/components/SceneCard.svelte`, `NowPlaying.svelte`, `Home.svelte`,
  `GameScreen.svelte` (tab solo se combat), `App.svelte` (vista credits).
- `vite.config.js` (base, workbox precache+runtimeCaching), manifest/icone.

## Testing

- Unit (Vitest): `scenes.test.js` aggiornato (explore obbligatorio, combat/victory
  opzionali, 12 scene, id unici, image presente sulle scene libreria); resto invariato.
- Manuale (controller, browser): Home mostra 12 tessere illustrate; scene semplici
  senza tab; audio in runtime-cache (prima play scarica, poi offline); Credits ok;
  build con base '/bardo/' serve correttamente in preview.
- Deploy: dopo il push, il workflow Actions verde e il link pubblico apre l'app.

## Definition of Done (Fase 5b)

- 12 scene navigabili; le 8 nuove semplici (no tab), le 4 originali con intensità.
- Illustrazioni su tessere + banner; icona PWA nuova; Credits funzionante.
- Runtime caching audio; install leggero; scena offline dopo prima riproduzione.
- Repo pubblico `bardo` su GitHub; Pages deploy verde; **link pubblico funzionante**
  e installabile come PWA sul telefono.

## Note / rischi

- **Sourcing audio** (24 suoni nuovi) e **generazione immagini** (12+icona): parti
  lunghe e a rischio (fit/qualità); fallback documentati (meno audio / gradiente).
- **ComfyUI** deve essere attivo per le immagini; altrimenti si rimanda la Fase B grafica.
- **Base path** `/bardo/`: attenzione a percorsi assoluti `/audio/...` e `/img/...`
  nel codice — vanno resi relativi alla base o gestiti, altrimenti 404 in produzione.
- Peso repo: immagini piccole (webp) + audio; entro i limiti Pages.
