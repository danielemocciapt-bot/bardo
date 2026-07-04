<script>
  import EffectIcon from './EffectIcon.svelte';
  import { soundKey } from '../lib/data/icons.js';
  export let scene;
  export let onPlay = (_id) => {};
</script>

<div style="display:flex;gap:8px;flex-wrap:wrap;padding:16px 16px 92px;">
  {#each scene.oneshots as sfx}
    <button on:click={() => onPlay(sfx.id)}
      style="flex:1;min-width:80px;border:none;cursor:pointer;background:#fff;border-radius:12px;
             padding:12px 8px;font-size:13px;font-weight:600;color:var(--ink);box-shadow:0 2px 0 #d9a85a;
             display:flex;flex-direction:column;align-items:center;gap:5px;">
      <EffectIcon sound={soundKey(sfx)} />
      {sfx.name}
    </button>
  {/each}
</div>
