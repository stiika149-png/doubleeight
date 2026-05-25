<?php
/**
 * Double Eight for Business Solutions
 * Newsletter Subscription Handler — newsletter.php
 *
 * Accepts POST: email
 * Saves to MySQL `newsletter` table
 * Returns JSON response
 */

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed.']);
    exit;
}

require_once __DIR__ . '/db.php';

$email = sanitize($_POST['email'] ?? '');

if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    jsonResponse(false, 'Please provide a valid email address.', 422);
}

$db = getDB();

if ($db === null) {
    jsonResponse(false, 'Service temporarily unavailable. Please try again later.', 500);
}

try {
    // Check if already subscribed
    $check = $db->prepare('SELECT id FROM `newsletter` WHERE email = :email LIMIT 1');
    $check->execute([':email' => $email]);

    if ($check->fetch()) {
        jsonResponse(false, 'This email address is already subscribed. Thank you!');
    }

    $stmt = $db->prepare(
        'INSERT INTO `newsletter` (email, ip_address, created_at)
         VALUES (:email, :ip, NOW())'
    );

    $stmt->execute([
        ':email' => $email,
        ':ip'    => $_SERVER['REMOTE_ADDR'] ?? '0.0.0.0',
    ]);

    jsonResponse(true, 'You have successfully subscribed to our newsletter!');

} catch (PDOException $e) {
    error_log('[Double Eight Newsletter Error] ' . $e->getMessage());
    jsonResponse(false, 'A database error occurred. Please try again later.', 500);
}
