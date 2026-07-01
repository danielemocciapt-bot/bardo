import { writable } from 'svelte/store';

const KEY = 'bardo.userScenes';

/**
 * Store delle scene custom, persistite su localStorage.
 * @param {Storage|Object} [storage]
 */
export function createUserScenes(storage = typeof localStorage !== 'undefined' ? localStorage : null) {
  const read = () => {
    if (!storage) return [];
    try { return JSON.parse(storage.getItem(KEY)) || []; } catch { return []; }
  };
  let current = read();
  const { subscribe, set } = writable(current);

  const persist = () => {
    if (!storage) return;
    try { storage.setItem(KEY, JSON.stringify(current)); } catch { /* quota/serialize */ }
  };

  function add(scene) { current = [...current, scene]; persist(); set(current); }
  function remove(id) { current = current.filter((s) => s.id !== id); persist(); set(current); }
  function all() { return current; }

  return { subscribe, add, remove, all };
}

/** Singleton dell'app (usa il vero localStorage). */
export const userScenes = createUserScenes();
