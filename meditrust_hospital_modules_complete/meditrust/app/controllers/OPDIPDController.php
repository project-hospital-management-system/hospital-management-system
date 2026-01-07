<?php
declare(strict_types=1);
require_once APP_ROOT . '/core/Controller.php';
require_once APP_ROOT . '/models/OPDModel.php';
require_once APP_ROOT . '/models/IPDModel.php';
class OPDIPDController extends Controller {
  private OPDModel $opd; private IPDModel $ipd;
  public function __construct(){ $c= $this->opd=new OPDModel($c['data_dir']); $this->ipd=new IPDModel($c['data_dir']); }
  public function index(): void { $this->view('hospital/opdipd', ['opd'=>$this->opd->all(),'ipd'=>$this->ipd->all()]); }
}
