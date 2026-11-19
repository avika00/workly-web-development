<?php
require_once "../config/database.php";

$data = json_decode(file_get_contents("php://input"), true);

$id_user = $data["id_user"] ?? null;
$skills  = $data["skills"] ?? [];

if (!$id_user || !is_array($skills)) {
    http_response_code(400);
    echo json_encode([
        "status" => false,
        "message" => "Data user atau skills tidak valid."
    ]);
    exit();
}

try {
    $conn->beginTransaction();

    // 1. Pastikan user punya ID_PROFILE
    $stmtCheck = $conn->prepare("SELECT ID_PROFILE FROM profile WHERE ID_USER = :id_user LIMIT 1");
    $stmtCheck->execute([":id_user" => $id_user]);
    $prof = $stmtCheck->fetch();

    if ($prof) {
        $id_profile = $prof["ID_PROFILE"];
    } else {
        $stmtCreate = $conn->prepare("INSERT INTO profile (ID_USER) VALUES (:id_user)");
        $stmtCreate->execute([":id_user" => $id_user]);
        $id_profile = $conn->lastInsertId();
    }

    // 2. Hapus relasi skill lama milik profil ini
    $stmtDel = $conn->prepare("DELETE FROM profile_skill WHERE ID_PROFILE = :id_profile");
    $stmtDel->execute([":id_profile" => $id_profile]);

    // 3. Simpan setiap skill ke tabel skill & profile_skill
    $stmtFindSkill   = $conn->prepare("SELECT ID_SKILL FROM skill WHERE LOWER(SKILL_NAME) = LOWER(:name) LIMIT 1");
    $stmtInsertSkill = $conn->prepare("INSERT INTO skill (SKILL_NAME) VALUES (:name)");
    $stmtLinkSkill   = $conn->prepare("INSERT INTO profile_skill (ID_PROFILE, ID_SKILL) VALUES (:id_profile, :id_skill)");

    foreach ($skills as $skillName) {
        $cleanName = trim($skillName);
        if ($cleanName === "") continue;

        $stmtFindSkill->execute([":name" => $cleanName]);
        $found = $stmtFindSkill->fetch();

        if ($found) {
            $id_skill = $found["ID_SKILL"];
        } else {
            $stmtInsertSkill->execute([":name" => $cleanName]);
            $id_skill = $conn->lastInsertId();
        }

        $stmtLinkSkill->execute([
            ":id_profile" => $id_profile,
            ":id_skill"   => $id_skill
        ]);
    }

    $conn->commit();

    echo json_encode([
        "status" => true,
        "message" => "Daftar skill berhasil disimpan!"
    ]);
} catch (Throwable $e) {
    if ($conn->inTransaction()) {
        $conn->rollBack();
    }
    http_response_code(500);
    echo json_encode([
        "status" => false,
        "message" => "Error database: " . $e->getMessage()
    ]);
}