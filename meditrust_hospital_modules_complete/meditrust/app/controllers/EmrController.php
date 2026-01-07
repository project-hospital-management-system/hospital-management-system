<?php
class EmrController extends Controller {
  public function index(){ $this->view('emr/emr', ['pageCss'=>'emr.css','pageJs'=>'emr.js']); }

  public function listJson(){ $items = $this->model('EmrModel')->all(); $this->json($items); }
  public function createJson(){
    $payload = json_decode(file_get_contents('php://input'), true) ?? $_POST;
    $id = $this->model('EmrModel')->create($payload);
    $this->json(['ok'=>true,'id'=>$id], 201);
  }
}
