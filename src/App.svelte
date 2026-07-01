<script>
  import { createRoute } from './lib/stores/route.js';
  import { getScene } from './lib/data/scenes.js';
  import Home from './components/Home.svelte';
  import GameScreen from './components/GameScreen.svelte';

  const route = createRoute();
</script>

{#if $route.view === 'game'}
  {#key $route.sceneId}
    <GameScreen scene={getScene($route.sceneId)} onBack={() => route.home()} />
  {/key}
{:else}
  <Home onOpen={(id) => route.open(id)} />
{/if}
