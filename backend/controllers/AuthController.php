<?php
require_once __DIR__ . '/../models/User.php';

class AuthController {
    private User $userModel;

    public function __construct() {
        $this->userModel = new User();
    }

    public function login(array $input): array {
        $email = trim($input['email'] ?? '');
        $password = $input['password'] ?? '';

        if (empty($email) || empty($password)) {
            http_response_code(400);
            return ['success' => false, 'message' => 'L\'adresse email et le mot de passe sont obligatoires.'];
        }

        $user = $this->userModel->findByEmail($email);
        if (!$user) {
            http_response_code(401);
            return ['success' => false, 'message' => 'Aucun compte associé à cette adresse email.'];
        }

        // Verify password using password_verify
        if (!password_verify($password, $user['mot_de_passe'])) {
            http_response_code(401);
            return ['success' => false, 'message' => 'Mot de passe incorrect.'];
        }

        // Generate token
        $token = bin2hex(random_bytes(32));

        unset($user['mot_de_passe']);

        return [
            'success' => true,
            'token'   => $token,
            'user'    => [
                'id'         => (int) $user['id'],
                'name'       => $user['nom'],
                'email'      => $user['email'],
                'phone'      => $user['telephone'],
                'department' => $user['departement'],
                'role'       => $user['role']
            ],
            'message' => 'Connexion réussie !'
        ];
    }

    public function register(array $input): array {
        $nom = trim($input['name'] ?? '');
        $email = trim($input['email'] ?? '');
        $phone = trim($input['phone'] ?? '');
        $department = trim($input['department'] ?? 'Campus ENSPD');
        $password = $input['password'] ?? '';

        // Validation
        if (strlen($nom) < 3) {
            http_response_code(400);
            return ['success' => false, 'message' => 'Le nom complet doit comporter au moins 3 caractères.'];
        }

        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            http_response_code(400);
            return ['success' => false, 'message' => 'L\'adresse email fournie est invalide.'];
        }

        $cleanPhone = preg_replace('/\s+/', '', $phone);
        if (strlen($cleanPhone) < 9) {
            http_response_code(400);
            return ['success' => false, 'message' => 'Le numéro de téléphone doit comporter au moins 9 chiffres.'];
        }

        if (strlen($password) < 6) {
            http_response_code(400);
            return ['success' => false, 'message' => 'Le mot de passe doit comporter au moins 6 caractères.'];
        }

        // Check if user already exists
        $existing = $this->userModel->findByEmail($email);
        if ($existing) {
            http_response_code(409);
            return ['success' => false, 'message' => 'Un compte existe déjà avec cette adresse email.'];
        }

        // Secure password hashing
        $hashed = password_hash($password, PASSWORD_BCRYPT, ['cost' => 10]);

        $userId = $this->userModel->create($nom, $email, $cleanPhone, $department, $hashed);
        $token = bin2hex(random_bytes(32));

        return [
            'success' => true,
            'token'   => $token,
            'user'    => [
                'id'         => $userId,
                'name'       => $nom,
                'email'      => $email,
                'phone'      => $cleanPhone,
                'department' => $department,
                'role'       => 'etudiant'
            ],
            'message' => 'Compte créé avec succès ! Bienvenue sur ENSPD SHOP.'
        ];
    }
}
