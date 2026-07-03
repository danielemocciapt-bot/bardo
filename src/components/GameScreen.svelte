<script>
  import { onMount, onDestroy } from 'svelte';
  import { AudioEngine } from '../lib/audio/AudioEngine.js';
  import { createMixer } from '../lib/stores/mixer.js';
  import { createMediaSession } from '../lib/audio/media-session.js';
  import { createWakeLock } from '../lib/audio/wake-lock.js';
  import NowPlaying from './NowPlaying.svelte';
  import IntensityTabs from './IntensityTabs.svelte';
  import Mixer from './Mixer.svelte';
  import OneShotBar from './OneShotBar.svelte';

  export let scene;
  export let onBack = () => {};

  const engine = new AudioEngine();
  const wake = createWakeLock();
  const mixer = createMixer(engine, { mediaSession: createMediaSession(), wakeLock: wake });

  onMount(() => mixer.load(scene));
  onDestroy(() => mixer.teardown());
</script>

<div style="padding:10px 16px 0;">
  <button on:click={onBack}
    style="border:none;cursor:pointer;background:#ffffff88;color:var(--ink);
           padding:8px 14px;border-radius:20px;font-size:13px;font-weight:600;">← Home</button>
</div>

<NowPlaying name={scene.name} image={scene.image ?? ''} />
{#if !scene.custom && scene.music.combat.length > 0}
  <IntensityTabs value={$mixer.intensity} onChange={(l) => mixer.setIntensity(l)} />
{/if}

<div style="text-align:center;margin:4px 0 12px;">
  <button on:click={() => mixer.togglePlay()}
    style="border:none;cursor:pointer;background:var(--amber);color:#4a3410;font-weight:700;
           padding:12px 28px;border-radius:24px;font-size:15px;box-shadow:0 3px 0 #d9a85a;">
    {$mixer.playing ? '⏸ Pausa' : '▶ Play'}
  </button>
</div>

{#if wake.supported}
  <div style="text-align:center;margin:-4px 0 10px;">
    <label style="font-size:12px;color:var(--ink-soft);cursor:pointer;">
      <input type="checkbox" checked={$mixer.keepAwake}
             on:change={(e) => mixer.setKeepAwake(e.target.checked)} />
      Tieni schermo acceso
    </label>
  </div>
{/if}

<Mixer {scene} state={$mixer} onMaster={(v) => mixer.setMaster(v)} onLayer={(id, v) => mixer.setLayerVolume(id, v)} />
<OneShotBar {scene} onPlay={(id) => mixer.oneShot(id)} />
