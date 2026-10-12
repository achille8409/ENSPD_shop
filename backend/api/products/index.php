<?php
require_once __DIR__ . '/../../config/cors.php';
require_once __DIR__ . '/../../controllers/ProductController.php';

$category = $_GET['cat'] ?? $_GET['category'] ?? null;
$search = $_GET['search'] ?? $_GET['q'] ?? null;

$controller = new ProductController();
$response = $controller->index($category, $search);

echo json_encode($response);
