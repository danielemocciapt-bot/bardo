<script>
  export let scene;
  export let onOpen = (_id) => {};
</script>

<button
  on:click={() => onOpen(scene.id)}
  style="border:none;cursor:pointer;padding:0;border-radius:14px;overflow:hidden;
         height:96px;position:relative;background:{scene.cover};
         box-shadow:0 3px 0 #d9b877;">
  <span style="position:absolute;left:10px;bottom:8px;color:#fff;font-weight:700;
               font-size:14px;text-shadow:0 1px 3px #00000088;">{scene.name}</span>
</button>
