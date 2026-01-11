<?php
header('Content-Type: text/plain; charset=utf-8');

// Email qui reçoit les messages
$to = 'yannickndako@gmail.com';

// Anti-spam (honeypot)
if (!empty($_POST['website'])) {
  http_response_code(200);
  exit('OK'); // on répond OK pour ne pas aider les bots
}

// Récupération des champs
$name    = trim($_POST['name'] ?? '');
$email   = trim($_POST['email'] ?? '');
$subject = trim($_POST['subject'] ?? '');
$message = trim($_POST['message'] ?? '');

// Validation
if ($name === '' || $email === '' || $subject === '' || $message === '') {
  http_response_code(400);
  exit('Veuillez remplir tous les champs.');
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
  http_response_code(400);
  exit('Adresse email invalide.');
}

// Sécurisation basique (évite l’injection d’en-têtes)
$name    = str_replace(["\r","\n"], ' ', $name);
$email   = str_replace(["\r","\n"], ' ', $email);
$subject = str_replace(["\r","\n"], ' ', $subject);

// Contenu du mail
$body  = "Nouveau message depuis le portfolio\n\n";
$body .= "Nom: {$name}\n";
$body .= "Email: {$email}\n";
$body .= "Objet: {$subject}\n\n";
$body .= "Message:\n{$message}\n";

// Headers (important: From = ton email, Reply-To = client)
$headers  = "From: Velox Web Studio <yannickndako@gmail.com>\r\n";
$headers .= "Reply-To: {$name} <{$email}>\r\n";
$headers .= "MIME-Version: 1.0\r\n";
$headers .= "Content-Type: text/plain; charset=UTF-8\r\n";

// Envoi
$ok = mail($to, "[Portfolio] " . $subject, $body, $headers);

if ($ok) {
  echo 'OK'; // le template attend souvent "OK"
} else {
  http_response_code(500);
  echo "Erreur lors de l'envoi. Réessayez plus tard.";
}