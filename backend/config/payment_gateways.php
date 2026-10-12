<?php
/**
 * Configuration des Passerelles de Paiement Mobile Money
 * MTN MoMo (Collection API) & Orange Money Web/USSD API
 */

return [
    // Mode Sandbox / Simulation (Mettre à false pour passer en production réelle)
    'sandbox_mode' => true,

    // Configuration MTN Mobile Money (MTN MoMo Cameroon)
    'mtn_momo' => [
        'base_url'          => 'https://sandbox.momodeveloper.mtn.com/collection/v1_0',
        'subscription_key'  => getenv('MTN_MOMO_SUB_KEY') ?: 'd4b79b9487c8441f9d50123456789abc',
        'api_user'          => getenv('MTN_MOMO_API_USER') ?: '12345678-abcd-1234-abcd-123456789abc',
        'api_key'           => getenv('MTN_MOMO_API_KEY') ?: 'momo_sandbox_key_example_987654321',
        'target_env'        => 'sandbox', // 'sandbox' ou 'live'
        'currency'          => 'XAF',
        'merchant_name'     => 'ENSPD SHOP DOUALA',
        'callback_url'      => 'https://enspd-shop.cm/backend/api/payments/callback_mtn.php'
    ],

    // Configuration Orange Money Cameroun
    'orange_money' => [
        'base_url'          => 'https://api.orange.com/orange-money-webpay/cm/v1',
        'auth_url'          => 'https://api.orange.com/oauth/v3/token',
        'client_id'         => getenv('OM_CLIENT_ID') ?: 'om_client_id_sandbox_example',
        'client_secret'     => getenv('OM_CLIENT_SECRET') ?: 'om_client_secret_sandbox_example',
        'merchant_key'      => getenv('OM_MERCHANT_KEY') ?: 'om_merch_key_123',
        'currency'          => 'XAF',
        'merchant_name'     => 'ENSPD SHOP DOUALA',
        'return_url'        => 'https://enspd-shop.cm/paiement?status=success',
        'cancel_url'        => 'https://enspd-shop.cm/paiement?status=failed'
    ],

    // Paramètres de simulation sandbox
    'simulation' => [
        'simulated_delay_seconds' => 1,
        // Téléphones tests pour simuler des cas d'échec
        'fail_phone_suffix'       => '000', // Un numéro se terminant par 000 déclenchera un solde insuffisant
    ]
];
