<?php
require_once __DIR__ . '/Database.php';

class Payment {
    private PDO $db;

    public function __construct() {
        $this->db = Database::getConnection();
    }

    public function record(array $data): int {
        $stmt = $this->db->prepare("
            INSERT INTO paiements (
                commande_id, reference_transaction, operateur, 
                telephone_payeur, montant_fcfa, statut, code_reponse, raw_response
            ) VALUES (
                :cmd_id, :ref, :operateur, 
                :phone, :montant, :statut, :code, :raw
            )
        ");

        $stmt->execute([
            ':cmd_id'    => $data['commande_id'],
            ':ref'       => $data['reference_transaction'],
            ':operateur' => $data['operateur'],
            ':phone'     => $data['telephone_payeur'],
            ':montant'   => (int) $data['montant_fcfa'],
            ':statut'    => $data['statut'] ?? 'EN_ATTENTE',
            ':code'      => $data['code_reponse'] ?? 'PENDING',
            ':raw'       => isset($data['raw_response']) ? json_encode($data['raw_response']) : null
        ]);

        return (int) $this->db->lastInsertId();
    }

    public function updateStatus(string $reference, string $statut, ?string $raw = null): bool {
        $stmt = $this->db->prepare("
            UPDATE paiements 
            SET statut = :statut, raw_response = COALESCE(:raw, raw_response) 
            WHERE reference_transaction = :ref
        ");
        return $stmt->execute([
            ':statut' => $statut,
            ':raw'    => $raw,
            ':ref'    => $reference
        ]);
    }
}
