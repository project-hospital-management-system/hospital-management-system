<div id="container">
    <header id="header">
      <h1>Telemedicine</h1>
      <p>Video-consult workflow demo: booking → waiting room → consultation → wrap-up</p>
    </header>

    <!-- Phase 1 -->
    <section id="phase1">
      <h2> Book Consultation + Waiting Room</h2>

      <div id="grid1">
        <div>
          <label>Patient Name</label>
          <input id="pName" type="text" placeholder="e.g., Rahim Uddin"/>
        </div>

        <div>
          <label>Doctor Name</label>
          <input id="dName" type="text" placeholder="e.g., Dr. Ayesha"/>
        </div>

        <div>
          <label>Department</label>
          <select id="dept">
            <option value="">Select</option>
            <option>Medicine</option>
            <option>Cardiology</option>
            <option>Dermatology</option>
            <option>Neurology</option>
          </select>
        </div>

        <div>
          <label>Consult Type</label>
          <select id="type">
            <option value="">Select</option>
            <option>Video</option>
            <option>Audio</option>
            <option>Chat</option>
          </select>
        </div>

        <div>
          <label>Date</label>
          <input id="date" type="date"/>
        </div>

        <div>
          <label>Time</label>
          <input id="time" type="time"/>
        </div>
      </div>

      <button id="bookBtn">Book Consultation</button>
      <p id="bookStatus"></p>

      <h3 id="queueTitle">Waiting Room Queue</h3>

      <div id="tableWrap">
        <table id="queueTable">
          <thead>
            <tr>
              <th>Session ID</th>
              <th>Patient</th>
              <th>Doctor</th>
              <th>Type</th>
              <th>DateTime</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody id="queueBody">
            <tr><td colspan="7" id="emptyRow">No bookings yet</td></tr>
          </tbody>
        </table>
      </div>
    </section>

    <!-- Phase 2 -->
    <section id="phase2">
      <h2> Consultation Session</h2>

      <div id="twoCol">
        <div id="panel1">
          <h3>Session Panel</h3>
          <p><b>Active Session:</b> <span id="activeSession">None</span></p>
          <p><b>Connection:</b> <span id="connStatus">Offline</span></p>

          <div id="toggles">
            <label><input id="lowBW" type="checkbox"/> Low Bandwidth Mode</label>
            <label><input id="recording" type="checkbox"/> Recording</label>
          </div>

          <div id="actions">
            <button id="joinBtn">Join</button>
            <button id="endBtn">End</button>
          </div>

          <p id="sessionStatus"></p>
        </div>

        <div id="panel2">
          <h3>In-session Chat & File Share</h3>

          <div id="chatBox">
            <div id="chatInit">System: Chat ready</div>
          </div>

          <div id="chatRow">
            <input id="chatInput" type="text" placeholder="Type message..."/>
            <button id="sendChatBtn">Send</button>
          </div>

          <div id="fileRow">
            <input id="fileName" type="text" placeholder="e.g., blood_report.pdf"/>
            <button id="shareFileBtn">Share File</button>
          </div>

          <p id="hint">* Video is simulated with status changes (frontend demo).</p>
        </div>
      </div>
    </section>

    <!-- Phase 3 -->
    <section id="phase3">
      <h2> Wrap-up (E-prescription, Follow-up, Payment)</h2>

      <div id="grid3">
        <div>
          <label>Diagnosis</label>
          <input id="diag" type="text" placeholder="e.g., Viral fever"/>
        </div>

        <div>
          <label>Follow-up Date</label>
          <input id="followUp" type="date"/>
        </div>

        <div id="presWrap">
          <label>E-Prescription</label>
          <textarea id="presc" placeholder="Write prescription..."></textarea>
        </div>

        <div>
          <label>Consultation Fee (BDT)</label>
          <input id="fee" type="number" value="500" min="0"/>
        </div>

        <div>
          <label>Payment Status</label>
          <select id="payment">
            <option value="">Select</option>
            <option>Paid</option>
            <option>Pending</option>
          </select>
        </div>
      </div>

      <button id="wrapBtn">Generate Summary</button>
      <p id="wrapStatus"></p>

      <div id="summary">
        <h3>Consultation Summary</h3>
        <pre id="summaryText">No summary generated yet.</pre>
      </div>
    </section>

    <footer id="footer">
      <p>Demo: Feature 19 — MediTrust Hospital Management System</p>
    </footer>
  </div>

  <script src="telemedicine.js"></script>