import { describe, it, expect, vi, beforeEach } from 'vitest';
import { get } from 'svelte/store';
import { createRoute } from './route.js';

function fakeHistory() {
  return { pushState: vi.fn(), back: vi.fn() };
}
function fakeWindow() {
  const handlers = {};
  return {
    addEventListener: (type, cb) => { handlers[type] = cb; },
    _emit: (type, ev) => handlers[type] && handlers[type](ev),
  };
}

describe('route store', () => {
  let history, win, route;
  beforeEach(() => {
    history = fakeHistory();
    win = fakeWindow();
    route = createRoute({ history, target: win });
  });

  it('parte dalla Home', () => {
    expect(get(route).view).toBe('home');
  });

  it('open passa a game + pushState', () => {
    route.open('forest');
    expect(get(route)).toEqual({ view: 'game', sceneId: 'forest' });
    expect(history.pushState).toHaveBeenCalledWith({ sceneId: 'forest' }, '', expect.anything());
  });

  it('home chiama history.back', () => {
    route.open('forest');
    route.home();
    expect(history.back).toHaveBeenCalled();
  });

  it('popstate riporta lo store alla Home', () => {
    route.open('forest');
    win._emit('popstate', { state: null });
    expect(get(route).view).toBe('home');
  });

  it('builder passa alla vista builder + pushState', () => {
    route.builder();
    expect(get(route)).toEqual({ view: 'builder' });
    expect(history.pushState).toHaveBeenCalledWith({ builder: true }, '', expect.anything());
  });

  it('popstate con state.builder ripristina la vista builder', () => {
    route.builder();
    win._emit('popstate', { state: { builder: true } });
    expect(get(route).view).toBe('builder');
  });

  it('credits passa alla vista credits + pushState', () => {
    route.credits();
    expect(get(route)).toEqual({ view: 'credits' });
    expect(history.pushState).toHaveBeenCalledWith({ credits: true }, '', expect.anything());
  });

  it('popstate con state.credits ripristina la vista credits', () => {
    route.credits();
    win._emit('popstate', { state: { credits: true } });
    expect(get(route).view).toBe('credits');
  });
});
