<?php
require_once __DIR__ . '/../../includes/session.php';
require_once __DIR__ . '/../models/User.php';

header('Content-Type: application/json');

$user = new User();
$action = $_REQUEST['action'] ?? '';

switch ($action) {
    case 'register':
        if (!validateCSRFToken($_POST['csrf_token'] ?? '')) {
            echo json_encode(['success' => false, 'message' => 'Invalid CSRF token']);
            break;
        }
        $data = [
            'username' => sanitizeInput($_POST['username']),
            'email' => filter_var($_POST['email'], FILTER_SANITIZE_EMAIL),
            'password' => $_POST['password'],
            'role' => $_POST['role'] ?? 'Staff'
        ];
        echo json_encode($user->register($data) ? 
            ['success' => true, 'message' => 'Registration successful'] : 
            ['success' => false, 'message' => 'Registration failed']);
        break;

    case 'login':
        $username = sanitizeInput($_POST['username'] ?? '');
        $password = $_POST['password'] ?? '';
        $userData = $user->login($username, $password);
        if ($userData) {
            $_SESSION['user_id'] = $userData['id'];
            $_SESSION['username'] = $userData['username'];
            $_SESSION['role'] = $userData['role'];
            $_SESSION['LAST_ACTIVITY'] = time();
            echo json_encode([
                'success' => true,
                'message' => 'Login successful',
                'user' => [
                    'id' => $userData['id'],
                    'username' => $userData['username'],
                    'role' => $userData['role']
                ]
            ]);
        } else {
            echo json_encode(['success' => false, 'message' => 'Invalid credentials']);
        }
        break;

    case 'logout':
        session_unset();
        session_destroy();
        echo json_encode(['success' => true, 'message' => 'Logged out']);
        break;

    case 'list':
        if (!isLoggedIn() || !hasRole('Admin')) {
            echo json_encode(['success' => false, 'message' => 'Unauthorized']);
            break;
        }
        $users = $user->getAll();
        echo json_encode(['success' => true, 'data' => $users]);
        break;

    case 'update_role':
        if (!isLoggedIn() || !hasRole('Admin')) {
            echo json_encode(['success' => false, 'message' => 'Unauthorized']);
            break;
        }
        $id = intval($_POST['id'] ?? 0);
        $role = $_POST['role'] ?? '';
        echo json_encode($user->updateRole($id, $role) ? 
            ['success' => true, 'message' => 'Role updated'] : 
            ['success' => false]);
        break;

    default:
        echo json_encode(['success' => false, 'message' => 'Invalid action']);
}
?>