<script>
  import licenses from '../lib/data/licenses.json';
  export let onDone = () => {};
  // raggruppa per licenza per una lista compatta
  const audio = licenses;
</script>

<div style="padding:10px 16px 40px;">
  <button on:click={onDone}
    style="border:none;cursor:pointer;background:#ffffff88;color:var(--ink);padding:8px 14px;border-radius:20px;font-size:13px;font-weight:600;">← Home</button>
  <h2 style="font-family:Georgia,serif;color:#7a5a2e;">Crediti</h2>

  <p style="font-size:13px;color:var(--ink);line-height:1.5;">
    Le illustrazioni sono generate con IA (ComfyUI · Z-Image Turbo).
    L'audio è royalty-free da Pixabay (Pixabay Content License) e simili; dettaglio sotto.
  </p>

  <div style="font-size:11px;color:var(--ink-soft);text-transform:uppercase;letter-spacing:1px;margin:14px 0 6px;">Audio</div>
  <div style="background:var(--panel);border-radius:12px;padding:10px 12px;box-shadow:var(--shadow);">
    {#each audio as e}
      <div style="font-size:12px;color:var(--ink);padding:5px 0;border-bottom:1px solid #00000010;">
        <a href={e.source} target="_blank" rel="noopener" style="color:var(--amber-deep);text-decoration:none;">{e.file}</a>
        — {e.license}{e.author ? ` · ${e.author}` : ''}
      </div>
    {/each}
  </div>
</div>
