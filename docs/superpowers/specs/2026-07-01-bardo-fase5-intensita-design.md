# Bardo — Fase 5a: Intensità vere (tracce distinte per scena)

**Data:** 2026-07-01
**Stato:** Design approvato, pronto per piano implementativo
**Fasi precedenti:** Fase 1 (core) + 2 (Home/audio/background) + 4 (scene builder) unite in `master`.

## Obiettivo

Dare a ciascuna delle 4 scene di libreria **3 tracce musicali distinte**
(esplora / combatti / vittoria), così le tab intensità cambiano davvero musica
con crossfade. Oggi ogni scena usa un'unica traccia condivisa: la feature
signature (intensità adattiva) non è ancora percepibile. Questa fase la rende reale.

## Scope

Dentro:
- Audio: per ogni scena, traccia esplora (riuso dell'attuale `music`), più
  **combatti** e **vittoria** nuove (8 tracce nuove, royalty-free Pixabay).
- Dati: `scenes.js` con `src` distinti per intensità (id invariati).
- Registro licenze aggiornato; precache automatico dei nuovi file.

Fuori:
- Nuove scene → fase separata.
- Grafica/icone finali, Credits UI, edit scene custom → fasi successive.
- Download manager pacchetti (Fase 3, rinviata): il precache cresce a ~15MB, accettabile ora.

## 1. Dati (`scenes.js`)

Ripristino la shape con file distinti per intensità (com'era prima della riduzione
di Fase 2), mantenendo gli **id invariati** (`<scena>-explore/combat/victory`):

```
music: {
  explore: [{ id:'tavern-explore', name:'Calma',    src: fmt('tavern','explore'), loop:true }],
  combat:  [{ id:'tavern-combat',  name:'Rissa',    src: fmt('tavern','combat'),  loop:true }],
  victory: [{ id:'tavern-victory', name:'Brindisi', src: fmt('tavern','victory'), loop:true }]
}
```

Solo il percorso file cambia (da `music.*` condiviso a `explore/combat/victory.*`
per intensità). Ambient e oneshots invariati.

**Perché gli id restano uguali conta:** i test di `AudioEngine`/`mixer` referenziano
`tavern-explore`/`tavern-combat`; la guardia `setIntensity` same-id (Fase 4) protegge
le scene custom (dove i 3 id coincidono). Con id invariati, entrambi restano validi:
per le scene di libreria i 3 id sono distinti → crossfade normale; per le custom
coincidono → guardia no-op. Nessun cambiamento di logica engine/mixer.

## 2. Audio (sourcing)

Per ogni scena (`tavern`, `forest`, `city`, `dungeon`):
- **explore**: rinomina il file attuale `public/audio/<scena>/music.*` →
  `explore.*` (riuso; già mood calmo/esplorazione).
- **combat**: nuova traccia intensa/battaglia a tema (es. taverna = rissa
  concitata; dungeon = orrore incalzante; città = guardie/inseguimento; foresta = agguato).
- **victory**: nuova traccia trionfale/di quiete conclusiva.

Fonte: Pixabay (Content License, royalty-free) via CDN + `ffmpeg`. Cap durata
~45-50s, Opus mono ~72kbps + fallback `.m4a` AAC, per contenere il peso del precache.

**Fallback sourcing** (come Fase 2): se una traccia non è recuperabile in automatico,
ridurre (es. usare la stessa `explore` come `victory`) o lasciare il ref e segnalare
il buco nel report — l'app tollera un 404 (silenzioso). Non inventare audio.

## 3. Licenze + offline

- Aggiungere le 8 nuove tracce a `src/lib/data/licenses.json` (file, source, license, author).
- Le tracce rinominate `explore.*` restano registrate (aggiornare il path se serve).
- Workbox precache le include (globPattern `webm,m4a` già presente). Precache atteso
  ~15MB. Nota nel README se utile.

## 4. Scene custom

Invariate. `buildUserScene` usa `music.explore[0]` come traccia unica; il builder
mostra `s.music.explore[0]` come opzione "musica" (ora è specificamente la traccia
esplora, coerente). Tab intensità restano nascoste per le custom. Nessuna modifica.

## 5. Testing

- Unit: restano verdi senza modifiche sostanziali (id invariati; la logica di
  crossfade è già coperta). Se `scenes.test.js` verifica solo shape/length, resta valido.
- Manuale (browser, controller): in una scena di libreria, Play → tab **Combatti** →
  la musica **cambia** (crossfade udibile/di fatto: caricano `combat.webm` 200/206) →
  tab **Vittoria** → carica `victory.*`. Nessun 404 sui file esistenti.

## Definition of Done (Fase 5a)

- `scenes.js` con tracce distinte per intensità (id invariati).
- 8 nuove tracce (combat+victory ×4 scene) scaricate e convertite (o fallback
  documentato nel report), esplora riusata dai file esistenti.
- `licenses.json` aggiornato; precache include i nuovi file.
- `npm test` verde; build pulita.
- In browser: cambiare intensità cambia davvero la musica; nessun 404 sui file presenti.

## Note / carry-over

- Peso precache ~15MB: se i contenuti cresceranno, riprendere il download-manager (Fase 3).
- Loop/seam delle tracce combat/victory: cura ragionevole, non perfetta (come Fase 2).
- Grafica finale, Credits UI, nuove scene, edit custom: fasi successive.
