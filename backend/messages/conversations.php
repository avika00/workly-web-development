<?php
require_once "../config/database.php";

$id_user = $_GET["id_user"] ?? null;

if (!$id_user) {
    http_response_code(400);
    echo json_encode(["status" => false, "message" => "Parameter id_user diperlukan."]);
    exit();
}

try {
    // Otomatis buat tabel MESSAGE jika belum ada
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

    $stmt = $conn->prepare("
        SELECT 
            a.ID_APPLICATION,
            a.APPLY_STATUS,
            a.ID_USER AS APPLICANT_ID,
            c.ID_USER AS OWNER_ID,
            j.ID_JOB,
            j.JOB_TITLE,
            c.COMPANY_NAME,
            u_app.USERNAME AS APP_USERNAME,
            p_app.FULLNAME AS APP_FULLNAME,
            p_app.PHOTO AS APP_PHOTO,
            u_own.USERNAME AS OWN_USERNAME,
            p_own.FULLNAME AS OWN_FULLNAME,
            p_own.PHOTO AS OWN_PHOTO,
            (
                SELECT m.MESSAGE_TEXT 
                FROM MESSAGE m 
                WHERE m.ID_APPLICATION = a.ID_APPLICATION 
                ORDER BY m.ID_MESSAGE DESC LIMIT 1
            ) AS LAST_MESSAGE,
            (
                SELECT m.CREATED_AT 
                FROM MESSAGE m 
                WHERE m.ID_APPLICATION = a.ID_APPLICATION 
                ORDER BY m.ID_MESSAGE DESC LIMIT 1
            ) AS LAST_TIME,
            (
                SELECT COUNT(*) 
                FROM MESSAGE m 
                WHERE m.ID_APPLICATION = a.ID_APPLICATION 
                  AND m.RECEIVER_ID = :id_user_1 
                  AND m.IS_READ = 0
            ) AS UNREAD_COUNT
        FROM APPLICATION a
        JOIN JOB j ON a.ID_JOB = j.ID_JOB
        JOIN COMPANY c ON j.ID_COMPANY = c.ID_COMPANY
        JOIN USERS u_app ON a.ID_USER = u_app.ID_USER
        LEFT JOIN PROFILE p_app ON u_app.ID_USER = p_app.ID_USER
        JOIN USERS u_own ON c.ID_USER = u_own.ID_USER
        LEFT JOIN PROFILE p_own ON u_own.ID_USER = p_own.ID_USER
        WHERE a.ID_USER = :id_user_2 OR c.ID_USER = :id_user_3
        ORDER BY LAST_TIME DESC, a.ID_APPLICATION DESC
    ");
    $stmt->execute([
        ":id_user_1" => $id_user,
        ":id_user_2" => $id_user,
        ":id_user_3" => $id_user,
    ]);
    $rows = $stmt->fetchAll();

    $conversations = array_map(function ($row) use ($id_user) {
        $isOwner = ((int)$row["OWNER_ID"] === (int)$id_user);

        $partnerName = $isOwner
            ? ($row["APP_FULLNAME"] ?: $row["APP_USERNAME"])
            : ($row["OWN_FULLNAME"] ?: $row["OWN_USERNAME"]);
        $partnerUsername = $isOwner ? $row["APP_USERNAME"] : $row["OWN_USERNAME"];
        $partnerPhoto    = $isOwner ? $row["APP_PHOTO"] : $row["OWN_PHOTO"];

        return [
            "applicationId"   => (int)$row["ID_APPLICATION"],
            "jobId"           => (int)$row["ID_JOB"],
            "jobTitle"        => $row["JOB_TITLE"],
            "companyName"     => $row["COMPANY_NAME"],
            "applyStatus"     => ucfirst(strtolower(trim($row["APPLY_STATUS"] ?: "Pending"))),
            "myRole"          => $isOwner ? "Recruiter" : "Applicant",
            "partnerRole"     => $isOwner ? "Applicant" : "Recruiter",
            "partnerName"     => $partnerName,
            "partnerUsername" => $partnerUsername,
            "partnerPhoto"    => $partnerPhoto ?: null,
            "lastMessage"     => $row["LAST_MESSAGE"] ?: "Belum ada pesan. Mulai obrolan sekarang!",
            "lastTime"        => $row["LAST_TIME"] ? date("H:i", strtotime($row["LAST_TIME"])) : "",
            "unreadCount"     => (int)$row["UNREAD_COUNT"],
        ];
    }, $rows);

    echo json_encode([
        "status"        => true,
        "conversations" => $conversations
    ]);
} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode(["status" => false, "message" => "Gagal memuat percakapan: " . $e->getMessage()]);
}