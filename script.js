// script.js completo con calcoli automatici
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
  "bab", "res_inc",
  "bmc_tot", "bmc_for", "bmc_taglia",
  "dmc_tot", "dmc_for", "dmc_des", "dmc_taglia",
  "abilita", "talenti", "capacita", "equip", "denaro", "note",
    "acro_check", "acro_tot", "acro_car", "acro_gradi", "acro_vari",
  "adda_check", "adda_tot", "adda_car", "adda_gradi", "adda_vari",
  "arti_check", "arti_tot", "arti_car", "arti_gradi", "arti_vari",
  "arte_check", "arte_tot", "arte_car", "arte_gradi", "arte_vari",
  "camu_check", "camu_tot", "camu_car", "camu_gradi", "camu_vari",
  "cava_check", "cava_tot", "cava_car", "cava_gradi", "cava_vari",
  "cona_check", "cona_tot", "cona_car", "cona_gradi", "cona_vari",
  "cond_check", "cond_tot", "cond_car", "cond_gradi", "cond_vari",
  "cong_check", "cong_tot", "cong_car", "cong_gradi", "cong_vari",
  "coni_check", "coni_tot", "coni_car", "coni_gradi", "coni_vari",
  "conl_check", "conl_tot", "conl_car", "conl_gradi", "conl_vari",
  "conn_check", "conn_tot", "conn_car", "conn_gradi", "conn_vari",
  "cono_check", "cono_tot", "cono_car", "cono_gradi", "cono_vari",
  "conp_check", "conp_tot", "conp_car", "conp_gradi", "conp_vari",
  "conr_check", "conr_tot", "conr_car", "conr_gradi", "conr_vari",
  "cons_check", "cons_tot", "cons_car", "cons_gradi", "cons_vari",
  "dipl_check", "dipl_tot", "dipl_car", "dipl_gradi", "dipl_vari",
  "disc_check", "disc_tot", "disc_car", "disc_gradi", "disc_vari",
  "furt_check", "furt_tot", "furt_car", "furt_gradi", "furt_vari",
  "guar_check", "guar_tot", "guar_car", "guar_gradi", "guar_vari",
  "inti_check", "inti_tot", "inti_car", "inti_gradi", "inti_vari",
  "intra_check", "intra_tot", "intra_car", "intra_gradi", "intra_vari",
  "intu_check", "intu_tot", "intu_car", "intu_gradi", "intu_vari",
  "ling_check", "ling_tot", "ling_car", "ling_gradi", "ling_vari",
  "nuot_check", "nuot_tot", "nuot_car", "nuot_gradi", "nuot_vari",
  "perc_check", "perc_tot", "perc_car", "perc_gradi", "perc_vari",
  "prof_check", "prof_tot", "prof_car", "prof_gradi", "prof_vari",
  "ragg_check", "ragg_tot", "ragg_car", "ragg_gradi", "ragg_vari",
  "rapi_check", "rapi_tot", "rapi_car", "rapi_gradi", "rapi_vari",
  "sapi_check", "sapi_tot", "sapi_car", "sapi_gradi", "sapi_vari",
  "scal_check", "scal_tot", "scal_car", "scal_gradi", "scal_vari",
  "sopr_check", "sopr_tot", "sopr_car", "sopr_gradi", "sopr_vari",
  "util_check", "util_tot", "util_car", "util_gradi", "util_vari",
  "valu_check", "valu_tot", "valu_car", "valu_gradi", "valu_vari",
  "vola_check", "vola_tot", "vola_car", "vola_gradi", "vola_vari",
  "monete_rame", "monete_argento", "monete_oro", "monete_platino"
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
  const armatura = getVal("ca_armatura") ?? 0;
  const scudo = getVal("ca_scudo") ?? 0;
  const des = getVal("des_mod") ?? 0;
  const taglia = getVal("ca_taglia") ?? 0;
  const naturale = getVal("ca_nat") ?? 0;
  const dev = getVal("ca_dev") ?? 0;
  const vari = getVal("ca_vari") ?? 0;

  // CA Totale: tutto
  const totale = 10 + armatura + scudo + des + taglia + naturale + dev + vari;
  setVal("ca_tot", totale);

  // CA Contatto: ignora armatura, scudo, taglia, naturale
  const contatto = 10 + des + dev + vari;
  setVal("ca_contatto", contatto);

  // CA Impreparato: ignora destrezza
  const impreparato = 10 + armatura + scudo + taglia + naturale + dev + vari;
  setVal("ca_impreparato", impreparato);

  // Salva anche mod DES per chiarezza
  setVal("ca_des", des);
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
  aggiornaAnteprime();
  aggiornaAbilita(); 
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
        if (el.type === "checkbox") {
          el.checked = data[id];
        } else {
          el.value = data[id];
        }
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
      const local = localStorage.getItem(id);
      if (local !== null && local !== undefined) {
        el.value = local;
      }

 el.addEventListener("input", () => {
  const value = el.type === "checkbox" ? el.checked : el.value;
  localStorage.setItem(id, value);
  saveToFirestore(id, value);
  aggiornaTuttiICalcoli();
});

// Assicura che anche il cambio di focus su textarea o checkbox venga salvato
el.addEventListener("change", () => {
  const value = el.type === "checkbox" ? el.checked : el.value;
  localStorage.setItem(id, value);
  saveToFirestore(id, value);
  aggiornaTuttiICalcoli();
});

// Forza resize iniziale dei campi auto-resize
document.querySelectorAll('.auto-resize').forEach(input => {
  input.style.width = '1ch'; // reset
  input.style.width = (input.value.length + 1) + 'ch';
});
      el.addEventListener("blur", () => {
        saveToFirestore(id, el.value);
      });
    }
  });

  aggiornaTuttiICalcoli();    
  aggiornaAnteprime();        
});

function autoResizeInput(input) {
  input.style.width = "1ch"; // reset
  const length = input.value.length || 1;
  input.style.width = `${length + 1}ch`;
}

document.addEventListener("DOMContentLoaded", async () => {
  await loadFromFirestore();

  // Auto-resize iniziale
  document.querySelectorAll("input.auto-resize").forEach(input => {
    autoResizeInput(input);
    input.addEventListener("input", () => autoResizeInput(input));
  });

  // Gestione salvataggio e ricaricamento per ogni campo definito
  fields.forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      const stored = localStorage.getItem(id);
      if (stored !== null) {
        if (el.type === "checkbox") {
          el.checked = stored === "true"; // localStorage salva stringhe!
        } else {
          el.value = stored;
        }
      }

      const save = () => {
        const value = el.type === "checkbox" ? el.checked : el.value;
        localStorage.setItem(id, value);
        saveToFirestore(id, value);
        aggiornaTuttiICalcoli();
      };

      el.addEventListener("input", save);
      el.addEventListener("change", save);
    }
  });

  aggiornaTuttiICalcoli();
  aggiornaAnteprime();

  // Tabs switching
  const tabs = document.querySelectorAll(".tab-nav button");
  const contents = document.querySelectorAll(".tab-content");
  tabs.forEach(tab => {
    tab.addEventListener("click", () => {
      tabs.forEach(t => t.classList.remove("active"));
      contents.forEach(c => c.classList.add("hidden"));
      tab.classList.add("active");
      document.getElementById(tab.getAttribute("data-tab")).classList.remove("hidden");
      aggiornaTuttiICalcoli();
    });
  });
});

 

function aggiornaAnteprime() {
  const ids = [
    "ca_tot", "ca_contatto", "ca_impreparato",
    "init_tot",
    "ts_tempra_tot", "ts_riflessi_tot", "ts_volonta_tot", "bmc_tot", "dmc_tot", "pf_totali", "vel_terreno"

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

function aggiornaTaglia() {
  const mod = parseInt(document.getElementById("taglia").value);
  ["ca_taglia", "bmc_taglia", "dmc_taglia"].forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.readOnly = false;
      el.value = mod;
      el.readOnly = true;
      setVal(id, mod); // Usa la tua funzione che salva e aggiorna
    }
  });

  aggiornaTuttiICalcoli();
}
// Mappa delle abilità con la loro caratteristica base
const abilitaCaratteristiche = {
  acro: "des",
  adda: "car",
  arti: "int",
  arte: "des",
  camu: "car",
  cava: "des",
  cona: "int",
  cond: "int",
  cong: "int",
  coni: "int",
  conl: "int",
  conn: "int",
  cono: "int",
  conp: "int",
  conr: "int",
  cons: "int",
  dipl: "car",
  disc: "des",
  furt: "des",
  guar: "sag",
  inti: "car",
  intra: "car",
  intu: "sag",
  ling: "int",
  nuot: "for",
  perc: "sag",
  prof: "sag",
  ragg: "car",
  rapi: "des",
  sapi: "int",
  scal: "for",
  sopr: "sag",
  util: "car",
  valu: "int",
  vola: "des"
};

function aggiornaAbilita() {
  Object.entries(abilitaCaratteristiche).forEach(([prefix, stat]) => {
    const mod = parseInt(document.getElementById(`${stat}_mod`)?.value || 0);
    const gradi = parseInt(document.getElementById(`${prefix}_gradi`)?.value || 0);
    const vari = parseInt(document.getElementById(`${prefix}_vari`)?.value || 0);

    const totale = mod + gradi + vari;

    // Aggiorna i campi
    const carField = document.getElementById(`${prefix}_car`);
    const totField = document.getElementById(`${prefix}_tot`);

    if (carField) carField.value = mod;
    if (totField) totField.value = totale;
  });
}

// Funzione che converte tutto in rame e poi redistribuisce
function normalizzaDenaro() {
  const rame = parseInt(document.getElementById("monete_rame")?.value || 0);
  const argento = parseInt(document.getElementById("monete_argento")?.value || 0);
  const oro = parseInt(document.getElementById("monete_oro")?.value || 0);
  const platino = parseInt(document.getElementById("monete_platino")?.value || 0);

  // Totale in monete di rame
  let totaleRame = rame + argento * 10 + oro * 100 + platino * 1000;

  // Redistribuzione
  const mp = Math.floor(totaleRame / 1000);
  totaleRame %= 1000;
  const mo = Math.floor(totaleRame / 100);
  totaleRame %= 100;
  const ma = Math.floor(totaleRame / 10);
  totaleRame %= 10;
  const mr = totaleRame;

  // Scrive nei campi
  document.getElementById("monete_platino").value = mp;
  document.getElementById("monete_oro").value = mo;
  document.getElementById("monete_argento").value = ma;
  document.getElementById("monete_rame").value = mr;

  // Salvataggio
  ["monete_rame", "monete_argento", "monete_oro", "monete_platino"].forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      const val = parseInt(el.value || 0);
      localStorage.setItem(id, val);
      saveToFirestore(id, val);
    }
  });
}

// Applica normalizzazione ad ogni input
["monete_rame", "monete_argento", "monete_oro", "monete_platino"].forEach(id => {
  const el = document.getElementById(id);
  if (el) {
    el.addEventListener("input", normalizzaDenaro);
    el.addEventListener("change", normalizzaDenaro);
  }
});

// Inizializza da localStorage all'avvio
window.addEventListener("DOMContentLoaded", () => {
  ["monete_rame", "monete_argento", "monete_oro", "monete_platino"].forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      const stored = localStorage.getItem(id);
      if (stored !== null) el.value = stored;
    }
  });
  normalizzaDenaro();
});

// Esegui al caricamento e ogni input
window.addEventListener("DOMContentLoaded", () => {
  aggiornaAbilita();

  // Aggiorna ogni volta che cambia un campo di abilità o caratteristiche
  const campiDaAscoltare = [
    ...Object.values(abilitaCaratteristiche).map(stat => `${stat}_mod`),
    ...Object.keys(abilitaCaratteristiche).flatMap(prefix => [
      `${prefix}_gradi`,
      `${prefix}_vari`
    ])
  ];

  campiDaAscoltare.forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener("input", aggiornaAbilita);
    }
  });
});


window.aggiornaTaglia = aggiornaTaglia; // ✅ Aggiungi questa riga


