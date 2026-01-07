// Hospital MVC (PHP + AJAX)
// This is a single-page style UI that talks to /api/index.php via fetch (AJAX).

const PUBLIC_BASE = (window.__BASE_URL__ ?? window.location.pathname.replace(/\/public\/?(index\.php)?$/, '/public')).replace(/\/$/, '');
const APP_BASE = PUBLIC_BASE.replace(/\/public$/, '');
const API = (resource) => `${APP_BASE}/api/index.php?resource=${resource}`;

const qs = (s, r=document) => r.querySelector(s);
const required = (v) => v !== undefined && v !== null && String(v).trim() !== '';

const qsa = (s, r=document) => [...r.querySelectorAll(s)];
const html = (el, m) => el.innerHTML = m;

let route = "patients";

const Layout = () => `
  <div class="container">
    <h1>Hospital Management System (MVC + PHP + AJAX)</h1>
    <div class="nav">
      ${navBtn("patients","Registration")}
      ${navBtn("doctors","Doctors")}
      ${navBtn("appointments","Appointments")}
      ${navBtn("opdipd","OPD / IPD")}
      ${navBtn("pharmacy","Pharmacy")}
    </div>
    <div id="page"></div>
  </div>
`;

const navBtn = (r, label) =>
  `<button data-route="${r}" class="${route===r?"active":""}">${label}</button>`;

async function apiGet(resource){ return (await fetch(API(resource))).json(); }
async function apiPost(resource, body){
  return (await fetch(API(resource), {method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify(body)})).json();
}
async function apiPut(resource, body){
  return (await fetch(API(resource), {method:"PUT", headers:{"Content-Type":"application/json"}, body:JSON.stringify(body)})).json();
}
async function apiDel(resource, body){
  return (await fetch(API(resource), {method:"DELETE", headers:{"Content-Type":"application/json"}, body:JSON.stringify(body)})).json();
}

function badge(text, type){
  return `<span class="badge ${type}">${text}</span>`;
}

function toDateOnly(d){ return (d||"").slice(0,10); }

async function render(){
  const app = qs("#app");
  html(app, Layout());
  const page = qs("#page");

  // nav
  qsa("button[data-route]").forEach(b=>{
    b.addEventListener("click", ()=>{ route=b.dataset.route; render(); });
  });

  if(route==="patients") return PatientsController(page);
  if(route==="doctors") return DoctorsController(page);
  if(route==="appointments") return AppointmentsController(page);
  if(route==="opdipd") return OPDIPDController(page);
  if(route==="pharmacy") return PharmacyController(page);
}

// --- Patients ---
async function PatientsController(root){
  const res = await apiGet("patients");
  const patients = res.data || [];
  html(root, PatientsView(patients));

  qs("#p_register", root).addEventListener("click", async ()=>{
    const body = {
      name: qs("#p_name",root).value.trim(),
      age: qs("#p_age",root).value.trim(),
      gender: qs("#p_gender",root).value.trim(),
      contact: qs("#p_contact",root).value.trim(),
      address: qs("#p_address",root).value.trim(),
    };
    const msg = qs("#p_msg",root); msg.className="msg"; msg.textContent="";
    const out = await apiPost("patients", body);
    if(!out.ok){ msg.classList.add("err"); msg.textContent="⚠ "+out.error; return; }
    msg.classList.add("ok"); msg.textContent="✅ Patient registered: "+out.data.id;
    render();
  });

  qs("#p_search", root).addEventListener("input", (e)=>{
    const q = e.target.value.toLowerCase();
    qsa("tbody tr",root).forEach(tr=> tr.style.display = tr.textContent.toLowerCase().includes(q) ? "" : "none");
  });

  root.addEventListener("click", async (e)=>{
    const btn = e.target.closest("button[data-action='edit-patient']");
    if(!btn) return;
    const id = btn.dataset.id;
    const patient = patients.find(p=>p.id===id);
    if(!patient) return;

    const modal = qs("#modal",root);
    modal.className="modal";
    html(modal, PatientModalView(patient));

    qs("#m_close",modal).addEventListener("click", ()=>{ modal.className="modal hidden"; modal.innerHTML=""; });

    qs("#m_save",modal).addEventListener("click", async ()=>{
      const contact = qs("#m_contact",modal).value.trim();
      const address = qs("#m_address",modal).value.trim();
      const msg = qs("#m_msg",modal); msg.className="msg"; msg.textContent="";
      const out = await apiPut("patients", {id, contact, address});
      if(!out.ok){ msg.classList.add("err"); msg.textContent="⚠ "+out.error; return; }
      msg.classList.add("ok"); msg.textContent="✅ Updated!";
      render();
    });
  });
}

function PatientsView(patients){
  return `
    <div class="grid">
      <div class="card">
        <h2>Patient Registration</h2>
        <div class="row">
          <div><label>Full Name</label><input id="p_name"></div>
          <div><label>Age</label><input id="p_age" type="number" min="0"></div>
        </div>
        <div class="row">
          <div>
            <label>Gender</label>
            <select id="p_gender">
              <option value="">Select</option><option>Male</option><option>Female</option><option>Other</option>
            </select>
          </div>
          <div><label>Contact</label><input id="p_contact"></div>
        </div>
        <label>Address</label><textarea id="p_address"></textarea>
        <button class="btn" id="p_register">Register Patient</button>
        <div id="p_msg" class="msg"></div>
      </div>

      <div class="card">
        <h2>Patient Records</h2>
        <input id="p_search" placeholder="Search by ID or Name">
        <table class="table">
          <thead><tr><th>ID</th><th>Name</th><th>Gender</th><th>Contact</th><th>Action</th></tr></thead>
          <tbody>
            ${patients.map(p=>`
              <tr>
                <td>${p.id}</td><td>${p.name}</td><td>${p.gender}</td><td>${p.contact}</td>
                <td class="actions"><button class="edit" data-action="edit-patient" data-id="${p.id}">View/Edit</button></td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      </div>
    </div>
    <div id="modal" class="modal hidden"></div>
  `;
}

function PatientModalView(p){
  return `
    <div class="card">
      <h2>Edit Patient (${p.id})</h2>
      <label>Name</label><input value="${p.name}" disabled>
      <label>Contact</label><input id="m_contact" value="${p.contact}">
      <label>Address</label><textarea id="m_address">${p.address||""}</textarea>
      <div class="row">
        <button class="btn" id="m_save">Save</button>
        <button class="btn secondary" id="m_close">Close</button>
      </div>
      <div id="m_msg" class="msg"></div>
    </div>
  `;
}

// --- Doctors + Duty ---
async function DoctorsController(root){
  const [docsR, dutiesR] = await Promise.all([apiGet("doctors"), apiGet("duties")]);
  const doctors = docsR.data || [];
  const duties = dutiesR.data || [];
  html(root, DoctorsView(doctors, duties));

  const dMsg = qs("#d_msg",root);
  qs("#d_save",root).addEventListener("click", async ()=>{
    dMsg.className="msg"; dMsg.textContent="";
    const body = {
      name: qs("#d_name",root).value.trim(),
      specialty: qs("#d_specialty",root).value.trim(),
      department: qs("#d_department",root).value.trim(),
      availability: qs("#d_availability",root).value.trim(),
      contact: qs("#d_contact",root).value.trim(),
      email: qs("#d_email",root).value.trim(),
    };
    const out = await apiPost("doctors", body);
    if(!out.ok){ dMsg.classList.add("err"); dMsg.textContent="⚠ "+out.error; return; }
    dMsg.classList.add("ok"); dMsg.textContent="✅ Doctor saved.";
    render();
  });

  const sMsg = qs("#sch_msg",root);
  qs("#sch_save",root).addEventListener("click", async ()=>{
    sMsg.className="msg"; sMsg.textContent="";
    const body = {
      doctorEmail: qs("#sch_doctor",root).value.trim(),
      department: qs("#sch_department",root).value.trim(),
      date: qs("#sch_date",root).value.trim(),
      startTime: qs("#sch_start",root).value.trim(),
      endTime: qs("#sch_end",root).value.trim(),
    };
    const out = await apiPost("duties", body);
    if(!out.ok){ sMsg.classList.add("err"); sMsg.textContent="⚠ "+out.error; return; }
    sMsg.classList.add("ok"); sMsg.textContent="✅ Duty assigned.";
    render();
  });

  qs("#d_search",root).addEventListener("input",(e)=>{
    const q=e.target.value.toLowerCase();
    qsa("#docTable tbody tr",root).forEach(tr=> tr.style.display = tr.textContent.toLowerCase().includes(q)?"":"none");
  });

  root.addEventListener("click", async (e)=>{
    const delDoc = e.target.closest("button[data-action='del-doc']");
    if(delDoc){
      if(!confirm("Delete doctor?")) return;
      await apiDel("doctors", {email: delDoc.dataset.email});
      render(); return;
    }
    const delDuty = e.target.closest("button[data-action='del-duty']");
    if(delDuty){
      if(!confirm("Delete duty?")) return;
      await apiDel("duties", {id: delDuty.dataset.id});
      render(); return;
    }
  });
}

function DoctorsView(doctors, duties){
  const options = doctors.map(d=>`<option value="${d.email}">${d.name} (${d.department})</option>`).join("");
  return `
    <div class="grid">
      <div class="card">
        <h2>Doctor Profile (Admin)</h2>
        <div class="row">
          <div><label>Name</label><input id="d_name"></div>
          <div><label>Specialty</label><input id="d_specialty"></div>
        </div>
        <div class="row">
          <div><label>Department</label><input id="d_department"></div>
          <div><label>Availability</label><input id="d_availability"></div>
        </div>
        <div class="row">
          <div><label>Contact</label><input id="d_contact"></div>
          <div><label>Email</label><input id="d_email"></div>
        </div>
        <button class="btn" id="d_save">Save Doctor</button>
        <div id="d_msg" class="msg"></div>
      </div>

      <div class="card">
        <h2>Duty Schedule</h2>
        <label>Doctor</label>
        <select id="sch_doctor"><option value="">Select</option>${options}</select>
        <div class="row">
          <div><label>Department</label><input id="sch_department"></div>
          <div><label>Date</label><input id="sch_date" type="date"></div>
        </div>
        <div class="row">
          <div><label>Start</label><input id="sch_start" type="time"></div>
          <div><label>End</label><input id="sch_end" type="time"></div>
        </div>
        <button class="btn" id="sch_save">Assign Duty</button>
        <div id="sch_msg" class="msg"></div>

        <h2 style="margin-top:18px;">Duty List</h2>
        <table class="table">
          <thead><tr><th>Doctor</th><th>Date</th><th>Time</th><th>Dept</th><th>Action</th></tr></thead>
          <tbody>
            ${duties.map(d=>`
              <tr>
                <td>${d.doctorName||""}</td>
                <td>${d.date}</td>
                <td>${d.startTime} - ${d.endTime}</td>
                <td>${d.department}</td>
                <td class="actions"><button class="delete" data-action="del-duty" data-id="${d.id}">Delete</button></td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      </div>
    </div>

    <div class="card" style="margin-top:16px;">
      <h2>Doctor List</h2>
      <input id="d_search" placeholder="Search doctors">
      <table class="table" id="docTable">
        <thead><tr><th>Name</th><th>Dept</th><th>Contact</th><th>Email</th><th>Action</th></tr></thead>
        <tbody>
          ${doctors.map(d=>`
            <tr>
              <td>${d.name}</td><td>${d.department}</td><td>${d.contact}</td><td>${d.email}</td>
              <td class="actions"><button class="delete" data-action="del-doc" data-email="${d.email}">Delete</button></td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    </div>
  `;
}

// --- Appointments ---
async function AppointmentsController(root){
  const [pR,dR,aR] = await Promise.all([apiGet("patients"), apiGet("doctors"), apiGet("appointments")]);
  const patients = pR.data || [];
  const doctors = dR.data || [];
  const appts = aR.data || [];
  html(root, AppointmentsView(patients, doctors, appts));

  const msg = qs("#a_msg",root);
  qs("#a_book",root).addEventListener("click", async ()=>{
    msg.className="msg"; msg.textContent="";
    const body = {
      patientId: qs("#a_patient",root).value.trim(),
      doctorEmail: qs("#a_doctor",root).value.trim(),
      department: qs("#a_department",root).value.trim(),
      datetime: qs("#a_datetime",root).value.trim(),
      reason: qs("#a_reason",root).value.trim(),
    };
    const out = await apiPost("appointments", body);
    if(!out.ok){ msg.classList.add("err"); msg.textContent="⚠ "+out.error; return; }
    msg.classList.add("ok"); msg.textContent="✅ Appointment booked: "+out.data.id;
    render();
  });

  qs("#a_filter_date",root).addEventListener("input",(e)=>{
    const date=e.target.value;
    qsa("tbody tr",root).forEach(tr=>{
      if(!date){ tr.style.display=""; return; }
      tr.style.display = tr.dataset.date===date ? "" : "none";
    });
  });

  qs("#a_search",root).addEventListener("input",(e)=>{
    const q=e.target.value.toLowerCase();
    qsa("tbody tr",root).forEach(tr=> tr.style.display = tr.textContent.toLowerCase().includes(q)?"":"none");
  });

  root.addEventListener("click", async (e)=>{
    const approve = e.target.closest("button[data-action='approve']");
    const resch = e.target.closest("button[data-action='reschedule']");
    const del = e.target.closest("button[data-action='del-appt']");
    const msg2 = qs("#dash_msg",root);

    if(approve){
      const id=approve.dataset.id;
      const out = await apiPut("appointments",{id,status:"Approved"});
      msg2.className="msg "+(out.ok?"ok":"err");
      msg2.textContent = out.ok ? "✅ Approved" : "⚠ "+out.error;
      if(out.ok) render();
    }
    if(resch){
      const id=resch.dataset.id;
      const current=resch.dataset.datetime;
      const newDT = prompt("Enter new DateTime (YYYY-MM-DDTHH:MM)", current);
      if(!newDT) return;
      const out = await apiPut("appointments",{id,datetime:newDT,status:"Rescheduled"});
      msg2.className="msg "+(out.ok?"ok":"err");
      msg2.textContent = out.ok ? "✅ Rescheduled" : "⚠ "+out.error;
      if(out.ok) render();
    }
    if(del){
      if(!confirm("Delete appointment?")) return;
      await apiDel("appointments",{id:del.dataset.id});
      render();
    }
  });
}

function AppointmentsView(patients, doctors, appts){
  const pOpt = patients.map(p=>`<option value="${p.id}">${p.id} - ${p.name}</option>`).join("");
  const dOpt = doctors.map(d=>`<option value="${d.email}">${d.name} (${d.department})</option>`).join("");
  return `
    <div class="grid">
      <div class="card">
        <h2>Book Appointment</h2>
        <label>Patient</label>
        <select id="a_patient"><option value="">Select</option>${pOpt}</select>
        <label>Doctor</label>
        <select id="a_doctor"><option value="">Select</option>${dOpt}</select>
        <div class="row">
          <div><label>Department</label><input id="a_department"></div>
          <div><label>Date & Time</label><input id="a_datetime" type="datetime-local"></div>
        </div>
        <label>Reason</label><textarea id="a_reason"></textarea>
        <button class="btn" id="a_book">Book</button>
        <div id="a_msg" class="msg"></div>
      </div>

      <div class="card">
        <h2>Doctor Dashboard</h2>
        <div class="row">
          <div><label>Filter by Date</label><input id="a_filter_date" type="date"></div>
          <div><label>Search</label><input id="a_search"></div>
        </div>
        <table class="table">
          <thead><tr><th>ID</th><th>Patient</th><th>Doctor</th><th>DateTime</th><th>Status</th><th>Action</th></tr></thead>
          <tbody>
            ${appts.map(a=>`
              <tr data-date="${toDateOnly(a.datetime)}">
                <td>${a.id}</td>
                <td>${a.patientId}</td>
                <td>${a.doctorName||a.doctorEmail}</td>
                <td>${(a.datetime||"").replace("T"," ")}</td>
                <td>${badge(a.status||"Pending", (a.status==="Approved")?"ok":(a.status==="Rescheduled")?"warn":"danger")}</td>
                <td class="actions">
                  <button class="approve" data-action="approve" data-id="${a.id}">Approve</button>
                  <button class="reschedule" data-action="reschedule" data-id="${a.id}" data-datetime="${a.datetime}">Reschedule</button>
                  <button class="delete" data-action="del-appt" data-id="${a.id}">Delete</button>
                </td>
              </tr>
            `).join("")}
          </tbody>
        </table>
        <div id="dash_msg" class="msg"></div>
      </div>
    </div>
  `;
}

// --- OPD/IPD ---
async function OPDIPDController(root){
  const [opdR, ipdR] = await Promise.all([apiGet("opd"), apiGet("ipd")]);
  const opd = opdR.data || [];
  const ipd = ipdR.data || [];
  html(root, OPDIPDView(opd, ipd));

  const opdMsg=qs("#opd_msg",root), ipdMsg=qs("#ipd_msg",root);

  qs("#opd_add",root).addEventListener("click", async ()=>{
    opdMsg.className="msg"; opdMsg.textContent="";
    const body = {
      patientId: qs("#opd_patient",root).value.trim(),
      doctor: qs("#opd_doctor",root).value.trim(),
      date: qs("#opd_date",root).value.trim(),
      reason: qs("#opd_reason",root).value.trim(),
    };
    const out=await apiPost("opd", body);
    if(!out.ok){ opdMsg.classList.add("err"); opdMsg.textContent="⚠ "+out.error; return; }
    opdMsg.classList.add("ok"); opdMsg.textContent="✅ OPD added.";
    render();
  });

  qs("#ipd_add",root).addEventListener("click", async ()=>{
    ipdMsg.className="msg"; ipdMsg.textContent="";
    const body = {
      patientId: qs("#ipd_patient",root).value.trim(),
      room: qs("#ipd_room",root).value.trim(),
      diagnosis: qs("#ipd_diag",root).value.trim(),
      admitDate: qs("#ipd_admit",root).value.trim(),
      dischargeDate: qs("#ipd_discharge",root).value.trim(),
      status: qs("#ipd_status",root).value.trim(),
    };
    const out=await apiPost("ipd", body);
    if(!out.ok){ ipdMsg.classList.add("err"); ipdMsg.textContent="⚠ "+out.error; return; }
    ipdMsg.classList.add("ok"); ipdMsg.textContent="✅ IPD added.";
    render();
  });

  root.addEventListener("click", async (e)=>{
    const opdNote=e.target.closest("button[data-action='opd-note']");
    const opdDel=e.target.closest("button[data-action='opd-del']");
    const ipdNote=e.target.closest("button[data-action='ipd-note']");
    const ipdStatus=e.target.closest("button[data-action='ipd-status']");
    const ipdDel=e.target.closest("button[data-action='ipd-del']");

    if(opdNote){
      const id=opdNote.dataset.id;
      const notes=prompt("Enter OPD notes:");
      if(notes===null) return;
      await apiPut("opd",{id,notes});
      render();
    }
    if(opdDel){
      if(!confirm("Delete OPD record?")) return;
      await apiDel("opd",{id:opdDel.dataset.id});
      render();
    }
    if(ipdNote){
      const id=ipdNote.dataset.id;
      const notes=prompt("Enter IPD notes:");
      if(notes===null) return;
      await apiPut("ipd",{id,notes});
      render();
    }
    if(ipdStatus){
      const id=ipdStatus.dataset.id;
      const status=prompt("Enter status (Admitted/Discharged):");
      if(!status) return;
      await apiPut("ipd",{id,status});
      render();
    }
    if(ipdDel){
      if(!confirm("Delete IPD record?")) return;
      await apiDel("ipd",{id:ipdDel.dataset.id});
      render();
    }
  });
}

function OPDIPDView(opd, ipd){
  return `
    <div class="grid">
      <div class="card">
        <h2>OPD Records</h2>
        <div class="row">
          <div><label>Patient ID</label><input id="opd_patient"></div>
          <div><label>Doctor</label><input id="opd_doctor"></div>
        </div>
        <div class="row">
          <div><label>Visit Date</label><input id="opd_date" type="date"></div>
          <div><label>Reason</label><input id="opd_reason"></div>
        </div>
        <button class="btn" id="opd_add">Add OPD</button>
        <div id="opd_msg" class="msg"></div>

        <table class="table">
          <thead><tr><th>ID</th><th>Patient</th><th>Doctor</th><th>Date</th><th>Reason</th><th>Notes</th><th>Action</th></tr></thead>
          <tbody>
            ${opd.map(r=>`
              <tr>
                <td>${r.id}</td><td>${r.patientId}</td><td>${r.doctor}</td><td>${r.date}</td>
                <td>${r.reason}</td><td>${r.notes||""}</td>
                <td class="actions">
                  <button class="note" data-action="opd-note" data-id="${r.id}">Notes</button>
                  <button class="delete" data-action="opd-del" data-id="${r.id}">Delete</button>
                </td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      </div>

      <div class="card">
        <h2>IPD Records</h2>
        <div class="row">
          <div><label>Patient ID</label><input id="ipd_patient"></div>
          <div><label>Room</label><input id="ipd_room"></div>
        </div>
        <div class="row">
          <div><label>Diagnosis</label><input id="ipd_diag"></div>
          <div><label>Admit Date</label><input id="ipd_admit" type="date"></div>
        </div>
        <div class="row">
          <div><label>Discharge Date</label><input id="ipd_discharge" type="date"></div>
          <div>
            <label>Status</label>
            <select id="ipd_status"><option>Admitted</option><option>Discharged</option></select>
          </div>
        </div>
        <button class="btn" id="ipd_add">Add IPD</button>
        <div id="ipd_msg" class="msg"></div>

        <table class="table">
          <thead><tr><th>ID</th><th>Patient</th><th>Room</th><th>Diagnosis</th><th>Admit</th><th>Discharge</th><th>Status</th><th>Notes</th><th>Action</th></tr></thead>
          <tbody>
            ${ipd.map(r=>`
              <tr>
                <td>${r.id}</td><td>${r.patientId}</td><td>${r.room}</td><td>${r.diagnosis}</td>
                <td>${r.admitDate}</td><td>${r.dischargeDate||""}</td>
                <td>${badge(r.status||"Admitted", (r.status==="Discharged")?"ok":"warn")}</td>
                <td>${r.notes||""}</td>
                <td class="actions">
                  <button class="status" data-action="ipd-status" data-id="${r.id}">Status</button>
                  <button class="note" data-action="ipd-note" data-id="${r.id}">Notes</button>
                  <button class="delete" data-action="ipd-del" data-id="${r.id}">Delete</button>
                </td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

// --- Pharmacy ---
async function PharmacyController(root){
  const r = await apiGet("medicines");
  const meds = r.data || [];
  html(root, PharmacyView(meds));

  const msg = qs("#m_msg",root);

  qs("#m_save",root).addEventListener("click", async ()=>{
    msg.className="msg"; msg.textContent="";
    const body = {
      name: qs("#m_name",root).value.trim(),
      batch: qs("#m_batch",root).value.trim(),
      expiry: qs("#m_expiry",root).value.trim(),
      qty: qs("#m_qty",root).value.trim(),
      price: qs("#m_price",root).value.trim(),
    };
    const out = await apiPost("medicines", body);
    if(!out.ok){ msg.classList.add("err"); msg.textContent="⚠ "+out.error; return; }
    msg.classList.add("ok"); msg.textContent="✅ Medicine saved.";
    render();
  });

  qs("#m_search",root).addEventListener("input",(e)=>{
    const q=e.target.value.toLowerCase();
    qsa("tbody tr",root).forEach(tr=> tr.style.display = tr.textContent.toLowerCase().includes(q)?"":"none");
  });

  root.addEventListener("click", async (e)=>{
    const del = e.target.closest("button[data-action='med-del']");
    if(del){
      if(!confirm("Delete medicine?")) return;
      await apiDel("medicines",{id:del.dataset.id});
      render();
    }
  });
}

function PharmacyView(meds){
  const LOW=10;
  const today = new Date(); today.setHours(0,0,0,0);
  return `
    <div class="grid">
      <div class="card">
        <h2>Pharmacy Inventory</h2>
        <label>Medicine Name</label><input id="m_name">
        <div class="row">
          <div><label>Batch</label><input id="m_batch"></div>
          <div><label>Expiry</label><input id="m_expiry" type="date"></div>
        </div>
        <div class="row">
          <div><label>Qty</label><input id="m_qty" type="number" min="0"></div>
          <div><label>Price</label><input id="m_price" type="number" step="0.01" min="0"></div>
        </div>
        <button class="btn" id="m_save">Save Medicine</button>
        <div id="m_msg" class="msg"></div>
      </div>

      <div class="card">
        <h2>Medicine List</h2>
        <input id="m_search" placeholder="Search by name/batch">
        <table class="table">
          <thead><tr><th>Name</th><th>Batch</th><th>Expiry</th><th>Qty</th><th>Price</th><th>Status</th><th>Alert</th><th>Action</th></tr></thead>
          <tbody>
            ${meds.map(m=>{
              const exp=new Date(m.expiry); exp.setHours(0,0,0,0);
              const expired = exp < today;
              const low = Number(m.qty) <= LOW;
              return `
                <tr>
                  <td>${m.name}</td><td>${m.batch}</td><td>${m.expiry}</td><td>${m.qty}</td><td>${Number(m.price).toFixed(2)}</td>
                  <td>${expired?badge("Expired","danger"):badge("Valid","ok")}</td>
                  <td>${low?badge("Low","warn"):badge("OK","ok")}</td>
                  <td class="actions"><button class="delete" data-action="med-del" data-id="${m.id}">Delete</button></td>
                </tr>
              `;
            }).join("")}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

render();
