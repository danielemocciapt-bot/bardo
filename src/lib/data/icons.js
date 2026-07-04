/**
 * Chiave del suono (basename del file) per scegliere l'icona dell'effetto.
 * Le scene riusano gli stessi file → il basename identifica il tipo di suono.
 * @param {{src?: string[]}} ref @returns {string} es. 'sword', 'bell', ''
 */
export function soundKey(ref) {
  const src = ref?.src?.[0] || '';
  const m = src.match(/\/([^/]+)\.(?:webm|m4a)(?:\?|$)/);
  return m ? m[1] : '';
}
