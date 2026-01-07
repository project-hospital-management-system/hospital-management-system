<?php
require_once __DIR__ . "/../core/JsonStore.php";
require_once __DIR__ . "/../core/Utils.php";
class AppointmentModel {
  private JsonStore $store;
  public function __construct(string $dataDir){ $this->store=new JsonStore($dataDir."/appointments.json"); }
  public function all(): array { return $this->store->all(); }
  public function create(array $payload): array {
    $items=$this->store->all();
    foreach($items as $a){
      if(($a["doctorEmail"]??"")===$payload["doctorEmail"] && ($a["datetime"]??"")===$payload["datetime"]) throw new Exception("Doctor already booked at this date/time");
    }
    $id=Utils::uid("A"); while($this->find($id)) $id=Utils::uid("A");
    $item=["id"=>$id,"status"=>"Pending"]+$payload+["created_at"=>date("c")];
    $items[]=$item; $this->store->saveAll($items); return $item;
  }
  public function update(string $id,array $updates): ?array {
    $items=$this->store->all();
    foreach($items as $i=>$it){
      if(($it["id"]??"")===$id){
        $newDT=$updates["datetime"] ?? $it["datetime"];
        foreach($items as $a){
          if(($a["id"]??"")===$id) continue;
          if(($a["doctorEmail"]??"")===$it["doctorEmail"] && ($a["datetime"]??"")===$newDT) throw new Exception("Conflict: doctor already booked");
        }
        $items[$i]=array_merge($it,$updates);
        $this->store->saveAll($items); return $items[$i];
      }
    }
    return null;
  }
  public function delete(string $id): bool {
    $items=$this->store->all(); $before=count($items);
    $items=array_values(array_filter($items, fn($it)=>($it["id"]??"")!==$id));
    $this->store->saveAll($items); return count($items)<$before;
  }
  public function find(string $id): ?array { foreach($this->store->all() as $it) if(($it["id"]??"")===$id) return $it; return null; }
}
