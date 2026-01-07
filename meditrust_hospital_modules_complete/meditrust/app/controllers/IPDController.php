<?php
declare(strict_types=1);
require_once APP_ROOT . '/core/Controller.php';
require_once APP_ROOT . '/models/IPDModel.php';
class IPDController extends Controller {
  private IPDModel $m;
  public function __construct(){ $c= $this->m=new IPDModel($c['data_dir']); }
  public function store(): void { try{
      $p=['patientId'=>trim($_POST['patientId']??''),'room'=>trim($_POST['room']??''),'diagnosis'=>trim($_POST['diagnosis']??''),'admitDate'=>trim($_POST['admitDate']??''),'dischargeDate'=>trim($_POST['dischargeDate']??''),'status'=>trim($_POST['status']??'Admitted')];
      foreach(['patientId','room','diagnosis','admitDate'] as $k) if(($p[$k]??'')==='') throw new Exception('Missing '.$k);
      $this->m->create($p); header('Location: /opd-ipd?msg=IPD%20added'); exit;
    }catch(Exception $e){ header('Location: /opd-ipd?err='.urlencode($e->getMessage())); exit; } }
  public function notes(): void { $id=$_POST['id']??''; $notes=trim($_POST['notes']??''); if($id) $this->m->update($id,['notes'=>$notes]); header('Location: /opd-ipd?msg=IPD%20notes%20updated'); exit; }
  public function status(): void { $id=$_POST['id']??''; $status=trim($_POST['status']??'Admitted'); $u=['status'=>$status]; if(strtolower($status)==='discharged') $u['dischargeDate']=date('Y-m-d'); if($id) $this->m->update($id,$u); header('Location: /opd-ipd?msg=IPD%20updated'); exit; }
  public function delete(): void { $id=$_POST['id']??''; if($id) $this->m->delete($id); header('Location: /opd-ipd?msg=IPD%20deleted'); exit; }
}
