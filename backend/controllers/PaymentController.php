<?php
require_once __DIR__ . '/../models/Payment.php';
require_once __DIR__ . '/../models/Order.php';

class PaymentController {
    private Payment $paymentModel;
    private Order $orderModel;
    private array $config;

    public function __construct() {
        $this->paymentModel = new Payment();
        $this->orderModel = new Order();
        $this->config = require __DIR__ . '/../config/payment_gateways.php';
    }

    public function process(array $input): array {
        $operator = strtolower(trim($input['operator'] ?? 'mtn'));
        $phone = preg_replace('/\s+/', '', $input['phone'] ?? '');
        $amount = (int) ($input['amount'] ?? 0);
        $orderId = $input['order_id'] ?? null;
        $items = $input['items'] ?? [];

        // Validation
        if (!in_array($operator, ['mtn', 'orange'])) {
            http_response_code(400);
            return ['success' => false, 'message' => 'Opérateur invalide. Choisissez MTN MoMo ou Orange Money.'];
        }

        if (strlen($phone) < 9) {
            http_response_code(400);
            return ['success' => false, 'message' => 'Numéro de téléphone invalide (minimum 9 chiffres).'];
        }

        if ($amount <= 0) {
            http_response_code(400);
            return ['success' => false, 'message' => 'Le montant doit être supérieur à 0 FCFA.'];
        }

        // Auto-create order if not provided
        if (!$orderId && !empty($items)) {
            try {
                $orderRes = $this->orderModel->create([
                    'nom'             => $input['fullName'] ?? 'Étudiant Polytech',
                    'email'           => $input['email'] ?? null,
                    'phone'           => $phone,
                    'adresse'         => $input['deliveryAddress'] ?? 'Campus ENSPD - PK17',
                    'notes'           => $input['notes'] ?? null,
                    'total'           => $amount,
                    'frais_livraison' => (int) ($input['deliveryFee'] ?? 0),
                    'code_promo'      => $input['promoCode'] ?? null
                ], $items);
                $orderId = $orderRes['order_id'];
            } catch (Exception $e) {
                // If DB is offline, continue in virtual mode
                $orderId = rand(100, 999);
            }
        }

        // Vérifier si le mode Sandbox est activé
        if ($this->config['sandbox_mode']) {
            return $this->handleSandboxPayment($operator, $phone, $amount, (int)$orderId);
        } else {
            return $this->handleLivePayment($operator, $phone, $amount, (int)$orderId);
        }
    }

    /**
     * Simulation haute fidélité Sandbox pour tests et soutenance
     */
    private function handleSandboxPayment(string $operator, string $phone, int $amount, int $orderId): array {
        // Test failure trigger : si le numéro se termine par le suffixe défini (000)
        $failSuffix = $this->config['simulation']['fail_phone_suffix'];
        if (str_ends_with($phone, $failSuffix)) {
            $refFailed = strtoupper($operator) . '-FAIL-' . rand(100000, 999999);
            
            try {
                $this->paymentModel->record([
                    'commande_id'           => $orderId,
                    'reference_transaction' => $refFailed,
                    'operateur'             => $operator,
                    'telephone_payeur'      => $phone,
                    'montant_fcfa'          => $amount,
                    'statut'                => 'ECHEC',
                    'code_reponse'          => 'INSUFFICIENT_FUNDS_OR_TIMEOUT',
                    'raw_response'          => ['reason' => 'Solde insuffisant ou rejet USSD']
                ]);
            } catch (Exception) {}

            http_response_code(402);
            return [
                'success' => false,
                'status'  => 'FAILED',
                'message' => 'Échec de la transaction : solde insuffisant sur votre compte ' . 
                    ($operator === 'orange' ? 'Orange Money' : 'MTN Mobile Money') . 
                    ' ou rejet de la notification USSD.'
            ];
        }

        // Succès de la transaction
        $prefix = $operator === 'orange' ? 'OM' : 'MOMO';
        $transactionId = $prefix . '-ENSPD-' . rand(100000, 999999);

        try {
            $this->paymentModel->record([
                'commande_id'           => $orderId,
                'reference_transaction' => $transactionId,
                'operateur'             => $operator,
                'telephone_payeur'      => $phone,
                'montant_fcfa'          => $amount,
                'statut'                => 'SUCCES',
                'code_reponse'          => 'SUCCESS_200',
                'raw_response'          => [
                    'mode'         => 'SANDBOX',
                    'auth_method'  => 'USSD_PUSH_PIN',
                    'gateway'      => $operator === 'orange' ? 'Orange Money Cameroun' : 'MTN MoMo Cameroon',
                    'timestamp'    => date('Y-m-d H:i:s')
                ]
            ]);

            $this->orderModel->updateStatus($orderId, 'payee');
        } catch (Exception $e) {
            // Mode sans base de données connectée
        }

        return [
            'success'       => true,
            'status'        => 'SUCCESS',
            'transactionId' => $transactionId,
            'orderId'       => 'ORD-ENSPD-' . $orderId,
            'amount'        => $amount,
            'operator'      => $operator,
            'phone'         => $phone,
            'timestamp'     => date('c'),
            'message'       => 'Paiement de ' . number_format($amount, 0, ',', ' ') . ' FCFA validé avec succès via ' . 
                ($operator === 'orange' ? 'Orange Money' : 'MTN Mobile Money') . '.'
        ];
    }

    /**
     * Intégration en Production avec les API Réelles MTN et Orange Money
     */
    private function handleLivePayment(string $operator, string $phone, int $amount, int $orderId): array {
        if ($operator === 'mtn') {
            return $this->callMtnMoMoLive($phone, $amount, $orderId);
        } else {
            return $this->callOrangeMoneyLive($phone, $amount, $orderId);
        }
    }

    private function callMtnMoMoLive(string $phone, int $amount, int $orderId): array {
        $momoConfig = $this->config['mtn_momo'];
        $referenceId = sprintf('%04x%04x-%04x-%04x-%04x-%04x%04x%04x',
            mt_rand(0, 0xffff), mt_rand(0, 0xffff), mt_rand(0, 0xffff),
            mt_rand(0, 0x0fff) | 0x4000, mt_rand(0, 0x3fff) | 0x8000,
            mt_rand(0, 0xffff), mt_rand(0, 0xffff), mt_rand(0, 0xffff)
        );

        $payload = [
            'amount'       => (string) $amount,
            'currency'     => $momoConfig['currency'],
            'externalId'   => (string) $orderId,
            'payer'        => ['partyIdType' => 'MSISDN', 'partyId' => '237' . $phone],
            'payerMessage' => 'Paiement commande ENSPD SHOP',
            'payeeNote'    => 'ENSPD Douala'
        ];

        // Exemple d'appel cURL vers MTN Collection API
        $ch = curl_init("{$momoConfig['base_url']}/requesttopay");
        curl_setopt($ch, CURLOPT_POST, 1);
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($payload));
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_HTTPHEADER, [
            'X-Reference-Id: ' . $referenceId,
            'X-Target-Environment: ' . $momoConfig['target_env'],
            'Ocp-Apim-Subscription-Key: ' . $momoConfig['subscription_key'],
            'Content-Type: application/json'
        ]);

        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);

        if ($httpCode === 202) {
            return [
                'success'       => true,
                'status'        => 'PENDING_USSD',
                'transactionId' => 'MOMO-' . $referenceId,
                'orderId'       => $orderId,
                'amount'        => $amount,
                'operator'      => 'mtn',
                'message'       => 'Veuillez composer *126# pour approuver le débit sur votre téléphone MTN.'
            ];
        }

        return [
            'success' => false,
            'message' => 'Erreur lors de la communication avec l\'API MTN MoMo (HTTP ' . $httpCode . ')'
        ];
    }

    private function callOrangeMoneyLive(string $phone, int $amount, int $orderId): array {
        $omConfig = $this->config['orange_money'];
        
        $payload = [
            'merchant_key' => $omConfig['merchant_key'],
            'currency'     => $omConfig['currency'],
            'order_id'     => (string) $orderId,
            'amount'       => $amount,
            'return_url'   => $omConfig['return_url'],
            'cancel_url'   => $omConfig['cancel_url'],
            'notif_url'    => 'https://enspd-shop.cm/backend/api/payments/callback_om.php',
            'lang'         => 'fr',
            'reference'    => 'ENSPD-' . $orderId
        ];

        // Appel cURL vers Orange Money Web Payment API
        $ch = curl_init("{$omConfig['base_url']}/webpayment");
        curl_setopt($ch, CURLOPT_POST, 1);
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($payload));
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_HTTPHEADER, [
            'Content-Type: application/json',
            'Authorization: Bearer ' . ($this->config['orange_money']['client_id'] ?? '')
        ]);

        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);

        $resData = json_decode($response, true);

        if ($httpCode === 201 && isset($resData['payment_url'])) {
            return [
                'success'     => true,
                'status'      => 'REDIRECT',
                'paymentUrl'  => $resData['payment_url'],
                'message'     => 'Redirection vers la page sécurisée Orange Money...'
            ];
        }

        return [
            'success' => false,
            'message' => 'Erreur lors de l\'initialisation du paiement Orange Money.'
        ];
    }
}
