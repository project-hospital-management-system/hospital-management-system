<?php
class TelemedicineController extends Controller {
  public function index(){ $this->view('telemedicine/telemedicine', ['pageCss'=>'telemedicine.css','pageJs'=>'telemedicine.js']); }

  public function listJson(){ $items = $this->model('TelemedicineModel')->all(); $this->json($items); }
  public function createJson(){
    $payload = json_decode(file_get_contents('php://input'), true) ?? $_POST;
    $id = $this->model('TelemedicineModel')->create($payload);
    $this->json(['ok'=>true,'id'=>$id], 201);
  }
}
