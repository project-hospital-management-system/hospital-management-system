<?php
require_once __DIR__ . '/../../includes/session.php';
require_once __DIR__ . '/../models/Laboratory.php';

header('Content-Type: application/json');

if (!isLoggedIn()) {
    echo json_encode(['success' => false, 'message' => 'Unauthorized']);
    exit();
}

$lab = new Laboratory();
$action = $_REQUEST['action'] ?? '';

switch ($action) {
    case 'create':
        if (!validateCSRFToken($_POST['csrf_token'] ?? '')) {
            echo json_encode(['success' => false, 'message' => 'Invalid CSRF token']);
            break;
        }
        $data = [
            'patient' => sanitizeInput($_POST['patient']),
            'test' => sanitizeInput($_POST['test']),
            'test_date' => $_POST['test_date'],
            'status' => $_POST['status'],
            'notes' => sanitizeInput($_POST['notes'] ?? '')
        ];
        echo json_encode($lab->create($data) ? 
            ['success' => true, 'message' => 'Lab test created'] : 
            ['success' => false]);
        break;

    case 'list':
        $records = $lab->getAll();
        echo json_encode(['success' => true, 'data' => $records]);
        break;

    case 'get':
        $id = intval($_GET['id'] ?? 0);
        $record = $lab->getById($id);
        echo json_encode($record ? ['success' => true, 'data' => $record] : ['success' => false]);
        break;

    case 'update':
        if (!validateCSRFToken($_POST['csrf_token'] ?? '')) {
            echo json_encode(['success' => false, 'message' => 'Invalid CSRF token']);
            break;
        }
        $id = intval($_POST['id'] ?? 0);
        $data = [
            'patient' => sanitizeInput($_POST['patient']),
            'test' => sanitizeInput($_POST['test']),
            'status' => $_POST['status'],
            'notes' => sanitizeInput($_POST['notes'] ?? '')
        ];
        echo json_encode($lab->update($id, $data) ? 
            ['success' => true, 'message' => 'Updated'] : 
            ['success' => false]);
        break;

    case 'delete':
        $id = intval($_REQUEST['id'] ?? 0);
        echo json_encode($lab->delete($id) ? 
            ['success' => true, 'message' => 'Deleted'] : 
            ['success' => false]);
        break;

    default:
        echo json_encode(['success' => false, 'message' => 'Invalid action']);
}
?>