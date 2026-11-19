<?php
require_once "../config/database.php";

$data = json_decode(file_get_contents("php://input"), true);

$id_user    = $data["id_user"] ?? null;
$fullName   = trim($data["fullName"] ?? "");
$username   = ltrim(trim($data["username"] ?? ""), "@");
$email      = trim($data["email"] ?? "");
$birth      = !empty($data["birth"]) ? $data["birth"] : null;
$education  = trim($data["education"] ?? "");
$university = trim($data["university"] ?? "");
$location   = trim($data["location"] ?? "");
$phone      = trim($data["phone"] ?? "");
$about      = trim($data["about"] ?? "");
$experience = trim($data["experience"] ?? "");

if (!$id_user || empty($username) || empty($email)) {
    http_response_code(400);
    echo json_encode(["status" => false, "message" => "ID user, username, dan email wajib diisi."]);
    exit();
}

try {
    $conn->beginTransaction();

    $stmtUser = $conn->prepare("
        UPDATE users 
        SET USERNAME = :username, EMAIL = :email 
        WHERE ID_USER = :id_user
    ");
    $stmtUser->execute([
        ":username" => $username,
        ":email"    => $email,
        ":id_user"  => $id_user
    ]);

    $stmtCheck = $conn->prepare("SELECT ID_PROFILE FROM profile WHERE ID_USER = :id_user LIMIT 1");
    $stmtCheck->execute([":id_user" => $id_user]);
    $existingProfile = $stmtCheck->fetch();

    if ($existingProfile) {
        $stmtProf = $conn->prepare("
            UPDATE profile 
            SET FULLNAME = :fullname, BIRTH = :birth, LATEST_EDU = :edu,
                UNIVERSITY = :univ, LOCATION = :loc, PHONE = :phone,
                ABOUT = :about, EXPERIENCE = :exp
            WHERE ID_USER = :id_user
        ");
    } else {
        $stmtProf = $conn->prepare("
            INSERT INTO profile (ID_USER, FULLNAME, BIRTH, LATEST_EDU, UNIVERSITY, LOCATION, PHONE, ABOUT, EXPERIENCE)
            VALUES (:id_user, :fullname, :birth, :edu, :univ, :loc, :phone, :about, :exp)
        ");
    }

    $stmtProf->execute([
        ":id_user"  => $id_user,
        ":fullname" => $fullName,
        ":birth"    => $birth,
        ":edu"      => $education,
        ":univ"     => $university,
        ":loc"      => $location,
        ":phone"    => $phone,
        ":about"    => $about,
        ":exp"      => $experience
    ]);

    $conn->commit();

    echo json_encode([
        "status" => true,
        "message" => "Profil berhasil diperbarui!",
        "cleanUsername" => $username
    ]);
} catch (Throwable $e) {
    if ($conn->inTransaction()) {
        $conn->rollBack();
    }
    http_response_code(400);
    if ($e->getCode() == 23000) {
        echo json_encode(["status" => false, "message" => "Username atau email sudah digunakan akun lain."]);
    } else {
        echo json_encode(["status" => false, "message" => "Gagal memperbarui profil: " . $e->getMessage()]);
    }
}