<?php
class VisitModel extends Model {
  public function all(){
    $st=$this->db->query("SELECT * FROM visits ORDER BY id DESC");
    return $st->fetchAll();
  }
  public function create(array $p){
    $sql="INSERT INTO visits (patient_name, doctor_name, department, visit_date, visit_type, revenue)
          VALUES (:patient_name,:doctor_name,:department,:visit_date,:visit_type,:revenue)";
    $stmt=$this->db->prepare($sql);
    $stmt->execute([
      'patient_name'=>$p['patient_name'] ?? '',
      'doctor_name'=>$p['doctor_name'] ?? '',
      'department'=>$p['department'] ?? null,
      'visit_date'=>$p['visit_date'] ?? date('Y-m-d'),
      'visit_type'=>$p['visit_type'] ?? 'OPD',
      'revenue'=>(float)($p['revenue'] ?? 0),
    ]);
    return (int)$this->db->lastInsertId();
  }
}
