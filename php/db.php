<?php
/**
 * Double Eight for Business Solutions
 * Database Connection — db.php
 *
 * SETUP INSTRUCTIONS:
 * 1. Replace DB_HOST, DB_NAME, DB_USER, DB_PASS with your actual hosting credentials
 * 2. These are typically found in your cPanel > MySQL Databases section
 * 3. Import the provided double_eight.sql file via phpMyAdmin BEFORE using the site
 */

define('DB_HOST', 'localhost');       // Usually 'localhost' on shared hosting
define('DB_NAME', 'doubvvoh_d8'); // Your database name (created in cPanel)
define('DB_USER', 'doubvvoh_d8');         // Your database username
define('DB_PASS', 'Sidali1212@');   // Your database password
define('DB_CHARSET', 'utf8mb4');

/**
 * Get PDO database connection
 * Returns PDO instance or null on failure
 */
function getDB(): ?PDO {
    static $pdo = null;

    if ($pdo !== null) {
        return $pdo;
    }

    $dsn = sprintf(
        'mysql:host=%s;dbname=%s;charset=%s',
        DB_HOST,
        DB_NAME,
        DB_CHARSET
    );

    $options = [
        PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES   => false,
    ];

    try {
        $pdo = new PDO($dsn, DB_USER, DB_PASS, $options);
        return $pdo;
    } catch (PDOException $e) {
        // Log error silently — do not expose details to client
        error_log('[Double Eight DB Error] ' . $e->getMessage());
        return null;
    }
}

/**
 * Sanitize input string
 */
function sanitize(string $input): string {
    return htmlspecialchars(strip_tags(trim($input)), ENT_QUOTES, 'UTF-8');
}

/**
 * Send JSON response and exit
 */
function jsonResponse(bool $success, string $message, int $httpCode = 200): void {
    http_response_code($httpCode);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode([
        'success' => $success,
        'message' => $message,
    ], JSON_UNESCAPED_UNICODE);
    exit;
}
