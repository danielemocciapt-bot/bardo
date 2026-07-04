<script>
  import { createRoute } from './lib/stores/route.js';
  import { getScene } from './lib/data/scenes.js';
  import { userScenes } from './lib/stores/userScenes.js';
  import Home from './components/Home.svelte';
  import GameScreen from './components/GameScreen.svelte';
  import SceneBuilder from './components/SceneBuilder.svelte';
  import Credits from './components/Credits.svelte';
  import FloatingControls from './components/FloatingControls.svelte';
  import InstrumentsBg from './components/InstrumentsBg.svelte';

  const route = createRoute();
  $: resolve = (id) => getScene(id) ?? $userScenes.find((s) => s.id === id);
</script>

<InstrumentsBg />

{#if $route.view === 'game' && resolve($route.sceneId)}
  {#key $route.sceneId}
    <GameScreen scene={resolve($route.sceneId)} onBack={() => route.home()} />
  {/key}
{:else if $route.view === 'builder'}
  <SceneBuilder onDone={() => route.home()} />
{:else if $route.view === 'credits'}
  <Credits onDone={() => route.home()} />
{:else}
  <Home onOpen={(id) => route.open(id)} onCreate={() => route.builder()} onCredits={() => route.credits()} />
{/if}

<FloatingControls />
