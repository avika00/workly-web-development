<?php
require_once "../config/database.php";

$data = json_decode(file_get_contents("php://input"), true);

$id_job         = $data["id_job"] ?? null;
$id_application = $data["id_application"] ?? null;
$id_user        = $data["id_user"] ?? null;
$new_status     = $data["status"] ?? "";

if (!$id_job || !$id_application || !$id_user || !in_array($new_status, ["Accepted", "Rejected", "Pending"])) {
    http_response_code(400);
    echo json_encode([
        "status"  => false,
        "message" => "Data status lamaran tidak valid."
    ]);
    exit();
}

try {
    // Pastikan lowongan memang milik user yang sedang login
    $stmtCheck = $conn->prepare("
        SELECT a.ID_APPLICATION
        FROM APPLICATION a
        JOIN JOB j ON a.ID_JOB = j.ID_JOB
        JOIN COMPANY c ON j.ID_COMPANY = c.ID_COMPANY
        WHERE a.ID_APPLICATION = :id_application
          AND a.ID_JOB = :id_job
          AND c.ID_USER = :id_user
        LIMIT 1
    ");
    $stmtCheck->execute([
        ":id_application" => $id_application,
        ":id_job"         => $id_job,
        ":id_user"        => $id_user,
    ]);

    if (!$stmtCheck->fetch()) {
        http_response_code(403);
        echo json_encode([
            "status"  => false,
            "message" => "Anda tidak memiliki akses untuk mengubah status pelamar ini."
        ]);
        exit();
    }

    $stmtUpd = $conn->prepare("
        UPDATE APPLICATION
        SET APPLY_STATUS = :status
        WHERE ID_APPLICATION = :id_application
    ");
    $stmtUpd->execute([
        ":status"         => $new_status,
        ":id_application" => $id_application,
    ]);

    echo json_encode([
        "status"    => true,
        "newStatus" => $new_status,
        "message"   => "Status pelamar berhasil diubah menjadi " . $new_status . "."
    ]);
} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode([
        "status"  => false,
        "message" => "Gagal memperbarui status pelamar: " . $e->getMessage()
    ]);
}