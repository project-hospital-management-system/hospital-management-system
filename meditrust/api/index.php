<?php
// Simple JSON API Router (JSON storage by default)
// Run with: php -S localhost:8000 -t public
// API base: /api/index.php?resource=patients

$config = require __DIR__ . "/../app/config/config.php";
require_once __DIR__ . "/../app/core/Response.php";
require_once __DIR__ . "/../app/core/Request.php";
require_once __DIR__ . "/../app/core/Utils.php";

$dataDir = $config["data_dir"];
$resource = Request::query("resource", "");
$method = Request::method();
$body = Request::body();

function bad($msg, $code=400) { Response::json(["ok"=>false,"error"=>$msg], $code); }

switch ($resource) {
  case "patients":
    require_once __DIR__ . "/../app/models/PatientModel.php";
    $m = new PatientModel($dataDir);
    if ($method === "GET") Response::json(["ok"=>true,"data"=>$m->all()]);
    if ($method === "POST") {
      foreach (["name","age","gender","contact","address"] as $k) if (!isset($body[$k]) || trim((string)$body[$k])==="") bad("Missing $k");
      $id = Utils::uid("P");
      // Ensure unique
      while ($m->find("id",$id)) $id = Utils::uid("P");
      $item = ["id"=>$id] + $body + ["created_at"=>date("c")];
      Response::json(["ok"=>true,"data"=>$m->create($item)]);
    }
    if ($method === "PUT") {
      $id = $body["id"] ?? "";
      if (!$id) bad("Missing id");
      $updated = $m->update("id",$id,$body);
      if (!$updated) bad("Not found",404);
      Response::json(["ok"=>true,"data"=>$updated]);
    }
    if ($method === "DELETE") {
      $id = $body["id"] ?? "";
      if (!$id) bad("Missing id");
      $ok = $m->delete("id",$id);
      Response::json(["ok"=>$ok]);
    }
    break;

  case "doctors":
    require_once __DIR__ . "/../app/models/DoctorModel.php";
    require_once __DIR__ . "/../app/models/DutyModel.php";
    $m = new DoctorModel($dataDir);
    $duty = new DutyModel($dataDir);
    if ($method === "GET") Response::json(["ok"=>true,"data"=>$m->all()]);
    if ($method === "POST") {
      foreach (["name","specialty","department","availability","contact","email"] as $k) if (!isset($body[$k]) || trim((string)$body[$k])==="") bad("Missing $k");
      if ($m->find("email",$body["email"])) bad("Email exists");
      // unique contact
      foreach ($m->all() as $doc) if (($doc["contact"] ?? "") === $body["contact"]) bad("Contact exists");
      $item = $body + ["created_at"=>date("c")];
      Response::json(["ok"=>true,"data"=>$m->create($item)]);
    }
    if ($method === "PUT") {
      $email = $body["email"] ?? "";
      if (!$email) bad("Missing email");
      $updated = $m->update("email",$email,$body);
      if (!$updated) bad("Not found",404);
      Response::json(["ok"=>true,"data"=>$updated]);
    }
    if ($method === "DELETE") {
      $email = $body["email"] ?? "";
      if (!$email) bad("Missing email");
      $ok = $m->delete("email",$email);
      // also remove duties for this doctor
      $duties = array_values(array_filter($duty->all(), fn($x)=>($x["doctorEmail"]??"")!==$email));
      (new JsonStore($dataDir."/duty_schedules.json"))->saveAll($duties);
      Response::json(["ok"=>$ok]);
    }
    break;

  case "duties":
    require_once __DIR__ . "/../app/models/DutyModel.php";
    require_once __DIR__ . "/../app/models/DoctorModel.php";
    $m = new DutyModel($dataDir);
    $docM = new DoctorModel($dataDir);
    if ($method === "GET") Response::json(["ok"=>true,"data"=>$m->all()]);
    if ($method === "POST") {
      foreach (["doctorEmail","department","date","startTime","endTime"] as $k) if (!isset($body[$k]) || trim((string)$body[$k])==="") bad("Missing $k");
      if (!$docM->find("email",$body["doctorEmail"])) bad("Doctor not found",404);
      $list = $m->all();
      $id = Utils::uid("D");
      while ($m->find("id",$id)) $id = Utils::uid("D");
      // overlap
      foreach ($list as $it) {
        if (($it["doctorEmail"]??"")!==$body["doctorEmail"] || ($it["date"]??"")!==$body["date"]) continue;
        if ($body["startTime"] < ($it["endTime"]??"") && $body["endTime"] > ($it["startTime"]??"")) bad("Duty overlap");
      }
      $doc = $docM->find("email",$body["doctorEmail"]);
      $item = ["id"=>$id, "doctorName"=>$doc["name"]??""] + $body + ["created_at"=>date("c")];
      Response::json(["ok"=>true,"data"=>$m->create($item)]);
    }
    if ($method === "DELETE") {
      $id = $body["id"] ?? "";
      if (!$id) bad("Missing id");
      $ok = $m->delete("id",$id);
      Response::json(["ok"=>$ok]);
    }
    break;

  case "appointments":
    require_once __DIR__ . "/../app/models/AppointmentModel.php";
    require_once __DIR__ . "/../app/models/DoctorModel.php";
    require_once __DIR__ . "/../app/models/PatientModel.php";
    $m = new AppointmentModel($dataDir);
    $docM = new DoctorModel($dataDir);
    $patM = new PatientModel($dataDir);
    if ($method === "GET") Response::json(["ok"=>true,"data"=>$m->all()]);
    if ($method === "POST") {
      foreach (["patientId","doctorEmail","department","datetime","reason"] as $k) if (!isset($body[$k]) || trim((string)$body[$k])==="") bad("Missing $k");
      if (!$patM->find("id",$body["patientId"])) bad("Patient not found",404);
      $doc = $docM->find("email",$body["doctorEmail"]);
      if (!$doc) bad("Doctor not found",404);
      foreach ($m->all() as $a) {
        if (($a["doctorEmail"]??"")===$body["doctorEmail"] && ($a["datetime"]??"")===$body["datetime"]) bad("Doctor already booked at this datetime");
      }
      $id = Utils::uid("A");
      while ($m->find("id",$id)) $id = Utils::uid("A");
      $item = ["id"=>$id,"status"=>"Pending","doctorName"=>$doc["name"]??""] + $body + ["created_at"=>date("c")];
      Response::json(["ok"=>true,"data"=>$m->create($item)]);
    }
    if ($method === "PUT") {
      $id = $body["id"] ?? "";
      if (!$id) bad("Missing id");
      // conflict check if datetime changed
      $existing = $m->find("id",$id);
      if (!$existing) bad("Not found",404);
      $newDT = $body["datetime"] ?? $existing["datetime"];
      $docEmail = $existing["doctorEmail"];
      foreach ($m->all() as $a) {
        if (($a["id"]??"")===$id) continue;
        if (($a["doctorEmail"]??"")===$docEmail && ($a["datetime"]??"")===$newDT) bad("Conflict");
      }
      $updated = $m->update("id",$id,$body);
      Response::json(["ok"=>true,"data"=>$updated]);
    }
    if ($method === "DELETE") {
      $id = $body["id"] ?? "";
      if (!$id) bad("Missing id");
      $ok = $m->delete("id",$id);
      Response::json(["ok"=>$ok]);
    }
    break;

  case "medicines":
    require_once __DIR__ . "/../app/models/MedicineModel.php";
    $m = new MedicineModel($dataDir);
    if ($method === "GET") Response::json(["ok"=>true,"data"=>$m->all()]);
    if ($method === "POST") {
      foreach (["name","batch","expiry","qty","price"] as $k) if (!isset($body[$k]) || trim((string)$body[$k])==="") bad("Missing $k");
      foreach ($m->all() as $it) {
        if (strtolower($it["name"]??"")===strtolower($body["name"]) && strtolower($it["batch"]??"")===strtolower($body["batch"])) bad("Duplicate medicine+batch");
      }
      $id = Utils::uid("M");
      while ($m->find("id",$id)) $id = Utils::uid("M");
      $item = ["id"=>$id] + $body + ["created_at"=>date("c")];
      Response::json(["ok"=>true,"data"=>$m->create($item)]);
    }
    if ($method === "PUT") {
      $id = $body["id"] ?? "";
      if (!$id) bad("Missing id");
      $updated = $m->update("id",$id,$body);
      if (!$updated) bad("Not found",404);
      Response::json(["ok"=>true,"data"=>$updated]);
    }
    if ($method === "DELETE") {
      $id = $body["id"] ?? "";
      if (!$id) bad("Missing id");
      $ok = $m->delete("id",$id);
      Response::json(["ok"=>$ok]);
    }
    break;

  case "opd":
    require_once __DIR__ . "/../app/models/OPDModel.php";
    $m = new OPDModel($dataDir);
    if ($method === "GET") Response::json(["ok"=>true,"data"=>$m->all()]);
    if ($method === "POST") {
      foreach (["patientId","doctor","date","reason"] as $k) if (!isset($body[$k]) || trim((string)$body[$k])==="") bad("Missing $k");
      $id = Utils::uid("OPD");
      while ($m->find("id",$id)) $id = Utils::uid("OPD");
      $item = ["id"=>$id,"notes"=>""] + $body + ["created_at"=>date("c")];
      Response::json(["ok"=>true,"data"=>$m->create($item)]);
    }
    if ($method === "PUT") {
      $id = $body["id"] ?? "";
      if (!$id) bad("Missing id");
      $updated = $m->update("id",$id,$body);
      if (!$updated) bad("Not found",404);
      Response::json(["ok"=>true,"data"=>$updated]);
    }
    if ($method === "DELETE") {
      $id = $body["id"] ?? "";
      if (!$id) bad("Missing id");
      $ok = $m->delete("id",$id);
      Response::json(["ok"=>$ok]);
    }
    break;

  case "ipd":
    require_once __DIR__ . "/../app/models/IPDModel.php";
    $m = new IPDModel($dataDir);
    if ($method === "GET") Response::json(["ok"=>true,"data"=>$m->all()]);
    if ($method === "POST") {
      foreach (["patientId","room","diagnosis","admitDate"] as $k) if (!isset($body[$k]) || trim((string)$body[$k])==="") bad("Missing $k");
      $id = Utils::uid("IPD");
      while ($m->find("id",$id)) $id = Utils::uid("IPD");
      $status = $body["status"] ?? "Admitted";
      $dis = $body["dischargeDate"] ?? "";
      if ($status === "Discharged" && !$dis) $dis = Utils::today();
      if (!$dis) $status = "Admitted";
      $item = ["id"=>$id,"notes"=>"","status"=>$status,"dischargeDate"=>$dis] + $body + ["created_at"=>date("c")];
      Response::json(["ok"=>true,"data"=>$m->create($item)]);
    }
    if ($method === "PUT") {
      $id = $body["id"] ?? "";
      if (!$id) bad("Missing id");
      $updated = $m->update("id",$id,$body);
      if (!$updated) bad("Not found",404);
      Response::json(["ok"=>true,"data"=>$updated]);
    }
    if ($method === "DELETE") {
      $id = $body["id"] ?? "";
      if (!$id) bad("Missing id");
      $ok = $m->delete("id",$id);
      Response::json(["ok"=>$ok]);
    }
    break;

  default:
    bad("Unknown resource. Use ?resource=patients|doctors|duties|appointments|medicines|opd|ipd", 404);
}
