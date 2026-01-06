<div id="container">
    <header id="header">
      <h1>Notification System </h1>
      <p>Manual + Event-based notifications with provider routing and rate limiting .</p>
    </header>

    <!-- PHASE 1 -->
    <section id="phase1">
      <h2>Send Manual Notification</h2>

      <div id="grid1">
        <div>
          <label>Recipient Name</label>
          <input id="recName" type="text" placeholder="e.g., Shibli Siyam"/>
        </div>

        <div>
          <label>Recipient Type</label>
          <select id="recType">
            <option value="">Select</option>
            <option>Patient</option>
            <option>Doctor</option>
            <option>Admin</option>
          </select>
        </div>

        <div>
          <label>Channel</label>
          <select id="channel">
            <option value="">Select</option>
            <option>Email</option>
            <option>SMS</option>
            <option>In-App</option>
          </select>
        </div>

        <div>
          <label>Language</label>
          <select id="lang">
            <option value="">Select</option>
            <option>English</option>
            <option>বাংলা</option>
          </select>
        </div>

        <div id="msgWrap">
          <label>Message</label>
          <textarea id="message" placeholder="Write notification message..."></textarea>
        </div>

        <div>
          <label>Priority</label>
          <select id="priority">
            <option value="">Select</option>
            <option>Low</option>
            <option>Normal</option>
            <option>High</option>
          </select>
        </div>

        <div>
          <label>Provider Route</label>
          <select id="provider">
            <option value="">Auto</option>
            <option>(SMS)</option>
            <option>(Email)</option>
            <option>(In-App)</option>
          </select>
        </div>
      </div>

      <button id="sendManualBtn">Send Notification</button>
      <p id="manualStatus"></p>
    </section>

    <!-- PHASE 2 -->
    <section id="phase2">
      <h2> Event-based Triggers</h2>

      <div id="grid2">
        <div>
          <label>Trigger Event</label>
          <select id="triggerEvent">
            <option value="">Select</option>
            <option>Appointment Confirmed</option>
            <option>Ambulance Request Updated</option>
            <option>Lab Report Ready</option>
            <option>Payment Received</option>
          </select>
        </div>

        <div>
          <label>Default Channel</label>
          <select id="triggerChannel">
            <option value="">Select</option>
            <option>Email</option>
            <option>SMS</option>
            <option>In-App</option>
          </select>
        </div>

        <div>
          <label>Target User</label>
          <select id="triggerUser">
            <option value="">Select</option>
            <option>Patient</option>
            <option>Doctor</option>
            <option>Admin</option>
          </select>
        </div>

        <div>
          <label>Template</label>
          <select id="template">
            <option value="">Select</option>
            <option>Your appointment is confirmed!</option>
            <option>Your lab report is ready!</option>
            <option>Your payment is successful..</option>
            <option>Ambulance request status updated..</option>
          </select>
        </div>
      </div>

      <button id="triggerBtn">Simulate Trigger</button>
      <p id="triggerStatus"></p>
    </section>

    <!-- PHASE 3 -->
    <section id="phase3">
      <h2> Logs, Filters & Rate Limit</h2>

      <div id="grid3">
        <div>
          <label>Filter by Channel</label>
          <select id="filterChannel">
            <option value="All">All</option>
            <option>Email</option>
            <option>SMS</option>
            <option>In-App</option>
          </select>
        </div>

        <div>
          <label>Filter by Status</label>
          <select id="filterStatus">
            <option value="All">All</option>
            <option>Sent</option>
            <option>Blocked (Rate Limited)</option>
          </select>
        </div>

        <div>
          <label>Filter by Priority</label>
          <select id="filterPriority">
            <option value="All">All</option>
            <option>Low</option>
            <option>Normal</option>
            <option>High</option>
          </select>
        </div>

        <div>
          <label>Rate Limit (max / minute)</label>
          <input id="rateLimit" type="number" value="3" min="1" />
        </div>
      </div>

      <div id="actions">
        <button id="applyFilterBtn">Apply Filters</button>
        <button id="resetFilterBtn">Reset Filters</button>
      </div>

      <div id="tableWrap">
        <table id="logTable">
          <thead>
            <tr>
              <th>Notification ID</th>
              <th>Type</th>
              <th>User</th>
              <th>Channel</th>
              <th>Provider</th>
              <th>Priority</th>
              <th>Status</th>
              <th>Time</th>
            </tr>
          </thead>
          <tbody id="logBody">
            <tr><td colspan="8" id="emptyRow">No notifications yet</td></tr>
          </tbody>
        </table>
      </div>

      <div id="kpiGrid">
        <div id="kpi1"><h3 id="kpiTotal">0</h3><p>Total</p></div>
        <div id="kpi2"><h3 id="kpiSent">0</h3><p>Sent</p></div>
        <div id="kpi3"><h3 id="kpiBlocked">0</h3><p>Blocked</p></div>
        <div id="kpi4"><h3 id="kpiHigh">0</h3><p>High Priority</p></div>
      </div>
    </section>

    <footer id="footer">
      <p> MediTrust Hospital Management System</p>
    </footer>
  </div>

  <script src="notifications.js"></script>