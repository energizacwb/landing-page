<?php
// Prevent unauthorized methods
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header("HTTP/1.1 405 Method Not Allowed");
    echo json_encode(["error" => "Method not allowed"]);
    exit;
}

header('Content-Type: application/json; charset=utf-8');

// Get POST JSON body
$json = file_get_contents('php://input');
$data = json_decode($json, true);

if (!$data) {
    header("HTTP/1.1 400 Bad Request");
    echo json_encode(["error" => "Invalid JSON payload"]);
    exit;
}

// Validate fields
$name = trim($data['name'] ?? '');
$email = trim($data['email'] ?? '');
$phone = trim($data['phone'] ?? '');
$company = trim($data['company'] ?? '');
$role = trim($data['role'] ?? '');
$icp = trim($data['icp'] ?? 'Geral');
$volume = trim($data['volume'] ?? '');

if (empty($name) || empty($email) || empty($phone) || empty($company)) {
    header("HTTP/1.1 400 Bad Request");
    echo json_encode(["error" => "Missing required fields"]);
    exit;
}

// Recipient email
$to = 'giza@energizasolucoes.com';
$subject = "Novo Lead Energiza: " . $name . " (" . $company . ")";

// Format email HTML body
$message = "
<html>
<head>
  <title>Novo Lead Capturado - Energiza Soluções</title>
  <style>
    body { font-family: sans-serif; color: #1e293b; line-height: 1.5; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px; }
    .header { background-color: #9900ff; color: white; padding: 15px; border-radius: 6px 6px 0 0; text-align: center; }
    .field { padding: 10px; border-bottom: 1px solid #f1f5f9; }
    .field-name { font-weight: bold; color: #64748b; }
    .field-value { color: #0f172a; }
  </style>
</head>
<body>
  <div class='container'>
    <div class='header'>
      <h2>Novo Lead Capturado</h2>
    </div>
    <div class='field'>
      <span class='field-name'>Nome Completo:</span> <span class='field-value'>$name</span>
    </div>
    <div class='field'>
      <span class='field-name'>E-mail Corporativo:</span> <span class='field-value'>$email</span>
    </div>
    <div class='field'>
      <span class='field-name'>Telefone/WhatsApp:</span> <span class='field-value'>$phone</span>
    </div>
    <div class='field'>
      <span class='field-name'>Empresa:</span> <span class='field-value'>$company</span>
    </div>
    <div class='field'>
      <span class='field-name'>Cargo:</span> <span class='field-value'>$role</span>
    </div>
    <div class='field'>
      <span class='field-name'>Segmento (ICP):</span> <span class='field-value'>$icp</span>
    </div>
    <div class='field'>
      <span class='field-name'>Volume Estimado:</span> <span class='field-value'>$volume</span>
    </div>
  </div>
</body>
</html>
";

// Headers
$headers = [];
$headers[] = 'MIME-Version: 1.0';
$headers[] = 'Content-type: text/html; charset=utf-8';
$headers[] = 'From: Leads Energiza <contato@energizasolucoes.com>';
$headers[] = 'Reply-To: ' . $email;

// Send email using PHP mail()
$mailSent = mail($to, $subject, $message, implode("\r\n", $headers));

if ($mailSent) {
    echo json_encode(["success" => true]);
} else {
    header("HTTP/1.1 500 Internal Server Error");
    echo json_encode(["error" => "Failed to send email"]);
}
