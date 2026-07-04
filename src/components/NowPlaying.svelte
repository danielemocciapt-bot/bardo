<script>
  export let name = '';
  export let image = '';
  export let emoji = '';
  let imgOk = !!image;
</script>

<header style="position:relative;overflow:hidden;height:120px;border-radius:0 0 20px 20px;
               background:linear-gradient(160deg,#f3c98a,#b98a4a);display:flex;align-items:flex-end;">
  {#if image && imgOk}
    <img src={image} alt="" on:error={() => (imgOk = false)}
      style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;" />
  {:else if emoji}
    <span style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;
                 font-size:56px;filter:drop-shadow(0 2px 5px #00000055);" aria-hidden="true">{emoji}</span>
  {/if}
  <div style="position:absolute;inset:0;background:linear-gradient(to top,#000000aa,transparent 60%);"></div>
  <div style="position:relative;padding:14px 16px;">
    <div style="font-size:10px;letter-spacing:2px;text-transform:uppercase;color:#ffe9c0;">In riproduzione</div>
    <div style="font-family:Georgia,serif;font-size:22px;font-weight:700;color:#fff;text-shadow:0 1px 4px #000000aa;">{name}</div>
  </div>
</header>
