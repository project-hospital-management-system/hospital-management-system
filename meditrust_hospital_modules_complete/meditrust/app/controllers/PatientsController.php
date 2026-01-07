<?php
declare(strict_types=1);
require_once APP_ROOT . '/core/Controller.php';
require_once APP_ROOT . '/models/PatientModel.php';
class PatientsController extends Controller {
  private PatientModel $m;
  public function __construct(){ $c= $this->m=new PatientModel($c['data_dir']); }
  public function index(): void { $this->view('hospital/patients', ['patients'=>$this->m->all()]); }
  public function store(): void {
    try{
      $p=['name'=>trim($_POST['name']??''),'age'=>trim($_POST['age']??''),'gender'=>trim($_POST['gender']??''),'contact'=>trim($_POST['contact']??''),'address'=>trim($_POST['address']??'')];
      foreach($p as $v) if($v==='') throw new Exception('All fields are required');
      $this->m->create($p);
      header('Location: /patients?msg=Patient%20registered'); exit;
    }catch(Exception $e){ header('Location: /patients?err='.urlencode($e->getMessage())); exit; }
  }
  public function update(): void {
    try{
      $id=$_POST['id']??''; if(!$id) throw new Exception('Missing id');
      $this->m->update($id, ['contact'=>trim($_POST['contact']??''), 'address'=>trim($_POST['address']??'')]);
      header('Location: /patients?msg=Patient%20updated'); exit;
    }catch(Exception $e){ header('Location: /patients?err='.urlencode($e->getMessage())); exit; }
  }
  public function delete(): void {
    $id=$_POST['id']??''; if($id) $this->m->delete($id);
    header('Location: /patients?msg=Patient%20deleted'); exit;
  }
}
