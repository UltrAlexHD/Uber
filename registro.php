<?php
// Configuración de la base de datos
$servername = "localhost"; 
$username = "root"; 
$password_db = "escuadron99"; 
$dbname = "registroub"; 

// Crear la conexión
$conn = new mysqli($servername, $username, $password_db, $dbname);

// Verificar conexión
if ($conn->connect_error) {
    die("Error en la conexión: " . $conn->connect_error);
}

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Obtener los datos del formulario
    $email = $_POST['email'];
    $password = password_hash($_POST['password'], PASSWORD_DEFAULT); // Encriptar contraseña
    $firstName = $_POST['first_name'];
    $lastName = $_POST['last_name'];
    $phone = $_POST['phone'];
    $cardNumber = $_POST['card_number'] ?? null;
    $emergencyContactName = $_POST['emergency_contact_name'] ?? null;
    $emergencyContactPhone = $_POST['emergency_contact_phone'] ?? null;
    $emergencyContactRelationship = $_POST['emergency_contact_relationship'] ?? null;
    $profilePic = null;

    // Manejo del archivo de foto de perfil
    if (isset($_FILES['profile_pic']) && $_FILES['profile_pic']['error'] == 0) {
        $targetDir = "uploads/";
        $profilePic = $targetDir . basename($_FILES["profile_pic"]["name"]);
        move_uploaded_file($_FILES["profile_pic"]["tmp_name"], $profilePic);
    }

    // Preparar la consulta SQL para insertar los datos
    $stmt = $conn->prepare("INSERT INTO usuarios (email, password, first_name, last_name, phone, card_number, profile_pic, emergency_contact_name, emergency_contact_phone, emergency_contact_relationship) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
    $stmt->bind_param("ssssssssss", $email, $password, $firstName, $lastName, $phone, $cardNumber, $profilePic, $emergencyContactName, $emergencyContactPhone, $emergencyContactRelationship);

    // Ejecutar la consulta
    if ($stmt->execute()) {
        // Si el registro es exitoso, redirigir a confirmacion.html
        header("Location: confirmacion.html");
        exit(); // Asegura que el script se detiene después de la redirección
    } else {
        echo "Error al registrar el usuario: " . $stmt->error;
    }

    // Cerrar la consulta y la conexión
    $stmt->close();
}

$conn->close();
?>
