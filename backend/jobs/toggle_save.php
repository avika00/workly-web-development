<?php
require_once "../config/database.php";

$data = json_decode(file_get_contents("php://input"), true);

$id_user = $data["id_user"] ?? null;
$id_job  = $data["id_job"] ?? null;

if (!$id_user || !$id_job) {
    http_response_code(400);
    echo json_encode([
        "status" => false,
        "message" => "ID user dan ID job wajib diisi."
    ]);
    exit();
}

try {
    $stmtCheck = $conn->prepare("SELECT ID_SAVED FROM SAVED_JOB WHERE ID_USER = :id_user AND ID_JOB = :id_job LIMIT 1");
    $stmtCheck->execute([":id_user" => $id_user, ":id_job" => $id_job]);
    $existing = $stmtCheck->fetch();

    if ($existing) {
        $stmtDel = $conn->prepare("DELETE FROM SAVED_JOB WHERE ID_SAVED = :id_saved");
        $stmtDel->execute([":id_saved" => $existing["ID_SAVED"]]);

        echo json_encode([
            "status"  => true,
            "isSaved" => false,
            "message" => "Lowongan dihapus dari daftar tersimpan."
        ]);
    } else {
        $stmtIns = $conn->prepare("INSERT INTO SAVED_JOB (ID_USER, ID_JOB) VALUES (:id_user, :id_job)");
        $stmtIns->execute([":id_user" => $id_user, ":id_job" => $id_job]);

        echo json_encode([
            "status"  => true,
            "isSaved" => true,
            "message" => "Lowongan berhasil disimpan!"
        ]);
    }
} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode([
        "status"  => false,
        "message" => "Gagal memproses simpan lowongan: " . $e->getMessage()
    ]);
}