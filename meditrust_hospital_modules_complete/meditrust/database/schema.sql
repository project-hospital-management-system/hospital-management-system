CREATE DATABASE IF NOT EXISTS meditrust;
USE meditrust;

CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  role VARCHAR(30) DEFAULT 'staff',
  email VARCHAR(120) UNIQUE,
  password_hash VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS patients (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  phone VARCHAR(30),
  dob DATE,
  gender VARCHAR(20),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS emr_records (
  id INT AUTO_INCREMENT PRIMARY KEY,
  patient_id INT NOT NULL,
  doctor_name VARCHAR(120) NOT NULL,
  department VARCHAR(80),
  visit_date DATE NOT NULL,
  diagnosis TEXT,
  prescription TEXT,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS visits (
  id INT AUTO_INCREMENT PRIMARY KEY,
  patient_name VARCHAR(120) NOT NULL,
  doctor_name VARCHAR(120) NOT NULL,
  department VARCHAR(80),
  visit_date DATE NOT NULL,
  visit_type ENUM('OPD','IPD') NOT NULL,
  revenue DECIMAL(10,2) DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS notifications (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  message TEXT NOT NULL,
  target_role VARCHAR(30) DEFAULT 'all',
  is_read TINYINT(1) DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS telemedicine_sessions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  session_code VARCHAR(30) UNIQUE NOT NULL,
  patient_name VARCHAR(120) NOT NULL,
  doctor_name VARCHAR(120) NOT NULL,
  department VARCHAR(80),
  consult_type ENUM('Video','Audio','Chat') NOT NULL,
  datetime VARCHAR(60) NOT NULL,
  status VARCHAR(50) DEFAULT 'Waiting Room',
  low_bw TINYINT(1) DEFAULT 0,
  recording TINYINT(1) DEFAULT 0,
  diagnosis TEXT,
  prescription TEXT,
  followup_date DATE,
  fee DECIMAL(10,2) DEFAULT 0,
  payment_status ENUM('Paid','Pending') DEFAULT 'Pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS feedback (
  id INT AUTO_INCREMENT PRIMARY KEY,
  patient_name VARCHAR(120) NOT NULL,
  category VARCHAR(80),
  message TEXT NOT NULL,
  status VARCHAR(30) DEFAULT 'Open',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO patients (name, phone, dob, gender)
VALUES ('Demo Patient','01700000000','2000-01-01','Male')
ON DUPLICATE KEY UPDATE name=name;
