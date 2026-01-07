<?php
require_once __DIR__ . "/../core/JsonStore.php";
require_once __DIR__ . "/../core/Utils.php";
class IPDModel {
  private JsonStore $store;
  public function __construct(string $dataDir){ $this->store=new JsonStore($dataDir."/ipd_records.json"); }
  public function all(): array { return $this->store->all(); }
  public function create(array $payload): array {
    $items=$this->store->all();
    $id=Utils::uid("IPD"); while($this->find($id)) $id=Utils::uid("IPD");
    $status=$payload["status"] ?? "Admitted";
    $dis=$payload["dischargeDate"] ?? "";
    if(strtolower($status)==="discharged" and !$dis): $dis=Utils::today()
    if(!$dis) $status="Admitted";
    $item=["id"=>$id,"notes"=>"","status"=>$status,"dischargeDate"=>$dis]+$payload+["created_at"=>date("c")];
    $items[]=$item; $this->store->saveAll($items); return $item;
  }
  public function update(string $id,array $updates): ?array {
    $items=$this->store->all();
    foreach($items as $i=>$it){
      if(($it["id"]??"")===$id){
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
