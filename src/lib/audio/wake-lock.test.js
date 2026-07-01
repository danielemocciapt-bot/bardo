import { describe, it, expect, vi } from 'vitest';
import { createWakeLock } from './wake-lock.js';

describe('wake-lock', () => {
  it('no-op e supported=false se assente', async () => {
    const wl = createWakeLock({});
    expect(wl.supported).toBe(false);
    await expect(wl.enable()).resolves.toBeUndefined();
    await expect(wl.disable()).resolves.toBeUndefined();
  });

  it('enable richiede lo screen lock; disable lo rilascia', async () => {
    const sentinel = { release: vi.fn().mockResolvedValue(undefined) };
    const nav = { wakeLock: { request: vi.fn().mockResolvedValue(sentinel) } };
    const wl = createWakeLock(nav);
    expect(wl.supported).toBe(true);
    await wl.enable();
    expect(nav.wakeLock.request).toHaveBeenCalledWith('screen');
    await wl.disable();
    expect(sentinel.release).toHaveBeenCalled();
  });

  it('enable due volte non crea due sentinel', async () => {
    const sentinel = { release: vi.fn().mockResolvedValue(undefined) };
    const nav = { wakeLock: { request: vi.fn().mockResolvedValue(sentinel) } };
    const wl = createWakeLock(nav);
    await wl.enable();
    await wl.enable();
    expect(nav.wakeLock.request).toHaveBeenCalledTimes(1);
  });
});
