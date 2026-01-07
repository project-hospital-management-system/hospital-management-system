<?php
// Front controller (UI)
$base = rtrim(str_replace('\\', '/', dirname($_SERVER['SCRIPT_NAME'])), '/');
if ($base === '/') $base = '';
?><!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>MediTrust Hospital Management System (MVC + PHP)</title>
  <link rel="stylesheet" href="<?= htmlspecialchars($base) ?>/assets/styles.css">
</head>
<body>
  <div id="app"></div>
  <script>
    window.__BASE_URL__ = <?= json_encode($base) ?>;
  </script>
  <script src="<?= htmlspecialchars($base) ?>/js/app.js"></script>
</body>
</html>
