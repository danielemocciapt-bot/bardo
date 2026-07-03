<script>
  import { player } from '../lib/stores/player.js';
</script>

{#if $player.scene}
  <button on:click={() => player.togglePlay()} aria-label="play o pausa"
    style="position:fixed;right:16px;bottom:16px;z-index:50;border:none;cursor:pointer;
           background:var(--amber);color:#4a3410;border-radius:28px;height:56px;padding:0 20px;
           box-shadow:0 6px 16px #00000055;font-weight:700;display:flex;align-items:center;gap:10px;">
    <span style="font-size:18px;line-height:1;">{$player.playing ? '⏸' : '▶'}</span>
    <span style="font-size:12px;max-width:130px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">{$player.scene.name}</span>
  </button>
{/if}
