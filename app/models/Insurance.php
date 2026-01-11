<?php
require_once __DIR__ . '/../../config/database.php';

class Insurance {
    private $conn;
    private $table = 'insurance';

    public function __construct() {
        $database = new Database();
        $this->conn = $database->getConnection();
    }

    public function create($data) {
        $query = "INSERT INTO " . $this->table . " (provider_name, policy_number, coverage_amount, expiry_date, patient_id) 
                  VALUES (:provider, :policy, :coverage, :expiry, :patient_id)";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':provider', $data['provider']);
        $stmt->bindParam(':policy', $data['policy']);
        $stmt->bindParam(':coverage', $data['coverage']);
        $stmt->bindParam(':expiry', $data['expiry']);
        $stmt->bindParam(':patient_id', $data['patient_id']);
        return $stmt->execute();
    }

    public function getAll() {
        $query = "SELECT * FROM " . $this->table . " ORDER BY created_at DESC";
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
        $query = "UPDATE " . $this->table . " SET provider_name=:provider, policy_number=:policy, 
                  coverage_amount=:coverage, expiry_date=:expiry WHERE id=:id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':provider', $data['provider']);
        $stmt->bindParam(':policy', $data['policy']);
        $stmt->bindParam(':coverage', $data['coverage']);
        $stmt->bindParam(':expiry', $data['expiry']);
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