<?php
declare(strict_types=1);

require_once __DIR__ . '/../app/config/config.php';
require_once APP_ROOT . '/core/Router.php';

$router = new Router();
$router->dispatch($_SERVER['REQUEST_URI'], $_SERVER['REQUEST_METHOD']);
