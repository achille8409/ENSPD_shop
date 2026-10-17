<?php
require_once __DIR__ . '/../../config/cors.php';
require_once __DIR__ . '/../../models/Database.php';

$method = $_SERVER['REQUEST_METHOD'];

// Ensure directory for log file exists if database is offline
$logFile = __DIR__ . '/../../logs/activities.json';
if (!file_exists(__DIR__ . '/../../logs')) {
    mkdir(__DIR__ . '/../../logs', 0777, true);
}

if ($method === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true) ?? $_POST;

    // Save to activities file
    $logs = [];
    if (file_exists($logFile)) {
        $logs = json_decode(file_get_contents($logFile), true) ?: [];
    }

    array_unshift($logs, [
        'id'        => $input['id'] ?? ('log-' . time()),
        'type'      => $input['type'] ?? 'ACTIVITY',
        'timestamp' => $input['timestamp'] ?? date('c'),
        'userName'  => $input['userName'] ?? 'Visiteur',
        'userEmail' => $input['userEmail'] ?? null,
        'userPhone' => $input['userPhone'] ?? null,
        'details'   => $input['details'] ?? '',
        'meta'      => $input['meta'] ?? []
    ]);

    // Keep last 300 entries
    if (count($logs) > 300) {
        $logs = array_slice($logs, 0, 300);
    }

    file_put_contents($logFile, json_encode($logs, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));

    echo json_encode(['success' => true, 'message' => 'Activité enregistrée avec succès.']);
    exit();
}

if ($method === 'GET') {
    $logs = [];
    if (file_exists($logFile)) {
        $logs = json_decode(file_get_contents($logFile), true) ?: [];
    }

    echo json_encode([
        'success' => true,
        'count'   => count($logs),
        'data'    => $logs
    ]);
    exit();
}
