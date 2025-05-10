<!DOCTYPE html>
<html lang="it">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Scheda Personaggio - Pathfinder 3.5</title>
  <link rel="stylesheet" href="style.css" />
</head>
<body>
  <main>
    <h1>Scheda Personaggio - Ladro</h1>

    <section>
      <h2>Anagrafica</h2>
      <label>Nome: <input type="text" id="nome" /></label>
      <label>Giocatore: <input type="text" id="giocatore" /></label>
      <label>Razza: <input type="text" id="razza" /></label>
      <label>Classe/Livello: <input type="text" id="classeLivello" /></label>
      <label>Allineamento: <input type="text" id="allineamento" /></label>
    </section>

    <section>
      <h2>Caratteristiche</h2>
      <div class="caratteristiche">
        <label>FOR: <input type="number" id="forza" /></label>
        <label>DES: <input type="number" id="destrezza" /></label>
        <label>COS: <input type="number" id="costituzione" /></label>
        <label>INT: <input type="number" id="intelligenza" /></label>
        <label>SAG: <input type="number" id="saggezza" /></label>
        <label>CAR: <input type="number" id="carisma" /></label>
      </div>
    </section>

    <section>
      <h2>Abilità</h2>
      <textarea id="abilita" rows="8" placeholder="Inserisci abilità e modificatori..."></textarea>
    </section>

    <section>
      <h2>Combattimento</h2>
      <label>CA: <input type="number" id="ca" /></label>
      <label>Iniziativa: <input type="number" id="iniziativa" /></label>
      <label>PF Attuali: <input type="number" id="pf" /></label>
      <label>Bonus Attacco Base: <input type="text" id="bab" /></label>
    </section>

    <section>
      <h2>Equipaggiamento</h2>
      <textarea id="equip" rows="5" placeholder="Inserisci equipaggiamento..."></textarea>
    </section>

    <section>
      <h2>Talenti e Incantesimi</h2>
      <textarea id="talenti" rows="5" placeholder="Talenti..."></textarea>
      <textarea id="incantesimi" rows="5" placeholder="Incantesimi..."></textarea>
    </section>
  </main>

  <script>
    const fields = [
      'nome', 'giocatore', 'razza', 'classeLivello', 'allineamento',
      'forza', 'destrezza', 'costituzione', 'intelligenza', 'saggezza', 'carisma',
      'abilita', 'ca', 'iniziativa', 'pf', 'bab', 'equip', 'talenti', 'incantesimi'
    ];

    window.addEventListener('DOMContentLoaded', () => {
      fields.forEach(id => {
        const el = document.getElementById(id);
        el.value = localStorage.getItem(id) || '';
        el.addEventListener('input', () => {
          localStorage.setItem(id, el.value);
        });
      });
    });
  </script>
</body>
</html>
