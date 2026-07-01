import { writable } from 'svelte/store';

/**
 * Store di routing Home/Game basato su History API.
 * @param {{history?: History, target?: Window}} [deps]
 */
export function createRoute(deps = {}) {
  const history = deps.history ?? (typeof window !== 'undefined' ? window.history : null);
  const target = deps.target ?? (typeof window !== 'undefined' ? window : null);

  const { subscribe, set } = writable({ view: 'home' });

  function open(sceneId) {
    set({ view: 'game', sceneId });
    history?.pushState({ sceneId }, '', `#/scene/${sceneId}`);
  }

  function home() {
    // torna indietro nello stack così lo stato history resta coerente
    history?.back();
  }

  // il tasto Indietro (o back()) emette popstate: se non c'è sceneId, siamo in Home
  target?.addEventListener('popstate', (ev) => {
    const sceneId = ev?.state?.sceneId;
    set(sceneId ? { view: 'game', sceneId } : { view: 'home' });
  });

  return { subscribe, open, home };
}
