<script>
  import SceneCard from './SceneCard.svelte';
  import { scenes } from '../lib/data/scenes.js';
  export let onOpen = (_id) => {};
</script>

<header style="padding:16px 16px 6px;display:flex;align-items:center;gap:8px;">
  <div style="font-family:Georgia,serif;font-size:22px;font-weight:700;color:#7a5a2e;">⚜ Bardo</div>
</header>

<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;padding:10px 16px 24px;">
  {#each scenes as scene}
    <SceneCard {scene} {onOpen} />
  {/each}
</div>
