<?php
require_once "../config/database.php";

$data = json_decode(file_get_contents("php://input"), true);

$username = trim($data["username"] ?? "");
$password = $data["password"] ?? "";

if (empty($username) || empty($password)) {
    http_response_code(400);
    echo json_encode(["status" => false, "message" => "Username dan password wajib diisi."]);
    exit();
}

$stmt = $conn->prepare("
    SELECT u.ID_USER, u.USERNAME, u.EMAIL, u.PASSWORD, p.FULLNAME
    FROM USERS u
    LEFT JOIN PROFILE p ON u.ID_USER = p.ID_USER
    WHERE u.USERNAME = :login OR u.EMAIL = :login
    LIMIT 1
");
$stmt->execute([":login" => $username]);
$user = $stmt->fetch();

if ($user && password_verify($password, $user["PASSWORD"])) {
    unset($user["PASSWORD"]);

    echo json_encode([
        "status" => true,
        "message" => "Login berhasil!",
        "user" => $user
    ]);
} else {
    http_response_code(401);
    echo json_encode([
        "status" => false,
        "message" => "Username atau password salah."
    ]);
}