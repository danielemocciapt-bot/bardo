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
 * @property {string} cover        // gradiente CSS o percorso illustrazione, usato da tessere/NowPlaying
 * @property {{explore: AudioRef[], combat: AudioRef[], victory: AudioRef[]}} music
 * @property {AudioRef[]} ambient
 * @property {AudioRef[]} oneshots
 */

export {};
