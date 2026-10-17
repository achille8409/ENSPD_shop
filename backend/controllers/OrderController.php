<?php
require_once __DIR__ . '/../models/Order.php';

class OrderController {
    private Order $orderModel;

    public function __construct() {
        $this->orderModel = new Order();
    }

    public function create(array $input): array {
        $nom = trim($input['nom'] ?? $input['fullName'] ?? '');
        $phone = trim($input['phone'] ?? '');
        $total = (int) ($input['amount'] ?? $input['total'] ?? 0);
        $items = $input['items'] ?? [];

        if (empty($nom) || empty($phone) || $total <= 0 || empty($items)) {
            http_response_code(400);
            return [
                'success' => false,
                'message' => 'Les informations du client, le montant et les articles sont obligatoires.'
            ];
        }

        try {
            $order = $this->orderModel->create([
                'user_id'         => $input['user_id'] ?? null,
                'nom'             => $nom,
                'email'           => $input['email'] ?? null,
                'phone'           => $phone,
                'adresse'         => $input['deliveryAddress'] ?? 'Campus ENSPD - PK17',
                'notes'           => $input['notes'] ?? null,
                'total'           => $total,
                'frais_livraison' => (int) ($input['deliveryFee'] ?? 0),
                'code_promo'      => $input['promoCode'] ?? null
            ], $items);

            return [
                'success' => true,
                'data'    => $order,
                'message' => 'Commande initiée avec succès.'
            ];
        } catch (Exception $e) {
            http_response_code(500);
            return [
                'success' => false,
                'message' => 'Erreur lors de la création de la commande : ' . $e->getMessage()
            ];
        }
    }
}
