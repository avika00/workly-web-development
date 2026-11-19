<?php
require_once "../config/database.php";

$id_application = $_GET["id_application"] ?? null;
$id_user        = $_GET["id_user"] ?? null;

if (!$id_application || !$id_user) {
    http_response_code(400);
    echo json_encode(["status" => false, "message" => "Parameter tidak lengkap."]);
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

    $stmtAuth = $conn->prepare("
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
            p_own.PHOTO AS OWN_PHOTO
        FROM APPLICATION a
        JOIN JOB j ON a.ID_JOB = j.ID_JOB
        JOIN COMPANY c ON j.ID_COMPANY = c.ID_COMPANY
        JOIN USERS u_app ON a.ID_USER = u_app.ID_USER
        LEFT JOIN PROFILE p_app ON u_app.ID_USER = p_app.ID_USER
        JOIN USERS u_own ON c.ID_USER = u_own.ID_USER
        LEFT JOIN PROFILE p_own ON u_own.ID_USER = p_own.ID_USER
        WHERE a.ID_APPLICATION = :id_application
          AND (a.ID_USER = :id_user_1 OR c.ID_USER = :id_user_2)
        LIMIT 1
    ");
    $stmtAuth->execute([
        ":id_application" => $id_application,
        ":id_user_1"      => $id_user,
        ":id_user_2"      => $id_user,
    ]);
    $thread = $stmtAuth->fetch();

    if (!$thread) {
        http_response_code(403);
        echo json_encode(["status" => false, "message" => "Akses percakapan ditolak."]);
        exit();
    }

    $stmtMark = $conn->prepare("
        UPDATE MESSAGE 
        SET IS_READ = 1 
        WHERE ID_APPLICATION = :id_application 
          AND RECEIVER_ID = :id_user 
          AND IS_READ = 0
    ");
    $stmtMark->execute([
        ":id_application" => $id_application,
        ":id_user"        => $id_user
    ]);

    $stmtMsgs = $conn->prepare("
        SELECT ID_MESSAGE, SENDER_ID, MESSAGE_TEXT, IS_READ, CREATED_AT
        FROM MESSAGE
        WHERE ID_APPLICATION = :id_application
        ORDER BY ID_MESSAGE ASC
    ");
    $stmtMsgs->execute([":id_application" => $id_application]);
    $msgRows = $stmtMsgs->fetchAll();

    $messages = array_map(function ($m) use ($id_user) {
        return [
            "id"       => (int)$m["ID_MESSAGE"],
            "senderId" => (int)$m["SENDER_ID"],
            "isMine"   => ((int)$m["SENDER_ID"] === (int)$id_user),
            "text"     => $m["MESSAGE_TEXT"],
            "isRead"   => (bool)$m["IS_READ"],
            "time"     => date("H:i", strtotime($m["CREATED_AT"])),
            "date"     => date("d M Y", strtotime($m["CREATED_AT"])),
        ];
    }, $msgRows);

    $isOwner = ((int)$thread["OWNER_ID"] === (int)$id_user);
    $partnerName = $isOwner
        ? ($thread["APP_FULLNAME"] ?: $thread["APP_USERNAME"])
        : ($thread["OWN_FULLNAME"] ?: $thread["OWN_USERNAME"]);
    $partnerPhoto = $isOwner ? $thread["APP_PHOTO"] : $thread["OWN_PHOTO"];

    echo json_encode([
        "status" => true,
        "thread" => [
            "applicationId" => (int)$thread["ID_APPLICATION"],
            "jobId"         => (int)$thread["ID_JOB"],
            "jobTitle"      => $thread["JOB_TITLE"],
            "companyName"   => $thread["COMPANY_NAME"],
            "applyStatus"   => ucfirst(strtolower(trim($thread["APPLY_STATUS"] ?: "Pending"))),
            "isOwner"       => $isOwner,
            "partnerRole"   => $isOwner ? "Applicant" : "Recruiter",
            "partnerName"   => $partnerName,
            "partnerPhoto"  => $partnerPhoto ?: null,
        ],
        "messages" => $messages
    ]);
} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode(["status" => false, "message" => "Gagal memuat pesan: " . $e->getMessage()]);
}