/** @typedef {import('../types.js').Scene} Scene */

// Base path per il deploy (es. '/bardo/' su GitHub Pages, '/' in locale)
const B = import.meta.env.BASE_URL || '/';
const fmt = (base, name) => [`${B}audio/${base}/${name}.webm`, `${B}audio/${base}/${name}.m4a`];
const img = (id) => `${B}img/scenes/${id}.webp`;

/** @type {Scene[]} */
export const scenes = [
  {
    id: 'tavern',
    name: 'Taverna del Drago',
    cover: 'linear-gradient(160deg,#f3c98a,#b98a4a)',
    image: img('tavern'),
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
    image: img('forest'),
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
    image: img('city'),
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
    image: img('dungeon'),
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
  },
  {
    id: 'battle',
    name: 'Battaglia campale',
    cover: 'linear-gradient(160deg,#d98a6a,#8a3a2a)',
    image: img('battle'),
    music: { explore: [{ id: 'battle-explore', name: 'Fronte', src: fmt('battle', 'music'), loop: true }], combat: [], victory: [] },
    ambient: [{ id: 'warcries', name: 'Mischia', src: fmt('battle', 'warcries'), loop: true }],
    oneshots: [{ id: 'sword', name: 'Spade', src: fmt('battle', 'sword') }]
  },
  {
    id: 'inn',
    name: 'Locanda',
    cover: 'linear-gradient(160deg,#e8c48a,#a8763e)',
    image: img('inn'),
    music: { explore: [{ id: 'inn-explore', name: 'Focolare', src: fmt('inn', 'music'), loop: true }], combat: [], victory: [] },
    ambient: [{ id: 'hearth', name: 'Camino', src: fmt('inn', 'hearth'), loop: true }],
    oneshots: [{ id: 'mug', name: 'Boccale', src: fmt('inn', 'mug') }]
  },
  {
    id: 'harbor',
    name: 'Porto sul mare',
    cover: 'linear-gradient(160deg,#8ec5d6,#3a7a9a)',
    image: img('harbor'),
    music: { explore: [{ id: 'harbor-explore', name: 'Marea', src: fmt('harbor', 'music'), loop: true }], combat: [], victory: [] },
    ambient: [{ id: 'waves', name: 'Onde', src: fmt('harbor', 'waves'), loop: true }],
    oneshots: [{ id: 'gull', name: 'Gabbiano', src: fmt('harbor', 'gull') }]
  },
  {
    id: 'temple',
    name: 'Tempio in rovina',
    cover: 'linear-gradient(160deg,#cdbfa0,#7a6a4a)',
    image: img('temple'),
    music: { explore: [{ id: 'temple-explore', name: 'Sacrario', src: fmt('temple', 'music'), loop: true }], combat: [], victory: [] },
    ambient: [{ id: 'chant', name: 'Eco', src: fmt('temple', 'chant'), loop: true }],
    oneshots: [{ id: 'gong', name: 'Gong', src: fmt('temple', 'gong') }]
  },
  {
    id: 'mountains',
    name: 'Montagne innevate',
    cover: 'linear-gradient(160deg,#cfe0ea,#7a90a8)',
    image: img('mountains'),
    music: { explore: [{ id: 'mountains-explore', name: 'Vetta', src: fmt('mountains', 'music'), loop: true }], combat: [], victory: [] },
    ambient: [{ id: 'gale', name: 'Bufera', src: fmt('mountains', 'gale'), loop: true }],
    oneshots: [{ id: 'rockfall', name: 'Frana', src: fmt('mountains', 'rockfall') }]
  },
  {
    id: 'swamp',
    name: 'Palude',
    cover: 'linear-gradient(160deg,#8a9a6a,#3a4a2a)',
    image: img('swamp'),
    music: { explore: [{ id: 'swamp-explore', name: 'Acquitrino', src: fmt('swamp', 'music'), loop: true }], combat: [], victory: [] },
    ambient: [{ id: 'frogs', name: 'Rane', src: fmt('swamp', 'frogs'), loop: true }],
    oneshots: [{ id: 'splash', name: 'Tonfo', src: fmt('swamp', 'splash') }]
  },
  {
    id: 'graveyard',
    name: 'Cimitero',
    cover: 'linear-gradient(160deg,#9a9aa8,#4a4a58)',
    image: img('graveyard'),
    music: { explore: [{ id: 'graveyard-explore', name: 'Requiem', src: fmt('graveyard', 'music'), loop: true }], combat: [], victory: [] },
    ambient: [{ id: 'moan', name: 'Lamento', src: fmt('graveyard', 'moan'), loop: true }],
    oneshots: [{ id: 'crow', name: 'Corvo', src: fmt('graveyard', 'crow') }]
  },
  {
    id: 'cave',
    name: 'Caverna',
    cover: 'linear-gradient(160deg,#8a7a6a,#3a2f28)',
    image: img('cave'),
    music: { explore: [{ id: 'cave-explore', name: 'Cunicolo', src: fmt('cave', 'music'), loop: true }], combat: [], victory: [] },
    ambient: [{ id: 'echo', name: 'Eco', src: fmt('cave', 'echo'), loop: true }],
    oneshots: [{ id: 'pickaxe', name: 'Piccone', src: fmt('cave', 'pickaxe') }]
  }
];

/** @param {string} id @returns {Scene|undefined} */
export const getScene = (id) => scenes.find((s) => s.id === id);

/** Prima scena, usata come default in test e avvio. */
export const demoScene = scenes[0];
