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
    category: 'fantasy',
    music: {
      explore: [{ id: 'tavern-explore', name: 'Calma', src: fmt('tavern', 'explore'), loop: true }],
      combat:  [{ id: 'tavern-combat',  name: 'Rissa', src: fmt('tavern', 'combat'),  loop: true }],
      victory: [{ id: 'tavern-victory', name: 'Brindisi', src: fmt('tavern', 'victory'), loop: false }]
    },
    ambient: [
      { id: 'crowd', name: 'Brusio', src: fmt('tavern', 'crowd'), loop: true },
      { id: 'tavern-hearth', name: 'Camino', src: fmt('inn', 'hearth'), loop: true },
      { id: 'tavern-market', name: 'Vociare', src: fmt('city', 'market'), loop: true },
      { id: 'tavern-warcries', name: 'Baldoria', src: fmt('battle', 'warcries'), loop: true }
    ],
    oneshots: [
      { id: 'door', name: 'Porta', src: fmt('tavern', 'door') },
      { id: 'tavern-mug', name: 'Boccale', src: fmt('inn', 'mug') },
      { id: 'tavern-bell', name: 'Campanello', src: fmt('city', 'bell') },
      { id: 'tavern-sword', name: 'Rissa', src: fmt('battle', 'sword') },
      { id: 'tavern-clang', name: 'Fracasso', src: fmt('asylum', 'clang') }
    ]
  },
  {
    id: 'forest',
    name: 'Foresta Antica',
    cover: 'linear-gradient(160deg,#a9d18a,#6fa15a)',
    image: img('forest'),
    category: 'fantasy',
    music: {
      explore: [{ id: 'forest-explore', name: 'Sentiero', src: fmt('forest', 'explore'), loop: true }],
      combat:  [{ id: 'forest-combat',  name: 'Agguato',  src: fmt('forest', 'combat'),  loop: true }],
      victory: [{ id: 'forest-victory', name: 'Radura',   src: fmt('forest', 'victory'), loop: false }]
    },
    ambient: [
      { id: 'wind', name: 'Vento', src: fmt('forest', 'wind'), loop: true },
      { id: 'forest-frogs', name: 'Stagno', src: fmt('swamp', 'frogs'), loop: true },
      { id: 'forest-echo', name: 'Fruscio', src: fmt('cave', 'echo'), loop: true },
      { id: 'forest-drip', name: 'Pioggia', src: fmt('dungeon', 'drip'), loop: true }
    ],
    oneshots: [
      { id: 'twig', name: 'Ramo', src: fmt('forest', 'twig') },
      { id: 'forest-crow', name: 'Corvo', src: fmt('graveyard', 'crow') },
      { id: 'forest-splash', name: 'Ruscello', src: fmt('swamp', 'splash') },
      { id: 'forest-creature', name: 'Bestia', src: fmt('alien', 'creature') },
      { id: 'forest-rockfall', name: 'Sasso', src: fmt('mountains', 'rockfall') }
    ]
  },
  {
    id: 'city',
    name: 'Città Reale',
    cover: 'linear-gradient(160deg,#8fa6d1,#5d6fa1)',
    image: img('city'),
    category: 'fantasy',
    music: {
      explore: [{ id: 'city-explore', name: 'Vie', src: fmt('city', 'explore'), loop: true }],
      combat:  [{ id: 'city-combat',  name: 'Guardie', src: fmt('city', 'combat'), loop: true }],
      victory: [{ id: 'city-victory', name: 'Corte', src: fmt('city', 'victory'), loop: false }]
    },
    ambient: [
      { id: 'market', name: 'Mercato', src: fmt('city', 'market'), loop: true },
      { id: 'city-crowd', name: 'Folla', src: fmt('tavern', 'crowd'), loop: true },
      { id: 'city-hearth', name: 'Fucina', src: fmt('inn', 'hearth'), loop: true },
      { id: 'city-wind', name: 'Vicoli', src: fmt('forest', 'wind'), loop: true }
    ],
    oneshots: [
      { id: 'bell', name: 'Campana', src: fmt('city', 'bell') },
      { id: 'city-door', name: 'Portone', src: fmt('tavern', 'door') },
      { id: 'city-pigeon', name: 'Piccioni', src: fmt('city', 'pigeon') },
      { id: 'city-clang', name: 'Incudine', src: fmt('asylum', 'clang') },
      { id: 'city-sword', name: 'Guardie', src: fmt('battle', 'sword') }
    ]
  },
  {
    id: 'dungeon',
    name: 'Sotterranei',
    cover: 'linear-gradient(160deg,#6b5563,#3a2c38)',
    image: img('dungeon'),
    category: 'fantasy',
    music: {
      explore: [{ id: 'dungeon-explore', name: 'Cripta', src: fmt('dungeon', 'explore'), loop: true }],
      combat:  [{ id: 'dungeon-combat',  name: 'Orrore', src: fmt('dungeon', 'combat'), loop: true }],
      victory: [{ id: 'dungeon-victory', name: 'Tesoro', src: fmt('dungeon', 'victory'), loop: false }]
    },
    ambient: [
      { id: 'drip', name: 'Gocce', src: fmt('dungeon', 'drip'), loop: true },
      { id: 'dungeon-echo', name: 'Eco', src: fmt('cave', 'echo'), loop: true },
      { id: 'dungeon-moan', name: 'Lamenti', src: fmt('graveyard', 'moan'), loop: true },
      { id: 'dungeon-drone', name: 'Presenza', src: fmt('ritual', 'drone'), loop: true }
    ],
    oneshots: [
      { id: 'chain', name: 'Catene', src: fmt('dungeon', 'chain') },
      { id: 'dungeon-door', name: 'Cancello', src: fmt('tavern', 'door') },
      { id: 'dungeon-clang', name: 'Ferro', src: fmt('asylum', 'clang') },
      { id: 'dungeon-rockfall', name: 'Crollo', src: fmt('mountains', 'rockfall') },
      { id: 'dungeon-scream', name: 'Urlo', src: fmt('haunted', 'scream') }
    ]
  },
  {
    id: 'battle',
    name: 'Battaglia campale',
    cover: 'linear-gradient(160deg,#d98a6a,#8a3a2a)',
    image: img('battle'),
    category: 'fantasy',
    music: { explore: [{ id: 'battle-explore', name: 'Fronte', src: fmt('battle', 'music'), loop: true }], combat: [{ id: 'battle-combat', name: 'Combattimento', src: fmt('battle', 'combat'), loop: true }], victory: [{ id: 'battle-victory', name: 'Vittoria', src: fmt('battle', 'victory'), loop: false }] },
    ambient: [
      { id: 'warcries', name: 'Mischia', src: fmt('battle', 'warcries'), loop: true },
      { id: 'battle-crowd', name: 'Esercito', src: fmt('tavern', 'crowd'), loop: true },
      { id: 'battle-drone', name: 'Tensione', src: fmt('ritual', 'drone'), loop: true },
      { id: 'battle-wind', name: 'Vento', src: fmt('forest', 'wind'), loop: true }
    ],
    oneshots: [
      { id: 'sword', name: 'Spade', src: fmt('battle', 'sword') },
      { id: 'battle-clang', name: 'Scudo', src: fmt('asylum', 'clang') },
      { id: 'battle-gong', name: 'Corno', src: fmt('temple', 'gong') },
      { id: 'battle-rockfall', name: 'Catapulta', src: fmt('mountains', 'rockfall') },
      { id: 'battle-crow', name: 'Corvi', src: fmt('graveyard', 'crow') }
    ]
  },
  {
    id: 'inn',
    name: 'Locanda',
    cover: 'linear-gradient(160deg,#e8c48a,#a8763e)',
    image: img('inn'),
    category: 'fantasy',
    music: { explore: [{ id: 'inn-explore', name: 'Focolare', src: fmt('inn', 'music'), loop: true }], combat: [{ id: 'inn-combat', name: 'Combattimento', src: fmt('inn', 'combat'), loop: true }], victory: [{ id: 'inn-victory', name: 'Vittoria', src: fmt('inn', 'victory'), loop: false }] },
    ambient: [
      { id: 'hearth', name: 'Camino', src: fmt('inn', 'hearth'), loop: true },
      { id: 'inn-crowd', name: 'Avventori', src: fmt('tavern', 'crowd'), loop: true },
      { id: 'inn-market', name: 'Cucina', src: fmt('city', 'market'), loop: true },
      { id: 'inn-drip', name: 'Pioggia', src: fmt('dungeon', 'drip'), loop: true }
    ],
    oneshots: [
      { id: 'mug', name: 'Boccale', src: fmt('inn', 'mug') },
      { id: 'inn-door', name: 'Porta', src: fmt('tavern', 'door') },
      { id: 'inn-bell', name: 'Campanello', src: fmt('city', 'bell') },
      { id: 'inn-clang', name: 'Stoviglie', src: fmt('asylum', 'clang') },
      { id: 'inn-splash', name: 'Versata', src: fmt('swamp', 'splash') }
    ]
  },
  {
    id: 'harbor',
    name: 'Porto sul mare',
    cover: 'linear-gradient(160deg,#8ec5d6,#3a7a9a)',
    image: img('harbor'),
    category: 'fantasy',
    music: { explore: [{ id: 'harbor-explore', name: 'Marea', src: fmt('harbor', 'music'), loop: true }], combat: [{ id: 'harbor-combat', name: 'Combattimento', src: fmt('harbor', 'combat'), loop: true }], victory: [{ id: 'harbor-victory', name: 'Vittoria', src: fmt('harbor', 'victory'), loop: false }] },
    ambient: [
      { id: 'waves', name: 'Onde', src: fmt('harbor', 'waves'), loop: true },
      { id: 'harbor-crowd', name: 'Banchina', src: fmt('tavern', 'crowd'), loop: true },
      { id: 'harbor-wind', name: 'Vento', src: fmt('forest', 'wind'), loop: true },
      { id: 'harbor-market', name: 'Bancarelle', src: fmt('city', 'market'), loop: true }
    ],
    oneshots: [
      { id: 'gull', name: 'Gabbiano', src: fmt('harbor', 'gull') },
      { id: 'harbor-bell', name: 'Campana', src: fmt('city', 'bell') },
      { id: 'harbor-splash', name: 'Tuffo', src: fmt('swamp', 'splash') },
      { id: 'harbor-chain', name: 'Ancora', src: fmt('dungeon', 'chain') },
      { id: 'harbor-clang', name: 'Attracco', src: fmt('asylum', 'clang') }
    ]
  },
  {
    id: 'temple',
    name: 'Tempio in rovina',
    cover: 'linear-gradient(160deg,#cdbfa0,#7a6a4a)',
    image: img('temple'),
    category: 'fantasy',
    music: { explore: [{ id: 'temple-explore', name: 'Sacrario', src: fmt('temple', 'music'), loop: true }], combat: [{ id: 'temple-combat', name: 'Combattimento', src: fmt('temple', 'combat'), loop: true }], victory: [{ id: 'temple-victory', name: 'Vittoria', src: fmt('temple', 'victory'), loop: false }] },
    ambient: [
      { id: 'chant', name: 'Eco', src: fmt('temple', 'chant'), loop: true },
      { id: 'temple-echo', name: 'Riverbero', src: fmt('cave', 'echo'), loop: true },
      { id: 'temple-wind', name: 'Spiffero', src: fmt('forest', 'wind'), loop: true },
      { id: 'temple-drone', name: 'Presenza', src: fmt('ritual', 'drone'), loop: true }
    ],
    oneshots: [
      { id: 'gong', name: 'Gong', src: fmt('temple', 'gong') },
      { id: 'temple-bell', name: 'Campana', src: fmt('city', 'bell') },
      { id: 'temple-crow', name: 'Corvo', src: fmt('graveyard', 'crow') },
      { id: 'temple-door', name: 'Portone', src: fmt('tavern', 'door') },
      { id: 'temple-chain', name: 'Catene', src: fmt('dungeon', 'chain') }
    ]
  },
  {
    id: 'mountains',
    name: 'Montagne innevate',
    cover: 'linear-gradient(160deg,#cfe0ea,#7a90a8)',
    image: img('mountains'),
    category: 'fantasy',
    music: { explore: [{ id: 'mountains-explore', name: 'Vetta', src: fmt('mountains', 'music'), loop: true }], combat: [{ id: 'mountains-combat', name: 'Combattimento', src: fmt('mountains', 'combat'), loop: true }], victory: [{ id: 'mountains-victory', name: 'Vittoria', src: fmt('mountains', 'victory'), loop: false }] },
    ambient: [
      { id: 'gale', name: 'Bufera', src: fmt('mountains', 'gale'), loop: true },
      { id: 'mountains-wind', name: 'Vento', src: fmt('forest', 'wind'), loop: true },
      { id: 'mountains-echo', name: 'Eco', src: fmt('cave', 'echo'), loop: true },
      { id: 'mountains-drip', name: 'Disgelo', src: fmt('dungeon', 'drip'), loop: true }
    ],
    oneshots: [
      { id: 'rockfall', name: 'Frana', src: fmt('mountains', 'rockfall') },
      { id: 'mountains-crow', name: 'Aquila', src: fmt('graveyard', 'crow') },
      { id: 'mountains-pickaxe', name: 'Piccozza', src: fmt('cave', 'pickaxe') },
      { id: 'mountains-creature', name: 'Bestia', src: fmt('alien', 'creature') },
      { id: 'mountains-clang', name: 'Ramponi', src: fmt('asylum', 'clang') }
    ]
  },
  {
    id: 'swamp',
    name: 'Palude',
    cover: 'linear-gradient(160deg,#8a9a6a,#3a4a2a)',
    image: img('swamp'),
    category: 'fantasy',
    music: { explore: [{ id: 'swamp-explore', name: 'Acquitrino', src: fmt('swamp', 'music'), loop: true }], combat: [{ id: 'swamp-combat', name: 'Combattimento', src: fmt('swamp', 'combat'), loop: true }], victory: [{ id: 'swamp-victory', name: 'Vittoria', src: fmt('swamp', 'victory'), loop: false }] },
    ambient: [
      { id: 'frogs', name: 'Rane', src: fmt('swamp', 'frogs'), loop: true },
      { id: 'swamp-wind', name: 'Canneto', src: fmt('forest', 'wind'), loop: true },
      { id: 'swamp-drip', name: 'Gocce', src: fmt('dungeon', 'drip'), loop: true },
      { id: 'swamp-moan', name: 'Nebbia', src: fmt('graveyard', 'moan'), loop: true }
    ],
    oneshots: [
      { id: 'splash', name: 'Tonfo', src: fmt('swamp', 'splash') },
      { id: 'swamp-crow', name: 'Uccello', src: fmt('graveyard', 'crow') },
      { id: 'swamp-twig', name: 'Ramo', src: fmt('forest', 'twig') },
      { id: 'swamp-creature', name: 'Creatura', src: fmt('alien', 'creature') },
      { id: 'swamp-gull', name: 'Airone', src: fmt('harbor', 'gull') }
    ]
  },
  {
    id: 'graveyard',
    name: 'Cimitero',
    cover: 'linear-gradient(160deg,#9a9aa8,#4a4a58)',
    image: img('graveyard'),
    category: 'fantasy',
    music: { explore: [{ id: 'graveyard-explore', name: 'Requiem', src: fmt('graveyard', 'music'), loop: true }], combat: [{ id: 'graveyard-combat', name: 'Combattimento', src: fmt('graveyard', 'combat'), loop: true }], victory: [{ id: 'graveyard-victory', name: 'Vittoria', src: fmt('graveyard', 'victory'), loop: false }] },
    ambient: [
      { id: 'moan', name: 'Lamento', src: fmt('graveyard', 'moan'), loop: true },
      { id: 'graveyard-wind', name: 'Vento', src: fmt('forest', 'wind'), loop: true },
      { id: 'graveyard-drone', name: 'Presenza', src: fmt('ritual', 'drone'), loop: true },
      { id: 'graveyard-creaks', name: 'Scricchiolii', src: fmt('haunted', 'creaks'), loop: true }
    ],
    oneshots: [
      { id: 'crow', name: 'Corvo', src: fmt('graveyard', 'crow') },
      { id: 'graveyard-bell', name: 'Rintocco', src: fmt('city', 'bell') },
      { id: 'graveyard-chain', name: 'Catene', src: fmt('dungeon', 'chain') },
      { id: 'graveyard-scream', name: 'Grido', src: fmt('haunted', 'scream') },
      { id: 'graveyard-pickaxe', name: 'Scavo', src: fmt('cave', 'pickaxe') }
    ]
  },
  {
    id: 'cave',
    name: 'Caverna',
    cover: 'linear-gradient(160deg,#8a7a6a,#3a2f28)',
    image: img('cave'),
    category: 'fantasy',
    music: { explore: [{ id: 'cave-explore', name: 'Cunicolo', src: fmt('cave', 'music'), loop: true }], combat: [{ id: 'cave-combat', name: 'Combattimento', src: fmt('cave', 'combat'), loop: true }], victory: [{ id: 'cave-victory', name: 'Vittoria', src: fmt('cave', 'victory'), loop: false }] },
    ambient: [
      { id: 'echo', name: 'Eco', src: fmt('cave', 'echo'), loop: true },
      { id: 'cave-drip', name: 'Gocce', src: fmt('dungeon', 'drip'), loop: true },
      { id: 'cave-wind', name: 'Corrente', src: fmt('forest', 'wind'), loop: true },
      { id: 'cave-drone', name: 'Rimbombo', src: fmt('ritual', 'drone'), loop: true }
    ],
    oneshots: [
      { id: 'pickaxe', name: 'Piccone', src: fmt('cave', 'pickaxe') },
      { id: 'cave-rockfall', name: 'Frana', src: fmt('mountains', 'rockfall') },
      { id: 'cave-splash', name: 'Pozza', src: fmt('swamp', 'splash') },
      { id: 'cave-creature', name: 'Creatura', src: fmt('alien', 'creature') },
      { id: 'cave-chain', name: 'Catene', src: fmt('dungeon', 'chain') }
    ]
  },
  {
    id: 'starship', name: 'Nave stellare', category: 'scifi',
    cover: 'linear-gradient(160deg,#4a90c0,#12314a)', image: img('starship'),
    music: { explore: [{ id: 'starship-explore', name: 'Ponte', src: fmt('starship', 'music'), loop: true }], combat: [{ id: 'starship-combat', name: 'Combattimento', src: fmt('starship', 'combat'), loop: true }], victory: [{ id: 'starship-victory', name: 'Vittoria', src: fmt('starship', 'victory'), loop: false }] },
    ambient: [
      { id: 'enginehum', name: 'Motori', src: fmt('starship', 'enginehum'), loop: true },
      { id: 'starship-machinebeep', name: 'Console', src: fmt('lab', 'machinebeep'), loop: true },
      { id: 'starship-stationhum', name: 'Ventilazione', src: fmt('station', 'stationhum'), loop: true },
      { id: 'starship-cosmicdrone', name: 'Cosmo', src: fmt('deepspace', 'cosmicdrone'), loop: true }
    ],
    oneshots: [
      { id: 'laser', name: 'Laser', src: fmt('starship', 'laser') },
      { id: 'starship-airlock', name: 'Portello', src: fmt('station', 'airlock') },
      { id: 'starship-alarm', name: 'Allarme', src: fmt('lab', 'alarm') },
      { id: 'starship-glitch', name: 'Interferenza', src: fmt('cyber', 'glitch') },
      { id: 'starship-radiobeep', name: 'Comunicazione', src: fmt('deepspace', 'radiobeep') }
    ]
  },
  {
    id: 'cyber', name: 'Città cyberpunk', category: 'scifi',
    cover: 'linear-gradient(160deg,#d05aa8,#3a1a5a)', image: img('cyber'),
    music: { explore: [{ id: 'cyber-explore', name: 'Neon', src: fmt('cyber', 'music'), loop: true }], combat: [{ id: 'cyber-combat', name: 'Combattimento', src: fmt('cyber', 'combat'), loop: true }], victory: [{ id: 'cyber-victory', name: 'Vittoria', src: fmt('cyber', 'victory'), loop: false }] },
    ambient: [
      { id: 'neonrain', name: 'Pioggia neon', src: fmt('cyber', 'neonrain'), loop: true },
      { id: 'cyber-crowd', name: 'Folla', src: fmt('tavern', 'crowd'), loop: true },
      { id: 'cyber-machinebeep', name: 'Server', src: fmt('lab', 'machinebeep'), loop: true },
      { id: 'cyber-enginehum', name: 'Traffico', src: fmt('starship', 'enginehum'), loop: true }
    ],
    oneshots: [
      { id: 'glitch', name: 'Glitch', src: fmt('cyber', 'glitch') },
      { id: 'cyber-laser', name: 'Colpo', src: fmt('starship', 'laser') },
      { id: 'cyber-alarm', name: 'Sirena', src: fmt('lab', 'alarm') },
      { id: 'cyber-radiobeep', name: 'Trasmissione', src: fmt('deepspace', 'radiobeep') },
      { id: 'cyber-airlock', name: 'Porta', src: fmt('station', 'airlock') }
    ]
  },
  {
    id: 'lab', name: 'Laboratorio', category: 'scifi',
    cover: 'linear-gradient(160deg,#7ab0d0,#25546e)', image: img('lab'),
    music: { explore: [{ id: 'lab-explore', name: 'Reparto', src: fmt('lab', 'music'), loop: true }], combat: [{ id: 'lab-combat', name: 'Combattimento', src: fmt('lab', 'combat'), loop: true }], victory: [{ id: 'lab-victory', name: 'Vittoria', src: fmt('lab', 'victory'), loop: false }] },
    ambient: [
      { id: 'machinebeep', name: 'Macchinari', src: fmt('lab', 'machinebeep'), loop: true },
      { id: 'lab-enginehum', name: 'Reattore', src: fmt('starship', 'enginehum'), loop: true },
      { id: 'lab-drone', name: 'Ronzio', src: fmt('ritual', 'drone'), loop: true },
      { id: 'lab-stationhum', name: 'Ventilazione', src: fmt('station', 'stationhum'), loop: true }
    ],
    oneshots: [
      { id: 'alarm', name: 'Allarme', src: fmt('lab', 'alarm') },
      { id: 'lab-glitch', name: 'Scarica', src: fmt('cyber', 'glitch') },
      { id: 'lab-airlock', name: 'Portello', src: fmt('station', 'airlock') },
      { id: 'lab-laser', name: 'Raggio', src: fmt('starship', 'laser') },
      { id: 'lab-radiobeep', name: 'Segnale', src: fmt('deepspace', 'radiobeep') }
    ]
  },
  {
    id: 'haunted', name: 'Villa infestata', category: 'horror',
    cover: 'linear-gradient(160deg,#6a5a7a,#2a1f38)', image: img('haunted'),
    music: { explore: [{ id: 'haunted-explore', name: 'Presenza', src: fmt('haunted', 'music'), loop: true }], combat: [{ id: 'haunted-combat', name: 'Combattimento', src: fmt('haunted', 'combat'), loop: true }], victory: [{ id: 'haunted-victory', name: 'Vittoria', src: fmt('haunted', 'victory'), loop: false }] },
    ambient: [
      { id: 'creaks', name: 'Scricchiolii', src: fmt('haunted', 'creaks'), loop: true },
      { id: 'haunted-moan', name: 'Lamenti', src: fmt('graveyard', 'moan'), loop: true },
      { id: 'haunted-drone', name: 'Presenza', src: fmt('ritual', 'drone'), loop: true },
      { id: 'haunted-asylumamb', name: 'Sussurri', src: fmt('asylum', 'asylumamb'), loop: true }
    ],
    oneshots: [
      { id: 'scream', name: 'Urlo', src: fmt('haunted', 'scream') },
      { id: 'haunted-chain', name: 'Catene', src: fmt('dungeon', 'chain') },
      { id: 'haunted-heartbeat', name: 'Battito', src: fmt('ritual', 'heartbeat') },
      { id: 'haunted-door', name: 'Porta', src: fmt('tavern', 'door') },
      { id: 'haunted-crow', name: 'Corvo', src: fmt('graveyard', 'crow') }
    ]
  },
  {
    id: 'asylum', name: 'Manicomio', category: 'horror',
    cover: 'linear-gradient(160deg,#8a9a90,#2e3a34)', image: img('asylum'),
    music: { explore: [{ id: 'asylum-explore', name: 'Corsia', src: fmt('asylum', 'music'), loop: true }], combat: [{ id: 'asylum-combat', name: 'Combattimento', src: fmt('asylum', 'combat'), loop: true }], victory: [{ id: 'asylum-victory', name: 'Vittoria', src: fmt('asylum', 'victory'), loop: false }] },
    ambient: [
      { id: 'asylumamb', name: 'Sussurri', src: fmt('asylum', 'asylumamb'), loop: true },
      { id: 'asylum-creaks', name: 'Scricchiolii', src: fmt('haunted', 'creaks'), loop: true },
      { id: 'asylum-drone', name: 'Ronzio', src: fmt('ritual', 'drone'), loop: true },
      { id: 'asylum-moan', name: 'Lamenti', src: fmt('graveyard', 'moan'), loop: true }
    ],
    oneshots: [
      { id: 'clang', name: 'Clangore', src: fmt('asylum', 'clang') },
      { id: 'asylum-scream', name: 'Urlo', src: fmt('haunted', 'scream') },
      { id: 'asylum-heartbeat', name: 'Battito', src: fmt('ritual', 'heartbeat') },
      { id: 'asylum-door', name: 'Cella', src: fmt('tavern', 'door') },
      { id: 'asylum-chain', name: 'Catene', src: fmt('dungeon', 'chain') }
    ]
  },
  {
    id: 'ritual', name: 'Rito oscuro', category: 'horror',
    cover: 'linear-gradient(160deg,#a0403a,#3a1015)', image: img('ritual'),
    music: { explore: [{ id: 'ritual-explore', name: 'Rituale', src: fmt('ritual', 'music'), loop: true }], combat: [{ id: 'ritual-combat', name: 'Combattimento', src: fmt('ritual', 'combat'), loop: true }], victory: [{ id: 'ritual-victory', name: 'Vittoria', src: fmt('ritual', 'victory'), loop: false }] },
    ambient: [
      { id: 'drone', name: 'Ronzio', src: fmt('ritual', 'drone'), loop: true },
      { id: 'ritual-chant', name: 'Cantilena', src: fmt('temple', 'chant'), loop: true },
      { id: 'ritual-moan', name: 'Sussurri', src: fmt('graveyard', 'moan'), loop: true },
      { id: 'ritual-asylumamb', name: 'Voci', src: fmt('asylum', 'asylumamb'), loop: true }
    ],
    oneshots: [
      { id: 'heartbeat', name: 'Battito', src: fmt('ritual', 'heartbeat') },
      { id: 'ritual-gong', name: 'Rintocco', src: fmt('temple', 'gong') },
      { id: 'ritual-scream', name: 'Grido', src: fmt('haunted', 'scream') },
      { id: 'ritual-bell', name: 'Campana a morto', src: fmt('city', 'bell') },
      { id: 'ritual-chain', name: 'Catene', src: fmt('dungeon', 'chain') }
    ]
  },
  {
    id: 'deepspace', name: 'Spazio profondo', category: 'space',
    cover: 'linear-gradient(160deg,#4a5aa8,#101030)', image: img('deepspace'),
    music: { explore: [{ id: 'deepspace-explore', name: 'Vuoto', src: fmt('deepspace', 'music'), loop: true }], combat: [{ id: 'deepspace-combat', name: 'Combattimento', src: fmt('deepspace', 'combat'), loop: true }], victory: [{ id: 'deepspace-victory', name: 'Vittoria', src: fmt('deepspace', 'victory'), loop: false }] },
    ambient: [
      { id: 'cosmicdrone', name: 'Cosmo', src: fmt('deepspace', 'cosmicdrone'), loop: true },
      { id: 'deepspace-stationhum', name: 'Riverbero', src: fmt('station', 'stationhum'), loop: true },
      { id: 'deepspace-drone', name: 'Vuoto', src: fmt('ritual', 'drone'), loop: true },
      { id: 'deepspace-machinebeep', name: 'Strumenti', src: fmt('lab', 'machinebeep'), loop: true }
    ],
    oneshots: [
      { id: 'radiobeep', name: 'Segnale', src: fmt('deepspace', 'radiobeep') },
      { id: 'deepspace-airlock', name: 'Portello', src: fmt('station', 'airlock') },
      { id: 'deepspace-alarm', name: 'Allarme', src: fmt('lab', 'alarm') },
      { id: 'deepspace-laser', name: 'Colpo', src: fmt('starship', 'laser') },
      { id: 'deepspace-glitch', name: 'Statica', src: fmt('cyber', 'glitch') }
    ]
  },
  {
    id: 'station', name: 'Stazione spaziale', category: 'space',
    cover: 'linear-gradient(160deg,#7a90b0,#2a3a55)', image: img('station'),
    music: { explore: [{ id: 'station-explore', name: 'Orbita', src: fmt('station', 'music'), loop: true }], combat: [{ id: 'station-combat', name: 'Combattimento', src: fmt('station', 'combat'), loop: true }], victory: [{ id: 'station-victory', name: 'Vittoria', src: fmt('station', 'victory'), loop: false }] },
    ambient: [
      { id: 'stationhum', name: 'Ronzio', src: fmt('station', 'stationhum'), loop: true },
      { id: 'station-machinebeep', name: 'Strumenti', src: fmt('lab', 'machinebeep'), loop: true },
      { id: 'station-cosmicdrone', name: 'Cosmo', src: fmt('deepspace', 'cosmicdrone'), loop: true },
      { id: 'station-enginehum', name: 'Motori', src: fmt('starship', 'enginehum'), loop: true }
    ],
    oneshots: [
      { id: 'airlock', name: 'Portello', src: fmt('station', 'airlock') },
      { id: 'station-alarm', name: 'Allarme', src: fmt('lab', 'alarm') },
      { id: 'station-radiobeep', name: 'Comunicazioni', src: fmt('deepspace', 'radiobeep') },
      { id: 'station-laser', name: 'Difese', src: fmt('starship', 'laser') },
      { id: 'station-glitch', name: 'Malfunzione', src: fmt('cyber', 'glitch') }
    ]
  },
  {
    id: 'alien', name: 'Pianeta alieno', category: 'space',
    cover: 'linear-gradient(160deg,#8ac07a,#3a2a5a)', image: img('alien'),
    music: { explore: [{ id: 'alien-explore', name: 'Ignoto', src: fmt('alien', 'music'), loop: true }], combat: [{ id: 'alien-combat', name: 'Combattimento', src: fmt('alien', 'combat'), loop: true }], victory: [{ id: 'alien-victory', name: 'Vittoria', src: fmt('alien', 'victory'), loop: false }] },
    ambient: [
      { id: 'alienwild', name: 'Fauna aliena', src: fmt('alien', 'alienwild'), loop: true },
      { id: 'alien-wind', name: 'Vento alieno', src: fmt('forest', 'wind'), loop: true },
      { id: 'alien-drone', name: 'Atmosfera', src: fmt('ritual', 'drone'), loop: true },
      { id: 'alien-cosmicdrone', name: 'Cielo alieno', src: fmt('deepspace', 'cosmicdrone'), loop: true }
    ],
    oneshots: [
      { id: 'creature', name: 'Creatura', src: fmt('alien', 'creature') },
      { id: 'alien-radiobeep', name: 'Scanner', src: fmt('deepspace', 'radiobeep') },
      { id: 'alien-splash', name: 'Melma', src: fmt('swamp', 'splash') },
      { id: 'alien-glitch', name: 'Anomalia', src: fmt('cyber', 'glitch') },
      { id: 'alien-alarm', name: 'Allerta', src: fmt('lab', 'alarm') }
    ]
  }
];

/** Categorie in ordine di visualizzazione: id -> etichetta. */
export const categories = [
  { id: 'fantasy', label: 'Fantasy' },
  { id: 'scifi', label: 'Sci-Fi' },
  { id: 'horror', label: 'Horror' },
  { id: 'space', label: 'Spazio' }
];

/** @param {string} id @returns {Scene|undefined} */
export const getScene = (id) => scenes.find((s) => s.id === id);

/** Prima scena, usata come default in test e avvio. */
export const demoScene = scenes[0];
