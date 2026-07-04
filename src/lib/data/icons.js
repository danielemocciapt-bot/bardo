/**
 * Icona (emoji) per un effetto one-shot, derivata dal nome-file del suono.
 * Le scene riusano gli stessi file → il basename identifica il tipo di suono.
 */
const ONESHOT_ICONS = {
  door: '🚪', twig: '🌿', bell: '🔔', chain: '⛓️', sword: '⚔️', mug: '🍺',
  gull: '🐦', gong: '🥁', rockfall: '🪨', splash: '💦', crow: '🐦‍⬛', pickaxe: '⛏️',
  laser: '🔫', glitch: '⚡', alarm: '🚨', scream: '😱', clang: '🔩', heartbeat: '💓',
  radiobeep: '📡', airlock: '💨', creature: '👾'
};

/** @param {{src?: string[]}} ref @returns {string} emoji (fallback ✨) */
export function oneshotIcon(ref) {
  const src = ref?.src?.[0] || '';
  const m = src.match(/\/([^/]+)\.(?:webm|m4a)(?:\?|$)/);
  return (m && ONESHOT_ICONS[m[1]]) || '✨';
}
