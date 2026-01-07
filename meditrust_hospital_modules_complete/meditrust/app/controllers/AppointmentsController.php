<?php
declare(strict_types=1);
require_once APP_ROOT . '/core/Controller.php';
require_once APP_ROOT . '/models/AppointmentModel.php';
require_once APP_ROOT . '/models/DoctorModel.php';
require_once APP_ROOT . '/models/PatientModel.php';
class AppointmentsController extends Controller {
  private AppointmentModel $a; private DoctorModel $d; private PatientModel $p;
  public function __construct(){ $c= $this->a=new AppointmentModel($c['data_dir']); $this->d=new DoctorModel($c['data_dir']); $this->p=new PatientModel($c['data_dir']); }
  public function index(): void { $this->view('hospital/appointments', ['appointments'=>$this->a->all(),'doctors'=>$this->d->all(),'patients'=>$this->p->all()]); }
  public function store(): void { try{
      $pl=['patientId'=>trim($_POST['patientId']??''),'doctorEmail'=>trim($_POST['doctorEmail']??''),'doctorName'=>trim($_POST['doctorName']??''),'department'=>trim($_POST['department']??''),'datetime'=>trim($_POST['datetime']??''),'reason'=>trim($_POST['reason']??'')];
      foreach($pl as $v) if($v==='') throw new Exception('All fields are required');
      $this->a->create($pl); header('Location: /appointments?msg=Appointment%20booked'); exit;
    }catch(Exception $e){ header('Location: /appointments?err='.urlencode($e->getMessage())); exit; } }
  public function approve(): void { try{ $id=$_POST['id']??''; $this->a->update($id,['status'=>'Approved']); header('Location: /appointments?msg=Approved'); exit; }catch(Exception $e){ header('Location: /appointments?err='.urlencode($e->getMessage())); exit; } }
  public function reschedule(): void { try{ $id=$_POST['id']??''; $dt=trim($_POST['datetime']??''); if(!$dt) throw new Exception('Missing datetime');
      $this->a->update($id,['datetime'=>$dt,'status'=>'Rescheduled']); header('Location: /appointments?msg=Rescheduled'); exit;
    }catch(Exception $e){ header('Location: /appointments?err='.urlencode($e->getMessage())); exit; } }
  public function delete(): void { $id=$_POST['id']??''; if($id) $this->a->delete($id); header('Location: /appointments?msg=Deleted'); exit; }
}
