// script.js completo con calcoli automatici
const fields = [
  "nome", "giocatore", "razza", "classeLivello", "allineamento",
  "for", "for_adj", "for_temp", "for_mod",
  "des", "des_adj", "des_temp", "des_mod",
  "cos", "cos_adj", "cos_temp", "cos_mod",
  "int", "int_adj", "int_temp", "int_mod",
  "sag", "sag_adj", "sag_temp", "sag_mod",
  "car", "car_adj", "car_temp", "car_mod",
  "pf_totali", "pf_rd", "pf_attuali", "pf_nonletale",
  "init_tot", "init_des", "init_vari",
  "ca_tot", "ca_armatura", "ca_scudo", "ca_des", "ca_taglia", "ca_nat", "ca_dev", "ca_vari", "ca_contatto", "ca_impreparato",
  "ts_tempra_tot", "ts_tempra_base", "ts_tempra_caratt", "ts_tempra_mag", "ts_tempra_vari", "ts_tempra_temp",
  "ts_riflessi_tot", "ts_riflessi_base", "ts_riflessi_caratt", "ts_riflessi_mag", "ts_riflessi_vari", "ts_riflessi_temp",
  "ts_volonta_tot", "ts_volonta_base", "ts_volonta_caratt", "ts_volonta_mag", "ts_volonta_vari", "ts_volonta_temp",
  "bab", "res_inc",
  "bmc_tot", "bmc_for", "bmc_taglia",
  "dmc_tot", "dmc_for", "dmc_des", "dmc_taglia",
  "abilita", "talenti", "capacita", "equip", "denaro", "note"
];

function calcMod(score) {
  const val = parseInt(score);
  return isNaN(val) ? "" : Math.floor((val - 10) / 2);
}

function getVal(id) {
  const el = document.getElementById(id);
  return el && el.value.trim() !== "" ? parseInt(el.value) || 0 : null;
}

function setVal(id, val) {
  const el = document.getElementById(id);
  if (el) el.value = val === null ? "" : val;
  localStorage.setItem(id, val ?? "");
  saveToFirestore(id, val ?? "");
}

function updateModificatori() {
  ["for", "des", "cos", "int", "sag", "car"].forEach(stat => {
    const base = getVal(stat);
    const mod = calcMod(base);
    setVal(`${stat}_mod`, mod);
  });
}

function calcolaIniziativa() {
  const modDes = getVal("des_mod") ?? 0;
  const vari = getVal("init_vari") ?? 0;
  setVal("init_des", modDes);
  setVal("init_tot", modDes + vari);
}

function calcolaCA() {
  const ca = (getVal("ca_armatura") ?? 0) + (getVal("ca_scudo") ?? 0) + (getVal("des_mod") ?? 0) +
             (getVal("ca_taglia") ?? 0) + (getVal("ca_nat") ?? 0) + (getVal("ca_dev") ?? 0) + (getVal("ca_vari") ?? 0) + 10;
  setVal("ca_des", getVal("des_mod"));
  setVal("ca_tot", ca);
  setVal("ca_contatto", 10 + (getVal("des_mod") ?? 0) + (getVal("ca_dev") ?? 0) + (getVal("ca_vari") ?? 0));
  setVal("ca_impreparato", 10 + (getVal("ca_armatura") ?? 0) + (getVal("ca_scudo") ?? 0) + (getVal("ca_taglia") ?? 0) + (getVal("ca_nat") ?? 0) + (getVal("ca_dev") ?? 0) + (getVal("ca_vari") ?? 0));
}

function calcolaTiriSalvezza() {
  setVal("ts_tempra_caratt", getVal("cos_mod"));
  setVal("ts_riflessi_caratt", getVal("des_mod"));
  setVal("ts_volonta_caratt", getVal("sag_mod"));

  setVal("ts_tempra_tot", (getVal("ts_tempra_base") ?? 0) + (getVal("ts_tempra_caratt") ?? 0) + (getVal("ts_tempra_mag") ?? 0) + (getVal("ts_tempra_vari") ?? 0) + (getVal("ts_tempra_temp") ?? 0));
  setVal("ts_riflessi_tot", (getVal("ts_riflessi_base") ?? 0) + (getVal("ts_riflessi_caratt") ?? 0) + (getVal("ts_riflessi_mag") ?? 0) + (getVal("ts_riflessi_vari") ?? 0) + (getVal("ts_riflessi_temp") ?? 0));
  setVal("ts_volonta_tot", (getVal("ts_volonta_base") ?? 0) + (getVal("ts_volonta_caratt") ?? 0) + (getVal("ts_volonta_mag") ?? 0) + (getVal("ts_volonta_vari") ?? 0) + (getVal("ts_volonta_temp") ?? 0));
}

function calcolaCombattimento() {
  setVal("bmc_for", getVal("for_mod"));
  setVal("bmc_tot", (getVal("bab") ?? 0) + (getVal("for_mod") ?? 0) + (getVal("bmc_taglia") ?? 0));

  setVal("dmc_for", getVal("for_mod"));
  setVal("dmc_des", getVal("des_mod"));
  setVal("dmc_tot", 10 + (getVal("bab") ?? 0) + (getVal("for_mod") ?? 0) + (getVal("des_mod") ?? 0) + (getVal("dmc_taglia") ?? 0));
}

function aggiornaTuttiICalcoli() {
  updateModificatori();
  calcolaIniziativa();
  calcolaCA();
  calcolaTiriSalvezza();
  calcolaCombattimento();
  aggiornaAnteprime(); // <-- qui dentro, così si aggiorna sempre!
}


async function loadFromFirestore() {
  const { getDoc, doc } = await import("https://www.gstatic.com/firebasejs/11.7.1/firebase-firestore.js");
  const ref = doc(window.db, "schede", "schedaLadro");
  const snap = await getDoc(ref);
  if (snap.exists()) {
    const data = snap.data();
    fields.forEach(id => {
      const el = document.getElementById(id);
      if (el && data[id] !== undefined) {
        el.value = data[id];
        localStorage.setItem(id, data[id]);
      }
    });
    aggiornaTuttiICalcoli();
  }
}

async function saveToFirestore(id, value) {
  const { setDoc, doc, getDoc } = await import("https://www.gstatic.com/firebasejs/11.7.1/firebase-firestore.js");
  const ref = doc(window.db, "schede", "schedaLadro");
  const current = (await getDoc(ref)).data() || {};
  await setDoc(ref, { ...current, [id]: value });
}

window.addEventListener("DOMContentLoaded", async () => {
  await loadFromFirestore();

  fields.forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.value = localStorage.getItem(id) || el.value;
      el.addEventListener("input", () => {
        localStorage.setItem(id, el.value);
        saveToFirestore(id, el.value);
        aggiornaTuttiICalcoli();
      });
    }
  });

  aggiornaTuttiICalcoli();    
  aggiornaAnteprime();        
});


  const tabs = document.querySelectorAll('.tab-nav button');
  const contents = document.querySelectorAll('.tab-content');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      contents.forEach(c => c.classList.add('hidden'));
      tab.classList.add('active');
      document.getElementById(tab.getAttribute('data-tab')).classList.remove('hidden');
       aggiornaTuttiICalcoli();
    });
});
 

function aggiornaAnteprime() {
  const ids = [
    "ca_tot", "ca_contatto", "ca_impreparato",
    "init_tot",
    "ts_tempra_tot", "ts_riflessi_tot", "ts_volonta_tot", "bmc_tot", "dmc_tot"

  ];

  ids.forEach(id => {
    const el = document.getElementById(id);
    const preview = document.getElementById(`${id}_preview`);
    if (el && preview) {
      preview.textContent = el.value !== "" ? el.value : "—";
    }
  });
}

window.toggleDettagli = function(button) {
  const dettagli = button.parentElement.nextElementSibling;
  const isHidden = dettagli.style.display === 'none';
  dettagli.style.display = isHidden ? 'block' : 'none';
  button.textContent = isHidden ? '− Nascondi' : '+ Dettagli';
  aggiornaAnteprime();
};
