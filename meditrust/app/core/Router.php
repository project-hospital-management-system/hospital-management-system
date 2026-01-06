<?php
declare(strict_types=1);

class Router
{
    private array $routes = [];

    public function __construct()
    {
        // Pages
        $this->get('/', 'HomeController@index');
        $this->get('/emr', 'EmrController@index');
        $this->get('/notifications', 'NotificationsController@index');
        $this->get('/reports', 'ReportsController@index');
        $this->get('/telemedicine', 'TelemedicineController@index');
        $this->get('/feedback', 'FeedbackController@index');

        // Simple JSON APIs (optional, for DB integration later)
        $this->get('/api/notifications', 'NotificationsController@listJson');
        $this->post('/api/notifications', 'NotificationsController@createJson');

        $this->get('/api/feedback', 'FeedbackController@listJson');
        $this->post('/api/feedback', 'FeedbackController@createJson');

        $this->get('/api/visits', 'ReportsController@listJson');
        $this->post('/api/visits', 'ReportsController@createJson');

        $this->get('/api/emr', 'EmrController@listJson');
        $this->post('/api/emr', 'EmrController@createJson');

        $this->get('/api/telemedicine', 'TelemedicineController@listJson');
        $this->post('/api/telemedicine', 'TelemedicineController@createJson');
    }

    private function add(string $method, string $path, string $handler): void
    {
        $this->routes[] = compact('method', 'path', 'handler');
    }

    public function get(string $path, string $handler): void { $this->add('GET', $path, $handler); }
    public function post(string $path, string $handler): void { $this->add('POST', $path, $handler); }

    public function dispatch(string $uri, string $method): void
    {
        $path = parse_url($uri, PHP_URL_PATH) ?? '/';
        $base = BASE_URL ?: '';
        if ($base && str_starts_with($path, $base)) {
            $path = substr($path, strlen($base)) ?: '/';
        }

        foreach ($this->routes as $route) {
            if ($route['method'] === $method && $route['path'] === $path) {
                [$controllerName, $action] = explode('@', $route['handler']);
                $controllerFile = APP_ROOT . '/controllers/' . $controllerName . '.php';
                if (!file_exists($controllerFile)) $this->abort(500, "Controller not found");
                require_once $controllerFile;
                $controller = new $controllerName();
                if (!method_exists($controller, $action)) $this->abort(500, "Action not found");
                $controller->$action();
                return;
            }
        }
        $this->abort(404, "Page not found");
    }

    private function abort(int $code, string $message): void
    {
        http_response_code($code);
        echo "<h1>{$code}</h1><p>{$message}</p>";
    }
}
