<?php
declare(strict_types=1);
require_once APP_ROOT . '/core/Controller.php';
require_once APP_ROOT . '/models/DoctorModel.php';
require_once APP_ROOT . '/models/DutyModel.php';
class DoctorsController extends Controller {
  private DoctorModel $doctors; private DutyModel $duties;
  public function __construct(){ $c= $this->doctors=new DoctorModel($c['data_dir']); $this->duties=new DutyModel($c['data_dir']); }
  public function index(): void { $this->view('hospital/doctors', ['doctors'=>$this->doctors->all(),'duties'=>$this->duties->all()]); }
  public function store(): void {
    try{
      $p=['name'=>trim($_POST['name']??''),'specialty'=>trim($_POST['specialty']??''),'department'=>trim($_POST['department']??''),'availability'=>trim($_POST['availability']??''),'contact'=>trim($_POST['contact']??''),'email'=>trim($_POST['email']??'')];
      foreach($p as $v) if($v==='') throw new Exception('All fields are required');
      $this->doctors->create($p);
      header('Location: /doctors?msg=Doctor%20saved'); exit;
    }catch(Exception $e){ header('Location: /doctors?err='.urlencode($e->getMessage())); exit; }
  }
  public function delete(): void {
    $email=$_POST['email']??''; if($email){ $this->doctors->delete($email); $this->duties->deleteByDoctor($email); }
    header('Location: /doctors?msg=Doctor%20deleted'); exit;
  }
}
