<?php
require_once __DIR__ . '/../../includes/session.php';
require_once __DIR__ . '/../models/Staff.php';

header('Content-Type: application/json');

if (!isLoggedIn()) {
    echo json_encode(['success' => false, 'message' => 'Unauthorized']);
    exit();
}

$staff = new Staff();
$action = $_REQUEST['action'] ?? '';

switch ($action) {
    case 'create':
        if (!validateCSRFToken($_POST['csrf_token'] ?? '')) {
            echo json_encode(['success' => false, 'message' => 'Invalid CSRF token']);
            break;
        }
        $data = [
            'name' => sanitizeInput($_POST['name']),
            'role' => sanitizeInput($_POST['role']),
            'department' => sanitizeInput($_POST['department']),
            'shift' => $_POST['shift'],
            'contact' => sanitizeInput($_POST['contact'] ?? '')
        ];
        echo json_encode($staff->create($data) ? 
            ['success' => true, 'message' => 'Staff member added'] : 
            ['success' => false]);
        break;

    case 'list':
        $records = $staff->getAll();
        echo json_encode(['success' => true, 'data' => $records]);
        break;

    case 'get':
        $id = intval($_GET['id'] ?? 0);
        $record = $staff->getById($id);
        echo json_encode($record ? ['success' => true, 'data' => $record] : ['success' => false]);
        break;

    case 'update':
        if (!validateCSRFToken($_POST['csrf_token'] ?? '')) {
            echo json_encode(['success' => false, 'message' => 'Invalid CSRF token']);
            break;
        }
        $id = intval($_POST['id'] ?? 0);
        $data = [
            'name' => sanitizeInput($_POST['name']),
            'role' => sanitizeInput($_POST['role']),
            'department' => sanitizeInput($_POST['department']),
            'shift' => $_POST['shift'],
            'contact' => sanitizeInput($_POST['contact'] ?? '')
        ];
        echo json_encode($staff->update($id, $data) ? 
            ['success' => true, 'message' => 'Updated'] : 
            ['success' => false]);
        break;

    case 'delete':
        $id = intval($_REQUEST['id'] ?? 0);
        echo json_encode($staff->delete($id) ? 
            ['success' => true, 'message' => 'Deleted'] : 
            ['success' => false]);
        break;

    default:
        echo json_encode(['success' => false, 'message' => 'Invalid action']);
}
?>