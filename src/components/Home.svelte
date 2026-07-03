<script>
  import SceneCard from './SceneCard.svelte';
  import { scenes } from '../lib/data/scenes.js';
  import { userScenes } from '../lib/stores/userScenes.js';
  export let onOpen = (_id) => {};
  export let onCreate = () => {};
  export let onCredits = () => {};

  function del(id) {
    if (confirm('Eliminare questa scena?')) userScenes.remove(id);
  }
</script>

<header style="padding:16px 16px 6px;display:flex;align-items:center;gap:8px;">
  <div style="font-family:Georgia,serif;font-size:22px;font-weight:700;color:#7a5a2e;">⚜ Bardo</div>
</header>

<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;padding:10px 16px 8px;">
  {#each scenes as scene}
    <SceneCard {scene} {onOpen} />
  {/each}
</div>

<div style="font-size:11px;color:var(--ink-soft);text-transform:uppercase;letter-spacing:1px;padding:6px 16px 0;">Le mie scene</div>
<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;padding:6px 16px 24px;">
  {#each $userScenes as scene (scene.id)}
    <SceneCard {scene} {onOpen} onDelete={del} />
  {/each}
  <button on:click={onCreate}
    style="border:2px dashed #d3b985;cursor:pointer;background:#efe1c4;border-radius:14px;height:96px;
           color:#a98f5e;font-size:13px;font-weight:600;">+ Crea scena</button>
</div>

<div style="text-align:center;padding:8px 16px 28px;">
  <button on:click={onCredits}
    style="border:none;background:none;cursor:pointer;color:var(--ink-soft);font-size:12px;text-decoration:underline;">Crediti e licenze</button>
</div>
