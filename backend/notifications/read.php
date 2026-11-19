<?php
require_once "../config/database.php";

$id_user = $_GET["id_user"] ?? null;

if (!$id_user) {
    http_response_code(400);
    echo json_encode([
        "status"  => false,
        "message" => "Parameter id_user diperlukan."
    ]);
    exit();
}

function makeInitials($name) {
    $parts = preg_split('/\s+/', trim($name));
    if (count($parts) >= 2) {
        return strtoupper(substr($parts[0], 0, 1) . substr($parts[1], 0, 1));
    }
    return strtoupper(substr($name ?: "U", 0, 2));
}

try {
    $notifications = [];

    // 1. PELAMAR BARU MASUK KE LOWONGAN MILIK USER (Recruiter)
    $stmtIncoming = $conn->prepare("
        SELECT 
            a.ID_APPLICATION,
            a.APPLY_STATUS,
            j.ID_JOB,
            j.JOB_TITLE,
            c.COMPANY_NAME,
            u.USERNAME,
            p.FULLNAME
        FROM APPLICATION a
        JOIN JOB j ON a.ID_JOB = j.ID_JOB
        JOIN COMPANY c ON j.ID_COMPANY = c.ID_COMPANY
        JOIN USERS u ON a.ID_USER = u.ID_USER
        LEFT JOIN PROFILE p ON u.ID_USER = p.ID_USER
        WHERE c.ID_USER = :uid_owner
        ORDER BY a.ID_APPLICATION DESC
    ");
    $stmtIncoming->execute([":uid_owner" => $id_user]);

    foreach ($stmtIncoming->fetchAll() as $row) {
        $applicantName = $row["FULLNAME"] ?: $row["USERNAME"];
        $status = ucfirst(strtolower(trim($row["APPLY_STATUS"] ?: "Pending")));

        $notifications[] = [
            "id"       => "app-in-" . $row["ID_APPLICATION"],
            "category" => "Applications",
            "type"     => "applicant",
            "name"     => $applicantName,
            "title"    => "applied for",
            "job"      => $row["JOB_TITLE"],
            "company"  => $row["COMPANY_NAME"],
            "message"  => "Kandidat baru melamar ke lowongan Anda. Klik Review Application untuk melihat profil dan menentukan status.",
            "status"   => $status,
            "time"     => "Application #" . $row["ID_APPLICATION"],
            "action"   => "Review Application",
            "link"     => "/post-job/" . $row["ID_JOB"] . "/applicant/" . $row["ID_APPLICATION"],
            "icon"     => makeInitials($applicantName),
        ];
    }

    // 2. STATUS LAMARAN USER DITERIMA / DITOLAK / DIPROSES (Applicant)
    $stmtMyApps = $conn->prepare("
        SELECT 
            a.ID_APPLICATION,
            a.APPLY_STATUS,
            j.ID_JOB,
            j.JOB_TITLE,
            c.COMPANY_NAME
        FROM APPLICATION a
        JOIN JOB j ON a.ID_JOB = j.ID_JOB
        JOIN COMPANY c ON j.ID_COMPANY = c.ID_COMPANY
        WHERE a.ID_USER = :uid_applicant
        ORDER BY a.ID_APPLICATION DESC
    ");
    $stmtMyApps->execute([":uid_applicant" => $id_user]);

    foreach ($stmtMyApps->fetchAll() as $row) {
        $status = ucfirst(strtolower(trim($row["APPLY_STATUS"] ?: "Pending")));

        if ($status === "Accepted") {
            $title = "Selamat! Lamaranmu diterima untuk posisi";
            $msg   = $row["COMPANY_NAME"] . " telah menerima lamaranmu pada posisi " . $row["JOB_TITLE"] . ".";
            $type  = "approved";
        } elseif ($status === "Rejected") {
            $title = "Pembaruan status lamaran untuk posisi";
            $msg   = "Lamaranmu di " . $row["COMPANY_NAME"] . " untuk posisi " . $row["JOB_TITLE"] . " belum lolos tahap ini.";
            $type  = "closed";
        } else {
            $title = "Lamaran terkirim untuk posisi";
            $msg   = "Lamaranmu ke " . $row["COMPANY_NAME"] . " sedang menunggu peninjauan rekruter.";
            $type  = "approved";
        }

        $notifications[] = [
            "id"       => "app-out-" . $row["ID_APPLICATION"] . "-" . strtolower($status),
            "category" => "Applications",
            "type"     => $type,
            "title"    => $title,
            "job"      => $row["JOB_TITLE"],
            "company"  => $row["COMPANY_NAME"],
            "message"  => $msg,
            "status"   => $status,
            "time"     => "Application #" . $row["ID_APPLICATION"],
            "action"   => "View Activity",
            "link"     => "/activity",
        ];
    }

    // 3. PESAN BARU YANG MASUK KE USER
    try {
        $stmtMsgs = $conn->prepare("
            SELECT 
                m.ID_MESSAGE,
                m.ID_APPLICATION,
                m.MESSAGE_TEXT,
                m.IS_READ,
                m.CREATED_AT,
                j.JOB_TITLE,
                u.USERNAME,
                p.FULLNAME
            FROM MESSAGE m
            JOIN APPLICATION a ON m.ID_APPLICATION = a.ID_APPLICATION
            JOIN JOB j ON a.ID_JOB = j.ID_JOB
            JOIN USERS u ON m.SENDER_ID = u.ID_USER
            LEFT JOIN PROFILE p ON u.ID_USER = p.ID_USER
            WHERE m.RECEIVER_ID = :uid_receiver
            ORDER BY m.ID_MESSAGE DESC
            LIMIT 10
        ");
        $stmtMsgs->execute([":uid_receiver" => $id_user]);

        foreach ($stmtMsgs->fetchAll() as $row) {
            $senderName = $row["FULLNAME"] ?: $row["USERNAME"];
            $notifications[] = [
                "id"            => "msg-" . $row["ID_MESSAGE"],
                "category"      => "Applications",
                "type"          => "message",
                "name"          => $senderName,
                "title"         => "sent a message regarding",
                "job"           => $row["JOB_TITLE"],
                "message"       => '"' . $row["MESSAGE_TEXT"] . '"',
                "status"        => "Message",
                "time"          => date("d M, H:i", strtotime($row["CREATED_AT"])),
                "forceUnread"   => !(bool)$row["IS_READ"],
                "action"        => "Reply Message",
                "link"          => "/messages/" . $row["ID_APPLICATION"],
                "icon"          => makeInitials($senderName),
            ];
        }
    } catch (Throwable $ignore) {
        // Lewati jika tabel MESSAGE belum dibuat
    }

    // 4. PEKERJAAN BARU YANG BARU SAJA DI-POST
    $stmtNewJobs = $conn->prepare("
        SELECT 
            j.ID_JOB,
            j.JOB_TITLE,
            c.COMPANY_NAME,
            c.ID_USER AS OWNER_ID
        FROM JOB j
        JOIN COMPANY c ON j.ID_COMPANY = c.ID_COMPANY
        ORDER BY j.ID_JOB DESC
        LIMIT 8
    ");
    $stmtNewJobs->execute();

    foreach ($stmtNewJobs->fetchAll() as $row) {
        $isMine = ((int)$row["OWNER_ID"] === (int)$id_user);
        $notifications[] = [
            "id"       => "job-new-" . $row["ID_JOB"],
            "category" => "New Jobs",
            "type"     => "approved",
            "title"    => $isMine ? "Lowonganmu berhasil dipublikasikan:" : "Lowongan baru tersedia:",
            "job"      => $row["JOB_TITLE"],
            "company"  => $row["COMPANY_NAME"],
            "message"  => $isMine
                ? "Lowongan " . $row["JOB_TITLE"] . " sudah tayang dan siap menerima pelamar."
                : $row["COMPANY_NAME"] . " baru saja membuka lowongan untuk posisi " . $row["JOB_TITLE"] . ".",
            "status"   => $isMine ? "Active" : "New Job",
            "time"     => "Job #" . $row["ID_JOB"],
            "action"   => $isMine ? "View Job Post" : "View Job",
            "link"     => $isMine ? "/post-job/" . $row["ID_JOB"] : "/jobs/" . $row["ID_JOB"],
        ];
    }

    // 5. LOWONGAN YANG DISIMPAN (SAVED JOBS)
    try {
        $stmtSaved = $conn->prepare("
            SELECT 
                s.ID_JOB,
                j.JOB_TITLE,
                c.COMPANY_NAME
            FROM SAVED_JOB s
            JOIN JOB j ON s.ID_JOB = j.ID_JOB
            JOIN COMPANY c ON j.ID_COMPANY = c.ID_COMPANY
            WHERE s.ID_USER = :uid_saved
            ORDER BY s.ID_JOB DESC
        ");
        $stmtSaved->execute([":uid_saved" => $id_user]);

        foreach ($stmtSaved->fetchAll() as $row) {
            $notifications[] = [
                "id"       => "saved-" . $row["ID_JOB"],
                "category" => "Saved Jobs",
                "type"     => "saved",
                "title"    => "Lowongan tersimpan:",
                "job"      => $row["JOB_TITLE"],
                "company"  => $row["COMPANY_NAME"],
                "message"  => "Jangan lupa segera lamar posisi " . $row["JOB_TITLE"] . " di " . $row["COMPANY_NAME"] . ".",
                "status"   => "Saved",
                "time"     => "Saved Job",
                "action"   => "View Job",
                "link"     => "/jobs/" . $row["ID_JOB"],
            ];
        }
    } catch (Throwable $ignore) {
        // Lewati jika tabel SAVED_JOB berbeda struktur
    }

    // 6. NOTIFIKASI SISTEM
    $notifications[] = [
        "id"       => "sys-welcome",
        "category" => "System",
        "type"     => "system",
        "title"    => "Welcome to Workly!",
        "message"  => "Lengkapi profil, keahlian, dan portofoliomu agar lebih menarik perhatian rekruter.",
        "status"   => "System",
        "time"     => "Account",
        "action"   => "Complete Profile",
        "link"     => "/profile",
    ];

    echo json_encode([
        "status"        => true,
        "notifications" => $notifications,
    ]);
} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode([
        "status"  => false,
        "message" => "Gagal memuat notifikasi: " . $e->getMessage(),
    ]);
}