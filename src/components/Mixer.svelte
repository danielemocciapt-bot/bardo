<script>
  export let scene;
  export let state;     // oggetto stato dello store mixer
  export let onMaster = (_v) => {};
  export let onLayer = (_id, _v) => {};
</script>

<div style="background:var(--panel);margin:0 16px;border-radius:var(--radius);padding:14px;box-shadow:var(--shadow);">
  <div style="font-size:10px;color:var(--ink-soft);text-transform:uppercase;letter-spacing:1px;margin-bottom:10px;">Mixer</div>

  <label style="display:flex;align-items:center;gap:10px;font-size:13px;margin-bottom:12px;">
    🎚 Master
    <input type="range" min="0" max="1" step="0.01" value={state.master}
           on:input={(e) => onMaster(+e.target.value)} style="flex:1;" />
  </label>

  {#each scene.ambient as layer}
    <label style="display:flex;align-items:center;gap:10px;font-size:13px;margin-bottom:10px;">
      {layer.name}
      <input type="range" min="0" max="1" step="0.01" value={state.layers[layer.id]}
             on:input={(e) => onLayer(layer.id, +e.target.value)} style="flex:1;" />
    </label>
  {/each}
</div>
