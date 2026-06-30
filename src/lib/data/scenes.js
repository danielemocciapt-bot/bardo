/** @typedef {import('../types.js').Scene} Scene */

/** @type {Scene} */
export const demoScene = {
  id: 'tavern',
  name: 'Taverna del Drago',
  music: {
    explore: [{ id: 'tavern-explore', name: 'Calma', src: ['/audio/demo/tavern-explore.webm', '/audio/demo/tavern-explore.m4a'], loop: true }],
    combat:  [{ id: 'tavern-combat',  name: 'Rissa', src: ['/audio/demo/tavern-combat.webm',  '/audio/demo/tavern-combat.m4a'],  loop: true }],
    victory: [{ id: 'tavern-victory', name: 'Brindisi', src: ['/audio/demo/tavern-victory.webm', '/audio/demo/tavern-victory.m4a'], loop: true }]
  },
  ambient: [
    { id: 'crowd', name: 'Brusio', src: ['/audio/demo/crowd.webm', '/audio/demo/crowd.m4a'], loop: true },
    { id: 'fire',  name: 'Fuoco',  src: ['/audio/demo/fire.webm',  '/audio/demo/fire.m4a'],  loop: true }
  ],
  oneshots: [
    { id: 'door',    name: 'Porta',     src: ['/audio/demo/door.webm',    '/audio/demo/door.m4a'] },
    { id: 'thunder', name: 'Tuono',     src: ['/audio/demo/thunder.webm', '/audio/demo/thunder.m4a'] },
    { id: 'cheers',  name: 'Applausi',  src: ['/audio/demo/cheers.webm',  '/audio/demo/cheers.m4a'] }
  ]
};

/**
 * Registro licenze degli asset (CC0/CC-BY). Compilare con fonte reale.
 * @type {{file: string, source: string, license: string, author?: string}[]}
 */
export const licenses = [];
