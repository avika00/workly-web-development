<?php
require_once "../config/database.php";

$id_user = $_POST["id_user"] ?? null;

if (!$id_user || !isset($_FILES["photo"])) {
    http_response_code(400);
    echo json_encode([
        "status" => false,
        "message" => "ID user dan file foto wajib dikirim."
    ]);
    exit();
}

$file = $_FILES["photo"];

if ($file["error"] !== UPLOAD_ERR_OK) {
    http_response_code(400);
    echo json_encode([
        "status" => false,
        "message" => "Terjadi kesalahan saat mengunggah file."
    ]);
    exit();
}

$allowedExt = ["jpg", "jpeg", "png", "webp"];
$ext = strtolower(pathinfo($file["name"], PATHINFO_EXTENSION));

if (!in_array($ext, $allowedExt)) {
    http_response_code(400);
    echo json_encode([
        "status" => false,
        "message" => "Format foto harus JPG, JPEG, PNG, atau WEBP."
    ]);
    exit();
}

if ($file["size"] > 2 * 1024 * 1024) {
    http_response_code(400);
    echo json_encode([
        "status" => false,
        "message" => "Ukuran foto maksimal 2MB."
    ]);
    exit();
}

try {
    $uploadDir = __DIR__ . "/../uploads/profiles/";
    if (!is_dir($uploadDir)) {
        mkdir($uploadDir, 0777, true);
    }

    $newFileName = "profile_" . $id_user . "_" . time() . "." . $ext;
    $targetPath = $uploadDir . $newFileName;

    if (!move_uploaded_file($file["tmp_name"], $targetPath)) {
        throw new Exception("Gagal memindahkan file ke folder server.");
    }

    $stmtCheck = $conn->prepare("SELECT ID_PROFILE, PHOTO FROM profile WHERE ID_USER = :id_user LIMIT 1");
    $stmtCheck->execute([":id_user" => $id_user]);
    $existing = $stmtCheck->fetch();

    if ($existing) {
        if (!empty($existing["PHOTO"]) && file_exists($uploadDir . $existing["PHOTO"])) {
            unlink($uploadDir . $existing["PHOTO"]);
        }

        $stmtSave = $conn->prepare("UPDATE profile SET PHOTO = :photo WHERE ID_USER = :id_user");
    } else {
        $stmtSave = $conn->prepare("INSERT INTO profile (ID_USER, PHOTO) VALUES (:id_user, :photo)");
    }

    $stmtSave->execute([
        ":photo"   => $newFileName,
        ":id_user" => $id_user
    ]);

    echo json_encode([
        "status" => true,
        "message" => "Foto profil berhasil diperbarui!",
        "photo" => $newFileName
    ]);
} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode([
        "status" => false,
        "message" => "Gagal menyimpan foto: " . $e->getMessage()
    ]);
}