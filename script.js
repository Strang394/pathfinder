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
  "bmc_tot", "bmc_bab", "bmc_for", "bmc_taglia",
  "dmc_tot", "dmc_bab", "dmc_for", "dmc_des", "dmc_taglia",
  "abilita", "talenti", "capacita", "equip", "denaro", "note"
];

function getVal(id) {
  const el = document.getElementById(id);
  return el && el.value.trim() !== "" ? parseInt(el.value) || 0 : null;
}


function calcMod(score) {
  const val = parseInt(score);
  return isNaN(val) ? "" : Math.floor((val - 10) / 2);
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
  const modDes = getVal("des_mod");
  const vari = getVal("init_vari");
  setVal("init_des", modDes);
  setVal("init_tot", modDes + vari);
}

function calcolaCA() {
  const ca = getVal("ca_armatura") + getVal("ca_scudo") + getVal("des_mod") +
             getVal("ca_taglia") + getVal("ca_nat") + getVal("ca_dev") + getVal("ca_vari") + 10;
  setVal("ca_des", getVal("des_mod"));
  setVal("ca_tot", ca);
  setVal("ca_contatto", 10 + getVal("des_mod") + getVal("ca_dev") + getVal("ca_vari"));
  setVal("ca_impreparato", 10 + getVal("ca_armatura") + getVal("ca_scudo") + getVal("ca_taglia") + getVal("ca_nat") + getVal("ca_dev") + getVal("ca_vari"));
}

function calcolaTiriSalvezza() {
  setVal("ts_tempra_caratt", getVal("cos_mod"));
  setVal("ts_riflessi_caratt", getVal("des_mod"));
  setVal("ts_volonta_caratt", getVal("sag_mod"));

  setVal("ts_tempra_tot", getVal("ts_tempra_base") + getVal("ts_tempra_caratt") + getVal("ts_tempra_mag") + getVal("ts_tempra_vari") + getVal("ts_tempra_temp"));
  setVal("ts_riflessi_tot", getVal("ts_riflessi_base") + getVal("ts_riflessi_caratt") + getVal("ts_riflessi_mag") + getVal("ts_riflessi_vari") + getVal("ts_riflessi_temp"));
  setVal("ts_volonta_tot", getVal("ts_volonta_base") + getVal("ts_volonta_caratt") + getVal("ts_volonta_mag") + getVal("ts_volonta_vari") + getVal("ts_volonta_temp"));
}

function calcolaCombattimento() {
  setVal("bmc_for", getVal("for_mod"));
  setVal("bmc_bab", getVal("bab"));
  setVal("bmc_tot", getVal("bab") + getVal("for_mod") + getVal("bmc_taglia"));

  setVal("dmc_for", getVal("for_mod"));
  setVal("dmc_des", getVal("des_mod"));
  setVal("dmc_bab", getVal("bab"));
  setVal("dmc_tot", 10 + getVal("bab") + getVal("for_mod") + getVal("des_mod") + getVal("dmc_taglia"));
}

function aggiornaTuttiICalcoli() {
  updateModificatori();
  calcolaIniziativa();
  calcolaCA();
  calcolaTiriSalvezza();
  calcolaCombattimento();
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

  aggiornaTuttiICalcoli();
});
