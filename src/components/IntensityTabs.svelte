<script>
  export let value = 'explore';
  export let onChange = (_l) => {};
  const tabs = [
    { id: 'explore', label: 'Esplora' },
    { id: 'combat', label: 'Combatti' },
    { id: 'victory', label: 'Vittoria' }
  ];
</script>

<div style="display:flex;gap:6px;padding:14px 16px;">
  {#each tabs as t}
    <button
      on:click={() => onChange(t.id)}
      style="flex:1;border:none;cursor:pointer;font-size:13px;padding:10px 0;border-radius:20px;font-weight:700;
             background:{value === t.id ? '#fff' : '#ffffff55'};
             color:{value === t.id ? 'var(--amber-deep)' : 'var(--ink)'};
             box-shadow:{value === t.id ? '0 2px 0 #d9a85a' : 'none'};">
      {t.label}
    </button>
  {/each}
</div>
