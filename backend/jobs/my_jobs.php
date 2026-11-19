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
            c.COMPANY_NAME,
            c.LOGO,
            u.USERNAME AS POSTED_BY,
            (SELECT COUNT(*) FROM APPLICATION a WHERE a.ID_JOB = j.ID_JOB) AS APPLICANTS_COUNT
        FROM JOB j
        JOIN COMPANY c ON j.ID_COMPANY = c.ID_COMPANY
        JOIN USERS u ON c.ID_USER = u.ID_USER
        WHERE c.ID_USER = :id_user
        ORDER BY j.CREATED_AT DESC, j.ID_JOB DESC
    ");
    $stmt->execute([":id_user" => $id_user]);
    $rows = $stmt->fetchAll();

    $jobs = array_map(function ($row) {
        $rawStatus = strtolower(trim($row["JOB_STATUS"] ?? "open"));
        if (in_array($rawStatus, ["open", "posted", "active"])) {
            $uiStatus = "Active";
        } elseif ($rawStatus === "closed") {
            $uiStatus = "Closed";
        } elseif ($rawStatus === "draft") {
            $uiStatus = "Draft";
        } else {
            $uiStatus = ucfirst($rawStatus);
        }

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

        $place = !empty($row["LOCATION"]) ? $row["LOCATION"] : ($row["WORK_MODE"] ?: "On-Site");
        $typeText = $place . " · " . ($row["TYPE"] ?: "Full Time");

        return [
            "id"         => (int)$row["ID_JOB"],
            "logo"       => $row["LOGO"] ?: null,
            "title"      => $row["JOB_TITLE"],
            "company"    => $row["COMPANY_NAME"],
            "postedBy"   => $row["POSTED_BY"],
            "type"       => $typeText,
            "salary"     => $salaryText,
            "applicants" => (int)$row["APPLICANTS_COUNT"],
            "status"     => $uiStatus,
        ];
    }, $rows);

    echo json_encode([
        "status" => true,
        "jobs"   => $jobs
    ]);
} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode([
        "status"  => false,
        "message" => "Gagal memuat daftar lowongan: " . $e->getMessage()
    ]);
}