<?php
/**
 * MB Architects — Contact Form Handler
 * Standalone mailer (no third-party library needed).
 * Uses cPanel's built-in PHP mail() function.
 *
 * Expected POST fields:
 *   name, email, phone (optional), project_type (optional), message, hp (honeypot — must be empty)
 *
 * Returns JSON: { "status": "ok" } or { "status": "error", "message": "..." }
 */

declare(strict_types=1);

/* ── Config ──────────────────────────────────────────────── */
const RECEIVING_EMAIL = 'mbarchitects10@gmail.com';
const FROM_DOMAIN     = 'mbarchitects.ng';           // used as sender domain
const RATE_LIMIT_MAX  = 3;                            // max submissions per session
const RATE_LIMIT_WIN  = 600;                          // window in seconds (10 min)

/* ── Bootstrap ───────────────────────────────────────────── */
header('Content-Type: application/json; charset=UTF-8');
header('X-Content-Type-Options: nosniff');

// Only accept POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['status' => 'error', 'message' => 'Method not allowed.']);
    exit;
}

/* ── Session-based rate limiting ─────────────────────────── */
session_start();
$now = time();
if (!isset($_SESSION['cf_times']) || !is_array($_SESSION['cf_times'])) {
    $_SESSION['cf_times'] = [];
}
// Purge entries outside the window
$_SESSION['cf_times'] = array_filter($_SESSION['cf_times'], fn($t) => ($now - $t) < RATE_LIMIT_WIN);
if (count($_SESSION['cf_times']) >= RATE_LIMIT_MAX) {
    http_response_code(429);
    echo json_encode(['status' => 'error', 'message' => 'Too many submissions. Please wait a few minutes.']);
    exit;
}

/* ── Honeypot check (bot trap) ───────────────────────────── */
if (!empty($_POST['hp'])) {
    // Silent discard — bots shouldn't know they were caught
    echo json_encode(['status' => 'ok']);
    exit;
}

/* ── Sanitise helper ─────────────────────────────────────── */
function clean(string $val): string {
    // Strip newlines (prevents email header injection) and excessive whitespace
    return trim(preg_replace('/[\r\n\t]+/', ' ', strip_tags($val)));
}

/* ── Collect & validate inputs ───────────────────────────── */
$name         = clean($_POST['name']         ?? '');
$email        = clean($_POST['email']        ?? '');
$phone        = clean($_POST['phone']        ?? '');
$project_type = clean($_POST['project_type'] ?? '');
$message      = trim(strip_tags($_POST['message'] ?? ''));

$errors = [];

if (mb_strlen($name) < 2 || mb_strlen($name) > 100) {
    $errors[] = 'Please enter your full name (2–100 characters).';
}
if (!filter_var($email, FILTER_VALIDATE_EMAIL) || mb_strlen($email) > 254) {
    $errors[] = 'Please enter a valid email address.';
}
if (mb_strlen($message) < 10 || mb_strlen($message) > 5000) {
    $errors[] = 'Please enter a message (10–5000 characters).';
}
if ($phone && !preg_match('/^[+\d\s\-().]{6,30}$/', $phone)) {
    $errors[] = 'Phone number format is invalid.';
}

if ($errors) {
    http_response_code(422);
    echo json_encode(['status' => 'error', 'message' => implode(' ', $errors)]);
    exit;
}

/* ── Build the email ─────────────────────────────────────── */
$subject = 'New Enquiry from ' . $name . ' — MB Architects Website';

// Plain-text body
$body  = "You have received a new project enquiry via the MB Architects website.\n";
$body .= str_repeat('─', 60) . "\n\n";
$body .= 'Name:          ' . $name        . "\n";
$body .= 'Email:         ' . $email       . "\n";
$body .= 'Phone:         ' . ($phone ?: '—') . "\n";
$body .= 'Project type:  ' . ($project_type ?: '—') . "\n\n";
$body .= "Message:\n" . $message . "\n\n";
$body .= str_repeat('─', 60) . "\n";
$body .= "Sent from: " . ($_SERVER['HTTP_ORIGIN'] ?? $_SERVER['HTTP_HOST'] ?? 'website') . "\n";
$body .= 'Time: ' . date('Y-m-d H:i:s T') . "\n";

// Headers
$headers    = implode("\r\n", [
    'MIME-Version: 1.0',
    'Content-Type: text/plain; charset=UTF-8',
    'Content-Transfer-Encoding: 8bit',
    'From: MB Architects Website <noreply@' . FROM_DOMAIN . '>',
    'Reply-To: <' . $email . '>',
    'X-Mailer: PHP/' . phpversion(),
]);

/* ── Send ─────────────────────────────────────────────────── */
$sent = mail(RECEIVING_EMAIL, $subject, $body, $headers);

if (!$sent) {
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'Mail could not be sent. Please try emailing us directly at info@mbarchitects.ng']);
    exit;
}

// Record this submission for rate limiting
$_SESSION['cf_times'][] = $now;

/* ── Send auto-reply to enquirer ─────────────────────────── */
$reply_subject = 'We received your enquiry — MB Architects';
$reply_body  = "Hi {$name},\n\n";
$reply_body .= "Thank you for reaching out to MB Architects. We've received your enquiry and will be in touch within 24 hours.\n\n";
$reply_body .= "In the meantime, you can explore our work at https://www.mbarchitects.ng\n\n";
$reply_body .= "Warm regards,\nThe MB Architects Team\n";
$reply_body .= "Lagos · Abuja · Abidjan · London\n";

$reply_headers = implode("\r\n", [
    'MIME-Version: 1.0',
    'Content-Type: text/plain; charset=UTF-8',
    'From: MB Architects <info@' . FROM_DOMAIN . '>',
]);

@mail($email, $reply_subject, $reply_body, $reply_headers);

echo json_encode(['status' => 'ok']);
exit;

