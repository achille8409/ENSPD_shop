<?php
require_once __DIR__ . '/../models/Product.php';

class ProductController {
    private Product $productModel;

    public function __construct() {
        $this->productModel = new Product();
    }

    public function index(?string $category = null, ?string $search = null): array {
        $products = $this->productModel->getAll($category, $search);
        return [
            'success' => true,
            'count'   => count($products),
            'data'    => $products
        ];
    }

    public function show(int $id): array {
        $product = $this->productModel->getById($id);
        if (!$product) {
            http_response_code(404);
            return ['success' => false, 'message' => 'Produit non trouvé.'];
        }
        return [
            'success' => true,
            'data'    => $product
        ];
    }

    public function categories(): array {
        $categories = $this->productModel->getCategories();
        return [
            'success' => true,
            'data'    => $categories
        ];
    }
}
