<?php
require_once "../config/database.php";

$id_user = $_GET["id_user"] ?? null;

if (!$id_user) {
    http_response_code(400);
    echo json_encode(["status" => false, "message" => "Parameter id_user diperlukan."]);
    exit();
}

$stmt = $conn->prepare("
    SELECT u.ID_USER, u.USERNAME, u.EMAIL,
           p.ID_PROFILE, p.FULLNAME, p.PHOTO, p.BIRTH, p.LATEST_EDU,
           p.UNIVERSITY, p.LOCATION, p.PHONE, p.ABOUT, p.EXPERIENCE
    FROM USERS u
    LEFT JOIN PROFILE p ON u.ID_USER = p.ID_USER
    WHERE u.ID_USER = :id_user
    LIMIT 1
");
$stmt->execute([":id_user" => $id_user]);
$user = $stmt->fetch();

if (!$user) {
    http_response_code(404);
    echo json_encode(["status" => false, "message" => "User tidak ditemukan."]);
    exit();
}

$skills = [];
if (!empty($user["ID_PROFILE"])) {
    $stmtSkill = $conn->prepare("
        SELECT s.SKILL_NAME
        FROM PROFILE_SKILL ps
        JOIN SKILL s ON ps.ID_SKILL = s.ID_SKILL
        WHERE ps.ID_PROFILE = :id_profile
    ");
    $stmtSkill->execute([":id_profile" => $user["ID_PROFILE"]]);
    $skills = array_column($stmtSkill->fetchAll(), "SKILL_NAME");
}

$stmtPort = $conn->prepare("
    SELECT ID_PORTOFOLIO AS id, PORTOFOLIO_TITLE AS title, LINK AS link
    FROM PORTOFOLIO
    WHERE ID_USER = :id_user
    ORDER BY ID_PORTOFOLIO ASC
");
$stmtPort->execute([":id_user" => $id_user]);
$portfolios = $stmtPort->fetchAll();

echo json_encode([
    "status" => true,
    "profile" => [
        "fullName"   => $user["FULLNAME"] ?? "",
        "photo"      => $user["PHOTO"] ?? "",
        "username"   => $user["USERNAME"] ?? "",
        "birth"      => $user["BIRTH"] ?? "",
        "education"  => $user["LATEST_EDU"] ?? "",
        "university" => $user["UNIVERSITY"] ?? "",
        "location"   => $user["LOCATION"] ?? "",
        "phone"      => $user["PHONE"] ?? "",
        "email"      => $user["EMAIL"] ?? "",
        "about"      => $user["ABOUT"] ?? "",
        "experience" => $user["EXPERIENCE"] ?? "",
    ],
    "skills"     => $skills,
    "portfolios" => $portfolios
]);