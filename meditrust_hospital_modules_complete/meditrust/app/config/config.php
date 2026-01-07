<?php
declare(strict_types=1);

define('APP_ROOT', dirname(__DIR__));
define('PUBLIC_ROOT', dirname(APP_ROOT) . '/public');

define('APP_NAME', 'MediTrust MVC');
define('BASE_URL', '/meditrust/public'); // auto-set for XAMPP folder name

require_once APP_ROOT . '/config/database.php';
require_once APP_ROOT . '/core/Controller.php';
require_once APP_ROOT . '/core/Model.php';


define('DATA_DIR', dirname(APP_ROOT) . '/data');
