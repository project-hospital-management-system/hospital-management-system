<?php
class FeedbackModel extends Model {
  public function all(){
    $st=$this->db->query("SELECT * FROM feedback ORDER BY id DESC");
    return $st->fetchAll();
  }
  public function create(array $p){
    $sql="INSERT INTO feedback (patient_name, category, message, status) VALUES (:patient_name,:category,:message,:status)";
    $stmt=$this->db->prepare($sql);
    $stmt->execute([
      'patient_name'=>$p['patient_name'] ?? '',
      'category'=>$p['category'] ?? null,
      'message'=>$p['message'] ?? '',
      'status'=>$p['status'] ?? 'Open',
    ]);
    return (int)$this->db->lastInsertId();
  }
}
