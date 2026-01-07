<?php

?><!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1"/>
  <title><?php echo htmlspecialchars(APP_NAME); ?></title>

  <link rel="stylesheet" href="<?php echo BASE_URL; ?>/assets/css/main.css">
  <?php if (!empty($pageCss)): ?>
    <link rel="stylesheet" href="<?php echo BASE_URL; ?>/assets/css/<?php echo htmlspecialchars($pageCss); ?>">
  <?php endif; ?>
</head>
<body>
  <header class="topbar">
    <div class="container">
      <div class="brand"><?php echo htmlspecialchars(APP_NAME); ?></div>
      <nav class="nav">
        <a href="<?php echo BASE_URL; ?>/">Home</a>
        <a href="<?php echo BASE_URL; ?>/emr">EMR</a>
        <a href="<?php echo BASE_URL; ?>/notifications">Notifications</a>
        <a href="<?php echo BASE_URL; ?>/reports">Reports</a>
        <a href="<?php echo BASE_URL; ?>/telemedicine">Telemedicine</a>
        <a href="<?php echo BASE_URL; ?>/feedback">Feedback</a>
      </nav>
    </div>
  </header>
  <main class="container">
