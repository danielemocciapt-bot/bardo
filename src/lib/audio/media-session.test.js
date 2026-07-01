import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createMediaSession } from './media-session.js';

function fakeNav() {
  return {
    mediaSession: { metadata: null, playbackState: 'none', setActionHandler: vi.fn() }
  };
}

describe('media-session', () => {
  beforeEach(() => {
    globalThis.MediaMetadata = class { constructor(init) { Object.assign(this, init); } };
  });

  it('no-op se mediaSession assente', () => {
    const ms = createMediaSession({});
    expect(() => { ms.setScene({ name: 'x', cover: 'y' }); ms.setPlaybackState('playing'); }).not.toThrow();
    expect(ms.supported).toBe(false);
  });

  it('setScene imposta metadata; setPlaybackState imposta lo stato', () => {
    const nav = fakeNav();
    const ms = createMediaSession(nav);
    ms.setScene({ name: 'Taverna', cover: 'linear-gradient(...)' });
    expect(nav.mediaSession.metadata.title).toBe('Taverna');
    ms.setPlaybackState('playing');
    expect(nav.mediaSession.playbackState).toBe('playing');
  });

  it('setHandlers registra play/pause/stop', () => {
    const nav = fakeNav();
    const ms = createMediaSession(nav);
    const onPlay = vi.fn(), onPause = vi.fn(), onStop = vi.fn();
    ms.setHandlers({ onPlay, onPause, onStop });
    const calls = Object.fromEntries(nav.mediaSession.setActionHandler.mock.calls);
    expect(calls.play).toBeTypeOf('function');
    expect(calls.pause).toBeTypeOf('function');
    expect(calls.stop).toBeTypeOf('function');
    calls.play(); calls.pause(); calls.stop();
    expect(onPlay).toHaveBeenCalled();
    expect(onPause).toHaveBeenCalled();
    expect(onStop).toHaveBeenCalled();
  });
});
