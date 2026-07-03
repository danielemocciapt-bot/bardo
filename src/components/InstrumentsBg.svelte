<script>
  // Texture di strumenti (liuti, flauti, tamburi, note) ripetuta dietro a tutto.
  // Unico layer decorativo di sfondo: fisso a schermo, dietro al contenuto.
  const B = import.meta.env.BASE_URL || '/';
  const url = `${B}img/instruments.svg`;
</script>

<div class="instruments" style="background-image:url('{url}')" aria-hidden="true"></div>

<style>
  .instruments {
    position: fixed;
    inset: 0;
    z-index: -1;            /* dietro al contenuto, sopra lo sfondo pagina */
    pointer-events: none;
    background-repeat: repeat;
    background-size: 300px 300px;
    opacity: 0.07;
  }
</style>
