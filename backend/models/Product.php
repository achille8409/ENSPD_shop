<?php
require_once __DIR__ . '/Database.php';

class Product {
    private PDO $db;

    public function __construct() {
        $this->db = Database::getConnection();
    }

    public function getAll(?string $categorySlug = null, ?string $search = null): array {
        $sql = "
            SELECT p.*, c.nom as categoryName, c.slug as category
            FROM produits p
            JOIN categories c ON p.categorie_id = c.id
            WHERE 1=1
        ";
        $params = [];

        if (!empty($categorySlug) && $categorySlug !== 'all') {
            $sql .= " AND c.slug = :category";
            $params[':category'] = $categorySlug;
        }

        if (!empty($search)) {
            $sql .= " AND (p.nom LIKE :search OR p.description LIKE :search)";
            $params[':search'] = '%' . $search . '%';
        }

        $sql .= " ORDER BY p.is_bestseller DESC, p.created_at DESC";

        $stmt = $this->db->prepare($sql);
        $stmt->execute($params);
        $results = $stmt->fetchAll();

        // Format boolean types & integers for JSON serialization
        return array_map(function($item) {
            return [
                'id'            => (int) $item['id'],
                'name'          => $item['nom'],
                'category'      => $item['category'],
                'categoryName'  => $item['categoryName'],
                'price'         => (int) $item['prix'],
                'originalPrice' => $item['prix_original'] ? (int) $item['prix_original'] : null,
                'rating'        => (float) $item['rating'],
                'reviewsCount'  => (int) $item['reviews_count'],
                'image'         => $item['image_url'],
                'badge'         => $item['badge'],
                'badgeColor'    => $item['badge_color'],
                'inStock'       => (int) $item['stock'] > 0,
                'stock'         => (int) $item['stock'],
                'isNew'         => (bool) $item['is_new'],
                'isBestSeller'  => (bool) $item['is_bestseller'],
                'description'   => $item['description']
            ];
        }, $results);
    }

    public function getById(int $id): ?array {
        $stmt = $this->db->prepare("
            SELECT p.*, c.nom as categoryName, c.slug as category
            FROM produits p
            JOIN categories c ON p.categorie_id = c.id
            WHERE p.id = :id
            LIMIT 1
        ");
        $stmt->execute([':id' => $id]);
        $item = $stmt->fetch();
        if (!$item) return null;

        return [
            'id'            => (int) $item['id'],
            'name'          => $item['nom'],
            'category'      => $item['category'],
            'categoryName'  => $item['categoryName'],
            'price'         => (int) $item['prix'],
            'originalPrice' => $item['prix_original'] ? (int) $item['prix_original'] : null,
            'rating'        => (float) $item['rating'],
            'reviewsCount'  => (int) $item['reviews_count'],
            'image'         => $item['image_url'],
            'badge'         => $item['badge'],
            'badgeColor'    => $item['badge_color'],
            'inStock'       => (int) $item['stock'] > 0,
            'stock'         => (int) $item['stock'],
            'isNew'         => (bool) $item['is_new'],
            'isBestSeller'  => (bool) $item['is_bestseller'],
            'description'   => $item['description']
        ];
    }

    public function getCategories(): array {
        $stmt = $this->db->query("
            SELECT c.*, COUNT(p.id) as count
            FROM categories c
            LEFT JOIN produits p ON p.categorie_id = c.id
            GROUP BY c.id
            ORDER BY c.id ASC
        ");
        return $stmt->fetchAll();
    }
}
