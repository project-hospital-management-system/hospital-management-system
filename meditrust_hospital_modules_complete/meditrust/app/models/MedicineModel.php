<?php
require_once __DIR__ . "/../core/JsonStore.php";
require_once __DIR__ . "/../core/Utils.php";
class MedicineModel {
  private JsonStore $store;
  public function __construct(string $dataDir){ $this->store=new JsonStore($dataDir."/medicines.json"); }
  public function all(): array { return $this->store->all(); }
  public function create(array $payload): array {
    $items=$this->store->all();
    foreach($items as $m){
      if(strtolower($m["name"]??"")==strtolower($payload["name"]) && strtolower($m["batch"]??"")==strtolower($payload["batch"])) throw new Exception("Duplicate medicine + batch");
    }
    $id=Utils::uid("M"); while($this->find($id)) $id=Utils::uid("M");
    $item=["id"=>$id]+$payload+["created_at"=>date("c")];
    $items[]=$item; $this->store->saveAll($items); return $item;
  }
  public function delete(string $id): bool {
    $items=$this->store->all(); $before=count($items);
    $items=array_values(array_filter($items, fn($it)=>($it["id"]??"")!==$id));
    $this->store->saveAll($items); return count($items)<$before;
  }
  public function find(string $id): ?array { foreach($this->store->all() as $it) if(($it["id"]??"")===$id) return $it; return null; }
}
