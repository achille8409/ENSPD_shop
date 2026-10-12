<?php
require_once __DIR__ . '/../../config/cors.php';
require_once __DIR__ . '/../../controllers/PaymentController.php';

$input = json_decode(file_get_contents('php://input'), true) ?? $_POST;

$controller = new PaymentController();
$response = $controller->process($input);

echo json_encode($response);
