// === INIZIALIZZAZIONE DEI CAMPI PRINCIPALI ===
// Questi sono tutti i campi salvati nel localStorage e su Firestore.
const fields = [
  "nome", "giocatore", "razza", "classeLivello", "allineamento",
  "divinita", "origini", "taglia", "sesso", "eta", "altezza", "peso", "capelli", "occhi",
  "vel_terreno", "vel_armatura", "vel_volare", "vel_nuotare", "vel_scalare", "vel_scavare",
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
  "bab", "res_inc", "bmc_tot", "bmc_for", "bmc_taglia", "dmc_tot", "dmc_for", "dmc_des", "dmc_taglia",
  "abilita", "talenti", "capacita", "equip", "denaro", "note",
  "monete_rame", "monete_argento", "monete_oro", "monete_platino", "armature"
];

// Mappa delle abilità e della caratteristica associata
const abilitaCaratteristiche = {
  acro: "des", adda: "car", arti: "int", arte: "des", camu: "car", cava: "des",
  cona: "int", cond: "int", cong: "int", coni: "int", conl: "int", conn: "int", cono: "int", conp: "int", conr: "int", cons: "int",
  dipl: "car", disc: "des", furt: "des", guar: "sag", inti: "car", intra: "car", intu: "sag", ling: "int", nuot: "for",
  perc: "sag", prof: "sag", ragg: "car", rapi: "des", sapi: "int", scal: "for", sopr: "sag", util: "car", valu: "int", vola: "des"
};

// Calcola il modificatore a partire dal punteggio (es: 10 -> 0, 14 -> +2, etc.)
function calcMod(score) {
  const val = parseInt(score);
  return isNaN(val) ? "" : Math.floor((val - 10) / 2);
}

// Recupera un valore dal campo con ID specificato
function getVal(id) {
  const el = document.getElementById(id);
  return el && el.value.trim() !== "" ? parseInt(el.value) || 0 : 0;
}

// Imposta un valore nel campo, nel localStorage e su Firestore
function setVal(id, val) {
  const el = document.getElementById(id);
  if (el) el.value = val === null ? "" : val;
  localStorage.setItem(id, val ?? "");
  saveToFirestore(id, val ?? "");
}

// Funzioni di calcolo automatico delle caratteristiche del personaggio
function updateModificatori() {
  ["for","des","cos","int","sag","car"].forEach(stat => {
    setVal(`${stat}_mod`, calcMod(getVal(stat)));
  });
}

function calcolaIniziativa() {
  const modDes = getVal("des_mod");
  const vari   = getVal("init_vari");
  setVal("init_des", modDes);
  setVal("init_tot", modDes + vari);
}

function calcolaCA() {
  const arm  = getVal("ca_armatura");
  const sc   = getVal("ca_scudo");
  const de   = getVal("des_mod");
  const tg   = getVal("ca_taglia");
  const nat  = getVal("ca_nat");
  const dev  = getVal("ca_dev");
  const varz = getVal("ca_vari");
  setVal("ca_tot",         10 + arm + sc + de + tg + nat + dev + varz);
  setVal("ca_contatto",    10 + de + dev + varz);
  setVal("ca_impreparato", 10 + arm + sc + tg + nat + dev + varz);
  setVal("ca_des",         de);
}

function calcolaTiriSalvezza() {
  setVal("ts_tempra_caratt",   getVal("cos_mod"));
  setVal("ts_riflessi_caratt", getVal("des_mod"));
  setVal("ts_volonta_caratt",  getVal("sag_mod"));

  setVal("ts_tempra_tot", getVal("ts_tempra_base") + getVal("ts_tempra_caratt") + getVal("ts_tempra_mag") + getVal("ts_tempra_vari") + getVal("ts_tempra_temp"));
  setVal("ts_riflessi_tot", getVal("ts_riflessi_base") + getVal("ts_riflessi_caratt") + getVal("ts_riflessi_mag") + getVal("ts_riflessi_vari") + getVal("ts_riflessi_temp"));
  setVal("ts_volonta_tot", getVal("ts_volonta_base") + getVal("ts_volonta_caratt") + getVal("ts_volonta_mag") + getVal("ts_volonta_vari") + getVal("ts_volonta_temp"));
}

function calcolaCombattimento() {
  setVal("bmc_for", getVal("for_mod"));
  setVal("bmc_tot", getVal("bab") + getVal("for_mod") + getVal("bmc_taglia"));
  setVal("dmc_for", getVal("for_mod"));
  setVal("dmc_des", getVal("des_mod"));
  setVal("dmc_tot", 10 + getVal("bab") + getVal("for_mod") + getVal("des_mod") + getVal("dmc_taglia"));
}

// Mostra le anteprime dei valori chiave accanto ai titoli
function aggiornaAnteprime() {
  ["ca_tot","ca_contatto","ca_impreparato","init_tot","ts_tempra_tot",
   "ts_riflessi_tot","ts_volonta_tot","bmc_tot","dmc_tot","pf_totali","vel_terreno"]
  .forEach(id => {
    const el = document.getElementById(id);
    const pr = document.getElementById(`${id}_preview`);
    if (el && pr) pr.textContent = el.value || "—";
  });
}

// Funzione centrale che ricalcola tutto il foglio
function aggiornaTuttiICalcoli() {
  updateModificatori();
  calcolaIniziativa();
  calcolaCA();
  calcolaTiriSalvezza();
  calcolaCombattimento();
  aggiornaAnteprime();
  aggiornaAbilita();
}

// Calcola le abilità partendo dalle caratteristiche
function aggiornaAbilita() {
  Object.entries(abilitaCaratteristiche).forEach(([prefix, stat]) => {
    const mod   = getVal(`${stat}_mod`);
    const gradi = getVal(`${prefix}_gradi`);
    const vari  = getVal(`${prefix}_vari`);
    setVal(`${prefix}_car`, mod);
    setVal(`${prefix}_tot`, mod + gradi + vari);
  });
}

// Salva lo stato delle abilità su localStorage e Firestore
function salvaAbilita() {
  const data = {};
  Object.keys(abilitaCaratteristiche).forEach(pref => {
    data[pref] = {
      checked: document.getElementById(pref + "_check").checked,
      gradi:   parseInt(document.getElementById(pref + "_gradi").value) || 0,
      vari:    parseInt(document.getElementById(pref + "_vari").value)  || 0
    };
  });
  const json = JSON.stringify(data);
  localStorage.setItem("abilita", json);
  saveToFirestore("abilita", json);
  aggiornaAbilita();
  aggiornaAnteprime();
}

// Carica i dati delle abilità da localStorage
function caricaAbilita() {
  const raw = localStorage.getItem("abilita");
  if (!raw) return;
  const data = JSON.parse(raw);
  Object.entries(data).forEach(([pref, obj]) => {
    const c = document.getElementById(pref + "_check");
    const g = document.getElementById(pref + "_gradi");
    const v = document.getElementById(pref + "_vari");
    if (c) c.checked = obj.checked;
    if (g) g.value   = obj.gradi;
    if (v) v.value   = obj.vari;
  });
  aggiornaAbilita();
  aggiornaAnteprime();
}

// Funzione per caricare tutti i dati dal documento Firestore all'avvio
async function loadFromFirestore() {
  const { getDoc, doc } = await import("https://www.gstatic.com/firebasejs/11.7.1/firebase-firestore.js");
  const ref = doc(window.db, "schede", "schedaLadro");
  const snap = await getDoc(ref);
  if (snap.exists()) {
    const data = snap.data();
    fields.forEach(id => {
      const el = document.getElementById(id);
      if (el && data[id] !== undefined) {
        if (el.type === "checkbox") el.checked = data[id];
        else el.value = data[id];
        localStorage.setItem(id, data[id]);
      }
    });
    if (data.abilita) {
      localStorage.setItem("abilita", data.abilita);
      caricaAbilita();
    }
    aggiornaTuttiICalcoli();
  }
}

// Salva un singolo campo su Firestore
async function saveToFirestore(id, value) {
  const { setDoc, doc, getDoc } = await import("https://www.gstatic.com/firebasejs/11.7.1/firebase-firestore.js");
  const ref = doc(window.db, "schede", "schedaLadro");
  const current = (await getDoc(ref)).data() || {};
  await setDoc(ref, { ...current, [id]: value });
}

// Attiva la sincronizzazione in tempo reale con Firestore
async function avviaSincronizzazioneLive() {
  const { onSnapshot, doc } = await import("https://www.gstatic.com/firebasejs/11.7.1/firebase-firestore.js");
  const ref = doc(window.db, "schede", "schedaLadro");

  onSnapshot(ref, (snap) => {
    if (snap.exists()) {
      const data = snap.data();
      fields.forEach(id => {
        const el = document.getElementById(id);
        if (el && data[id] !== undefined) {
          if (el.type === "checkbox") el.checked = data[id];
          else el.value = data[id];
          localStorage.setItem(id, data[id]);
        }
      });
      if (data.abilita) {
        localStorage.setItem("abilita", data.abilita);
        caricaAbilita();
      }
      aggiornaTuttiICalcoli();
    }
  });
}

// Debounce = evita chiamate eccessive a Firestore mentre si digita
function debounce(fn, delay = 500) {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn(...args), delay);
  };
}

// Applica debounce ai salvataggi dei campi
function aggiungiListenerSalvataggioConDebounce(id, el) {
  const save = debounce(() => {
    const value = el.type === "checkbox" ? el.checked : el.value;
    localStorage.setItem(id, value);
    saveToFirestore(id, value);
    aggiornaTuttiICalcoli();
  });

  el.addEventListener("input", save);
  el.addEventListener("change", save);
  el.addEventListener("blur", () => saveToFirestore(id, el.value));
}

// Avvio dell'app quando la pagina è pronta
window.addEventListener("DOMContentLoaded", async () => {
  await loadFromFirestore(); // carica dati iniziali
  avviaSincronizzazioneLive(); // attiva sync live
  caricaAbilita();
  caricaArmature();

  // Abilità: aggiorna su modifiche
  document
    .querySelectorAll('#sezione2 input[id$="_check"], #sezione2 input[id$="_gradi"], #sezione2 input[id$="_vari"]')
    .forEach(el => {
      el.addEventListener("change", salvaAbilita);
      el.addEventListener("input",  salvaAbilita);
    });

  // Assegna listener a tutti i campi definiti in "fields"
  fields.forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;

    if (id.endsWith("_check")) {
      const row = el.closest("tr");
      const toggleRowClass = () => {
        if (el.checked) row.classList.add("attiva");
        else row.classList.remove("attiva");
      };
      el.addEventListener("change", toggleRowClass);
      toggleRowClass();
    }

    aggiungiListenerSalvataggioConDebounce(id, el);
  });

  aggiornaTuttiICalcoli();
  aggiornaAnteprime();

  // Pulsante per aggiungere nuove armature
  const btn = document.getElementById("aggiungiArmatura");
  if (btn) {
    btn.addEventListener("click", () => {
      aggiungiArmatura();
      salvaArmature();
    });
  }

  // Comportamento dei tab (navigazione a sezioni)
  const tabs = document.querySelectorAll(".tab-nav button");
  const contents = document.querySelectorAll(".tab-content");
  tabs.forEach(tab => {
    tab.addEventListener("click", () => {
      tabs.forEach(t => t.classList.remove("active"));
      contents.forEach(c => c.classList.add("hidden"));
      tab.classList.add("active");
      document.getElementById(tab.getAttribute("data-tab"))
              .classList.remove("hidden");
      aggiornaTuttiICalcoli();
    });
  });
});
