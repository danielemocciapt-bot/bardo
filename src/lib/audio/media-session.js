/**
 * Wrapper feature-detected su navigator.mediaSession.
 * @param {Navigator|Object} [nav]
 */
export function createMediaSession(nav = typeof navigator !== 'undefined' ? navigator : {}) {
  const ms = nav && nav.mediaSession ? nav.mediaSession : null;
  const supported = !!ms;

  function setScene(scene) {
    if (!ms || typeof MediaMetadata === 'undefined') return;
    const B = (import.meta.env && import.meta.env.BASE_URL) || '/';
    // artwork reale: illustrazione scena (se presente) + icona app come fallback.
    // Serve anche a far comparire la notifica media -> l'OS tiene l'audio a schermo spento.
    const artwork = [];
    if (typeof scene.image === 'string' && scene.image) {
      artwork.push({ src: scene.image, sizes: '512x512', type: 'image/webp' });
    }
    artwork.push({ src: `${B}icons/icon-512.png`, sizes: '512x512', type: 'image/png' });
    ms.metadata = new MediaMetadata({ title: scene.name, artist: 'Bonfire Melody', artwork });
  }

  function setPlaybackState(state) {
    if (!ms) return;
    ms.playbackState = state; // 'playing' | 'paused' | 'none'
  }

  function setHandlers({ onPlay, onPause, onStop }) {
    if (!ms) return;
    ms.setActionHandler('play', () => onPlay && onPlay());
    ms.setActionHandler('pause', () => onPause && onPause());
    ms.setActionHandler('stop', () => onStop && onStop());
  }

  return { supported, setScene, setPlaybackState, setHandlers };
}
