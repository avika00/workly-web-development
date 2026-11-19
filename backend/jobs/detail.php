<?php
require_once "../config/database.php";

$id_job  = $_GET["id_job"] ?? null;
$id_user = $_GET["id_user"] ?? null;

if (!$id_job) {
    http_response_code(400);
    echo json_encode([
        "status" => false,
        "message" => "Parameter id_job diperlukan."
    ]);
    exit();
}

try {
    $stmt = $conn->prepare("
        SELECT 
            j.ID_JOB,
            j.JOB_TITLE,
            j.TYPE,
            j.WORK_MODE,
            j.LOCATION,
            j.JOB_STATUS,
            j.CURRENCY,
            j.SALARY_MIN,
            j.SALARY_MAX,
            j.SALARY_PERIOD,
            j.EXPERIENCE_LEVEL,
            j.DEADLINE,
            j.JOB_DESC,
            j.RESPONSIBILITIES,
            c.ID_COMPANY,
            c.ID_USER AS CREATOR_ID,
            c.COMPANY_NAME,
            c.LOGO,
            c.COMPANY_DESC,
            u.USERNAME AS POSTED_BY
        FROM JOB j
        JOIN COMPANY c ON j.ID_COMPANY = c.ID_COMPANY
        JOIN USERS u ON c.ID_USER = u.ID_USER
        WHERE j.ID_JOB = :id_job
        LIMIT 1
    ");
    $stmt->execute([":id_job" => $id_job]);
    $row = $stmt->fetch();

    if (!$row) {
        http_response_code(404);
        echo json_encode([
            "status" => false,
            "message" => "Lowongan tidak ditemukan."
        ]);
        exit();
    }

    // Ambil daftar skill dari JOB_SKILL
    $stmtSkills = $conn->prepare("
        SELECT s.SKILL_NAME
        FROM JOB_SKILL js
        JOIN SKILL s ON js.ID_SKILL = s.ID_SKILL
        WHERE js.ID_JOB = :id_job
    ");
    $stmtSkills->execute([":id_job" => $id_job]);
    $skills = array_column($stmtSkills->fetchAll(), "SKILL_NAME");

    // Cek apakah user sudah menyimpan atau melamar lowongan ini
    $isSaved = false;
    $hasApplied = false;
    $applyStatus = null;

    if (!empty($id_user)) {
        $stmtSaved = $conn->prepare("SELECT ID_SAVED FROM SAVED_JOB WHERE ID_USER = :id_user AND ID_JOB = :id_job LIMIT 1");
        $stmtSaved->execute([":id_user" => $id_user, ":id_job" => $id_job]);
        $isSaved = (bool)$stmtSaved->fetch();

        $stmtApp = $conn->prepare("SELECT APPLY_STATUS FROM APPLICATION WHERE ID_USER = :id_user AND ID_JOB = :id_job LIMIT 1");
        $stmtApp->execute([":id_user" => $id_user, ":id_job" => $id_job]);
        $appRow = $stmtApp->fetch();
        if ($appRow) {
            $hasApplied = true;
            $applyStatus = $appRow["APPLY_STATUS"];
        }
    }

    // Format status UI
    $rawStatus = strtolower(trim($row["JOB_STATUS"] ?? "open"));
    $uiStatus = in_array($rawStatus, ["open", "posted", "active"]) ? "Active" : ucfirst($rawStatus);

    // Format gaji
    $currency = $row["CURRENCY"] ?: "RP";
    $min = $row["SALARY_MIN"];
    $max = $row["SALARY_MAX"];
    $period = $row["SALARY_PERIOD"] ?: "/Month";

    if ($min && $max && $min != $max) {
        $salaryText = $currency . " " . number_format($min, 0, ",", ".") . " - " . number_format($max, 0, ",", ".") . " " . $period;
    } elseif ($min) {
        $salaryText = $currency . " " . number_format($min, 0, ",", ".") . " " . $period;
    } else {
        $salaryText = "Negotiable";
    }

    // Pisahkan responsibilities per baris menjadi array
    $respRaw = trim($row["RESPONSIBILITIES"] ?? "");
    $responsibilities = $respRaw !== ""
        ? array_values(array_filter(array_map(function ($line) {
            return preg_replace('/^[-•*]\s*/', '', trim($line));
        }, preg_split('/\r?\n/', $respRaw))))
        : [];

    echo json_encode([
        "status" => true,
        "job" => [
            "id"               => (int)$row["ID_JOB"],
            "title"            => $row["JOB_TITLE"],
            "company"          => $row["COMPANY_NAME"],
            "logo"             => $row["LOGO"] ?: null,
            "postedBy"         => $row["POSTED_BY"],
            "isOwner"          => !empty($id_user) && ((int)$row["CREATOR_ID"] === (int)$id_user),
            "status"           => $uiStatus,
            "location"         => !empty($row["LOCATION"]) ? $row["LOCATION"] : ($row["WORK_MODE"] ?: "Remote"),
            "type"             => $row["TYPE"] ?: "Full Time",
            "salary"           => $salaryText,
            "description"      => !empty($row["JOB_DESC"]) ? $row["JOB_DESC"] : ($row["COMPANY_DESC"] ?: "No job description provided."),
            "responsibilities" => $responsibilities,
            "skills"           => $skills,
            "experience"       => $row["EXPERIENCE_LEVEL"] ?: "Not specified",
            "deadline"         => $row["DEADLINE"],
            "isSaved"          => $isSaved,
            "hasApplied"       => $hasApplied,
            "applyStatus"      => $applyStatus,
        ]
    ]);
} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode([
        "status"  => false,
        "message" => "Gagal memuat detail lowongan: " . $e->getMessage()
    ]);
}