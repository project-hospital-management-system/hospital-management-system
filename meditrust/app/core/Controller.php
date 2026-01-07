<?php
declare(strict_types=1);

class Controller
{
    protected function view(string $view, array $data = []): void
    {
        extract($data);
        $viewFile = APP_ROOT . '/views/' . $view . '.php';
        if (!file_exists($viewFile)) {
            http_response_code(500);
            echo "View not found: " . htmlspecialchars($view);
            return;
        }

        require APP_ROOT . '/views/layout/header.php';
        require $viewFile;
        require APP_ROOT . '/views/layout/footer.php';
    }

    protected function json($payload, int $status = 200): void
    {
        http_response_code($status);
        header('Content-Type: application/json; charset=utf-8');
        echo json_encode($payload);
        exit;
    }

    protected function model(string $model)
    {
        $modelFile = APP_ROOT . '/models/' . $model . '.php';
        if (!file_exists($modelFile)) {
            throw new RuntimeException("Model not found: {$model}");
        }
        require_once $modelFile;
        return new $model();
    }
}
