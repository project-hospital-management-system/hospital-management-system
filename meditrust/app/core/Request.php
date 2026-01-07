<?php
class Request {
  public static function method(): string {
    return $_SERVER["REQUEST_METHOD"] ?? "GET";
  }
  public static function body(): array {
    $raw = file_get_contents("php://input");
    if (!$raw) return [];
    $json = json_decode($raw, true);
    return is_array($json) ? $json : [];
  }
  public static function query(string $key, $default=null) {
    return $_GET[$key] ?? $default;
  }
}
