<?php
require_once __DIR__ . '/../../includes/session.php';
require_once __DIR__ . '/../models/Insurance.php';

header('Content-Type: application/json');

if (!isLoggedIn()) {
    echo json_encode(['success' => false, 'message' => 'Unauthorized']);
    exit();
}

$insurance = new Insurance();
$action = $_REQUEST['action'] ?? '';

switch ($action) {
    case 'create':
        if (!validateCSRFToken($_POST['csrf_token'] ?? '')) {
            echo json_encode(['success' => false, 'message' => 'Invalid CSRF token']);
            break;
        }
        $data = [
            'provider' => sanitizeInput($_POST['provider']),
            'policy' => sanitizeInput($_POST['policy']),
            'coverage' => floatval($_POST['coverage']),
            'expiry' => $_POST['expiry'],
            'patient_id' => $_SESSION['user_id']
        ];
        echo json_encode($insurance->create($data) ? 
            ['success' => true, 'message' => 'Insurance record created'] : 
            ['success' => false, 'message' => 'Failed to create']);
        break;

    case 'list':
        $records = $insurance->getAll();
        echo json_encode(['success' => true, 'data' => $records]);
        break;

    case 'get':
        $id = intval($_GET['id'] ?? 0);
        $record = $insurance->getById($id);
        echo json_encode($record ? ['success' => true, 'data' => $record] : ['success' => false]);
        break;

    case 'update':
        if (!validateCSRFToken($_POST['csrf_token'] ?? '')) {
            echo json_encode(['success' => false, 'message' => 'Invalid CSRF token']);
            break;
        }
        $id = intval($_POST['id'] ?? 0);
        $data = [
            'provider' => sanitizeInput($_POST['provider']),
            'policy' => sanitizeInput($_POST['policy']),
            'coverage' => floatval($_POST['coverage']),
            'expiry' => $_POST['expiry']
        ];
        echo json_encode($insurance->update($id, $data) ? 
            ['success' => true, 'message' => 'Record updated'] : 
            ['success' => false]);
        break;

    case 'delete':
        $id = intval($_REQUEST['id'] ?? 0);
        echo json_encode($insurance->delete($id) ? 
            ['success' => true, 'message' => 'Record deleted'] : 
            ['success' => false]);
        break;

    default:
        echo json_encode(['success' => false, 'message' => 'Invalid action']);
}
?>