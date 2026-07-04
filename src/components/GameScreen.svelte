<script>
  import { player } from '../lib/stores/player.js';
  import NowPlaying from './NowPlaying.svelte';
  import IntensityTabs from './IntensityTabs.svelte';
  import Mixer from './Mixer.svelte';
  import OneShotBar from './OneShotBar.svelte';

  export let scene;
  export let onBack = () => {};

  // questa scena è quella attualmente attiva nel player?
  $: active = $player.scene && $player.scene.id === scene.id;
  // master e "schermo acceso" sono globali/persistiti (sempre dallo store);
  // playing/intensity/layers sono per-scena (solo se attiva)
  $: shown = {
    master: $player.master,
    keepAwake: $player.keepAwake,
    playing: active ? $player.playing : false,
    intensity: active ? $player.intensity : 'explore',
    layers: active ? $player.layers : {}
  };
</script>

<div style="padding:10px 16px 0;">
  <button on:click={onBack}
    style="border:none;cursor:pointer;background:#ffffff88;color:var(--ink);
           padding:8px 14px;border-radius:20px;font-size:13px;font-weight:600;">← Home</button>
</div>

<NowPlaying name={scene.name} image={scene.image ?? ''} emoji={scene.emoji ?? ''} />

{#if scene.music.combat.length > 0}
  <IntensityTabs value={shown.intensity} onChange={(l) => { if (active) player.setIntensity(l); }} />
{/if}

<div style="display:flex;gap:10px;justify-content:center;margin:4px 16px 12px;">
  <button on:click={() => (active ? player.togglePlay() : player.playScene(scene))}
    style="flex:1;max-width:170px;border:none;cursor:pointer;background:var(--amber);color:#4a3410;font-weight:700;
           padding:12px 0;border-radius:24px;font-size:15px;box-shadow:0 3px 0 #d9a85a;">
    {active && shown.playing ? '⏸ Pausa' : '▶ Play'}
  </button>
  <button on:click={() => player.playMixScene(scene)}
    style="flex:1;max-width:170px;border:none;cursor:pointer;background:#fff;color:var(--amber-deep);font-weight:700;
           padding:12px 0;border-radius:24px;font-size:15px;box-shadow:0 3px 0 #d9a85a;">
    🎲 Play Mix
  </button>
</div>

{#if player.wakeSupported}
  <div style="text-align:center;margin:-4px 0 10px;">
    <label style="font-size:12px;color:var(--ink-soft);cursor:pointer;">
      <input type="checkbox" checked={shown.keepAwake}
             on:change={(e) => player.setKeepAwake(e.target.checked)} />
      Tieni schermo acceso
    </label>
  </div>
{/if}

<Mixer {scene} state={shown} onMaster={(v) => player.setMaster(v)} onLayer={(id, v) => player.setLayer(scene, id, v)} />
<OneShotBar {scene} onPlay={(id) => player.oneShot(scene, id)} />
