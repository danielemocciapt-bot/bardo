/** @typedef {import('../types.js').Scene} Scene */

const fmt = (base, name) => [`/audio/${base}/${name}.webm`, `/audio/${base}/${name}.m4a`];

/** @type {Scene[]} */
export const scenes = [
  {
    id: 'tavern',
    name: 'Taverna del Drago',
    cover: 'linear-gradient(160deg,#f3c98a,#b98a4a)',
    music: {
      explore: [{ id: 'tavern-explore', name: 'Calma', src: fmt('tavern', 'explore'), loop: true }],
      combat:  [{ id: 'tavern-combat',  name: 'Rissa', src: fmt('tavern', 'combat'),  loop: true }],
      victory: [{ id: 'tavern-victory', name: 'Brindisi', src: fmt('tavern', 'victory'), loop: true }]
    },
    ambient: [
      { id: 'crowd', name: 'Brusio', src: fmt('tavern', 'crowd'), loop: true }
    ],
    oneshots: [
      { id: 'door', name: 'Porta', src: fmt('tavern', 'door') }
    ]
  },
  {
    id: 'forest',
    name: 'Foresta Antica',
    cover: 'linear-gradient(160deg,#a9d18a,#6fa15a)',
    music: {
      explore: [{ id: 'forest-explore', name: 'Sentiero', src: fmt('forest', 'explore'), loop: true }],
      combat:  [{ id: 'forest-combat',  name: 'Agguato',  src: fmt('forest', 'combat'),  loop: true }],
      victory: [{ id: 'forest-victory', name: 'Radura',   src: fmt('forest', 'victory'), loop: true }]
    },
    ambient: [
      { id: 'wind', name: 'Vento', src: fmt('forest', 'wind'), loop: true }
    ],
    oneshots: [
      { id: 'twig', name: 'Ramo', src: fmt('forest', 'twig') }
    ]
  },
  {
    id: 'city',
    name: 'Città Reale',
    cover: 'linear-gradient(160deg,#8fa6d1,#5d6fa1)',
    music: {
      explore: [{ id: 'city-explore', name: 'Vie', src: fmt('city', 'explore'), loop: true }],
      combat:  [{ id: 'city-combat',  name: 'Guardie', src: fmt('city', 'combat'), loop: true }],
      victory: [{ id: 'city-victory', name: 'Corte', src: fmt('city', 'victory'), loop: true }]
    },
    ambient: [
      { id: 'market', name: 'Mercato', src: fmt('city', 'market'), loop: true }
    ],
    oneshots: [
      { id: 'bell', name: 'Campana', src: fmt('city', 'bell') }
    ]
  },
  {
    id: 'dungeon',
    name: 'Sotterranei',
    cover: 'linear-gradient(160deg,#6b5563,#3a2c38)',
    music: {
      explore: [{ id: 'dungeon-explore', name: 'Cripta', src: fmt('dungeon', 'explore'), loop: true }],
      combat:  [{ id: 'dungeon-combat',  name: 'Orrore', src: fmt('dungeon', 'combat'), loop: true }],
      victory: [{ id: 'dungeon-victory', name: 'Tesoro', src: fmt('dungeon', 'victory'), loop: true }]
    },
    ambient: [
      { id: 'drip', name: 'Gocce', src: fmt('dungeon', 'drip'), loop: true }
    ],
    oneshots: [
      { id: 'chain', name: 'Catene', src: fmt('dungeon', 'chain') }
    ]
  }
];

/** @param {string} id @returns {Scene|undefined} */
export const getScene = (id) => scenes.find((s) => s.id === id);

/** Prima scena, usata come default in test e avvio. */
export const demoScene = scenes[0];
