<?php
class EmrModel extends Model {
  public function all(){
    $st=$this->db->query("SELECT * FROM emr_records ORDER BY id DESC");
    return $st->fetchAll();
  }
  public function create(array $p){
    $sql="INSERT INTO emr_records (patient_id, doctor_name, department, visit_date, diagnosis, prescription, notes)
          VALUES (:patient_id,:doctor_name,:department,:visit_date,:diagnosis,:prescription,:notes)";
    $stmt=$this->db->prepare($sql);
    $stmt->execute([
      'patient_id' => (int)($p['patient_id'] ?? 1),
      'doctor_name'=> $p['doctor_name'] ?? 'Doctor',
      'department' => $p['department'] ?? null,
      'visit_date' => $p['visit_date'] ?? date('Y-m-d'),
      'diagnosis'  => $p['diagnosis'] ?? null,
      'prescription'=>$p['prescription'] ?? null,
      'notes'      => $p['notes'] ?? null,
    ]);
    return (int)$this->db->lastInsertId();
  }
}
