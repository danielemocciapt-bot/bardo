/** @typedef {import('../types.js').Scene} Scene */

const two = (id, base) => [`/audio/${base}/${id}.webm`, `/audio/${base}/${id}.m4a`];

/** @type {Scene[]} */
export const scenes = [
  {
    id: 'tavern',
    name: 'Taverna del Drago',
    cover: 'linear-gradient(160deg,#f3c98a,#b98a4a)',
    music: {
      explore: [{ id: 'tavern-explore', name: 'Calma', src: two('explore', 'tavern'), loop: true }],
      combat:  [{ id: 'tavern-combat',  name: 'Rissa', src: two('combat', 'tavern'),  loop: true }],
      victory: [{ id: 'tavern-victory', name: 'Brindisi', src: two('victory', 'tavern'), loop: true }]
    },
    ambient: [
      { id: 'crowd', name: 'Brusio', src: two('crowd', 'tavern'), loop: true },
      { id: 'fire',  name: 'Fuoco',  src: two('fire', 'tavern'),  loop: true }
    ],
    oneshots: [
      { id: 'door',   name: 'Porta',    src: two('door', 'tavern') },
      { id: 'cheers', name: 'Applausi', src: two('cheers', 'tavern') }
    ]
  },
  {
    id: 'forest',
    name: 'Foresta Antica',
    cover: 'linear-gradient(160deg,#a9d18a,#6fa15a)',
    music: {
      explore: [{ id: 'forest-explore', name: 'Sentiero', src: two('explore', 'forest'), loop: true }],
      combat:  [{ id: 'forest-combat',  name: 'Agguato',  src: two('combat', 'forest'),  loop: true }],
      victory: [{ id: 'forest-victory', name: 'Radura',   src: two('victory', 'forest'), loop: true }]
    },
    ambient: [
      { id: 'wind',  name: 'Vento',   src: two('wind', 'forest'),  loop: true },
      { id: 'birds', name: 'Uccelli', src: two('birds', 'forest'), loop: true }
    ],
    oneshots: [
      { id: 'twig', name: 'Ramo', src: two('twig', 'forest') },
      { id: 'owl',  name: 'Gufo', src: two('owl', 'forest') }
    ]
  },
  {
    id: 'city',
    name: 'Città Reale',
    cover: 'linear-gradient(160deg,#8fa6d1,#5d6fa1)',
    music: {
      explore: [{ id: 'city-explore', name: 'Vie', src: two('explore', 'city'), loop: true }],
      combat:  [{ id: 'city-combat',  name: 'Guardie', src: two('combat', 'city'), loop: true }],
      victory: [{ id: 'city-victory', name: 'Corte', src: two('victory', 'city'), loop: true }]
    },
    ambient: [
      { id: 'market', name: 'Mercato', src: two('market', 'city'), loop: true },
      { id: 'people', name: 'Folla',   src: two('people', 'city'), loop: true }
    ],
    oneshots: [
      { id: 'bell', name: 'Campana', src: two('bell', 'city') },
      { id: 'cart', name: 'Carro',   src: two('cart', 'city') }
    ]
  },
  {
    id: 'dungeon',
    name: 'Sotterranei',
    cover: 'linear-gradient(160deg,#6b5563,#3a2c38)',
    music: {
      explore: [{ id: 'dungeon-explore', name: 'Cripta', src: two('explore', 'dungeon'), loop: true }],
      combat:  [{ id: 'dungeon-combat',  name: 'Orrore', src: two('combat', 'dungeon'), loop: true }],
      victory: [{ id: 'dungeon-victory', name: 'Tesoro', src: two('victory', 'dungeon'), loop: true }]
    },
    ambient: [
      { id: 'drip', name: 'Gocce', src: two('drip', 'dungeon'), loop: true },
      { id: 'wind', name: 'Vento', src: two('wind', 'dungeon'), loop: true }
    ],
    oneshots: [
      { id: 'chain', name: 'Catene', src: two('chain', 'dungeon') },
      { id: 'growl', name: 'Ringhio', src: two('growl', 'dungeon') }
    ]
  }
];

/** @param {string} id @returns {Scene|undefined} */
export const getScene = (id) => scenes.find((s) => s.id === id);

/** Prima scena, usata come default in test e avvio. */
export const demoScene = scenes[0];
