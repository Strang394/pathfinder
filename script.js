const fields = [
  'nome', 'giocatore', 'razza', 'classeLivello', 'allineamento',
  'forza', 'destrezza', 'costituzione', 'intelligenza', 'saggezza', 'carisma',
  'ca', 'iniziativa', 'pf', 'bab', 'abilita', 'talenti',
  'capacita', 'equip', 'denaro', 'note'
];

async function loadDataFromFirestore() {
  if (!window.db) return;
  const { getDoc, doc } = await import('https://www.gstatic.com/firebasejs/11.7.1/firebase-firestore.js');
  const docRef = doc(window.db, "schede", "schedaLadro");
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    const data = docSnap.data();
    fields.forEach(id => {
      const el = document.getElementById(id);
      if (el && data[id] !== undefined) {
        el.value = data[id];
        localStorage.setItem(id, data[id]);
      }
    });
  }
}

async function saveDataToFirestore(id, value) {
  if (!window.db) return;
  const { setDoc, doc, getDoc } = await import('https://www.gstatic.com/firebasejs/11.7.1/firebase-firestore.js');
  const docRef = doc(window.db, "schede", "schedaLadro");
  const existing = (await getDoc(docRef)).data() || {};
  await setDoc(docRef, { ...existing, [id]: value });
}

window.addEventListener('DOMContentLoaded', async () => {
  await loadDataFromFirestore();

  fields.forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.value = localStorage.getItem(id) || el.value;
      el.addEventListener('input', () => {
        localStorage.setItem(id, el.value);
        saveDataToFirestore(id, el.value);
      });
    }
  });

  const tabs = document.querySelectorAll('.tab-nav button');
  const contents = document.querySelectorAll('.tab-content');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      contents.forEach(c => c.classList.add('hidden'));
      tab.classList.add('active');
      document.getElementById(tab.getAttribute('data-tab')).classList.remove('hidden');
    });
  });
});
