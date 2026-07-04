import { writable } from 'svelte/store';

/**
 * Store di routing Home/Game basato su History API.
 * @param {{history?: History, target?: Window}} [deps]
 */
export function createRoute(deps = {}) {
  const history = deps.history ?? (typeof window !== 'undefined' ? window.history : null);
  const target = deps.target ?? (typeof window !== 'undefined' ? window : null);
  const location = deps.location ?? (typeof window !== 'undefined' ? window.location : null);

  // stato iniziale dall'URL (deep-link / reload su una scena)
  const parseHash = (h) => {
    const m = /^#\/scene\/(.+)$/.exec(h || '');
    if (m) return { view: 'game', sceneId: decodeURIComponent(m[1]) };
    if (h === '#/builder') return { view: 'builder' };
    if (h === '#/credits') return { view: 'credits' };
    return { view: 'home' };
  };
  const initial = parseHash(location?.hash);
  const { subscribe, set } = writable(initial);
  // semina lo stato history così il tasto Indietro funziona partendo da un deep-link
  if (history && initial.view !== 'home') {
    const st = initial.view === 'game' ? { sceneId: initial.sceneId }
      : initial.view === 'builder' ? { builder: true } : { credits: true };
    history.replaceState(st, '', location?.hash);
  }

  function open(sceneId) {
    set({ view: 'game', sceneId });
    history?.pushState({ sceneId }, '', `#/scene/${sceneId}`);
  }

  function home() {
    // torna indietro nello stack così lo stato history resta coerente
    history?.back();
  }

  function builder() {
    set({ view: 'builder' });
    history?.pushState({ builder: true }, '', '#/builder');
  }

  function credits() {
    set({ view: 'credits' });
    history?.pushState({ credits: true }, '', '#/credits');
  }

  // il tasto Indietro (o back()) emette popstate: ripristina la vista dallo stato
  target?.addEventListener('popstate', (ev) => {
    const st = ev?.state;
    if (st?.sceneId) set({ view: 'game', sceneId: st.sceneId });
    else if (st?.builder) set({ view: 'builder' });
    else if (st?.credits) set({ view: 'credits' });
    else set({ view: 'home' });
  });

  return { subscribe, open, home, builder, credits };
}
