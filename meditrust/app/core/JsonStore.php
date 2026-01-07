<?php
class JsonStore {
  private string $path;

  public function __construct(string $filePath) {
    $this->path = $filePath;
    if (!file_exists($this->path)) {
      file_put_contents($this->path, json_encode([], JSON_PRETTY_PRINT));
    }
  }

  public function all(): array {
    $raw = file_get_contents($this->path);
    $data = json_decode($raw, true);
    return is_array($data) ? $data : [];
  }

  public function saveAll(array $items): void {
    file_put_contents($this->path, json_encode(array_values($items), JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
  }
}
