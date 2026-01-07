<?php
class TelemedicineModel extends Model {
  public function all(){
    $st=$this->db->query("SELECT * FROM telemedicine_sessions ORDER BY id DESC");
    return $st->fetchAll();
  }
  public function create(array $p){
    $sql="INSERT INTO telemedicine_sessions (session_code, patient_name, doctor_name, department, consult_type, datetime, status, low_bw, recording)
          VALUES (:session_code,:patient_name,:doctor_name,:department,:consult_type,:datetime,:status,:low_bw,:recording)";
    $stmt=$this->db->prepare($sql);
    $stmt->execute([
      'session_code'=>$p['session_code'] ?? ('TM'.rand(10000,99999)),
      'patient_name'=>$p['patient_name'] ?? '',
      'doctor_name'=>$p['doctor_name'] ?? '',
      'department'=>$p['department'] ?? null,
      'consult_type'=>$p['consult_type'] ?? 'Video',
      'datetime'=>$p['datetime'] ?? date('Y-m-d H:i'),
      'status'=>$p['status'] ?? 'Waiting Room',
      'low_bw'=>(int)($p['low_bw'] ?? 0),
      'recording'=>(int)($p['recording'] ?? 0),
    ]);
    return (int)$this->db->lastInsertId();
  }
}
