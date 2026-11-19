<?php
require_once "../config/database.php";

$id_job         = $_GET["id_job"] ?? null;
$id_application = $_GET["id_application"] ?? null;
$id_user        = $_GET["id_user"] ?? null;

if (!$id_job || !$id_application || !$id_user) {
    http_response_code(400);
    echo json_encode([
        "status"  => false,
        "message" => "Parameter id_job, id_application, dan id_user diperlukan."
    ]);
    exit();
}

try {
    $stmt = $conn->prepare("
        SELECT 
            a.ID_APPLICATION,
            a.APPLY_STATUS,
            j.ID_JOB,
            j.JOB_TITLE,
            c.COMPANY_NAME,
            u.ID_USER AS CANDIDATE_ID,
            u.USERNAME,
            u.EMAIL,
            p.ID_PROFILE,
            p.FULLNAME,
            p.PHOTO,
            p.BIRTH,
            p.LATEST_EDU,
            p.UNIVERSITY,
            p.LOCATION,
            p.PHONE,
            p.ABOUT,
            p.EXPERIENCE
        FROM APPLICATION a
        JOIN JOB j ON a.ID_JOB = j.ID_JOB
        JOIN COMPANY c ON j.ID_COMPANY = c.ID_COMPANY
        JOIN USERS u ON a.ID_USER = u.ID_USER
        LEFT JOIN PROFILE p ON u.ID_USER = p.ID_USER
        WHERE a.ID_APPLICATION = :id_application
          AND a.ID_JOB = :id_job
          AND c.ID_USER = :id_user
        LIMIT 1
    ");
    $stmt->execute([
        ":id_application" => $id_application,
        ":id_job"         => $id_job,
        ":id_user"        => $id_user,
    ]);
    $row = $stmt->fetch();

    if (!$row) {
        http_response_code(404);
        echo json_encode([
            "status"  => false,
            "message" => "Data pelamar tidak ditemukan atau Anda tidak memiliki akses."
        ]);
        exit();
    }

    $skills = [];
    if (!empty($row["ID_PROFILE"])) {
        $stmtSkills = $conn->prepare("
            SELECT s.SKILL_NAME
            FROM PROFILE_SKILL ps
            JOIN SKILL s ON ps.ID_SKILL = s.ID_SKILL
            WHERE ps.ID_PROFILE = :id_profile
        ");
        $stmtSkills->execute([":id_profile" => $row["ID_PROFILE"]]);
        $skills = array_column($stmtSkills->fetchAll(), "SKILL_NAME");
    }

    $stmtPort = $conn->prepare("
        SELECT ID_PORTOFOLIO AS id, PORTOFOLIO_TITLE AS title, LINK AS link
        FROM PORTOFOLIO
        WHERE ID_USER = :candidate_id
        ORDER BY ID_PORTOFOLIO ASC
    ");
    $stmtPort->execute([":candidate_id" => $row["CANDIDATE_ID"]]);
    $portfolios = $stmtPort->fetchAll();

    $status = ucfirst(strtolower(trim($row["APPLY_STATUS"] ?? "Pending")));
    if (!in_array($status, ["Pending", "Accepted", "Rejected"])) {
        $status = "Pending";
    }

    echo json_encode([
        "status" => true,
        "application" => [
            "id"          => (int)$row["ID_APPLICATION"],
            "status"      => $status,
            "appliedDate" => "Recent",
            "jobId"       => (int)$row["ID_JOB"],
            "jobTitle"    => $row["JOB_TITLE"],
            "companyName" => $row["COMPANY_NAME"],
        ],
        "candidate" => [
            "id"         => (int)$row["CANDIDATE_ID"],
            "fullName"   => $row["FULLNAME"] ?: $row["USERNAME"],
            "username"   => $row["USERNAME"],
            "email"      => $row["EMAIL"],
            "photo"      => $row["PHOTO"] ?: null,
            "birth"      => $row["BIRTH"] ?: "",
            "education"  => $row["LATEST_EDU"] ?: "",
            "university" => $row["UNIVERSITY"] ?: "",
            "location"   => $row["LOCATION"] ?: "",
            "phone"      => $row["PHONE"] ?: "",
            "about"      => $row["ABOUT"] ?: "",
            "experience" => $row["EXPERIENCE"] ?: "",
            "skills"     => $skills,
            "portfolios" => $portfolios,
        ]
    ]);
} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode([
        "status"  => false,
        "message" => "Gagal memuat detail pelamar: " . $e->getMessage()
    ]);
}