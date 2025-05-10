const fields = [
  "nome", "giocatore", "razza", "classeLivello", "allineamento",
  "for", "for_adj", "for_temp",
  "des", "des_adj", "des_temp",
  "cos", "cos_adj", "cos_temp",
  "int", "int_adj", "int_temp",
  "sag", "sag_adj", "sag_temp",
  "car", "car_adj", "car_temp",
  "abilita", "talenti", "capacita", "equip", "denaro", "note"
];

function calcMod(score) {
  const parsed = parseInt(score);
  return isNaN(parsed) ? "" : Math.floor((parsed - 10) / 2);
}

async function loadFromFirestore() {
  const { getDoc, doc } = await import("https://www.gstatic.com/firebasejs/11.7.1/firebase-firestore.js");
  const docRef = doc(window.db, "schede", "schedaLadro");
  const snap = await getDoc(docRef);
  if (snap.exists()) {
    const data = snap.data();
    fields.forEach(id => {
      const el = document.getElementById(id);
      if (el && data[id] !== undefined) {
        el.value = data[id];
        localStorage.setItem(id, data[id]);
      }
    });
    updateAllModifiers();
  }
}

async function saveToFirestore(id, value) {
  const { setDoc, doc, getDoc } = await import("https://www.gstatic.com/firebasejs/11.7.1/firebase-firestore.js");
  const ref = doc(window.db, "schede", "schedaLadro");
  const current = (await getDoc(ref)).data() || {};
  await setDoc(ref, { ...current, [id]: value });
}

function updateModifierFor(stat) {
  const input = document.getElementById(stat);
  const modField = document.getElementById(`${stat}_mod`);
  const mod = calcMod(input.value);
  modField.value = mod;
  localStorage.setItem(`${stat}_mod`, mod);
}

function updateAllModifiers() {
  ["for", "des", "cos", "int", "sag", "car"].forEach(updateModifierFor);
}

window.addEventListener("DOMContentLoaded", async () => {
  await loadFromFirestore();

  fields.forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;
    el.value = localStorage.getItem(id) || el.value;
    el.addEventListener("input", () => {
      localStorage.setItem(id, el.value);
      saveToFirestore(id, el.value);
      if (id.match(/^(for|des|cos|int|sag|car)$/)) {
        updateModifierFor(id);
      }
    });
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

  updateAllModifiers();
});
