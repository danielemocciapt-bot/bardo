/**
 * @typedef {Object} AudioRef
 * @property {string} id
 * @property {string} name
 * @property {string[]} src     // url candidati (es. ['/audio/demo/x.webm','/audio/demo/x.m4a'])
 * @property {boolean} [loop]
 */

/**
 * @typedef {Object} Scene
 * @property {string} id
 * @property {string} name
 * @property {string} cover        // gradiente CSS (fallback / scene custom)
 * @property {string} [image]      // path illustrazione (scene di libreria)
 * @property {boolean} [custom]    // true per le scene create dall'utente
 * @property {{explore: AudioRef[], combat: AudioRef[], victory: AudioRef[]}} music  // combat/victory vuoti = scena semplice
 * @property {AudioRef[]} ambient
 * @property {AudioRef[]} oneshots
 */

export {};
