<?php
require_once "../config/database.php";

$data = json_decode(file_get_contents("php://input"), true);

$id_user    = $data["id_user"] ?? null;
$portfolios = $data["portfolios"] ?? [];

if (!$id_user || !is_array($portfolios)) {
    http_response_code(400);
    echo json_encode([
        "status" => false,
        "message" => "Data user atau portofolio tidak valid."
    ]);
    exit();
}

try {
    $conn->beginTransaction();

    // 1. Hapus daftar portofolio lama milik user ini
    $stmtDel = $conn->prepare("DELETE FROM PORTOFOLIO WHERE ID_USER = :id_user");
    $stmtDel->execute([":id_user" => $id_user]);

    // 2. Simpan ulang daftar portofolio yang baru
    $stmtIns = $conn->prepare("
        INSERT INTO PORTOFOLIO (ID_USER, PORTOFOLIO_TITLE, LINK)
        VALUES (:id_user, :title, :link)
    ");

    foreach ($portfolios as $item) {
        $title = trim($item["title"] ?? "");
        $link  = trim($item["link"] ?? "");

        if ($title === "" || $link === "") {
            continue;
        }

        // Tambahkan https:// otomatis jika user belum mengetik protokol URL
        if (!preg_match("~^(?:f|ht)tps?://~i", $link)) {
            $link = "https://" . $link;
        }

        $stmtIns->execute([
            ":id_user" => $id_user,
            ":title"   => substr($title, 0, 255),
            ":link"    => $link
        ]);
    }

    $conn->commit();

    echo json_encode([
        "status" => true,
        "message" => "Portofolio berhasil disimpan!"
    ]);
} catch (Throwable $e) {
    if ($conn->inTransaction()) {
        $conn->rollBack();
    }
    http_response_code(500);
    echo json_encode([
        "status" => false,
        "message" => "Error database: " . $e->getMessage()
    ]);
}