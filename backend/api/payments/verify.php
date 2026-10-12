<?php
require_once __DIR__ . '/../../config/cors.php';
require_once __DIR__ . '/../../models/Database.php';

$reference = $_GET['ref'] ?? $_GET['transactionId'] ?? null;

if (empty($reference)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Référence de transaction requise.']);
    exit();
}

$db = Database::getConnection();
$stmt = $db->prepare("SELECT * FROM paiements WHERE reference_transaction = :ref LIMIT 1");
$stmt->execute([':ref' => $reference]);
$payment = $stmt->fetch();

if (!$payment) {
    http_response_code(404);
    echo json_encode(['success' => false, 'message' => 'Transaction introuvable.']);
    exit();
}

echo json_encode([
    'success' => true,
    'data'    => $payment
]);
