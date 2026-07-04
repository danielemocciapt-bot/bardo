<script>
  export let scene;
  export let onOpen = (_id) => {};
  export let onDelete = null;
  let imgOk = !!scene.image;
</script>

<div style="position:relative;">
  <button
    on:click={() => onOpen(scene.id)}
    style="width:100%;border:none;cursor:pointer;padding:0;border-radius:14px;overflow:hidden;
           height:96px;position:relative;background:{scene.cover};box-shadow:0 3px 0 #d9b877;">
    {#if scene.image && imgOk}
      <img src={scene.image} alt={scene.name} on:error={() => (imgOk = false)}
        style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;" />
    {:else if scene.emoji}
      <span style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;
                   font-size:44px;filter:drop-shadow(0 2px 4px #00000055);" aria-hidden="true">{scene.emoji}</span>
    {/if}
    <div style="position:absolute;inset:0;background:linear-gradient(to top,#00000099,transparent 55%);"></div>
    <span style="position:absolute;left:10px;bottom:8px;color:#fff;font-weight:700;
                 font-size:14px;text-shadow:0 1px 3px #00000088;">{scene.name}</span>
  </button>
  {#if onDelete}
    <button on:click|stopPropagation={() => onDelete(scene.id)} aria-label="elimina"
      style="position:absolute;top:6px;right:6px;border:none;cursor:pointer;width:26px;height:26px;
             border-radius:50%;background:#00000055;color:#fff;font-size:14px;line-height:1;z-index:2;">✕</button>
  {/if}
</div>
