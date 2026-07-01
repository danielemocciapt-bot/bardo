/** @typedef {import('../types.js').AudioRef} AudioRef */
/** @typedef {import('../types.js').Scene} Scene */

let _seq = 0;
const defaultId = () => `u-${Date.now()}-${(_seq++).toString(36)}`;

/**
 * Assembla una scena custom (stessa shape di Scene, con custom:true) dai layer scelti.
 * La musica scelta è usata per tutte e tre le intensità (le tab sono nascoste per le custom).
 * @param {{name:string, cover:string, musicRef:AudioRef, ambientRefs?:AudioRef[], oneshotRefs?:AudioRef[]}} sel
 * @param {() => string} [idGen]
 * @returns {Scene}
 */
export function buildUserScene(sel, idGen = defaultId) {
  const { name, cover, musicRef, ambientRefs = [], oneshotRefs = [] } = sel;
  const track = { ...musicRef };
  return {
    id: idGen(),
    name,
    cover,
    custom: true,
    music: { explore: [track], combat: [track], victory: [track] },
    ambient: ambientRefs.map((r) => ({ ...r })),
    oneshots: oneshotRefs.map((r) => ({ ...r }))
  };
}
