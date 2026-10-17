<?php
require_once __DIR__ . '/Database.php';

class User {
    private PDO $db;

    public function __construct() {
        $this->db = Database::getConnection();
    }

    public function findByEmail(string $email): ?array {
        $stmt = $this->db->prepare("SELECT * FROM utilisateurs WHERE email = :email LIMIT 1");
        $stmt->execute([':email' => $email]);
        $user = $stmt->fetch();
        return $user ?: null;
    }

    public function findById(int $id): ?array {
        $stmt = $this->db->prepare("SELECT id, nom, email, telephone, departement, role, created_at FROM utilisateurs WHERE id = :id LIMIT 1");
        $stmt->execute([':id' => $id]);
        $user = $stmt->fetch();
        return $user ?: null;
    }

    public function create(string $nom, string $email, string $telephone, string $departement, string $hashedPassword, string $role = 'etudiant'): int {
        $stmt = $this->db->prepare("
            INSERT INTO utilisateurs (nom, email, telephone, departement, mot_de_passe, role)
            VALUES (:nom, :email, :telephone, :departement, :mot_de_passe, :role)
        ");
        $stmt->execute([
            ':nom'          => $nom,
            ':email'        => $email,
            ':telephone'    => $telephone,
            ':departement'  => $departement,
            ':mot_de_passe' => $hashedPassword,
            ':role'         => $role
        ]);
        return (int) $this->db->lastInsertId();
    }

}
