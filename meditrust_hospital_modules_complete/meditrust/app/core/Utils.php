<?php
class Utils {
  public static function uid(string $prefix): string { return $prefix . strval(random_int(10000,99999)); }
  public static function today(): string { return date("Y-m-d"); }
  public static function h(string $s): string { return htmlspecialchars($s, ENT_QUOTES, "UTF-8"); }
}
