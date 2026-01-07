-- Demo seed data for MediTrust (import after schema.sql)
USE meditrust;

-- Users
INSERT INTO users (name,email,password,role) VALUES
('Admin','admin@meditrust.local',MD5('admin123'),'admin')
ON DUPLICATE KEY UPDATE name=VALUES(name);

-- Patients
INSERT INTO patients (name, phone, dob, gender) VALUES
('Demo Patient','01700000000','2000-01-01','Male'),
('Demo Patient 2','01800000000','1998-05-20','Female')
ON DUPLICATE KEY UPDATE name=name;

-- Doctors
INSERT INTO doctors (name, department, phone) VALUES
('Dr. Rahman','Medicine','01900000000'),
('Dr. Sultana','Surgery','01600000000')
ON DUPLICATE KEY UPDATE name=name;

-- Appointments
INSERT INTO appointments (patient_id, doctor_id, appt_date, appt_time, status) VALUES
(1,1,CURDATE(), '10:00', 'Scheduled'),
(2,2,CURDATE(), '11:00', 'Scheduled')
ON DUPLICATE KEY UPDATE status=VALUES(status);

-- OPD / IPD
INSERT INTO opd_ipd (patient_id, type, admit_date, discharge_date, notes) VALUES
(1,'OPD',CURDATE(), NULL,'Initial checkup'),
(2,'IPD',CURDATE(), NULL,'Admitted for observation')
ON DUPLICATE KEY UPDATE notes=VALUES(notes);

-- Pharmacy
INSERT INTO pharmacy (medicine_name, quantity, price) VALUES
('Paracetamol', 100, 2.00),
('Antacid', 50, 5.00)
ON DUPLICATE KEY UPDATE quantity=VALUES(quantity);
