// === CAMPI SALVATI IN FIRESTORE E LOCALSTORAGE ===
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
  "monete_rame", "monete_argento", "monete_oro", "monete_platino", "armature", "acro_check", "adda_check", "arti_check", "arte_check", "camu_check", "cava_check",
  "cona_check", "cond_check", "cong_check", "coni_check", "conl_check", "conn_check",
  "cono_check", "conp_check", "conr_check", "cons_check",
  "dipl_check", "disc_check", "furt_check", "guar_check", "inti_check", "intra_check",
  "intu_check", "ling_check", "nuot_check", "perc_check", "prof_check", "ragg_check",
  "rapi_check", "sapi_check", "scal_check", "sopr_check", "util_check", "valu_check", "vola_check"
];

// === FUNZIONI DI UTILITÀ ===
function calcMod(score) {
  const val = parseInt(score);
  return isNaN(val) ? "" : Math.floor((val - 10) / 2);
}

function getVal(id) {
  const el = document.getElementById(id);
  return el && el.value.trim() !== "" ? parseInt(el.value) || 0 : 0;
}

function setVal(id, val) {
  const el = document.getElementById(id);
  if (el) el.value = val === null ? "" : val;
  localStorage.setItem(id, val ?? "");
  saveToFirestore(id, val ?? "");
}

// === CALCOLI BASE ===
function updateModificatori() {
  ["for", "des", "cos", "int", "sag", "car"].forEach(stat => {
    setVal(`${stat}_mod`, calcMod(getVal(stat)));
  });
}

function calcolaIniziativa() {
  const modDes = getVal("des_mod");
  const vari = getVal("init_vari");
  setVal("init_des", modDes);
  setVal("init_tot", modDes + vari);
}

function calcolaCA() {
  const armatura = getVal("ca_armatura");
  const scudo = getVal("ca_scudo");
  const des = getVal("des_mod");
  const taglia = getVal("ca_taglia");
  const naturale = getVal("ca_nat");
  const dev = getVal("ca_dev");
  const vari = getVal("ca_vari");

  setVal("ca_tot", 10 + armatura + scudo + des + taglia + naturale + dev + vari);
  setVal("ca_contatto", 10 + des + dev + vari);
  setVal("ca_impreparato", 10 + armatura + scudo + taglia + naturale + dev + vari);
  setVal("ca_des", des);
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
  setVal("bmc_tot", getVal("bab") + getVal("for_mod") + getVal("bmc_taglia"));
  setVal("dmc_for", getVal("for_mod"));
  setVal("dmc_des", getVal("des_mod"));
  setVal("dmc_tot", 10 + getVal("bab") + getVal("for_mod") + getVal("des_mod") + getVal("dmc_taglia"));
}

function aggiornaAnteprime() {
  ["ca_tot", "ca_contatto", "ca_impreparato", "init_tot", "ts_tempra_tot", "ts_riflessi_tot", "ts_volonta_tot", "bmc_tot", "dmc_tot", "pf_totali", "vel_terreno"].forEach(id => {
    const el = document.getElementById(id);
    const preview = document.getElementById(`${id}_preview`);
    if (el && preview) preview.textContent = el.value || "—";
  });
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

// === FIREBASE ===
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
    aggiornaTuttiICalcoli();
  }
}

async function saveToFirestore(id, value) {
  const { setDoc, doc, getDoc } = await import("https://www.gstatic.com/firebasejs/11.7.1/firebase-firestore.js");
  const ref = doc(window.db, "schede", "schedaLadro");
  const current = (await getDoc(ref)).data() || {};
  await setDoc(ref, { ...current, [id]: value });
}

// === ABILITÀ ===
const abilitaCaratteristiche = {
  acro: "des", adda: "car", arti: "int", arte: "des", camu: "car", cava: "des",
  cona: "int", cond: "int", cong: "int", coni: "int", conl: "int", conn: "int", cono: "int", conp: "int", conr: "int", cons: "int",
  dipl: "car", disc: "des", furt: "des", guar: "sag", inti: "car", intra: "car", intu: "sag", ling: "int", nuot: "for",
  perc: "sag", prof: "sag", ragg: "car", rapi: "des", sapi: "int", scal: "for", sopr: "sag", util: "car", valu: "int", vola: "des"
};

function aggiornaAbilita() {
  Object.entries(abilitaCaratteristiche).forEach(([prefix, stat]) => {
    const mod = getVal(`${stat}_mod`);
    const gradi = getVal(`${prefix}_gradi`);
    const vari = getVal(`${prefix}_vari`);
    setVal(`${prefix}_car`, mod);
    setVal(`${prefix}_tot`, mod + gradi + vari);
  });
}

// === ARMATURE ===
function aggiornaBonusArmaturaDaTabella() {
  const rows = document.querySelectorAll("#tbodyArmature tr");
  let totale = 0;
  rows.forEach(row => {
    const bonus = parseInt(row.querySelector(".armor-bonus")?.value || 0);
    totale += bonus;
  });
  setVal("ca_armatura", totale);
  calcolaCA();
}

function salvaArmature() {
  const rows = document.querySelectorAll("#tbodyArmature tr");
  const armature = Array.from(rows).map(row => ({
    nome: row.querySelector(".armor-nome")?.value || "",
    bonus: parseInt(row.querySelector(".armor-bonus")?.value || 0),
    maxDes: row.querySelector(".armor-maxdes")?.value || "",
    penalita: row.querySelector(".armor-pen")?.value || "",
    note: row.querySelector(".armor-note")?.value || ""
  }));
  setVal("armature", JSON.stringify(armature));
}

function caricaArmature() {
  const json = localStorage.getItem("armature");
  if (!json) return;
  const armature = JSON.parse(json);
  armature.forEach(dati => aggiungiArmatura(dati));
  aggiornaBonusArmaturaDaTabella();
}

function aggiungiArmatura(dati = {}) {
  const tr = document.createElement("tr");
  tr.innerHTML = `
    <td><input class="armor-nome" value="${dati.nome || ''}" /></td>
    <td><input type="number" class="armor-bonus" value="${dati.bonus || 0}" /></td>
    <td><input class="armor-maxdes" value="${dati.maxDes || ''}" /></td>
    <td><input class="armor-pen" value="${dati.penalita || ''}" /></td>
    <td><input class="armor-note" value="${dati.note || ''}" /></td>
    <td><button class="remove">🗑️</button></td>
  `;
  tr.querySelectorAll("input").forEach(el => {
    el.addEventListener("input", () => {
      aggiornaBonusArmaturaDaTabella();
      salvaArmature();
    });
  });
  tr.querySelector(".remove").addEventListener("click", () => {
    tr.remove();
    aggiornaBonusArmaturaDaTabella();
    salvaArmature();
  });
  document.getElementById("tbodyArmature").appendChild(tr);
}

// === AVVIO PAGINA ===
window.addEventListener("DOMContentLoaded", async () => {
  await loadFromFirestore();

  fields.forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      const saved = localStorage.getItem(id);
      if (saved !== null) {
        if (el.type === "checkbox") el.checked = saved === "true";
        else el.value = saved;
      }

      const save = () => {
        const value = el.type === "checkbox" ? el.checked : el.value;
        localStorage.setItem(id, value);
        saveToFirestore(id, value);
        aggiornaTuttiICalcoli();
      };

      el.addEventListener("input", save);
      el.addEventListener("change", save);
      el.addEventListener("blur", () => saveToFirestore(id, el.value));
    }
  });

  aggiornaTuttiICalcoli();
  aggiornaAnteprime();
  caricaArmature();

  const btn = document.getElementById("aggiungiArmatura");
  if (btn) {
    btn.addEventListener("click", () => {
      aggiungiArmatura();
      salvaArmature();
    });
  }

  // Tab switching
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

  // Abilità dinamiche
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

// Espone funzione per HTML
window.toggleDettagli = function (btn) {
  const dett = btn.parentElement.nextElementSibling;
  const isHidden = dett.style.display === "none";
  dett.style.display = isHidden ? "block" : "none";
  btn.textContent = isHidden ? "− Nascondi" : "+ Mostra";
  aggiornaAnteprime();
};

window.aggiornaTaglia = function () {
  const mod = parseInt(document.getElementById("taglia").value);
  ["ca_taglia", "bmc_taglia", "dmc_taglia"].forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.readOnly = false;
      el.value = mod;
      el.readOnly = true;
      setVal(id, mod);
    }
  });
  aggiornaTuttiICalcoli();
};
