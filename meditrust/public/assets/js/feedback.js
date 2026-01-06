
// ---------------- ----------------
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

document.addEventListener("DOMContentLoaded", function () {
  // PHASE 1 ELEMENTS
  const fbName = document.getElementById("fbName");
  const fbContact = document.getElementById("fbContact");
  const fbType = document.getElementById("fbType");
  const fbCategory = document.getElementById("fbCategory");
  const fbPriority = document.getElementById("fbPriority");
  const fbMessageText = document.getElementById("fbMessageText");
  const submitFbBtn = document.getElementById("submitFbBtn");
  const phase1Status = document.getElementById("phase1Status");

  // PHASE 2 ELEMENTS
  const filterType = document.getElementById("filterType");
  const filterStatus = document.getElementById("filterStatus");
  const filterPriority = document.getElementById("filterPriority");
  const applyFilterBtn = document.getElementById("applyFilterBtn");
  const clearFilterBtn = document.getElementById("clearFilterBtn");
  const complaintBody = document.getElementById("complaintBody");
  const statusUpdateId = document.getElementById("statusUpdateId");
  const newStatusSelect = document.getElementById("newStatusSelect");
  const updateStatusBtn = document.getElementById("updateStatusBtn");
  const phase2Status = document.getElementById("phase2Status");

  // PHASE 3 ELEMENTS
  const kpiFeedbackCount = document.getElementById("kpiFeedbackCount");
  const kpiComplaintCount = document.getElementById("kpiComplaintCount");
  const kpiOpenCount = document.getElementById("kpiOpenCount");
  const kpiClosedCount = document.getElementById("kpiClosedCount");
  const categoryBody = document.getElementById("categoryBody");
  const recalcAnalyticsBtn = document.getElementById("recalcAnalyticsBtn");
  const phase3Status = document.getElementById("phase3Status");

  // DATA
  let items = [];
  let idCounter = 1;

  // ---------- PHASE 1: SUBMIT ----------

  submitFbBtn.addEventListener("click", function () {
    const name = fbName.value.trim();
    const contact = fbContact.value.trim();
    const type = fbType.value;
    const category = fbCategory.value;
    const priority = fbPriority.value;
    const message = fbMessageText.value.trim();

    if (!name) {
      showStatus(phase1Status, "Please enter name.", "red");
      return;
    }
    if (!contact) {
      showStatus(phase1Status, "Please enter contact.", "red");
      return;
    }
    if (!category) {
      showStatus(phase1Status, "Please select category.", "red");
      return;
    }
    if (!message) {
      showStatus(phase1Status, "Please enter message.", "red");
      return;
    }

    const id = "FB-" + String(idCounter).padStart(3, "0");
    idCounter++;

    const item = {
      id: id,
      name: name,
      contact: contact,
      type: type,
      category: category,
      priority: priority,
      status: "Open",
      message: message
    };

    items.push(item);
    renderTable(items);
    updateAnalytics();

    fbMessageText.value = "";
    showStatus(phase1Status, "Submitted successfully. ID: " + id, "green");
  });

  // ---------- PHASE 2: TABLE & FILTER & STATUS ----------

  function renderTable(list) {
    complaintBody.innerHTML = "";

    if (list.length === 0) {
      const row = document.createElement("tr");
      const cell = document.createElement("td");
      cell.colSpan = 6; // ID, Name, Type, Category, Priority, Status
      cell.textContent = "No records.";
      row.appendChild(cell);
      complaintBody.appendChild(row);
      return;
    }

    list.forEach(function (it) {
      const row = document.createElement("tr");
      row.innerHTML =
        "<td>" + it.id + "</td>" +
        "<td>" + it.name + "</td>" +
        "<td>" + it.type + "</td>" +
        "<td>" + it.category + "</td>" +
        "<td>" + it.priority + "</td>" +
        "<td>" + it.status + "</td>";
      complaintBody.appendChild(row);
    });
  }

  applyFilterBtn.addEventListener("click", function () {
    const t = filterType.value;
    const s = filterStatus.value;
    const p = filterPriority.value;

    const filtered = items.filter(function (it) {
      if (t && it.type !== t) return false;
      if (s && it.status !== s) return false;
      if (p && it.priority !== p) return false;
      return true;
    });

    renderTable(filtered);
    showStatus(phase2Status, "Filter applied.", "green");
  });

  clearFilterBtn.addEventListener("click", function () {
    filterType.value = "";
    filterStatus.value = "";
    filterPriority.value = "";
    renderTable(items);
    showStatus(phase2Status, "Filter cleared.", "green");
  });

  updateStatusBtn.addEventListener("click", function () {
    const id = statusUpdateId.value.trim();
    const newStatus = newStatusSelect.value;

    if (!id) {
      showStatus(phase2Status, "Please enter Complaint ID.", "red");
      return;
    }

    const found = items.find(function (it) { return it.id === id; });
    if (!found) {
      showStatus(phase2Status, "ID not found.", "red");
      return;
    }

    found.status = newStatus;
    renderTable(items);
    updateAnalytics();
    showStatus(phase2Status, "Status updated for " + id, "green");
  });

  // ---------- PHASE 3: ANALYTICS ----------

  function updateAnalytics() {
    const feedbackItems = items.filter(it => it.type === "Feedback");
    const complaintItems = items.filter(it => it.type === "Complaint");
    const openItems = items.filter(it => it.status === "Open");
    const closedItems = items.filter(it => it.status === "Closed");

    kpiFeedbackCount.textContent = feedbackItems.length;
    kpiComplaintCount.textContent = complaintItems.length;
    kpiOpenCount.textContent = openItems.length;
    kpiClosedCount.textContent = closedItems.length;

    const catMap = {};
    items.forEach(function (it) {
      if (!catMap[it.category]) catMap[it.category] = 0;
      catMap[it.category]++;
    });

    categoryBody.innerHTML = "";
    Object.keys(catMap).forEach(function (cat) {
      const row = document.createElement("tr");
      row.innerHTML =
        "<td>" + cat + "</td>" +
        "<td>" + catMap[cat] + "</td>";
      categoryBody.appendChild(row);
    });
  }

  recalcAnalyticsBtn.addEventListener("click", function () {
    updateAnalytics();
    showStatus(phase3Status, "Analytics recalculated.", "green");
  });

  // ---------- HELPERS & INITIAL ----------

  function showStatus(el, msg, color) {
    el.textContent = msg;
    el.style.color = color;
  }

  renderTable(items);
  updateAnalytics();
});


/* MVC_API_INTEGRATION */

(async function(){
  try{
    const r = await fetch((window.BASE_URL||'') + '/api/feedback');
    if(r.ok){
      const data = await r.json();
      if(Array.isArray(data)) { entries = data; }
      if(typeof renderTable==='function') renderTable();
      if(typeof updateAnalytics==='function') updateAnalytics();
    }
  }catch(e){ console.warn('API load failed', e); }
})();

document.addEventListener('click', async function(ev){
  if(ev.target && ev.target.id==='submitFbBtn'){
    try{
      const payload = {
        patient_name: document.getElementById('fbName')?.value || '',
        category: document.getElementById('fbCategory')?.value || '',
        message: document.getElementById('fbMessageText')?.value || '',
        status: 'Open'
      };
      await fetch((window.BASE_URL||'') + '/api/feedback', {method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(payload)});
    }catch(e){ console.warn('API save failed', e); }
  }
});



// ---------------- AUTO-VALIDATION PATCH ----------------

document.addEventListener("submit", function(e){
  const form = e.target;
  if (!form) return;
  const name = form.querySelector("#patientName, #patient_name, [name='patient_name'], [name='patientName']");
  const cat  = form.querySelector("#category, [name='category']");
  const msg  = form.querySelector("#message, #feedbackMessage, [name='message']");
  const looksLikeFeedback = name && msg && cat;
  if (!looksLikeFeedback) return;

  const ok =
    __required(name, "Patient Name") &&
    __required(cat, "Category") &&
    __required(msg, "Message") &&
    __minLen(msg, "Message", 10);

  if (!ok) { e.preventDefault(); e.stopPropagation(); }
}, true);

// -------------------------------------------------------
