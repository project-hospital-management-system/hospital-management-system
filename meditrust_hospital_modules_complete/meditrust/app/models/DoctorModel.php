<?php
require_once __DIR__ . "/../core/JsonStore.php";
class DoctorModel {
  private JsonStore $store;
  public function __construct(string $dataDir){ $this->store=new JsonStore($dataDir."/doctors.json"); }
  public function all(): array { return $this->store->all(); }
  public function create(array $payload): array {
    $items=$this->store->all();
    foreach($items as $d){
      if(($d["email"]??"")===$payload["email"]) throw new Exception("Email already exists");
      if(($d["contact"]??"")===$payload["contact"]) throw new Exception("Contact already exists");
    }
    $items[]=$payload+["created_at"=>date("c")];
    $this->store->saveAll($items); return $payload;
  }
  public function update(string $email, array $updates): ?array {
    $items=$this->store->all();
    foreach($items as $i=>$it){
      if(($it["email"]??"")===$email){
        if(isset($updates["contact"])){
          foreach($items as $d){
            if(($d["email"]??"")!==$email && ($d["contact"]??"")===$updates["contact"]) throw new Exception("Contact already used");
          }
        }
        $items[$i]=array_merge($it,$updates);
        $this->store->saveAll($items); return $items[$i];
      }
    }
    return null;
  }
  public function delete(string $email): bool {
    $items=$this->store->all(); $before=count($items);
    $items=array_values(array_filter($items, fn($it)=>($it["email"]??"")!==$email));
    $this->store->saveAll($items); return count($items)<$before;
  }
  public function find(string $email): ?array {
    foreach($this->store->all() as $it) if(($it["email"]??"")===$email) return $it;
    return null;
  }
}
