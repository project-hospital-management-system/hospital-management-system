<?php
class ReportsController extends Controller {
  public function index(){ $this->view('reports/reports', ['pageCss'=>'reports.css','pageJs'=>'reports.js']); }

  public function listJson(){ $items = $this->model('VisitModel')->all(); $this->json($items); }
  public function createJson(){
    $payload = json_decode(file_get_contents('php://input'), true) ?? $_POST;
    $id = $this->model('VisitModel')->create($payload);
    $this->json(['ok'=>true,'id'=>$id], 201);
  }
}
