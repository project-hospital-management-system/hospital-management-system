<?php
require_once __DIR__ . '/../../includes/session.php';
require_once __DIR__ . '/../models/Billing.php';

header('Content-Type: application/json');

if (!isLoggedIn()) {
    echo json_encode(['success' => false, 'message' => 'Unauthorized']);
    exit();
}

$billing = new Billing();
$action = $_REQUEST['action'] ?? '';

switch ($action) {
    case 'create':
        if (!validateCSRFToken($_POST['csrf_token'] ?? '')) {
            echo json_encode(['success' => false, 'message' => 'Invalid CSRF token']);
            break;
        }
        $data = [
            'patient' => sanitizeInput($_POST['patient']),
            'service' => sanitizeInput($_POST['service']),
            'amount' => floatval($_POST['amount']),
            'status' => $_POST['status'],
            'invoice_date' => $_POST['invoice_date'],
            'due_date' => $_POST['due_date']
        ];
        echo json_encode($billing->create($data) ? 
            ['success' => true, 'message' => 'Billing record created'] : 
            ['success' => false]);
        break;

    case 'list':
        $records = $billing->getAll();
        echo json_encode(['success' => true, 'data' => $records]);
        break;

    case 'get':
        $id = intval($_GET['id'] ?? 0);
        $record = $billing->getById($id);
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
            'service' => sanitizeInput($_POST['service']),
            'amount' => floatval($_POST['amount']),
            'status' => $_POST['status']
        ];
        echo json_encode($billing->update($id, $data) ? 
            ['success' => true, 'message' => 'Updated'] : 
            ['success' => false]);
        break;

    case 'delete':
        $id = intval($_REQUEST['id'] ?? 0);
        echo json_encode($billing->delete($id) ? 
            ['success' => true, 'message' => 'Deleted'] : 
            ['success' => false]);
        break;

    default:
        echo json_encode(['success' => false, 'message' => 'Invalid action']);
}
?>