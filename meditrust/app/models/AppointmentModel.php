<?php
require_once __DIR__ . "/../core/JsonStore.php";
require_once __DIR__ . "/../core/Utils.php";

class AppointmentModel {
  private JsonStore $store;

  public function __construct(string $dataDir) {
    $this->store = new JsonStore($dataDir . "/appointments.json");
  }

  public function all(): array {
    return $this->store->all();
  }

  public function create(array $item): array {
    $items = $this->store->all();
    $items[] = $item;
    $this->store->saveAll($items);
    return $item;
  }

  public function update(string $idKey, string $id, array $updates): ?array {
    $items = $this->store->all();
    foreach ($items as $i => $it) {
      if (($it[$idKey] ?? "") === $id) {
        $items[$i] = array_merge($it, $updates);
        $this->store->saveAll($items);
        return $items[$i];
      }
    }
    return null;
  }

  public function delete(string $idKey, string $id): bool {
    $items = $this->store->all();
    $before = count($items);
    $items = array_values(array_filter($items, fn($it) => ($it[$idKey] ?? "") !== $id));
    $this->store->saveAll($items);
    return count($items) < $before;
  }

  public function find(string $idKey, string $id): ?array {
    foreach ($this->store->all() as $it) {
      if (($it[$idKey] ?? "") === $id) return $it;
    }
    return null;
  }
}
