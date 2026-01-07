<?php
class NotificationModel extends Model {
  public function all(){
    $st=$this->db->query("SELECT * FROM notifications ORDER BY id DESC");
    return $st->fetchAll();
  }
  public function create(array $p){
    $sql="INSERT INTO notifications (title, message, target_role) VALUES (:title,:message,:target_role)";
    $stmt=$this->db->prepare($sql);
    $stmt->execute([
      'title'=>$p['title'] ?? 'Notification',
      'message'=>$p['message'] ?? '',
      'target_role'=>$p['target_role'] ?? 'all',
    ]);
    return (int)$this->db->lastInsertId();
  }
}
