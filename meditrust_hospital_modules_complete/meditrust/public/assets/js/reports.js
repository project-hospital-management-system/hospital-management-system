
// ---------------- VALIDATION HELPERS (auto-added) ----------------
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

document.addEventListener('DOMContentLoaded', function () {
  // ---- ELEMENTS ----
  const doctorSelect = document.getElementById('doctorSelect');
  const deptSelect = document.getElementById('deptSelect');
  const visitDate = document.getElementById('visitDate');
  const patientName = document.getElementById('patientName');
  const visitType = document.getElementById('visitType');
  const visitRevenue = document.getElementById('visitRevenue');
  const addVisitBtn = document.getElementById('addVisitBtn');
  const phase1Status = document.getElementById('phase1Status');
  const visitBody = document.getElementById('visitBody');

  const kpiTotalVisits = document.getElementById('kpiTotalVisits');
  const kpiOpdVisits = document.getElementById('kpiOpdVisits');
  const kpiIpdVisits = document.getElementById('kpiIpdVisits');
  const kpiRevenue = document.getElementById('kpiRevenue');
  const refreshDashboardBtn = document.getElementById('refreshDashboardBtn');
  const phase2Status = document.getElementById('phase2Status');

  const cohortBody = document.getElementById('cohortBody');
  const productivityBody = document.getElementById('productivityBody');
  const tatBody = document.getElementById('tatBody');
  const recalcAnalyticsBtn = document.getElementById('recalcAnalyticsBtn');
  const phase3Status = document.getElementById('phase3Status');

  // visits array (starting empty)
  let visits = [];

  // ----------------- PHASE 1: ADD VISITS -----------------

  addVisitBtn.addEventListener('click', function () {
    const doctor = doctorSelect.value;
    const dept = deptSelect.value;
    const dateVal = visitDate.value;
    const patient = patientName.value.trim();
    const type = visitType.value;
    const revenueVal = parseFloat(visitRevenue.value) || 0;

    if (!doctor) {
      phase1Status.textContent = 'Please select a doctor.';
      phase1Status.style.color = 'red';
      return;
    }

    if (!dateVal) {
    
      phase1Status.textContent = 'Please select a date before adding.';
      phase1Status.style.color = 'red';
      return;
    }

    if (!patient) {
      phase1Status.textContent = 'Please enter patient name.';
      phase1Status.style.color = 'red';
      return;
    }

    const visit = {
      patient: patient,
      doctor: doctor,
      dept: dept || '-',
      date: dateVal,
      type: type,
      revenue: revenueVal
    };

    visits.push(visit);
    renderVisitTable();
    // Doctor selection thakbe, kintu patient & revenue field clear korbo
    patientName.value = '';
    visitRevenue.value = '';

    phase1Status.textContent = 'Visit added to list.';
    phase1Status.style.color = 'green';
  });

  function renderVisitTable() {
    visitBody.innerHTML = '';

    if (visits.length === 0) {
      const row = document.createElement('tr');
      const cell = document.createElement('td');
      cell.colSpan = 6;
      cell.textContent = 'No visits added yet.';
      row.appendChild(cell);
      visitBody.appendChild(row);
      return;
    }

    visits.forEach(function (v) {
      const row = document.createElement('tr');

      const c1 = document.createElement('td');
      const c2 = document.createElement('td');
      const c3 = document.createElement('td');
      const c4 = document.createElement('td');
      const c5 = document.createElement('td');
      const c6 = document.createElement('td');

      c1.textContent = v.patient;
      c2.textContent = v.doctor;
      c3.textContent = v.dept;
      c4.textContent = v.date;
      c5.textContent = v.type;
      c6.textContent = v.revenue;

      row.appendChild(c1);
      row.appendChild(c2);
      row.appendChild(c3);
      row.appendChild(c4);
      row.appendChild(c5);
      row.appendChild(c6);

      visitBody.appendChild(row);
    });
  }

  // ----------------- PHASE 2: DASHBOARD -----------------

  function updateKPIs() {
    const total = visits.length;
    const opd = visits.filter(v => v.type === 'OPD').length;
    const ipd = visits.filter(v => v.type === 'IPD').length;
    const revenue = visits.reduce((sum, v) => sum + v.revenue, 0);

    // phase 2  primarily 0 

    kpiTotalVisits.textContent = total;
    kpiOpdVisits.textContent = opd;
    kpiIpdVisits.textContent = ipd;
    kpiRevenue.textContent = revenue;
  }

  // initially dashboard 0 
  updateKPIs();

  refreshDashboardBtn.addEventListener('click', function () {
    updateKPIs();
    phase2Status.textContent = 'Dashboard refreshed.';
    phase2Status.style.color = 'green';
  });

  // ----------------- PHASE 3: ANALYTICS -----------------

  function updateAnalytics() {
    const deptMap = {};
    visits.forEach(function (v) {
      if (!deptMap[v.dept]) {
        deptMap[v.dept] = { visits: 0, revenue: 0 };
      }
      deptMap[v.dept].visits += 1;
      deptMap[v.dept].revenue += v.revenue;
    });

    cohortBody.innerHTML = '';
    Object.keys(deptMap).forEach(function (dept) {
      const info = deptMap[dept];
      const avgRev = info.visits > 0 ? (info.revenue / info.visits) : 0;

      const row = document.createElement('tr');
      const c1 = document.createElement('td');
      const c2 = document.createElement('td');
      const c3 = document.createElement('td');

      c1.textContent = dept;
      c2.textContent = info.visits;
      c3.textContent = avgRev.toFixed(0);

      row.appendChild(c1);
      row.appendChild(c2);
      row.appendChild(c3);
      cohortBody.appendChild(row);
    });

    // Doctor productivity
    const docMap = {};
    visits.forEach(function (v) {
      if (!docMap[v.doctor]) {
        docMap[v.doctor] = 0;
      }
      docMap[v.doctor] += 1;
    });

    productivityBody.innerHTML = '';
    Object.keys(docMap).forEach(function (doc) {
      const count = docMap[doc];

      const row = document.createElement('tr');
      const c1 = document.createElement('td');
      const c2 = document.createElement('td');
      const c3 = document.createElement('td');

      c1.textContent = doc;
      c2.textContent = count;
      // very simple estimate
      c3.textContent = count;

      row.appendChild(c1);
      row.appendChild(c2);
      row.appendChild(c3);
      productivityBody.appendChild(row);
    });

    // PD = 20 min, IPD = 90 min

    tatBody.innerHTML = '';
    visits.forEach(function (v) {
      const row = document.createElement('tr');
      const c1 = document.createElement('td');
      const c2 = document.createElement('td');
      const c3 = document.createElement('td');
      const c4 = document.createElement('td');

      const duration = v.type === 'IPD' ? 90 : 20;
      const flag = duration > 60 ? 'Slow / Anomaly' : 'Normal';

      c1.textContent = v.patient;
      c2.textContent = v.type;
      c3.textContent = duration + ' min';
      c4.textContent = flag;

      row.appendChild(c1);
      row.appendChild(c2);
      row.appendChild(c3);
      row.appendChild(c4);
      tatBody.appendChild(row);
    });
  }

  updateAnalytics();

  recalcAnalyticsBtn.addEventListener('click', function () {
    updateAnalytics();
    phase3Status.textContent = 'Analytics recalculated.';
    phase3Status.style.color = 'green';
  });

  renderVisitTable();
});


/* MVC_API_INTEGRATION */

(async function(){
  try{
    const r = await fetch((window.BASE_URL||'') + '/api/visits');
    if(r.ok){
      const data = await r.json();
      if(Array.isArray(data)) { visits = data; }
      if(typeof renderVisitTable==='function') renderVisitTable();
      if(typeof updateKPIs==='function') updateKPIs();
      if(typeof updateAnalytics==='function') updateAnalytics();
    }
  }catch(e){ console.warn('API load failed', e); }
})();

document.addEventListener('click', async function(ev){
  if(ev.target && ev.target.id==='addVisitBtn'){
    try{
      const payload = {
        patient_name: document.getElementById('patientName')?.value || '',
        doctor_name: document.getElementById('doctorName')?.value || '',
        department: document.getElementById('deptSelect')?.value || '',
        visit_date: document.getElementById('visitDate')?.value || '',
        visit_type: document.getElementById('visitType')?.value || 'OPD',
        revenue: parseFloat(document.getElementById('revenue')?.value || '0')
      };
      await fetch((window.BASE_URL||'') + '/api/visits', {method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(payload)});
    }catch(e){ console.warn('API save failed', e); }
  }
});



// ---------------- AUTO-VALIDATION PATCH ----------------

document.addEventListener("submit", function(e){
  const form = e.target;
  if (!form) return;
  const patient = form.querySelector("#patientName, #patient_name, [name='patient_name']");
  const doctor  = form.querySelector("#doctorName, #doctor_name, [name='doctor_name']");
  const dept    = form.querySelector("#department, [name='department']");
  const vdate   = form.querySelector("#visitDate, #visit_date, [name='visit_date']");
  const vtype   = form.querySelector("#visitType, #visit_type, [name='visit_type']");
  const revenue = form.querySelector("#revenue, [name='revenue']");
  const looksLikeReports = patient && doctor && dept && vdate && vtype;
  if (!looksLikeReports) return;

  const ok =
    __required(patient, "Patient Name") &&
    __required(doctor, "Doctor Name") &&
    __required(dept, "Department") &&
    __isDate(vdate, "Visit Date") &&
    __required(vtype, "Visit Type") &&
    __isNumber(revenue, "Revenue", 0, 10000000);

  if (!ok) { e.preventDefault(); e.stopPropagation(); }
}, true);

// -------------------------------------------------------
