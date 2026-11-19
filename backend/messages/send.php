<?php
require_once "../config/database.php";

$data = json_decode(file_get_contents("php://input"), true);

$id_application = $data["id_application"] ?? null;
$sender_id      = $data["sender_id"] ?? null;
$message_text   = trim($data["message"] ?? "");

if (!$id_application || !$sender_id || $message_text === "") {
    http_response_code(400);
    echo json_encode(["status" => false, "message" => "Pesan tidak boleh kosong."]);
    exit();
}

try {
    $conn->exec("
        CREATE TABLE IF NOT EXISTS MESSAGE (
            ID_MESSAGE INT AUTO_INCREMENT PRIMARY KEY,
            ID_APPLICATION INT NOT NULL,
            SENDER_ID INT NOT NULL,
            RECEIVER_ID INT NOT NULL,
            MESSAGE_TEXT TEXT NOT NULL,
            IS_READ TINYINT(1) NOT NULL DEFAULT 0,
            CREATED_AT TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ");

    $stmtInfo = $conn->prepare("
        SELECT a.ID_USER AS APPLICANT_ID, c.ID_USER AS OWNER_ID
        FROM APPLICATION a
        JOIN JOB j ON a.ID_JOB = j.ID_JOB
        JOIN COMPANY c ON j.ID_COMPANY = c.ID_COMPANY
        WHERE a.ID_APPLICATION = :id_application
        LIMIT 1
    ");
    $stmtInfo->execute([":id_application" => $id_application]);
    $info = $stmtInfo->fetch();

    if (!$info) {
        http_response_code(404);
        echo json_encode(["status" => false, "message" => "Data lamaran tidak ditemukan."]);
        exit();
    }

    $applicantId = (int)$info["APPLICANT_ID"];
    $ownerId     = (int)$info["OWNER_ID"];
    $senderInt   = (int)$sender_id;

    if ($senderInt === $applicantId) {
        $receiverId = $ownerId;
    } elseif ($senderInt === $ownerId) {
        $receiverId = $applicantId;
    } else {
        http_response_code(403);
        echo json_encode(["status" => false, "message" => "Anda tidak terlibat dalam percakapan ini."]);
        exit();
    }

    $stmtIns = $conn->prepare("
        INSERT INTO MESSAGE (ID_APPLICATION, SENDER_ID, RECEIVER_ID, MESSAGE_TEXT)
        VALUES (:id_application, :sender_id, :receiver_id, :message_text)
    ");
    $stmtIns->execute([
        ":id_application" => $id_application,
        ":sender_id"      => $senderInt,
        ":receiver_id"    => $receiverId,
        ":message_text"   => $message_text,
    ]);

    echo json_encode([
        "status"  => true,
        "message" => [
            "id"       => (int)$conn->lastInsertId(),
            "senderId" => $senderInt,
            "isMine"   => true,
            "text"     => $message_text,
            "isRead"   => false,
            "time"     => date("H:i"),
            "date"     => date("d M Y"),
        ]
    ]);
} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode(["status" => false, "message" => "Gagal mengirim pesan: " . $e->getMessage()]);
}