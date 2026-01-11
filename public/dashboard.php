<?php
require_once __DIR__ . '/../includes/session.php';
requireLogin();
?>
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dashboard - Hospital Management</title>
    <link rel="stylesheet" href="../assets/css/style.css">
</head>
<body>
    <div class="header">
        <h1>🏥 Hospital Management System</h1>
        <div class="user-info">
            <span>Welcome, <strong><?php echo htmlspecialchars($_SESSION['username']); ?></strong> 
            (<?php echo $_SESSION['role']; ?>)</span>
            <button onclick="logout()" class="btn-logout">Logout</button>
        </div>
    </div>

    <div class="container">
        <h2>Dashboard</h2>

        <div class="dashboard-grid">
            <a href="insurance.php" class="dashboard-card">
                <div class="card-icon">🛡️</div>
                <h3>Insurance</h3>
                <p class="card-count" id="insuranceCount">Loading...</p>
                <p class="card-desc">Policy Management</p>
            </a>

            <a href="billing.php" class="dashboard-card">
                <div class="card-icon">💰</div>
                <h3>Billing</h3>
                <p class="card-count" id="billingCount">Loading...</p>
                <p class="card-desc">Invoice Tracking</p>
            </a>

            <a href="laboratory.php" class="dashboard-card">
                <div class="card-icon">🔬</div>
                <h3>Laboratory</h3>
                <p class="card-count" id="labCount">Loading...</p>
                <p class="card-desc">Test Management</p>
            </a>

            <a href="staff.php" class="dashboard-card">
                <div class="card-icon">👨‍⚕️</div>
                <h3>Staff</h3>
                <p class="card-count" id="staffCount">Loading...</p>
                <p class="card-desc">Shift Scheduling</p>
            </a>

            <?php if (hasRole('Admin')): ?>
            <a href="users.php" class="dashboard-card">
                <div class="card-icon">👤</div>
                <h3>Users</h3>
                <p class="card-count">Admin</p>
                <p class="card-desc">Access Control</p>
            </a>
            <?php endif; ?>
        </div>
    </div>

    <script>
        async function loadStats() {
            try {
                const endpoints = [
                    { url: '../app/controllers/insurance_controller.php?action=list', id: 'insuranceCount' },
                    { url: '../app/controllers/billing_controller.php?action=list', id: 'billingCount' },
                    { url: '../app/controllers/laboratory_controller.php?action=list', id: 'labCount' },
                    { url: '../app/controllers/staff_controller.php?action=list', id: 'staffCount' }
                ];

                endpoints.forEach(async (endpoint) => {
                    const response = await fetch(endpoint.url);
                    const data = await response.json();
                    if (data.success) {
                        document.getElementById(endpoint.id).textContent = data.data.length + ' Records';
                    }
                });
            } catch (error) {
                console.error('Error loading stats:', error);
            }
        }

        async function logout() {
            try {
                const formData = new FormData();
                formData.append('action', 'logout');

                const response = await fetch('../app/controllers/user_controller.php', {
                    method: 'POST',
                    body: formData
                });

                const data = await response.json();
                if (data.success) {
                    window.location.href = 'login.php';
                }
            } catch (error) {
                console.error('Logout error:', error);
            }
        }

        loadStats();
    </script>
</body>
</html>