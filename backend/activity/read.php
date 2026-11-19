<?php
require_once "../config/database.php";

$id_user = $_GET["id_user"] ?? null;

if (!$id_user) {
    http_response_code(400);
    echo json_encode([
        "status" => false,
        "message" => "Parameter id_user diperlukan."
    ]);
    exit();
}

function formatSalary($row) {
    $currency = $row["CURRENCY"] ?: "RP";
    $min      = $row["SALARY_MIN"];
    $max      = $row["SALARY_MAX"];
    $period   = $row["SALARY_PERIOD"] ?: "/Month";

    if ($min && $max && $min != $max) {
        return $currency . " " . number_format($min, 0, ",", ".") . " - " . number_format($max, 0, ",", ".") . " " . $period;
    }
    if ($min) {
        return $currency . " " . number_format($min, 0, ",", ".") . " " . $period;
    }
    return "Negotiable";
}

try {
    // 1. Daftar Lamaran (Application)
    $stmtApp = $conn->prepare("
        SELECT 
            a.ID_APPLICATION AS activity_id,
            a.APPLY_STATUS,
            a.APPLIED_AT AS sort_date,
            j.ID_JOB,
            j.JOB_TITLE,
            j.TYPE,
            j.WORK_MODE,
            j.LOCATION,
            j.CURRENCY,
            j.SALARY_MIN,
            j.SALARY_MAX,
            j.SALARY_PERIOD,
            c.COMPANY_NAME,
            c.LOGO
        FROM APPLICATION a
        JOIN JOB j ON a.ID_JOB = j.ID_JOB
        JOIN COMPANY c ON j.ID_COMPANY = c.ID_COMPANY
        WHERE a.ID_USER = :id_user
        ORDER BY a.APPLIED_AT DESC, a.ID_APPLICATION DESC
    ");
    $stmtApp->execute([":id_user" => $id_user]);
    $applications = array_map(function ($row) {
        $place = !empty($row["LOCATION"]) ? $row["LOCATION"] : ($row["WORK_MODE"] ?: "Remote");
        return [
            "id"          => "app-" . $row["activity_id"],
            "jobId"       => (int)$row["ID_JOB"],
            "category"    => "Application",
            "title"       => $row["JOB_TITLE"],
            "company"     => $row["COMPANY_NAME"],
            "logo"        => $row["LOGO"] ?: null,
            "type"        => $place . " · " . ($row["TYPE"] ?: "Full Time"),
            "salary"      => formatSalary($row),
            "status"      => ucfirst(strtolower(trim($row["APPLY_STATUS"] ?: "Pending"))),
            "detailLink"  => "/jobs/" . $row["ID_JOB"],
            "sortDate"    => $row["sort_date"] ?? ""
        ];
    }, $stmtApp->fetchAll());

    // 2. Daftar Lowongan Tersimpan (Saved Jobs)
    $stmtSaved = $conn->prepare("
        SELECT 
            s.ID_SAVED AS activity_id,
            j.ID_JOB,
            j.JOB_TITLE,
            j.TYPE,
            j.WORK_MODE,
            j.LOCATION,
            j.CURRENCY,
            j.SALARY_MIN,
            j.SALARY_MAX,
            j.SALARY_PERIOD,
            j.CREATED_AT AS sort_date,
            c.COMPANY_NAME,
            c.LOGO
        FROM SAVED_JOB s
        JOIN JOB j ON s.ID_JOB = j.ID_JOB
        JOIN COMPANY c ON j.ID_COMPANY = c.ID_COMPANY
        WHERE s.ID_USER = :id_user
        ORDER BY s.ID_SAVED DESC
    ");
    $stmtSaved->execute([":id_user" => $id_user]);
    $savedJobs = array_map(function ($row) {
        $place = !empty($row["LOCATION"]) ? $row["LOCATION"] : ($row["WORK_MODE"] ?: "Remote");
        return [
            "id"          => "saved-" . $row["activity_id"],
            "jobId"       => (int)$row["ID_JOB"],
            "category"    => "Saved Jobs",
            "title"       => $row["JOB_TITLE"],
            "company"     => $row["COMPANY_NAME"],
            "logo"        => $row["LOGO"] ?: null,
            "type"        => $place . " · " . ($row["TYPE"] ?: "Full Time"),
            "salary"      => formatSalary($row),
            "status"      => "Saved",
            "detailLink"  => "/jobs/" . $row["ID_JOB"],
            "sortDate"    => $row["sort_date"] ?? ""
        ];
    }, $stmtSaved->fetchAll());

    // 3. Daftar Lowongan yang Dibuat User (Job Posted)
    $stmtPosted = $conn->prepare("
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
            j.CREATED_AT AS sort_date,
            c.COMPANY_NAME,
            c.LOGO
        FROM JOB j
        JOIN COMPANY c ON j.ID_COMPANY = c.ID_COMPANY
        WHERE c.ID_USER = :id_user
        ORDER BY j.CREATED_AT DESC, j.ID_JOB DESC
    ");
    $stmtPosted->execute([":id_user" => $id_user]);
    $postedJobs = array_map(function ($row) {
        $place = !empty($row["LOCATION"]) ? $row["LOCATION"] : ($row["WORK_MODE"] ?: "Remote");
        $rawStatus = strtolower(trim($row["JOB_STATUS"] ?? "open"));
        $uiStatus = in_array($rawStatus, ["open", "posted", "active"]) ? "Active" : ucfirst($rawStatus);

        return [
            "id"          => "posted-" . $row["ID_JOB"],
            "jobId"       => (int)$row["ID_JOB"],
            "category"    => "Job Posted",
            "title"       => $row["JOB_TITLE"],
            "company"     => $row["COMPANY_NAME"],
            "logo"        => $row["LOGO"] ?: null,
            "type"        => $place . " · " . ($row["TYPE"] ?: "Full Time"),
            "salary"      => formatSalary($row),
            "status"      => $uiStatus,
            "detailLink"  => "/post-job/" . $row["ID_JOB"],
            "sortDate"    => $row["sort_date"] ?? ""
        ];
    }, $stmtPosted->fetchAll());

    $allActivities = array_merge($applications, $savedJobs, $postedJobs);

    echo json_encode([
        "status"     => true,
        "activities" => $allActivities,
        "summary"    => [
            "applications" => count($applications),
            "saved"        => count($savedJobs),
            "posted"       => count($postedJobs),
        ]
    ]);
} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode([
        "status"  => false,
        "message" => "Gagal memuat aktivitas: " . $e->getMessage()
    ]);
}