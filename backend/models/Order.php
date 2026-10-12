<?php
require_once __DIR__ . '/Database.php';

class Order {
    private PDO $db;

    public function __construct() {
        $this->db = Database::getConnection();
    }

    public function create(array $orderData, array $items): array {
        $this->db->beginTransaction();

        try {
            $codeCommande = 'ORD-ENSPD-' . strtoupper(substr(bin2hex(random_bytes(4)), 0, 6));

            $stmt = $this->db->prepare("
                INSERT INTO commandes (
                    code_commande, utilisateur_id, nom_client, email_client, 
                    telephone_client, adresse_livraison, notes, total_fcfa, 
                    frais_livraison, code_promo, statut
                ) VALUES (
                    :code, :user_id, :nom, :email, 
                    :phone, :adresse, :notes, :total, 
                    :frais, :promo, 'en_attente'
                )
            ");

            $stmt->execute([
                ':code'     => $codeCommande,
                ':user_id'  => $orderData['user_id'] ?? null,
                ':nom'      => $orderData['nom'],
                ':email'    => $orderData['email'] ?? null,
                ':phone'    => $orderData['phone'],
                ':adresse'  => $orderData['adresse'],
                ':notes'    => $orderData['notes'] ?? null,
                ':total'    => (int) $orderData['total'],
                ':frais'    => (int) ($orderData['frais_livraison'] ?? 0),
                ':promo'    => $orderData['code_promo'] ?? null
            ]);

            $orderId = (int) $this->db->lastInsertId();

            // Insert line items
            $lineStmt = $this->db->prepare("
                INSERT INTO lignes_commande (
                    commande_id, produit_id, nom_produit, prix_unitaire, quantite, sous_total
                ) VALUES (
                    :cmd_id, :prod_id, :nom, :prix, :qty, :subtotal
                )
            ");

            $stockStmt = $this->db->prepare("
                UPDATE produits SET stock = GREATEST(0, stock - :qty) WHERE id = :prod_id
            ");

            foreach ($items as $item) {
                $subtotal = (int) ($item['price'] * $item['quantity']);
                $lineStmt->execute([
                    ':cmd_id'   => $orderId,
                    ':prod_id'  => $item['id'] ?? null,
                    ':nom'      => $item['name'],
                    ':prix'     => (int) $item['price'],
                    ':qty'      => (int) $item['quantity'],
                    ':subtotal' => $subtotal
                ]);

                if (!empty($item['id'])) {
                    $stockStmt->execute([
                        ':qty'     => (int) $item['quantity'],
                        ':prod_id' => (int) $item['id']
                    ]);
                }
            }

            $this->db->commit();

            return [
                'order_id'      => $orderId,
                'code_commande' => $codeCommande,
                'total'         => $orderData['total']
            ];
        } catch (Exception $e) {
            $this->db->rollBack();
            throw $e;
        }
    }

    public function updateStatus(int $orderId, string $status): bool {
        $stmt = $this->db->prepare("UPDATE commandes SET statut = :status WHERE id = :id");
        return $stmt->execute([
            ':status' => $status,
            ':id'     => $orderId
        ]);
    }
}
