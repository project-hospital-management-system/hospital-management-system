<?php
require_once __DIR__ . '/../../config/database.php';

class Laboratory {
    private $conn;
    private $table = 'laboratory';

    public function __construct() {
        $database = new Database();
        $this->conn = $database->getConnection();
    }

    public function create($data) {
        $query = "INSERT INTO " . $this->table . " (patient_name, test_name, test_date, result_status, notes) 
                  VALUES (:patient, :test, :test_date, :status, :notes)";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':patient', $data['patient']);
        $stmt->bindParam(':test', $data['test']);
        $stmt->bindParam(':test_date', $data['test_date']);
        $stmt->bindParam(':status', $data['status']);
        $stmt->bindParam(':notes', $data['notes']);
        return $stmt->execute();
    }

    public function getAll() {
        $query = "SELECT * FROM " . $this->table . " ORDER BY test_date DESC";
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
        $query = "UPDATE " . $this->table . " SET patient_name=:patient, test_name=:test, 
                  result_status=:status, notes=:notes WHERE id=:id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':patient', $data['patient']);
        $stmt->bindParam(':test', $data['test']);
        $stmt->bindParam(':status', $data['status']);
        $stmt->bindParam(':notes', $data['notes']);
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