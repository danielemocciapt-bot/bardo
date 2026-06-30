import { describe, it, expect } from 'vitest';
import { demoScene } from './scenes.js';

describe('demoScene', () => {
  it('ha id, nome e le tre intensità musicali', () => {
    expect(demoScene.id).toBeTypeOf('string');
    expect(demoScene.name).toBeTypeOf('string');
    expect(demoScene.music.explore.length).toBeGreaterThan(0);
    expect(demoScene.music.combat.length).toBeGreaterThan(0);
    expect(demoScene.music.victory.length).toBeGreaterThan(0);
  });

  it('ha layer ambient e oneshot con campi obbligatori', () => {
    for (const layer of demoScene.ambient) {
      expect(layer.id).toBeTypeOf('string');
      expect(layer.src.length).toBeGreaterThan(0);
    }
    for (const sfx of demoScene.oneshots) {
      expect(sfx.id).toBeTypeOf('string');
      expect(sfx.src.length).toBeGreaterThan(0);
    }
  });
});
