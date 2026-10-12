<?php
require_once __DIR__ . '/../../config/cors.php';
require_once __DIR__ . '/../../controllers/ProductController.php';

$controller = new ProductController();
$response = $controller->categories();

echo json_encode($response);
