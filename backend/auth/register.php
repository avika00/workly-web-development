<?php
require_once "../config/database.php";

$data = json_decode(file_get_contents("php://input"), true);

$fullName = trim($data["fullName"] ?? "");
$username = trim($data["username"] ?? "");
$email    = trim($data["email"] ?? "");
$password = $data["password"] ?? "";

if (empty($fullName) || empty($username) || empty($email) || empty($password)) {
    http_response_code(400);
    echo json_encode([
        "status" => false,
        "message" => "Semua kolom wajib diisi."
    ]);
    exit();
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode([
        "status" => false,
        "message" => "Format email tidak valid."
    ]);
    exit();
}

try {
    // Gunakan transaksi agar data di USERS dan PROFILE tersimpan bersamaan
    $conn->beginTransaction();

    $hashedPassword = password_hash($password, PASSWORD_DEFAULT);

    // 1. Simpan akun ke tabel USERS
    $stmtUser = $conn->prepare("
        INSERT INTO USERS (USERNAME, EMAIL, PASSWORD) 
        VALUES (:username, :email, :password)
    ");
    $stmtUser->execute([
        ":username" => $username,
        ":email"    => $email,
        ":password" => $hashedPassword
    ]);

    $newUserId = $conn->lastInsertId();

    // 2. Simpan nama lengkap ke tabel PROFILE
    $stmtProfile = $conn->prepare("
        INSERT INTO PROFILE (ID_USER, FULLNAME) 
        VALUES (:id_user, :fullname)
    ");
    $stmtProfile->execute([
        ":id_user"  => $newUserId,
        ":fullname" => $fullName
    ]);

    $conn->commit();

    echo json_encode([
        "status" => true,
        "message" => "Akun berhasil dibuat! Silakan login.",
        "id_user" => $newUserId
    ]);
} catch (PDOException $e) {
    if ($conn->inTransaction()) {
        $conn->rollBack();
    }

    http_response_code(400);
    // Kode error 23000 menandakan duplikat UNIQUE (username/email sudah dipakai)
    if ($e->getCode() == 23000) {
        echo json_encode([
            "status" => false,
            "message" => "Username atau email sudah terdaftar."
        ]);
    } else {
        echo json_encode([
            "status" => false,
            "message" => "Gagal membuat akun: " . $e->getMessage()
        ]);
    }
}