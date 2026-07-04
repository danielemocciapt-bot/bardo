<script>
  // Icona line-art per un effetto, in base al tipo di suono (basename del file).
  // stroke = currentColor → eredita il colore del tasto.
  export let sound = '';
  export let size = 22;
</script>

<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
     stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
  {#if sound === 'door'}
    <rect x="6" y="3" width="12" height="18" rx="1"/><circle cx="14.5" cy="12" r="1" fill="currentColor" stroke="none"/>
  {:else if sound === 'twig'}
    <path d="M6 20 C9 15 11 11 12 4"/><path d="M12 10 C14 10 16 8 17 6"/><path d="M11 14 C9 14 7 13 6 11"/>
  {:else if sound === 'bell'}
    <path d="M6 16 v-4 a6 6 0 0 1 12 0 v4 l2 2 H4 Z"/><path d="M10.5 20 a1.5 1.5 0 0 0 3 0"/><path d="M12 4 v-1.5"/>
  {:else if sound === 'chain'}
    <rect x="3" y="9" width="10" height="6" rx="3"/><rect x="11" y="9" width="10" height="6" rx="3"/>
  {:else if sound === 'sword'}
    <path d="M12 3 L12 16"/><path d="M10.5 5 L12 3 L13.5 5"/><path d="M8 16 H16"/><path d="M12 16 V20"/><circle cx="12" cy="21" r="1" fill="currentColor" stroke="none"/>
  {:else if sound === 'mug'}
    <path d="M6 9 h9 v8 a2 2 0 0 1 -2 2 h-5 a2 2 0 0 1 -2 -2 Z"/><path d="M15 11 h2 a2 2 0 0 1 0 5 h-2"/><path d="M6 9 q1.5 -2 3 -0.5 q1.5 -2 3 0 q1.5 -1.5 3 0.5"/>
  {:else if sound === 'gull'}
    <path d="M3 13 Q7 7 11 13"/><path d="M11 13 Q15 7 19 13"/>
  {:else if sound === 'gong'}
    <circle cx="11" cy="11" r="6"/><circle cx="11" cy="11" r="1.4" fill="currentColor" stroke="none"/><path d="M17 5 L20 8"/><circle cx="20.5" cy="8.5" r="1.4" fill="currentColor" stroke="none"/>
  {:else if sound === 'rockfall'}
    <path d="M3 14 l3 -4 4 1 -1 4 Z"/><path d="M12 19 l3 -3 3 2 -1 3 Z"/><path d="M15 9 l2 -2 2 2 -1 2 Z"/>
  {:else if sound === 'splash'}
    <path d="M12 3 C15 9 18 12 18 15 a6 6 0 0 1 -12 0 c0 -3 3 -6 6 -12 Z"/><path d="M4 9 l1.5 -1.5 M20 9 l-1.5 -1.5"/>
  {:else if sound === 'crow'}
    <path d="M6 18 q-2 -8 6 -9 q4 0 5 3 q3 0.5 4 -1 q-1 3.5 -4 3.5 q0 4.5 -5 4.5 Z"/><circle cx="10" cy="10.5" r="0.6" fill="currentColor" stroke="none"/><path d="M11 18 v3 M14 18 v3"/>
  {:else if sound === 'pigeon'}
    <path d="M3 15 q2 -6 8 -5 q1 -3 4 -4 q0 3 -2 4 q3 1 3 4 q0 3 -4 3 q-7 1 -9 -2 Z"/><circle cx="12.6" cy="9.6" r="0.6" fill="currentColor" stroke="none"/><path d="M11 16 v3 M14 16 v3"/>
  {:else if sound === 'pickaxe'}
    <path d="M3 7 Q12 2 21 7"/><path d="M12 5 V21"/>
  {:else if sound === 'laser'}
    <path d="M3 12 H12"/><path d="M12 8.5 L19 12 L12 15.5 L14 12 Z" fill="currentColor" stroke="none"/>
  {:else if sound === 'glitch'}
    <path d="M4 8 h5 v3 h4 v-2 h4"/><path d="M4 15 h6 v-2"/><rect x="16" y="14" width="3" height="3" fill="currentColor" stroke="none"/>
  {:else if sound === 'alarm'}
    <path d="M12 4 L21 19 H3 Z"/><path d="M12 10 v4"/><circle cx="12" cy="16.5" r="0.8" fill="currentColor" stroke="none"/>
  {:else if sound === 'scream'}
    <circle cx="12" cy="12" r="8.5"/><path d="M9 9.5 v1.5 M15 9.5 v1.5"/><ellipse cx="12" cy="16" rx="1.8" ry="2.4"/>
  {:else if sound === 'clang'}
    <path d="M12 2 l1.6 5.4 5.4 -1.6 -3.2 4.8 3.2 4.8 -5.4 -1.6 -1.6 5.4 -1.6 -5.4 -5.4 1.6 3.2 -4.8 -3.2 -4.8 5.4 1.6 Z"/>
  {:else if sound === 'heartbeat'}
    <path d="M3 12 h4 l2 -6 3 12 2 -7 h7"/>
  {:else if sound === 'radiobeep'}
    <path d="M12 21 v-7"/><circle cx="12" cy="12" r="1.6" fill="currentColor" stroke="none"/><path d="M8.3 8.3 a5 5 0 0 1 7.4 0"/><path d="M5.5 5.5 a9 9 0 0 1 13 0"/>
  {:else if sound === 'airlock'}
    <circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="3.5"/><path d="M12 4 v3 M12 17 v3 M4 12 h3 M17 12 h3"/>
  {:else if sound === 'creature'}
    <ellipse cx="12" cy="11" rx="9" ry="6"/><circle cx="12" cy="11" r="2.4" fill="currentColor" stroke="none"/><path d="M6 16 l-1 3 M12 17 v3 M18 16 l1 3"/>
  {:else}
    <path d="M12 4 l1.5 5.5 5.5 1.5 -5.5 1.5 -1.5 5.5 -1.5 -5.5 -5.5 -1.5 5.5 -1.5 Z"/>
  {/if}
</svg>
