/**
 * Wrapper feature-detected su navigator.wakeLock.
 * @param {Navigator|Object} [nav]
 */
export function createWakeLock(nav = typeof navigator !== 'undefined' ? navigator : {}) {
  const api = nav && nav.wakeLock ? nav.wakeLock : null;
  const supported = !!api;
  let sentinel = null;

  async function enable() {
    if (!api || sentinel) return;
    try {
      sentinel = await api.request('screen');
      sentinel.addEventListener?.('release', () => { sentinel = null; });
    } catch {
      sentinel = null;
    }
  }

  async function disable() {
    if (!sentinel) return;
    try { await sentinel.release(); } catch { /* ignore */ }
    sentinel = null;
  }

  return { supported, enable, disable };
}
