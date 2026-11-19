<?php
require_once "../config/database.php";

$data = json_decode(file_get_contents("php://input"), true);

$id_job  = $data["id_job"] ?? null;
$id_user = $data["id_user"] ?? null;
$action  = $data["action"] ?? ""; // 'Active', 'Closed', atau 'Delete'

if (!$id_job || !$id_user || !$action) {
    http_response_code(400);
    echo json_encode([
        "status" => false,
        "message" => "Parameter tidak lengkap."
    ]);
    exit();
}

try {
    // Pastikan lowongan memang milik user yang login
    $stmtCheck = $conn->prepare("
        SELECT j.ID_JOB
        FROM JOB j
        JOIN COMPANY c ON j.ID_COMPANY = c.ID_COMPANY
        WHERE j.ID_JOB = :id_job AND c.ID_USER = :id_user
        LIMIT 1
    ");
    $stmtCheck->execute([
        ":id_job"  => $id_job,
        ":id_user" => $id_user
    ]);

    if (!$stmtCheck->fetch()) {
        http_response_code(403);
        echo json_encode([
            "status" => false,
            "message" => "Anda tidak memiliki akses untuk mengubah lowongan ini."
        ]);
        exit();
    }

    if ($action === "Delete") {
        $stmtDel = $conn->prepare("DELETE FROM JOB WHERE ID_JOB = :id_job");
        $stmtDel->execute([":id_job" => $id_job]);

        echo json_encode([
            "status"  => true,
            "message" => "Lowongan berhasil dihapus."
        ]);
        exit();
    }

    $dbStatus = ($action === "Closed") ? "Closed" : "Open";
    $stmtUpd = $conn->prepare("UPDATE JOB SET JOB_STATUS = :status WHERE ID_JOB = :id_job");
    $stmtUpd->execute([
        ":status" => $dbStatus,
        ":id_job" => $id_job
    ]);

    echo json_encode([
        "status"    => true,
        "newStatus" => ($dbStatus === "Closed") ? "Closed" : "Active",
        "message"   => "Status lowongan berhasil diperbarui."
    ]);
} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode([
        "status"  => false,
        "message" => "Gagal memperbarui lowongan: " . $e->getMessage()
    ]);
}