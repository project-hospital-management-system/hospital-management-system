<?php
require_once __DIR__ . '/../includes/session.php';
requireLogin();
?>
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Staff Management</title>
    <link rel="stylesheet" href="../assets/css/staff.css">
</head>
<body>
    <div class="header">
        <h1>Staff Management</h1>
        <div class="nav">
            <a href="dashboard.php">Dashboard</a>
            <a href="#" onclick="logout()">Logout</a>
        </div>
    </div>

    <div class="container">
        <h2>Add Record</h2>
        <form id="mainForm">
            <input type="hidden" name="csrf_token" value="<?php echo $csrf_token; ?>">
            <input type="text" name="name" placeholder="Name" required> <input type="text" name="role" placeholder="Role" required> <input type="text" name="department" placeholder="Department" required> <input type="text" name="shift" placeholder="Shift" required>
            <button type="submit">Add Record</button>
        </form>

        <h2>Records</h2>
        <table>
            <tbody id="tableBody">
                <tr><td colspan="5" style="text-align:center;">Loading...</td></tr>
            </tbody>
        </table>
    </div>

    <script>
        async function loadRecords() {
            const response = await fetch('../app/controllers/staff_controller.php?action=list');
            const data = await response.json();
            const tbody = document.getElementById('tableBody');
            tbody.innerHTML = '';
            if (data.success && data.data.length > 0) {
                data.data.forEach(record => {
                    const row = tbody.insertRow();
                    row.innerHTML = '<td>' + record.id + '</td><td>' + Object.values(record).slice(1,4).join('</td><td>') + 
                                    '</td><td><button onclick="deleteRecord(' + record.id + ')">Delete</button></td>';
                });
            } else {
                tbody.innerHTML = '<tr><td colspan="5" style="text-align:center;">No records</td></tr>';
            }
        }

        document.getElementById('mainForm').addEventListener('submit', async function(e) {
            e.preventDefault();
            const formData = new FormData(this);
            formData.append('action', 'create');
            const response = await fetch('../app/controllers/staff_controller.php', {
                method: 'POST',
                body: formData
            });
            const data = await response.json();
            alert(data.message);
            if (data.success) {
                this.reset();
                loadRecords();
            }
        });

        async function deleteRecord(id) {
            if (!confirm('Delete this record?')) return;
            const response = await fetch('../app/controllers/staff_controller.php?action=delete&id=' + id);
            const data = await response.json();
            alert(data.message);
            if (data.success) loadRecords();
        }

        function logout() {
            fetch('../app/controllers/user_controller.php', {
                method: 'POST',
                body: new URLSearchParams({action: 'logout'})
            }).then(() => window.location.href = 'login.php');
        }

        loadRecords();
    </script>
</body>
</html>