<?php
class FeedbackController extends Controller {
  public function index(){ $this->view('feedback/feedback', ['pageCss'=>'feedback.css','pageJs'=>'feedback.js']); }

  public function listJson(){ $items = $this->model('FeedbackModel')->all(); $this->json($items); }
  public function createJson(){
    $payload = json_decode(file_get_contents('php://input'), true) ?? $_POST;
    $id = $this->model('FeedbackModel')->create($payload);
    $this->json(['ok'=>true,'id'=>$id], 201);
  }
}
