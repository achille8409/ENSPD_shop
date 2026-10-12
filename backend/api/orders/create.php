<?php
require_once __DIR__ . '/../../config/cors.php';
require_once __DIR__ . '/../../controllers/OrderController.php';

$input = json_decode(file_get_contents('php://input'), true) ?? $_POST;

$controller = new OrderController();
$response = $controller->create($input);

echo json_encode($response);
