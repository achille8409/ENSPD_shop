<?php
require_once __DIR__ . '/../../config/cors.php';
require_once __DIR__ . '/../../controllers/AuthController.php';

$input = json_decode(file_get_contents('php://input'), true) ?? $_POST;

$controller = new AuthController();
$response = $controller->register($input);

echo json_encode($response);
