<?php
require_once "../config/database.php";

$id_job  =$_GET["id_job"] ?? null;
$id_user =$_GET["id_user"] ?? null;

if (!$id_job) {
    http_response_code(400);
    echo json_encode([
        "status" => false,
        "message" => "Parameter id_job diperlukan."
    ]);
    exit();
}

try {
    // 1. Ambil detail lowongan & perusahaan
    $sql = "
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
            c.COMPANY_DESC
        FROM JOB j
        JOIN COMPANY c ON j.ID_COMPANY = c.ID_COMPANY
        WHERE j.ID_JOB = :id_job
    ";

    $params = [":id_job" => $id_job];
    if (!empty($id_user)) {$sql .= " AND c.ID_USER = :id_user";
        $params[":id_user"] = $id_user;
    }
    $sql .= " LIMIT 1";

    $stmt = $conn->prepare($sql);
    $stmt->execute($params);
    $row =$stmt->fetch();

    if (!$row) {
        http_response_code(404);
        echo json_encode([
            "status" => false,
            "message" => "Lowongan tidak ditemukan atau bukan milik akun ini."
        ]);
        exit();
    }

    // 2. Ambil daftar skill lowongan
    $stmtSkills =$conn->prepare("
        SELECT s.SKILL_NAME
        FROM JOB_SKILL js
        JOIN SKILL s ON js.ID_SKILL = s.ID_SKILL
        WHERE js.ID_JOB = :id_job
    ");
    $stmtSkills->execute([":id_job" => $id_job]);
    $skills = array_column($stmtSkills->fetchAll(), "SKILL_NAME");

    // 3. Ambil daftar pelamar dari tabel APPLICATION
    $stmtApp =$conn->prepare("
        SELECT 
            a.ID_APPLICATION,
            a.ID_USER,
            a.APPLY_STATUS,
            a.APPLIED_AT,
            u.USERNAME,
            u.EMAIL,
            p.FULLNAME,
            p.PHOTO
        FROM APPLICATION a
        JOIN USERS u ON a.ID_USER = u.ID_USER
        LEFT JOIN PROFILE p ON u.ID_USER = p.ID_USER
        WHERE a.ID_JOB = :id_job
        ORDER BY a.APPLIED_AT DESC, a.ID_APPLICATION DESC
    ");
    $stmtApp->execute([":id_job" => $id_job]);
    $appRows =$stmtApp->fetchAll();

    $pendingCount  = 0;
    $acceptedCount = 0;
    $rejectedCount = 0;

    $applicants = array_map(function ($app) use (&$pendingCount, &$acceptedCount, &$rejectedCount) {
        $status = ucfirst(strtolower(trim($app["APPLY_STATUS"] ?? "Pending")));
        if ($status === "Accepted") {
            $acceptedCount++;
        } elseif ($status === "Rejected") {
            $rejectedCount++;
        } else {
            $status = "Pending";
            $pendingCount++;
        }

        $appliedDate = !empty($app["APPLIED_AT"])
            ? date("M d", strtotime($app["APPLIED_AT"]))
            : "-";

        return [
            "id"       => (int)$app["ID_APPLICATION"],
            "userId"   => (int)$app["ID_USER"],
            "name"     => !empty($app["FULLNAME"]) ? $app["FULLNAME"] : $app["USERNAME"],
            "username" => $app["USERNAME"],
            "email"    => $app["EMAIL"],
            "photo"    => $app["PHOTO"] ?: null,
            "applied"  => $appliedDate,
            "status"   => $status,
        ];
    }, $appRows);

    // Format status UI
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

    // Format gaji
    $currency =$row["CURRENCY"] ?: "RP";
    $min      =$row["SALARY_MIN"];
    $max      =$row["SALARY_MAX"];
    $period   =$row["SALARY_PERIOD"] ?: "/Month";

    if ($min && $max &&$min != $max) {$salaryText = $currency . " " . number_format($min, 0, ",", ".") . " - " . number_format($max, 0, ",", ".") . " " . $period;
    } elseif ($min) {
        $salaryText =$currency . " " . number_format($min, 0, ",", ".") . " " . $period;
    } else {
        $salaryText = "Negotiable";
    }

    // Pisahkan responsibilities per baris
    $respRaw = trim($row["RESPONSIBILITIES"] ?? "");
    $responsibilities =$respRaw !== ""
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
            "status"           => $uiStatus,
            "location"         => !empty($row["LOCATION"]) ? $row["LOCATION"] : ($row["WORK_MODE"] ?: "Remote"),
            "type"             => $row["TYPE"] ?: "Full Time",
            "salary"           => $salaryText,
            "description"      => !empty($row["JOB_DESC"]) ? $row["JOB_DESC"] : ($row["COMPANY_DESC"] ?: "No job description provided."),
            "responsibilities" => $responsibilities,
            "skills"           => $skills,
            "experience"       => $row["EXPERIENCE_LEVEL"] ?: "Not specified",
            "deadline"         => $row["DEADLINE"],
        ],
        "statistics" => [
            "applications" => count($applicants),
            "pending"      => $pendingCount,
            "accepted"     => $acceptedCount,
            "rejected"     => $rejectedCount,
        ],
        "applicants" => $applicants
    ]);
} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode([
        "status"  => false,
        "message" => "Gagal memuat detail lowongan: " . $e->getMessage()
    ]);
}