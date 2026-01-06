
// ----------------  ----------------
function __showToast(msg, type = "error") {
  let box = document.getElementById("__toast");
  if (!box) {
    box = document.createElement("div");
    box.id = "__toast";
    box.style.position = "fixed";
    box.style.top = "16px";
    box.style.right = "16px";
    box.style.zIndex = "999999";
    box.style.maxWidth = "360px";
    document.body.appendChild(box);
  }

  const item = document.createElement("div");
  item.style.padding = "12px 14px";
  item.style.marginBottom = "10px";
  item.style.borderRadius = "10px";
  item.style.boxShadow = "0 10px 25px rgba(0,0,0,.15)";
  item.style.color = "#fff";
  item.style.fontSize = "14px";
  item.style.lineHeight = "1.3";
  item.style.background = type === "success" ? "#16a34a" : "#dc2626";
  item.textContent = msg;

  box.appendChild(item);
  setTimeout(() => item.remove(), 3200);
}

function __setInvalid(el, msg) {
  if (!el) return false;
  el.style.border = "2px solid #dc2626";
  el.style.outline = "none";
  el.title = msg || "Invalid input";
  el.addEventListener("input", () => { el.style.border = ""; el.title=""; }, { once: true });
  return false;
}

function __required(el, label = "This field") {
  if (!el) return true; // if element doesn't exist in this UI, skip
  const v = (el.value || "").trim();
  if (!v) {
    __showToast(`${label} is required`);
    return __setInvalid(el, `${label} is required`);
  }
  return true;
}

function __minLen(el, label, n) {
  if (!el) return true;
  const v = (el.value || "").trim();
  if (v && v.length < n) {
    __showToast(`${label} must be at least ${n} characters`);
    return __setInvalid(el, `${label} too short`);
  }
  return true;
}

function __isDate(el, label="Date") {
  if (!el) return true;
  const v = (el.value || "").trim();
  if (!v) return __required(el, label);
  const ok = /^\d{4}-\d{2}-\d{2}/.test(v); // allow datetime-local prefix too
  if (!ok) {
    __showToast(`${label} format invalid`);
    return __setInvalid(el, `${label} invalid`);
  }
  return true;
}

function __isNumber(el, label="Number", min=null, max=null) {
  if (!el) return true;
  const v=(el.value||"").trim();
  if (!v) return true;
  const n=Number(v);
  if (Number.isNaN(n)) {
    __showToast(`${label} must be a number`);
    return __setInvalid(el, `${label} invalid`);
  }
  if (min!==null && n<min) {
    __showToast(`${label} must be >= ${min}`);
    return __setInvalid(el, `${label} too small`);
  }
  if (max!==null && n>max) {
    __showToast(`${label} must be <= ${max}`);
    return __setInvalid(el, `${label} too big`);
  }
  return true;
}
// -----------------------------------------------------------------

// PHASE 1 ELEMENTS
const patientIdInput = document.getElementById('patientId');
const patientNameInput = document.getElementById('patientName');
const prescriptionList = document.getElementById('prescriptionList');
const addMedicineBtn = document.getElementById('addMedicineBtn');
const saveEncounterBtn = document.getElementById('saveEncounterBtn');
const emrMessage = document.getElementById('emrMessage');

// PHASE 2 ELEMENTS
const noEncounterNote = document.getElementById('noEncounterNote');
const encounterSummary = document.getElementById('encounterSummary');
const sumPatientId = document.getElementById('sumPatientId');
const sumPatientName = document.getElementById('sumPatientName');
const sumDiagnosis = document.getElementById('sumDiagnosis');
const sumBp = document.getElementById('sumBp');
const sumPulse = document.getElementById('sumPulse');
const sumTemp = document.getElementById('sumTemp');
const summaryMedicinesBody = document.getElementById('summaryMedicinesBody');

// PHASE 3 ELEMENTS
const dischargeSummaryInput = document.getElementById('dischargeSummary');
const exportFormatSelect = document.getElementById('exportFormat');
const exportBtn = document.getElementById('exportBtn');
const exportMessage = document.getElementById('exportMessage');

let medicines = [];

// PHASE 1: add medicine row
addMedicineBtn.addEventListener('click', function () {
  medicines.push({ name: '', dose: '', days: '' });
  renderMedicines();
});

function renderMedicines() {
  prescriptionList.innerHTML = '';

  medicines.forEach(function (med, i) {
    const row = document.createElement('div');

    const nameInput = document.createElement('input');
    nameInput.placeholder = 'Medicine Name';
    nameInput.value = med.name;
    nameInput.addEventListener('input', function () {
      medicines[i].name = nameInput.value;
    });

    const doseInput = document.createElement('input');
    doseInput.placeholder = 'Dose';
    doseInput.value = med.dose;
    doseInput.addEventListener('input', function () {
      medicines[i].dose = doseInput.value;
    });

    const daysInput = document.createElement('input');
    daysInput.type = 'number';
    daysInput.placeholder = 'Days';
    daysInput.value = med.days;
    daysInput.addEventListener('input', function () {
      medicines[i].days = daysInput.value;
    });

    const removeBtn = document.createElement('button');
    removeBtn.textContent = 'X';
    removeBtn.addEventListener('click', function () {
      medicines.splice(i, 1);
      renderMedicines();
    });

    row.appendChild(nameInput);
    row.appendChild(doseInput);
    row.appendChild(daysInput);
    row.appendChild(removeBtn);

    prescriptionList.appendChild(row);
  });
}

// PHASE 1: save encounter
saveEncounterBtn.addEventListener('click', function () {
  const encounter = {
    patientId: patientIdInput.value.trim(),
    patientName: patientNameInput.value.trim(),
    bp: document.getElementById('bp').value.trim(),
    pulse: document.getElementById('pulse').value.trim(),
    temperature: document.getElementById('temperature').value.trim(),
    diagnosis: document.getElementById('diagnosis').value,
    medicines: medicines
  };

  if (!encounter.patientId || !encounter.patientName || !encounter.diagnosis) {
    emrMessage.textContent = 'Please enter Patient ID, Name and Diagnosis.';
    emrMessage.style.color = 'red';
    return;
  }

  emrMessage.textContent = 'Encounter saved (demo only).';
  emrMessage.style.color = 'green';

  // PHASE 2 view update
  updatePhase2View(encounter);
});

// PHASE 2: show report-style summary
function updatePhase2View(encounter) {
  // hide info text
  noEncounterNote.style.display = 'none';
  // show summary box
  encounterSummary.style.display = 'block';

  sumPatientId.textContent = encounter.patientId;
  sumPatientName.textContent = encounter.patientName;
  sumDiagnosis.textContent = encounter.diagnosis || '-';
  sumBp.textContent = encounter.bp || '-';
  sumPulse.textContent = encounter.pulse || '-';
  sumTemp.textContent = encounter.temperature || '-';

  summaryMedicinesBody.innerHTML = '';
  if (encounter.medicines.length === 0) {
    const row = document.createElement('tr');
    const cell = document.createElement('td');
    cell.colSpan = 3;
    cell.textContent = 'No medicines added.';
    row.appendChild(cell);
    summaryMedicinesBody.appendChild(row);
  } else {
    encounter.medicines.forEach(function (m) {
      const row = document.createElement('tr');
      const c1 = document.createElement('td');
      const c2 = document.createElement('td');
      const c3 = document.createElement('td');

      c1.textContent = m.name || '-';
      c2.textContent = m.dose || '-';
      c3.textContent = m.days || '-';

      row.appendChild(c1);
      row.appendChild(c2);
      row.appendChild(c3);

      summaryMedicinesBody.appendChild(row);
    });
  }
}

// PHASE 3: Discharge & Export
exportBtn.addEventListener('click', function () {
  const summary = dischargeSummaryInput.value.trim();
  const format = exportFormatSelect.value;

  if (!summary || !format) {
    exportMessage.textContent = 'Please enter summary and select format.';
    exportMessage.style.color = 'red';
    return;
  }

  exportMessage.textContent =
    'Discharge summary exported as ' + format.toUpperCase() + ' (demo only).';
  exportMessage.style.color = 'green';
});


/* MVC_API_INTEGRATION */

(async function(){
  try{
    const r = await fetch((window.BASE_URL||'') + '/api/emr');
    if(r.ok){
      const data = await r.json();
      // Your current EMR UI is encounter-based; keep data available for later mapping
      window.__emrRecords = data;
    }
  }catch(e){ console.warn('API load failed', e); }
})();

document.addEventListener('click', async function(ev){
  if(ev.target && ev.target.id==='saveEncounterBtn'){
    try{
      const payload = {
        patient_id: parseInt(document.getElementById('patientId')?.value || '1',10),
        doctor_name: document.getElementById('doctorName')?.value || 'Doctor',
        department: document.getElementById('department')?.value || '',
        visit_date: document.getElementById('visitDate')?.value || '',
        diagnosis: document.getElementById('diagnosis')?.value || '',
        prescription: (window.medicines || []).join(', '),
        notes: document.getElementById('notes')?.value || ''
      };
      await fetch((window.BASE_URL||'') + '/api/emr', {method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(payload)});
    }catch(e){ console.warn('API save failed', e); }
  }
});



// ---------------- AUTO-VALIDATION PATCH ----------------

document.addEventListener("submit", function(e){
  const form = e.target;
  if (!form) return;
  // EMR: try detect by having patient/doctor fields
  const patient = form.querySelector("#patientName, #patient_name, [name='patientName'], [name='patient_name']");
  const doctor  = form.querySelector("#doctorName, #doctor_name, [name='doctorName'], [name='doctor_name']");
  const vdate   = form.querySelector("#visitDate, #visit_date, [name='visitDate'], [name='visit_date']");
  const diag    = form.querySelector("#diagnosis, [name='diagnosis']");
  const pres    = form.querySelector("#prescription, [name='prescription']");

  const looksLikeEmr = patient && doctor && (diag || pres);
  if (!looksLikeEmr) return;

  const ok =
    __required(patient, "Patient Name") &&
    __required(doctor, "Doctor Name") &&
    __isDate(vdate, "Visit Date") &&
    __required(diag, "Diagnosis") &&
    __minLen(diag, "Diagnosis", 3) &&
    __minLen(pres, "Prescription", 3);

  if (!ok) { e.preventDefault(); e.stopPropagation(); }
}, true);

// -------------------------------------------------------
