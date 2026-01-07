<?php
declare(strict_types=1);
require_once APP_ROOT . '/core/Controller.php';
require_once APP_ROOT . '/models/MedicineModel.php';
class PharmacyController extends Controller {
  private MedicineModel $m;
  public function __construct(){ $c= $this->m=new MedicineModel($c['data_dir']); }
  public function index(): void { $this->view('hospital/pharmacy', ['medicines'=>$this->m->all()]); }
  public function store(): void { try{
      $p=['name'=>trim($_POST['name']??''),'batch'=>trim($_POST['batch']??''),'expiry'=>trim($_POST['expiry']??''),'qty'=>trim($_POST['qty']??''),'price'=>trim($_POST['price']??'')];
      foreach($p as $v) if($v==='') throw new Exception('All fields are required');
      $this->m->create($p); header('Location: /pharmacy?msg=Medicine%20saved'); exit;
    }catch(Exception $e){ header('Location: /pharmacy?err='.urlencode($e->getMessage())); exit; } }
  public function delete(): void { $id=$_POST['id']??''; if($id) $this->m->delete($id); header('Location: /pharmacy?msg=Medicine%20deleted'); exit; }
}
