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
    // Pastikan user tidak melamar ke lowongan buatannya sendiri
    $stmtOwner = $conn->prepare("
        SELECT c.ID_USER
        FROM JOB j
        JOIN COMPANY c ON j.ID_COMPANY = c.ID_COMPANY
        WHERE j.ID_JOB = :id_job
        LIMIT 1
    ");
    $stmtOwner->execute([":id_job" => $id_job]);
    $jobInfo = $stmtOwner->fetch();

    if (!$jobInfo) {
        http_response_code(404);
        echo json_encode(["status" => false, "message" => "Lowongan tidak ditemukan."]);
        exit();
    }

    if ((int)$jobInfo["ID_USER"] === (int)$id_user) {
        http_response_code(400);
        echo json_encode(["status" => false, "message" => "Kamu tidak dapat melamar pada lowongan yang kamu buat sendiri."]);
        exit();
    }

    // Cek apakah sudah pernah melamar
    $stmtCheck = $conn->prepare("SELECT ID_APPLICATION FROM APPLICATION WHERE ID_USER = :id_user AND ID_JOB = :id_job LIMIT 1");
    $stmtCheck->execute([":id_user" => $id_user, ":id_job" => $id_job]);

    if ($stmtCheck->fetch()) {
        echo json_encode([
            "status"  => false,
            "message" => "Kamu sudah melamar pekerjaan ini sebelumnya."
        ]);
        exit();
    }

    $stmtIns = $conn->prepare("
        INSERT INTO APPLICATION (ID_USER, ID_JOB, APPLY_STATUS)
        VALUES (:id_user, :id_job, 'Pending')
    ");
    $stmtIns->execute([
        ":id_user" => $id_user,
        ":id_job"  => $id_job
    ]);

    echo json_encode([
        "status"  => true,
        "message" => "Lamaran berhasil dikirim!"
    ]);
} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode([
        "status"  => false,
        "message" => "Gagal mengirim lamaran: " . $e->getMessage()
    ]);
}