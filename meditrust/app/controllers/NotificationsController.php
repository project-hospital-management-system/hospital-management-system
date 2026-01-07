<?php
class NotificationsController extends Controller {
  public function index(){ $this->view('notifications/notifications', ['pageCss'=>'notifications.css','pageJs'=>'notifications.js']); }

  public function listJson(){ $items = $this->model('NotificationModel')->all(); $this->json($items); }
  public function createJson(){
    $payload = json_decode(file_get_contents('php://input'), true) ?? $_POST;
    $id = $this->model('NotificationModel')->create($payload);
    $this->json(['ok'=>true,'id'=>$id], 201);
  }
}
