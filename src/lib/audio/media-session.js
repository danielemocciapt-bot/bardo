/**
 * Wrapper feature-detected su navigator.mediaSession.
 * @param {Navigator|Object} [nav]
 */
export function createMediaSession(nav = typeof navigator !== 'undefined' ? navigator : {}) {
  const ms = nav && nav.mediaSession ? nav.mediaSession : null;
  const supported = !!ms;

  function setScene(scene) {
    if (!ms || typeof MediaMetadata === 'undefined') return;
    ms.metadata = new MediaMetadata({
      title: scene.name,
      artist: 'Bardo',
      artwork: typeof scene.cover === 'string' && scene.cover.startsWith('/')
        ? [{ src: scene.cover, sizes: '512x512', type: 'image/png' }]
        : []
    });
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
