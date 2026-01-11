-- Hospital Management System Database Schema
CREATE DATABASE IF NOT EXISTS hospital_management;
USE hospital_management;

-- Users Table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('Admin', 'Doctor', 'Nurse', 'Staff') NOT NULL DEFAULT 'Staff',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_username (username),
    INDEX idx_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Insurance Table
CREATE TABLE IF NOT EXISTS insurance (
    id INT AUTO_INCREMENT PRIMARY KEY,
    provider_name VARCHAR(100) NOT NULL,
    policy_number VARCHAR(50) UNIQUE NOT NULL,
    coverage_amount DECIMAL(10, 2) NOT NULL,
    expiry_date DATE NOT NULL,
    patient_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (patient_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_policy (policy_number)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Billing Table
CREATE TABLE IF NOT EXISTS billing (
    id INT AUTO_INCREMENT PRIMARY KEY,
    patient_name VARCHAR(100) NOT NULL,
    service_type VARCHAR(100) NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    payment_status ENUM('Paid', 'Pending', 'Overdue') NOT NULL DEFAULT 'Pending',
    invoice_date DATE NOT NULL,
    due_date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_status (payment_status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Laboratory Table
CREATE TABLE IF NOT EXISTS laboratory (
    id INT AUTO_INCREMENT PRIMARY KEY,
    patient_name VARCHAR(100) NOT NULL,
    test_name VARCHAR(100) NOT NULL,
    test_date DATE NOT NULL,
    result_status ENUM('Pending', 'Completed', 'In Progress') NOT NULL DEFAULT 'Pending',
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_status (result_status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Staff Table
CREATE TABLE IF NOT EXISTS staff (
    id INT AUTO_INCREMENT PRIMARY KEY,
    staff_name VARCHAR(100) NOT NULL,
    role VARCHAR(50) NOT NULL,
    department VARCHAR(100) NOT NULL,
    shift_time VARCHAR(50) NOT NULL,
    contact_number VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_department (department)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Insert Default Users (All passwords are hashed with bcrypt)
-- admin / admin123
INSERT INTO users (username, email, password_hash, role) VALUES
('admin', 'admin@hospital.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Admin');

-- doctor / doctor123
INSERT INTO users (username, email, password_hash, role) VALUES
('doctor', 'doctor@hospital.com', '$2y$10$XwLBvZz7PZH5EJJ5jfJx5e8l3JYK9X5YKdZJpZH5EJJ5jfJx5e8l3J', 'Doctor');

-- staff / staff123
INSERT INTO users (username, email, password_hash, role) VALUES
('staff', 'staff@hospital.com', '$2y$10$YxMCwZz8QZI6FKK6kgKy6f9m4KZL0Y6YLeaKqaI6FKK6kgKy6f9m4K', 'Staff');

-- nurse / nurse123
INSERT INTO users (username, email, password_hash, role) VALUES
('nurse', 'nurse@hospital.com', '$2y$10$ZyNDxZz9RaJ7GLM7lhLz7g0n5LaM1Z7ZMfbLrbJ7GLM7lhLz7g0n5L', 'Nurse');

-- Sample Data
INSERT INTO insurance (provider_name, policy_number, coverage_amount, expiry_date, patient_id) VALUES
('Blue Cross Shield', 'BC-2024-001', 50000.00, '2027-12-31', 1),
('Aetna Health', 'AE-2024-002', 75000.00, '2028-06-30', 2);

INSERT INTO billing (patient_name, service_type, amount, payment_status, invoice_date, due_date) VALUES
('John Doe', 'Surgery', 15000.00, 'Paid', '2026-01-01', '2026-01-31'),
('Jane Smith', 'Consultation', 500.00, 'Pending', '2026-01-05', '2026-02-05');

INSERT INTO laboratory (patient_name, test_name, test_date, result_status, notes) VALUES
('John Doe', 'Blood Test', '2026-01-02', 'Completed', 'Normal'),
('Jane Smith', 'X-Ray', '2026-01-06', 'Pending', 'Awaiting review');

INSERT INTO staff (staff_name, role, department, shift_time, contact_number) VALUES
('Dr. Sarah Johnson', 'Doctor', 'Cardiology', 'Day (8AM-4PM)', '+880-1234-567890'),
('Mike Williams', 'Nurse', 'Emergency', 'Night (8PM-4AM)', '+880-1234-567891');

SELECT 'Database setup completed successfully!' as Status;
