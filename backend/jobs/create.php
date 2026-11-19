<?php
require_once "../config/database.php";

$data = json_decode(file_get_contents("php://input"), true);

$id_user = $data["id_user"] ?? null;
$company = $data["company"] ?? [];
$job     = $data["job"] ?? [];

if (!$id_user || empty($company["companyName"]) || empty($job["jobTitle"])) {
    http_response_code(400);
    echo json_encode([
        "status" => false,
        "message" => "Data user, perusahaan, dan judul lowongan wajib diisi."
    ]);
    exit();
}

try {
    $conn->beginTransaction();

    // 1. Cari atau buat data INDUSTRY
    $industryName = trim($company["industry"] ?? "Technology");
    $stmtInd = $conn->prepare("SELECT ID_INDUSTRY FROM INDUSTRY WHERE LOWER(INDUSTRY_NAME) = LOWER(:name) LIMIT 1");
    $stmtInd->execute([":name" => $industryName]);
    $indRow = $stmtInd->fetch();

    if ($indRow) {
        $id_industry = $indRow["ID_INDUSTRY"];
    } else {
        $stmtNewInd = $conn->prepare("INSERT INTO INDUSTRY (INDUSTRY_NAME) VALUES (:name)");
        $stmtNewInd->execute([":name" => substr($industryName, 0, 25)]);
        $id_industry = $conn->lastInsertId();
    }

    // 2. Simpan file logo perusahaan jika ada (dari base64 data URL)
    $logoFileName = null;
    if (!empty($company["logo"]) && str_starts_with($company["logo"], "data:image/")) {
        if (preg_match('/^data:image\/(\w+);base64,/', $company["logo"], $matches)) {
            $ext = strtolower($matches[1]);
            if ($ext === "jpeg") $ext = "jpg";

            $base64Data = substr($company["logo"], strpos($company["logo"], ",") + 1);
            $decodedImage = base64_decode($base64Data);

            if ($decodedImage !== false) {
                $uploadDir = __DIR__ . "/../uploads/logos/";
                if (!is_dir($uploadDir)) {
                    mkdir($uploadDir, 0777, true);
                }
                $logoFileName = "company_" . $id_user . "_" . time() . "." . $ext;
                file_put_contents($uploadDir . $logoFileName, $decodedImage);
            }
        }
    }

    // 3. Cek apakah user sudah pernah mendaftarkan perusahaan dengan nama yang sama
    $companyName  = trim($company["companyName"]);
    $companyEmail = trim($company["businessEmail"] ?? "");
    $companyDesc  = trim($company["description"] ?? "");
    $website      = trim($company["website"] ?? "");

    $stmtComp = $conn->prepare("
        SELECT ID_COMPANY, LOGO
        FROM COMPANY
        WHERE ID_USER = :id_user AND LOWER(COMPANY_NAME) = LOWER(:name)
        LIMIT 1
    ");
    $stmtComp->execute([
        ":id_user" => $id_user,
        ":name"    => $companyName
    ]);
    $existingComp = $stmtComp->fetch();

    if ($existingComp) {
        $id_company = $existingComp["ID_COMPANY"];
        $finalLogo  = $logoFileName ?? $existingComp["LOGO"];

        $stmtUpdComp = $conn->prepare("
            UPDATE COMPANY
            SET ID_INDUSTRY = :id_ind,
                COMPANY_EMAIL = :email,
                COMPANY_DESC = :desc,
                WEBSITE = :web,
                LOGO = :logo
            WHERE ID_COMPANY = :id_comp
        ");
        $stmtUpdComp->execute([
            ":id_ind"  => $id_industry,
            ":email"   => $companyEmail,
            ":desc"    => $companyDesc,
            ":web"     => $website,
            ":logo"    => $finalLogo,
            ":id_comp" => $id_company
        ]);
    } else {
        $stmtInsComp = $conn->prepare("
            INSERT INTO COMPANY (ID_INDUSTRY, ID_USER, COMPANY_NAME, COMPANY_EMAIL, COMPANY_DESC, WEBSITE, LOGO)
            VALUES (:id_ind, :id_user, :name, :email, :desc, :web, :logo)
        ");
        $stmtInsComp->execute([
            ":id_ind"  => $id_industry,
            ":id_user" => $id_user,
            ":name"    => $companyName,
            ":email"   => $companyEmail,
            ":desc"    => $companyDesc,
            ":web"     => $website,
            ":logo"    => $logoFileName
        ]);
        $id_company = $conn->lastInsertId();
    }

    // 4. Simpan data NIB jika diisi
    $nibNumber = trim($company["nib"] ?? "");
    if ($nibNumber !== "") {
        $nibStatus = !empty($company["nibVerified"]) ? "Verified" : "Pending";
        $stmtCheckNib = $conn->prepare("SELECT ID_NIB FROM NIB WHERE ID_COMPANY = :id_comp LIMIT 1");
        $stmtCheckNib->execute([":id_comp" => $id_company]);

        if ($stmtCheckNib->fetch()) {
            $stmtNib = $conn->prepare("UPDATE NIB SET NIB_NUMBER = :nib, NIB_STATUS = :status WHERE ID_COMPANY = :id_comp");
        } else {
            $stmtNib = $conn->prepare("INSERT INTO NIB (ID_COMPANY, NIB_NUMBER, NIB_STATUS) VALUES (:id_comp, :nib, :status)");
        }
        $stmtNib->execute([
            ":id_comp" => $id_company,
            ":nib"     => substr($nibNumber, 0, 15),
            ":status"  => $nibStatus
        ]);
    }

    // 5. Simpan log verifikasi email perusahaan jika sudah verified
    if (!empty($company["emailVerified"])) {
        $stmtVer = $conn->prepare("
            INSERT INTO COMPANY_VERIFICATION (ID_COMPANY, OTP_CODE, VERIFIED_AT, VALID_UNTIL)
            VALUES (:id_comp, 'VERIFIED', NOW(), DATE_ADD(NOW(), INTERVAL 1 YEAR))
        ");
        $stmtVer->execute([":id_comp" => $id_company]);
    }

    // 6. Parsing rentang gaji (contoh: "8.000.000 - 10.000.000" -> min 8000000, max 10000000)
    $rawSalary = trim($job["salary"] ?? "");
    $salaryParts = preg_split('/[-–]|to/i', $rawSalary);
    $salaryMin = null;
    $salaryMax = null;

    if (!empty($salaryParts[0])) {
        $numMin = preg_replace('/\D/', '', $salaryParts[0]);
        $salaryMin = $numMin !== "" ? (int)$numMin : null;
    }
    if (!empty($salaryParts[1])) {
        $numMax = preg_replace('/\D/', '', $salaryParts[1]);
        $salaryMax = $numMax !== "" ? (int)$numMax : $salaryMin;
    } else {
        $salaryMax = $salaryMin;
    }

    // Deteksi work mode dari teks lokasi (opsional, default On-Site)
    $locationText = trim($job["location"] ?? "");
    $workMode = "On-Site";
    if (stripos($locationText, "remote") !== false) {
        $workMode = "Remote";
    } elseif (stripos($locationText, "hybrid") !== false) {
        $workMode = "Hybrid";
    }

    // 7. Simpan lowongan ke tabel JOB
    $stmtJob = $conn->prepare("
        INSERT INTO JOB (
            ID_COMPANY, JOB_TITLE, TYPE, WORK_MODE, LOCATION, JOB_STATUS,
            CURRENCY, SALARY_MIN, SALARY_MAX, SALARY_PERIOD,
            EXPERIENCE_LEVEL, DEADLINE, JOB_DESC, RESPONSIBILITIES
        ) VALUES (
            :id_comp, :title, :type, :mode, :loc, 'Open',
            :curr, :smin, :smax, :speriod,
            :exp, :deadline, :desc, :resp
        )
    ");
    $stmtJob->execute([
        ":id_comp"  => $id_company,
        ":title"    => trim($job["jobTitle"]),
        ":type"     => trim($job["jobType"] ?? "Full Time"),
        ":mode"     => $workMode,
        ":loc"      => $locationText,
        ":curr"     => trim($job["currency"] ?? "RP"),
        ":smin"     => $salaryMin,
        ":smax"     => $salaryMax,
        ":speriod"  => trim($job["salaryPeriod"] ?? "/Month"),
        ":exp"      => trim($job["experience"] ?? "1-3 Years"),
        ":deadline" => !empty($job["deadline"]) ? $job["deadline"] : null,
        ":desc"     => trim($job["description"] ?? ""),
        ":resp"     => trim($job["responsibilities"] ?? "")
    ]);
    $id_job = $conn->lastInsertId();

    // 8. Simpan required skills ke tabel SKILL dan JOB_SKILL
    $skills = $job["skills"] ?? [];
    if (is_array($skills)) {
        $stmtFindSkill   = $conn->prepare("SELECT ID_SKILL FROM SKILL WHERE LOWER(SKILL_NAME) = LOWER(:name) LIMIT 1");
        $stmtInsertSkill = $conn->prepare("INSERT INTO SKILL (SKILL_NAME) VALUES (:name)");
        $stmtLinkSkill   = $conn->prepare("INSERT INTO JOB_SKILL (ID_JOB, ID_SKILL) VALUES (:id_job, :id_skill)");

        foreach ($skills as $skillName) {
            $cleanSkill = trim($skillName);
            if ($cleanSkill === "") continue;

            $stmtFindSkill->execute([":name" => $cleanSkill]);
            $foundSkill = $stmtFindSkill->fetch();

            if ($foundSkill) {
                $id_skill = $foundSkill["ID_SKILL"];
            } else {
                $stmtInsertSkill->execute([":name" => substr($cleanSkill, 0, 25)]);
                $id_skill = $conn->lastInsertId();
            }

            $stmtLinkSkill->execute([
                ":id_job"   => $id_job,
                ":id_skill" => $id_skill
            ]);
        }
    }

    $conn->commit();

    echo json_encode([
        "status"     => true,
        "message"    => "Lowongan berhasil dipublikasikan!",
        "id_job"     => $id_job,
        "id_company" => $id_company
    ]);
} catch (Throwable $e) {
    if ($conn->inTransaction()) {
        $conn->rollBack();
    }
    http_response_code(500);
    echo json_encode([
        "status"  => false,
        "message" => "Gagal menyimpan lowongan: " . $e->getMessage()
    ]);
}