<?php
declare(strict_types=1);
require_once APP_ROOT . '/core/Controller.php';
require_once APP_ROOT . '/models/DutyModel.php';
class DutiesController extends Controller {
  private DutyModel $duties;
  public function __construct(){ $c= $this->duties=new DutyModel($c['data_dir']); }
  public function store(): void {
    try{
      $p=['doctorEmail'=>trim($_POST['doctorEmail']??''),'doctorName'=>trim($_POST['doctorName']??''),'department'=>trim($_POST['department']??''),'date'=>trim($_POST['date']??''),'startTime'=>trim($_POST['startTime']??''),'endTime'=>trim($_POST['endTime']??'')];
      foreach($p as $v) if($v==='') throw new Exception('All fields are required');
      $this->duties->create($p);
      header('Location: /doctors?msg=Duty%20assigned'); exit;
    }catch(Exception $e){ header('Location: /doctors?err='.urlencode($e->getMessage())); exit; }
  }
  public function delete(): void {
    $id=$_POST['id']??''; if($id) $this->duties->delete($id);
    header('Location: /doctors?msg=Duty%20deleted'); exit;
  }
}
