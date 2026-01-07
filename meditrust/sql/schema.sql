-- Hospital Management System - MySQL Schema
-- You can import this into phpMyAdmin / MySQL Workbench

CREATE DATABASE IF NOT EXISTS hospital_mvc CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE hospital_mvc;

CREATE TABLE IF NOT EXISTS patients (
  id VARCHAR(10) PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  age INT NOT NULL,
  gender VARCHAR(20) NOT NULL,
  contact VARCHAR(20) NOT NULL,
  address TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS doctors (
  email VARCHAR(160) PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  specialty VARCHAR(120) NOT NULL,
  department VARCHAR(120) NOT NULL,
  availability VARCHAR(120) NOT NULL,
  contact VARCHAR(20) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uniq_doctor_contact (contact)
);

CREATE TABLE IF NOT EXISTS duty_schedules (
  id VARCHAR(12) PRIMARY KEY,
  doctor_email VARCHAR(160) NOT NULL,
  department VARCHAR(120) NOT NULL,
  duty_date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_duty_doctor FOREIGN KEY (doctor_email) REFERENCES doctors(email) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS appointments (
  id VARCHAR(12) PRIMARY KEY,
  patient_id VARCHAR(10) NOT NULL,
  doctor_email VARCHAR(160) NOT NULL,
  department VARCHAR(120) NOT NULL,
  appt_datetime DATETIME NOT NULL,
  reason TEXT NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'Pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_appt_patient FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE,
  CONSTRAINT fk_appt_doctor FOREIGN KEY (doctor_email) REFERENCES doctors(email) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS medicines (
  id VARCHAR(12) PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  batch VARCHAR(60) NOT NULL,
  expiry DATE NOT NULL,
  qty INT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uniq_med_name_batch (name, batch)
);

CREATE TABLE IF NOT EXISTS opd_records (
  id VARCHAR(20) PRIMARY KEY,
  patient_id VARCHAR(10) NOT NULL,
  doctor VARCHAR(120) NOT NULL,
  visit_date DATE NOT NULL,
  reason VARCHAR(255) NOT NULL,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_opd_patient FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS ipd_records (
  id VARCHAR(20) PRIMARY KEY,
  patient_id VARCHAR(10) NOT NULL,
  room VARCHAR(40) NOT NULL,
  diagnosis VARCHAR(255) NOT NULL,
  admit_date DATE NOT NULL,
  discharge_date DATE NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'Admitted',
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_ipd_patient FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE
);
