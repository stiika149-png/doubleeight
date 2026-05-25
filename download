<?php
/**
 * Double Eight for Business Solutions
 * Contact Form Handler — contact.php
 *
 * Accepts POST: name, email, phone, service, message
 * Saves to MySQL contacts table
 * Returns JSON response
 */

// Allow cross-origin requests from same domain
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Content-Type: application/json; charset=utf-8');

// Only accept POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed.']);
    exit;
}

require_once __DIR__ . '/db.php';

// ── Collect & Sanitize Inputs ──────────────────────────────────────────────
$name    = sanitize($_POST['name']    ?? '');
$email   = sanitize($_POST['email']   ?? '');
$phone   = sanitize($_POST['phone']   ?? '');
$service = sanitize($_POST['service'] ?? '');
$message = sanitize($_POST['message'] ?? '');

// ── Server-Side Validation ─────────────────────────────────────────────────
$errors = [];

if (empty($name) || strlen($name) < 2) {
    $errors[] = 'Please provide your full name.';
}

if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $errors[] = 'Please provide a valid email address.';
}

if (!empty($phone) && !preg_match('/^[\d\s\+\-\(\)]{7,20}$/', $phone)) {
    $errors[] = 'Please provide a valid phone number.';
}

if (empty($message) || strlen($message) < 10) {
    $errors[] = 'Please provide a message of at least 10 characters.';
}

if (!empty($errors)) {
    jsonResponse(false, implode(' ', $errors), 422);
}

// ── Rate Limiting (simple IP-based) ───────────────────────────────────────
$ip = $_SERVER['REMOTE_ADDR'] ?? '0.0.0.0';
$rateLimitFile = sys_get_temp_dir() . '/de_contact_' . md5($ip) . '.txt';
if (file_exists($rateLimitFile)) {
    $lastSubmit = (int) file_get_contents($rateLimitFile);
    if (time() - $lastSubmit < 60) {
        jsonResponse(false, 'Please wait a moment before sending another message.', 429);
    }
}
file_put_contents($rateLimitFile, time());

// ── Save to Database ───────────────────────────────────────────────────────
$db = getDB();

if ($db === null) {
    jsonResponse(false, 'We are experiencing technical difficulties. Please try again later.', 500);
}

try {
    $stmt = $db->prepare(
        'INSERT INTO contacts (name, email, phone, service, message, ip_address, created_at)
         VALUES (:name, :email, :phone, :service, :message, :ip, NOW())'
    );

    $stmt->execute([
        ':name'    => $name,
        ':email'   => $email,
        ':phone'   => $phone,
        ':service' => $service,
        ':message' => $message,
        ':ip'      => $ip,
    ]);

    // Optional: Send notification email to admin
    // mail('hello@doubleeight.qa', 'New Contact Form Submission', "From: $name <$email>\n\n$message");

    jsonResponse(true, 'Thank you, ' . $name . '! Your message has been received. Our team will be in touch within 24 hours.');

} catch (PDOException $e) {
    error_log('[Double Eight Contact Error] ' . $e->getMessage());
    jsonResponse(false, 'A database error occurred. Please try again later.', 500);
}
