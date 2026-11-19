<?php
require_once "../config/database.php";

$id_user =$_GET["id_user"] ?? null;

function formatPostedAgo($datetime) {
    if (empty($datetime)) return "Recently posted";
    $timestamp = strtotime($datetime);
    if (!$timestamp) return "Recently posted";

    $diff = time() -$timestamp;
    if ($diff < 60) return "Posted just now";
    if ($diff < 3600) {
        $mins = (int)floor($diff / 60);
        return "Posted " . $mins . ($mins === 1 ? " min ago" : " mins ago");
    }
    if ($diff < 86400) {
        $hours = (int)floor($diff / 3600);
        return "Posted " . $hours . ($hours === 1 ? " hour ago" : " hours ago");
    }
    $days = (int)floor($diff / 86400);
    if ($days < 7) {
        return "Posted " . $days . ($days === 1 ? " day ago" : " days ago");
    }
    $weeks = (int)floor($days / 7);
    return "Posted " . $weeks . ($weeks === 1 ? " week ago" : " weeks ago");
}

try {
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
            j.CREATED_AT,
            c.ID_COMPANY,
            c.ID_USER AS CREATOR_ID,
            c.COMPANY_NAME,
            c.LOGO,
            i.INDUSTRY_NAME,
            u.USERNAME AS POSTED_BY,
            (SELECT COUNT(*) FROM APPLICATION a WHERE a.ID_JOB = j.ID_JOB) AS APPLICANTS_COUNT
        FROM JOB j
        JOIN COMPANY c ON j.ID_COMPANY = c.ID_COMPANY
        JOIN USERS u ON c.ID_USER = u.ID_USER
        LEFT JOIN INDUSTRY i ON c.ID_INDUSTRY = i.ID_INDUSTRY
        WHERE LOWER(j.JOB_STATUS) IN ('open', 'posted', 'active')
    ";

    $params = [];
    if (!empty($id_user)) {
        // Hanya tampilkan lowongan yang dibuat oleh user lain
        $sql .= " AND c.ID_USER != :id_user";
        $params[":id_user"] = $id_user;
    }

    $sql .= " ORDER BY j.CREATED_AT DESC, j.ID_JOB DESC";

    $stmt = $conn->prepare($sql);
    $stmt->execute($params);
    $rows =$stmt->fetchAll();

    // Ambil skill user yang sedang login untuk rekomendasi
    $userSkills = [];
    if (!empty($id_user)) {
        $stmtUserSkill =$conn->prepare("
            SELECT LOWER(s.SKILL_NAME) AS SKILL_NAME
            FROM PROFILE_SKILL ps
            JOIN PROFILE p ON ps.ID_PROFILE = p.ID_PROFILE
            JOIN SKILL s ON ps.ID_SKILL = s.ID_SKILL
            WHERE p.ID_USER = :id_user
        ");
        $stmtUserSkill->execute([":id_user" => $id_user]);
        $userSkills = array_column($stmtUserSkill->fetchAll(), "SKILL_NAME");
    }

    $stmtSkills =$conn->prepare("
        SELECT s.SKILL_NAME
        FROM JOB_SKILL js
        JOIN SKILL s ON js.ID_SKILL = s.ID_SKILL
        WHERE js.ID_JOB = :id_job
    ");

    $jobs = array_map(function ($row) use ($stmtSkills,$userSkills) {
        $idJob = (int)$row["ID_JOB"];

        $stmtSkills->execute([":id_job" => $idJob]);
        $skills = array_column($stmtSkills->fetchAll(), "SKILL_NAME");

        // Hitung kecocokan skill dengan profil user
        $matchScore = 0;
        if (!empty($userSkills) && !empty($skills)) {
            foreach ($skills as$sk) {
                if (in_array(strtolower($sk), $userSkills, true)) {$matchScore++;
                }
            }
        }

        // Format gaji
        $currency  =$row["CURRENCY"] ?: "RP";
        $min       = $row["SALARY_MIN"] ? (int)$row["SALARY_MIN"] : 0;
        $max       = $row["SALARY_MAX"] ? (int)$row["SALARY_MAX"] : 0;
        $rawPeriod = trim($row["SALARY_PERIOD"] ?: "/Month");
        $period    = str_starts_with($rawPeriod, "/") ? $rawPeriod : "/" . $rawPeriod;

        if ($min > 0 && $max > 0 &&$min !== $max) {$salaryLabel = $currency . " " . number_format($min, 0, ",", ".") . " - " . number_format($max, 0, ",", ".") . " " . $period;
        } elseif ($min > 0) {
            $salaryLabel =$currency . " " . number_format($min, 0, ",", ".") . " " . $period;
        } else {
            $salaryLabel = "Negotiable";
        }

        $numericSalary =$max > 0 ? $max :$min;

        return [
            "id"          => $idJob,
            "title"       => $row["JOB_TITLE"],
            "company"     => $row["COMPANY_NAME"],
            "logo"        => $row["LOGO"] ?: null,
            "category"    => $row["INDUSTRY_NAME"] ?: "Other",
            "postedBy"    => $row["POSTED_BY"],
            "type"        => $row["WORK_MODE"] ?: "On-Site",
            "employment"  => $row["TYPE"] ?: "Full Time",
            "location"    => !empty($row["LOCATION"]) ? $row["LOCATION"] : ($row["WORK_MODE"] ?: "Indonesia"),
            "salary"      => $numericSalary,
            "salaryLabel" => $salaryLabel,
            "applicants"  => (int)$row["APPLICANTS_COUNT"],
            "status"      => "Active",
            "posted"      => formatPostedAgo($row["CREATED_AT"]),
            "experience"  => $row["EXPERIENCE_LEVEL"] ?: "Mid-Level",
            "skills"      => $skills,
            "matchScore"  => $matchScore,
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
        "message" => "Gagal memuat lowongan: " . $e->getMessage()
    ]);
}