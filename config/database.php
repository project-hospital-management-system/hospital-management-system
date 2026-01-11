<?php
/**
 * Database Configuration
 * Update these settings with your MySQL credentials
 */

class Database {
    private $host = "localhost";
    private $db_name = "hospital_management";
    private $username = "root";
    private $password = "";
    public $conn;

    public function getConnection() {
        $this->conn = null;

        try {
            $this->conn = new PDO(
                "mysql:host=" . $this->host . ";dbname=" . $this->db_name,
                $this->username,
                $this->password
            );
            $this->conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            $this->conn->exec("set names utf8");
        } catch(PDOException $exception) {
            echo json_encode([
                'success' => false,
                'message' => 'Database connection failed: ' . $exception->getMessage()
            ]);
            exit();
        }

        return $this->conn;
    }
}
?>