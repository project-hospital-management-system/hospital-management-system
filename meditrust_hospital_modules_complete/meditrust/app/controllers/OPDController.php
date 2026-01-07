<?php
declare(strict_types=1);
require_once APP_ROOT . '/core/Controller.php';
require_once APP_ROOT . '/models/OPDModel.php';
require_once APP_ROOT . '/config/config.php';
class OPDController extends Controller {
  private OPDModel $m;
  public function __construct(){ $c= $this->m=new OPDModel($c['data_dir']); }
  public function store(): void { try{
      $p=['patientId'=>trim($_POST['patientId']??''),'doctor'=>trim($_POST['doctor']??''),'date'=>trim($_POST['date']??''),'reason'=>trim($_POST['reason']??'')];
      foreach($p as $v) if($v==='') throw new Exception('All fields are required');
      $this->m->create($p); header('Location: /opd-ipd?msg=OPD%20added'); exit;
    }catch(Exception $e){ header('Location: /opd-ipd?err='.urlencode($e->getMessage())); exit; } }
  public function notes(): void { $id=$_POST['id']??''; $notes=trim($_POST['notes']??''); if($id) $this->m->update($id,['notes'=>$notes]); header('Location: /opd-ipd?msg=OPD%20notes%20updated'); exit; }
  public function delete(): void { $id=$_POST['id']??''; if($id) $this->m->delete($id); header('Location: /opd-ipd?msg=OPD%20deleted'); exit; }
}
