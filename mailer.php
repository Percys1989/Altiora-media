<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

// ---- Configuración ----
$to      = 'hello@altioramedia.com'; // Correo corporativo destino
$subject_prefix = '[Altiora Media] Nuevo mensaje de contacto';

// ---- Solo aceptar POST ----
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
  http_response_code(405);
  echo json_encode(['success' => false, 'message' => 'Método no permitido.']);
  exit;
}

// ---- Sanitizar y validar campos ----
$name    = isset($_POST['name'])    ? htmlspecialchars(strip_tags(trim($_POST['name'])))    : '';
$email   = isset($_POST['email'])   ? htmlspecialchars(strip_tags(trim($_POST['email'])))   : '';
$company = isset($_POST['company']) ? htmlspecialchars(strip_tags(trim($_POST['company']))) : '';
$service = isset($_POST['service']) ? htmlspecialchars(strip_tags(trim($_POST['service']))) : '';
$message = isset($_POST['message']) ? htmlspecialchars(strip_tags(trim($_POST['message']))) : '';

// Validaciones básicas
if (empty($name) || strlen($name) < 2) {
  echo json_encode(['success' => false, 'message' => 'Por favor ingresa tu nombre.']);
  exit;
}

if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
  echo json_encode(['success' => false, 'message' => 'Por favor ingresa un correo válido.']);
  exit;
}

if (empty($message) || strlen($message) < 10) {
  echo json_encode(['success' => false, 'message' => 'Por favor escribe un mensaje más detallado.']);
  exit;
}

// ---- Honeypot anti-spam ----
if (!empty($_POST['website'])) {
  echo json_encode(['success' => true, 'message' => 'Mensaje enviado.']);
  exit;
}

// ---- Construir el correo ----
$subject = "$subject_prefix - $name";

$body = "
<!DOCTYPE html>
<html lang='en'>
<head>
  <meta charset='UTF-8'>
  <style>
    body { font-family: Arial, sans-serif; color: #1a1a1a; margin: 0; padding: 0; }
    .wrapper { max-width: 600px; margin: 0 auto; }
    .header { background-color: #0a1510; padding: 32px; text-align: center; }
    .header img { height: 60px; }
    .header h2 { color: #4ade80; font-size: 1rem; letter-spacing: 0.1em; margin: 12px 0 0; }
    .body { padding: 32px; background: #f4f3ee; }
    .field { margin-bottom: 20px; }
    .label { font-size: 0.75rem; font-weight: 700; text-transform: uppercase;
             letter-spacing: 0.08em; color: #4a534a; margin-bottom: 4px; }
    .value { font-size: 1rem; color: #12190f; background: #fff;
             padding: 12px 16px; border-radius: 8px; border-left: 3px solid #2f6b4f; }
    .message .value { white-space: pre-wrap; }
    .footer { background: #0a1510; padding: 20px 32px; text-align: center;
              font-size: 0.78rem; color: #b9c4bc; }
  </style>
</head>
<body>
  <div class='wrapper'>
    <div class='header'>
      <h2>NEW CONTACT MESSAGE</h2>
    </div>
    <div class='body'>
      <div class='field'>
        <div class='label'>Name</div>
        <div class='value'>$name</div>
      </div>
      <div class='field'>
        <div class='label'>Email</div>
        <div class='value'>$email</div>
      </div>
      " . (!empty($company) ? "
      <div class='field'>
        <div class='label'>Company</div>
        <div class='value'>$company</div>
      </div>" : "") . "
      " . (!empty($service) ? "
      <div class='field'>
        <div class='label'>Service of Interest</div>
        <div class='value'>$service</div>
      </div>" : "") . "
      <div class='field message'>
        <div class='label'>Message</div>
        <div class='value'>$message</div>
      </div>
    </div>
    <div class='footer'>
      Altiora Media &mdash; hello@altioramedia.com
    </div>
  </div>
</body>
</html>
";

// ---- Headers del correo ----
$headers  = "MIME-Version: 1.0\r\n";
$headers .= "Content-Type: text/html; charset=UTF-8\r\n";
$headers .= "From: Altiora Media Contact <no-reply@altioramedia.com>\r\n";
$headers .= "Reply-To: $name <$email>\r\n";
$headers .= "X-Mailer: PHP/" . phpversion();

// ---- Enviar ----
$sent = mail($to, $subject, $body, $headers);

if ($sent) {
  echo json_encode(['success' => true, 'message' => '¡Mensaje enviado! We\'ll be in touch soon.']);
} else {
  http_response_code(500);
  echo json_encode(['success' => false, 'message' => 'Hubo un error al enviar. Por favor intenta de nuevo.']);
}