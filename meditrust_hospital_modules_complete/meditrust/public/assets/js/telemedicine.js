
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

let sessions = [];
let sessionCounter = 0;
let active = null;

function idGen() {
  sessionCounter++;
  return "TM-" + String(sessionCounter).padStart(3, "0");
}

function setStatus(id, text, ok = true) {
  const el = document.getElementById(id);
  el.style.color = ok ? "#0f766e" : "#b91c1c";
  el.textContent = text;
}

function renderQueue() {
  const body = document.getElementById("queueBody");

  if (!sessions.length) {
    body.innerHTML = `<tr><td colspan="7" id="emptyRow">No bookings yet</td></tr>`;
    return;
  }

  body.innerHTML = sessions.map(s => `
    <tr>
      <td>${s.id}</td>
      <td>${s.patient}</td>
      <td>${s.doctor}</td>
      <td>${s.type}</td>
      <td>${s.datetime}</td>
      <td>${s.status}</td>
      <td><button onclick="selectSession('${s.id}')">Select</button></td>
    </tr>
  `).join("");
}

window.selectSession = function(id) {
  const s = sessions.find(x => x.id === id);
  if (!s) return;

  active = s;
  document.getElementById("activeSession").textContent = `${s.id} (${s.patient} → ${s.doctor})`;
  document.getElementById("connStatus").textContent = "Ready";
  setStatus("sessionStatus", `✅ Selected ${s.id}. You can now Join.`, true);
};

function pushChat(role, msg) {
  const box = document.getElementById("chatBox");

  const div = document.createElement("div");
  div.style.padding = "8px 10px";
  div.style.borderRadius = "12px";
  div.style.marginBottom = "8px";
  div.style.maxWidth = "90%";
  div.style.fontSize = "14px";

  if (role === "user") {
    div.style.background = "#dbeafe";
    div.style.marginLeft = "auto";
  } else {
    div.style.background = "#f3f4f6";
    div.style.marginRight = "auto";
  }

  div.textContent = msg;
  box.appendChild(div);
  box.scrollTop = box.scrollHeight;
}

function updateConnStatus(text) {
  document.getElementById("connStatus").textContent = text;
}

/* Phase 1 Booking */
document.getElementById("bookBtn").addEventListener("click", () => {
  const patient = document.getElementById("pName").value.trim();
  const doctor = document.getElementById("dName").value.trim();
  const dept = document.getElementById("dept").value;
  const type = document.getElementById("type").value;
  const date = document.getElementById("date").value;
  const time = document.getElementById("time").value;

  if (!patient || !doctor || !dept || !type || !date || !time) {
    setStatus("bookStatus", "❌ Please fill all booking fields.", false);
    return;
  }

  const session = {
    id: idGen(),
    patient,
    doctor,
    dept,
    type,
    datetime: `${date} ${time}`,
    status: "Waiting Room",
    joined: false,
    ended: false,
    lowBW: false,
    recording: false
  };

  sessions.unshift(session);
  renderQueue();
  setStatus("bookStatus", `✅ Booking created! Session ID: ${session.id}`, true);
});

/* Phase 2 Join */
document.getElementById("joinBtn").addEventListener("click", () => {
  if (!active) {
    setStatus("sessionStatus", "❌ Please select a session first.", false);
    return;
  }
  if (active.ended) {
    setStatus("sessionStatus", "❌ Session already ended.", false);
    return;
  }

  active.joined = true;
  active.status = "In Consultation";
  active.lowBW = document.getElementById("lowBW").checked;
  active.recording = document.getElementById("recording").checked;

  updateConnStatus(active.lowBW ? "Connected (Low BW)" : "Connected (HD)");
  pushChat("bot", `System: ${active.id} joined. ${active.recording ? "Recording ON 🎥" : "Recording OFF"}`);
  pushChat("bot", `Doctor: Hello ${active.patient}, how can I help you today?`);

  setStatus("sessionStatus", "✅ Session started successfully.", true);
  renderQueue();
});

/* Phase 2 End */
document.getElementById("endBtn").addEventListener("click", () => {
  if (!active) {
    setStatus("sessionStatus", "❌ No active session selected.", false);
    return;
  }

  active.ended = true;
  active.status = "Completed";

  updateConnStatus("Disconnected");
  pushChat("bot", `System: Session ${active.id} ended ✅`);
  setStatus("sessionStatus", "✅ Session ended. Go to Wrap-up to generate summary.", true);
  renderQueue();
});

/* Chat */
document.getElementById("sendChatBtn").addEventListener("click", () => {
  if (!active || !active.joined || active.ended) {
    setStatus("sessionStatus", "❌ Join an active session to chat.", false);
    return;
  }

  const text = document.getElementById("chatInput").value.trim();
  if (!text) return;

  pushChat("user", `Patient: ${text}`);
  document.getElementById("chatInput").value = "";
  pushChat("bot", "Doctor: Noted. Please continue explaining symptoms.");
});

/* File share */
document.getElementById("shareFileBtn").addEventListener("click", () => {
  if (!active || !active.joined || active.ended) {
    setStatus("sessionStatus", "❌ Join an active session to share files.", false);
    return;
  }

  const file = document.getElementById("fileName").value.trim();
  if (!file) {
    setStatus("sessionStatus", "❌ Enter a file name to share.", false);
    return;
  }

  pushChat("user", `Patient shared: ${file} 📎`);
  pushChat("bot", "Doctor: File received. I will review it.");
  document.getElementById("fileName").value = "";
});

/* Phase 3 Wrap-up */
document.getElementById("wrapBtn").addEventListener("click", () => {
  if (!active) {
    setStatus("wrapStatus", "❌ Please select a session first.", false);
    return;
  }

  const diagnosis = document.getElementById("diag").value.trim();
  const follow = document.getElementById("followUp").value;
  const presc = document.getElementById("presc").value.trim();
  const fee = document.getElementById("fee").value;
  const payment = document.getElementById("payment").value;

  if (!diagnosis || !presc || !payment) {
    setStatus("wrapStatus", "❌ Fill diagnosis, prescription and payment status.", false);
    return;
  }

  const summary =
`Telemedicine Summary
--------------------
Session ID: ${active.id}
Patient: ${active.patient}
Doctor: ${active.doctor}
Department: ${active.dept}
Type: ${active.type}
DateTime: ${active.datetime}

Connection Mode: ${active.lowBW ? "Low Bandwidth" : "HD"}
Recording: ${active.recording ? "Enabled" : "Disabled"}
Session Status: ${active.status}

Diagnosis:
- ${diagnosis}

E-Prescription:
${presc}

Follow-up Date:
- ${follow || "Not scheduled"}

Payment:
- Fee: ${fee} BDT
- Status: ${payment}

System Note:
- Frontend demo; backend will store summary & generate PDF prescription.`;

  document.getElementById("summaryText").textContent = summary;
  setStatus("wrapStatus", "✅ Summary generated successfully.", true);
});

renderQueue();


/* MVC_API_INTEGRATION */

(async function(){
  try{
    const r = await fetch((window.BASE_URL||'') + '/api/telemedicine');
    if(r.ok){
      const data = await r.json();
      if(Array.isArray(data)) { sessions = data; }
      if(typeof renderQueue==='function') renderQueue();
    }
  }catch(e){ console.warn('API load failed', e); }
})();

document.addEventListener('click', async function(ev){
  if(ev.target && ev.target.id==='bookBtn'){
    try{
      const payload = {
        session_code: document.getElementById('sessionId')?.value || undefined,
        patient_name: document.getElementById('patient')?.value || '',
        doctor_name: document.getElementById('doctor')?.value || '',
        department: document.getElementById('department')?.value || '',
        consult_type: document.getElementById('consultType')?.value || 'Video',
        datetime: document.getElementById('dateTime')?.value || '',
        low_bw: document.getElementById('lowBW')?.checked ? 1 : 0,
        recording: document.getElementById('recording')?.checked ? 1 : 0,
        status: 'Waiting Room'
      };
      await fetch((window.BASE_URL||'') + '/api/telemedicine', {method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(payload)});
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
  const ctype   = form.querySelector("#consultType, #consult_type, [name='consult_type']");
  const dt      = form.querySelector("#datetime, #dateTime, [name='datetime'], [type='datetime-local']");
  // Telemedicine booking likely has these fields
  const looksLikeTele = patient && doctor && (ctype || dt) && !form.querySelector("#visitType,#visit_type");
  if (!looksLikeTele) return;

  const ok =
    __required(patient, "Patient Name") &&
    __required(doctor, "Doctor Name") &&
    __required(dept, "Department") &&
    __required(ctype, "Consult Type") &&
    __required(dt, "Date & Time");

  if (!ok) { e.preventDefault(); e.stopPropagation(); }
}, true);

// Wrap-up validation (buttons or forms)
document.addEventListener("click", function(e){
  const btn = e.target.closest("button, a, input[type='button'], input[type='submit']");
  if (!btn) return;
  const text = (btn.innerText || btn.value || "").toLowerCase();
  if (!text.includes("wrap") && !text.includes("finish") && !text.includes("complete")) return;

  const diag = document.querySelector("#diagnosis, [name='diagnosis']");
  const pres = document.querySelector("#prescription, [name='prescription']");
  if (!diag && !pres) return;

  const ok = __required(diag, "Diagnosis") && __minLen(diag, "Diagnosis", 3) &&
             __required(pres, "Prescription") && __minLen(pres, "Prescription", 3);
  if (!ok) { e.preventDefault(); e.stopPropagation(); }
}, true);

// -------------------------------------------------------
