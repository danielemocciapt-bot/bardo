<script>
  import { createRoute } from './lib/stores/route.js';
  import { getScene } from './lib/data/scenes.js';
  import { userScenes } from './lib/stores/userScenes.js';
  import Home from './components/Home.svelte';
  import GameScreen from './components/GameScreen.svelte';
  import SceneBuilder from './components/SceneBuilder.svelte';

  const route = createRoute();

  // libreria prima, poi scene custom
  $: resolve = (id) => getScene(id) ?? $userScenes.find((s) => s.id === id);
</script>

{#if $route.view === 'game'}
  {#key $route.sceneId}
    <GameScreen scene={resolve($route.sceneId)} onBack={() => route.home()} />
  {/key}
{:else if $route.view === 'builder'}
  <SceneBuilder onDone={() => route.home()} />
{:else}
  <Home onOpen={(id) => route.open(id)} onCreate={() => route.builder()} />
{/if}
