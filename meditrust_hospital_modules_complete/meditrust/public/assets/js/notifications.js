
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

let logs = [];
let notifCounter = 0;
let sentTimes = []; // timestamps for rate limit

function nowTimeString() {
  return new Date().toLocaleString();
}

function generateNotifId() {
  notifCounter++;
  return "NT-" + String(notifCounter).padStart(3, "0");
}

function getRateLimit() {
  const limit = parseInt(document.getElementById("rateLimit").value || "3", 10);
  return isNaN(limit) ? 3 : Math.max(1, limit);
}

function isRateLimited() {
  const limit = getRateLimit();
  const now = Date.now();
  sentTimes = sentTimes.filter(t => now - t <= 60000);
  return sentTimes.length >= limit;
}

function recordSent() {
  sentTimes.push(Date.now());
}

function pickProvider(channel) {
  if (channel === "SMS") return "(SMS)";
  if (channel === "Email") return "(Email)";
  return "MediTrust (In-App)";
}

function setStatus(elId, text, ok = true) {
  const el = document.getElementById(elId);
  el.style.color = ok ? "#0f766e" : "#b91c1c";
  el.textContent = text;
}

function updateKPIs() {
  document.getElementById("kpiTotal").textContent = logs.length;
  document.getElementById("kpiSent").textContent = logs.filter(l => l.status === "Sent").length;
  document.getElementById("kpiBlocked").textContent = logs.filter(l => l.status.indexOf("Blocked") >= 0).length;
  document.getElementById("kpiHigh").textContent = logs.filter(l => l.priority === "High").length;
}

function renderTable(list) {
  const body = document.getElementById("logBody");

  if (!list.length) {
    body.innerHTML = `<tr><td colspan="8" id="emptyRow">No notifications found</td></tr>`;
    return;
  }

  body.innerHTML = list.map(n => `
    <tr>
      <td>${n.id}</td>
      <td>${n.type}</td>
      <td>${n.userType} (${n.userName})</td>
      <td>${n.channel}</td>
      <td>${n.provider}</td>
      <td>${n.priority}</td>
      <td>${n.status}</td>
      <td>${n.time}</td>
    </tr>
  `).join("");
}

function applyFilters(silent = false) {
  const ch = document.getElementById("filterChannel").value;
  const st = document.getElementById("filterStatus").value;
  const pr = document.getElementById("filterPriority").value;

  let filtered = [...logs];
  if (ch !== "All") filtered = filtered.filter(l => l.channel === ch);
  if (st !== "All") filtered = filtered.filter(l => l.status === st);
  if (pr !== "All") filtered = filtered.filter(l => l.priority === pr);

  renderTable(filtered);
  if (!silent) updateKPIs();
}

function addLog(entry) {
  logs.unshift(entry);
  applyFilters(true);
  updateKPIs();
}

/* Phase 1 Manual */
document.getElementById("sendManualBtn").addEventListener("click", () => {
  const userName = document.getElementById("recName").value.trim();
  const userType = document.getElementById("recType").value;
  const channel = document.getElementById("channel").value;
  const lang = document.getElementById("lang").value;
  const msg = document.getElementById("message").value.trim();
  const priority = document.getElementById("priority").value;
  let provider = document.getElementById("provider").value;

  if (!userName || !userType || !channel || !lang || !msg || !priority) {
    setStatus("manualStatus", "❌ Please fill all required fields.", false);
    return;
  }

  if (!provider) provider = pickProvider(channel);

  const limited = isRateLimited();
  const status = limited ? "Blocked (Rate Limited)" : "Sent";

  if (!limited) recordSent();

  addLog({
    id: generateNotifId(),
    type: "Manual",
    userName,
    userType,
    channel,
    provider,
    priority,
    status,
    time: nowTimeString()
  });

  setStatus(
    "manualStatus",
    limited ? "⚠️ Notification blocked due to rate limit." : `✅ Notification sent via ${channel} (${provider})`
  );
});

/* Phase 2 Trigger */
document.getElementById("triggerBtn").addEventListener("click", () => {
  const eventName = document.getElementById("triggerEvent").value;
  const channel = document.getElementById("triggerChannel").value;
  const userType = document.getElementById("triggerUser").value;
  const template = document.getElementById("template").value;

  if (!eventName || !channel || !userType || !template) {
    setStatus("triggerStatus", "❌ Please select event, channel, user and template.", false);
    return;
  }

  const provider = pickProvider(channel);
  const limited = isRateLimited();
  const status = limited ? "Blocked (Rate Limited)" : "Sent";

  if (!limited) recordSent();

  addLog({
    id: generateNotifId(),
    type: "Trigger: " + eventName,
    userName: "AutoUser",
    userType,
    channel,
    provider,
    priority: "Normal",
    status,
    time: nowTimeString()
  });

  setStatus(
    "triggerStatus",
    limited ? "⚠️ Trigger blocked due to rate limit." : `✅ Trigger executed: ${eventName}`
  );
});

/* Phase 3 Filters */
document.getElementById("applyFilterBtn").addEventListener("click", () => applyFilters());
document.getElementById("resetFilterBtn").addEventListener("click", () => {
  document.getElementById("filterChannel").value = "All";
  document.getElementById("filterStatus").value = "All";
  document.getElementById("filterPriority").value = "All";
  renderTable(logs);
});

/* Initial */
renderTable(logs);
updateKPIs();


/* MVC_API_INTEGRATION */

(async function(){
  try{
    const r = await fetch((window.BASE_URL||'') + '/api/notifications');
    if(r.ok){
      const data = await r.json();
      if(Array.isArray(data)) { notifs = data; }
      if(typeof renderTable==='function') renderTable();
      if(typeof updateKPIs==='function') updateKPIs();
    }
  }catch(e){ console.warn('API load failed', e); }
})();

document.addEventListener('click', async function(ev){
  if(ev.target && ev.target.id==='sendBtn'){
    try{
      const payload = {
        title: document.getElementById('title')?.value || 'Notification',
        message: document.getElementById('message')?.value || '',
        target_role: document.getElementById('audience')?.value || 'all'
      };
      await fetch((window.BASE_URL||'') + '/api/notifications', {method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(payload)});
    }catch(e){ console.warn('API save failed', e); }
  }
});



// ---------------- AUTO-VALIDATION PATCH ----------------

document.addEventListener("submit", function(e){
  const form = e.target;
  if (!form) return;
  const title = form.querySelector("#title, #notifTitle, [name='title']");
  const msg   = form.querySelector("#message, #notifMessage, [name='message']");
  const looksLikeNotif = title && msg;
  if (!looksLikeNotif) return;

  const ok = __required(title, "Title") && __minLen(title, "Title", 3) &&
             __required(msg, "Message") && __minLen(msg, "Message", 5);

  if (!ok) { e.preventDefault(); e.stopPropagation(); }
}, true);

// -------------------------------------------------------
