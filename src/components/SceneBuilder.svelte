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

  // molte scene riusano lo stesso file audio: mostra ogni suono una sola volta (dedup per src)
  const dedupBySrc = (opts) => {
    const seen = new Set();
    return opts.filter((o) => { const k = o.ref.src.join('|'); return seen.has(k) ? false : seen.add(k); });
  };
  const musicOptions = scenes.map((s) => ({ ref: s.music.explore[0], label: `${s.music.explore[0].name} (${s.name})` }));
  const ambientOptions = dedupBySrc(scenes.flatMap((s) => s.ambient.map((a) => ({ ref: a, label: `${a.name} (${s.name})` }))));
  const oneshotOptions = dedupBySrc(scenes.flatMap((s) => s.oneshots.map((o) => ({ ref: o, label: `${o.name} (${s.name})` }))));

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

  <label for="sb-name" style="display:block;font-size:12px;color:var(--ink-soft);text-transform:uppercase;letter-spacing:1px;">Nome</label>
  <input id="sb-name" bind:value={name} placeholder="La mia scena"
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
