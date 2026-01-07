<?php
require_once __DIR__ . "/../core/JsonStore.php";
require_once __DIR__ . "/../core/Utils.php";
class DutyModel {
  private JsonStore $store;
  public function __construct(string $dataDir){ $this->store=new JsonStore($dataDir."/duty_schedules.json"); }
  public function all(): array { return $this->store->all(); }
  public function create(array $payload): array {
    $items=$this->store->all();
    foreach($items as $it){
      if(($it["doctorEmail"]??"")!==($payload["doctorEmail"]??"")) continue;
      if(($it["date"]??"")!==($payload["date"]??"")) continue;
      if($payload["startTime"] < ($it["endTime"]??"") && $payload["endTime"] > ($it["startTime"]??"")) throw new Exception("Duty overlap detected");
    }
    $id=Utils::uid("D"); while($this->find($id)) $id=Utils::uid("D");
    $item=["id"=>$id]+$payload+["created_at"=>date("c")];
    $items[]=$item; $this->store->saveAll($items); return $item;
  }
  public function delete(string $id): bool {
    $items=$this->store->all(); $before=count($items);
    $items=array_values(array_filter($items, fn($it)=>($it["id"]??"")!==$id));
    $this->store->saveAll($items); return count($items)<$before;
  }
  public function deleteByDoctor(string $email): void {
    $items=array_values(array_filter($this->store->all(), fn($it)=>($it["doctorEmail"]??"")!==$email));
    $this->store->saveAll($items);
  }
  public function find(string $id): ?array { foreach($this->store->all() as $it) if(($it["id"]??"")===$id) return $it; return null; }
}
