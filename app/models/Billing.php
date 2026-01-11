<?php
require_once __DIR__ . '/../../config/database.php';

class Billing {
    private $conn;
    private $table = 'billing';

    public function __construct() {
        $database = new Database();
        $this->conn = $database->getConnection();
    }

    public function create($data) {
        $query = "INSERT INTO " . $this->table . " (patient_name, service_type, amount, payment_status, invoice_date, due_date) 
                  VALUES (:patient, :service, :amount, :status, :invoice_date, :due_date)";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':patient', $data['patient']);
        $stmt->bindParam(':service', $data['service']);
        $stmt->bindParam(':amount', $data['amount']);
        $stmt->bindParam(':status', $data['status']);
        $stmt->bindParam(':invoice_date', $data['invoice_date']);
        $stmt->bindParam(':due_date', $data['due_date']);
        return $stmt->execute();
    }

    public function getAll() {
        $query = "SELECT * FROM " . $this->table . " ORDER BY invoice_date DESC";
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function getById($id) {
        $query = "SELECT * FROM " . $this->table . " WHERE id = :id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':id', $id, PDO::PARAM_INT);
        $stmt->execute();
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    public function update($id, $data) {
        $query = "UPDATE " . $this->table . " SET patient_name=:patient, service_type=:service, 
                  amount=:amount, payment_status=:status WHERE id=:id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':patient', $data['patient']);
        $stmt->bindParam(':service', $data['service']);
        $stmt->bindParam(':amount', $data['amount']);
        $stmt->bindParam(':status', $data['status']);
        $stmt->bindParam(':id', $id, PDO::PARAM_INT);
        return $stmt->execute();
    }

    public function delete($id) {
        $query = "DELETE FROM " . $this->table . " WHERE id = :id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':id', $id, PDO::PARAM_INT);
        return $stmt->execute();
    }
}
?>