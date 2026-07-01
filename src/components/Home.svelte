<script>
  import SceneCard from './SceneCard.svelte';
  import { scenes } from '../lib/data/scenes.js';
  export let onOpen = (_id) => {};
  export let onCreate = () => {};
</script>

<header style="padding:16px 16px 6px;display:flex;align-items:center;gap:8px;">
  <div style="font-family:Georgia,serif;font-size:22px;font-weight:700;color:#7a5a2e;">⚜ Bardo</div>
</header>

<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;padding:10px 16px 24px;">
  {#each scenes as scene}
    <SceneCard {scene} {onOpen} />
  {/each}
  <button on:click={onCreate}
    style="border:2px dashed #d3b985;cursor:pointer;background:#efe1c4;border-radius:14px;height:96px;
           color:#a98f5e;font-size:13px;font-weight:600;">+ Crea scena</button>
</div>
