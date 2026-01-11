<?php
session_start();
if (isset($_SESSION['user_id'])) {
    header('Location: dashboard.php');
    exit();
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login - Hospital Management</title>
    <link rel="stylesheet" href="../assets/css/style.css">
</head>
<body>
    <div class="login-container">
        <div class="login-box">
            <h1>🏥 Hospital Management</h1>
            <h2>Login</h2>

            <form id="loginForm">
                <div class="form-group">
                    <label for="username">Username</label>
                    <input type="text" id="username" name="username" required autofocus>
                </div>

                <div class="form-group">
                    <label for="password">Password</label>
                    <input type="password" id="password" name="password" required>
                </div>

                <button type="submit" class="btn-primary">Login</button>
            </form>

            <p class="register-link">
                Don't have an account? <a href="register.php">Register here</a>
            </p>

            <div class="demo-credentials">
                <strong>Demo Credentials:</strong><br>
                Admin: <code>admin</code> / <code>admin123</code><br>
                Doctor: <code>doctor</code> / <code>doctor123</code><br>
                Staff: <code>staff</code> / <code>staff123</code>
            </div>
        </div>
    </div>

    <script>
        document.getElementById('loginForm').addEventListener('submit', async function(e) {
            e.preventDefault();

            const formData = new FormData(this);
            formData.append('action', 'login');

            try {
                const response = await fetch('../app/controllers/user_controller.php', {
                    method: 'POST',
                    body: formData
                });

                const data = await response.json();

                if (data.success) {
                    alert(data.message);
                    window.location.href = 'dashboard.php';
                } else {
                    alert(data.message);
                }
            } catch (error) {
                alert('Login error: ' + error.message);
            }
        });
    </script>
</body>
</html>