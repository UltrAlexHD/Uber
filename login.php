<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

header('Content-Type: application/json');

// Configuración de la base de datos
$servername = "localhost";
$username = "root";
$password_db = "escuadron99"; 
$dbname = "registroub"; 

// Crear la conexión
$conn = new mysqli($servername, $username, $password_db, $dbname);

// Verificar conexión
if ($conn->connect_error) {
    echo json_encode(['success' => false, 'message' => 'Error de conexión a la base de datos']);
    exit();
}

// Leer datos del POST
$data = json_decode(file_get_contents('php://input'), true);
if (!isset($data['email']) || !isset($data['password'])) {
    echo json_encode(['success' => false, 'message' => 'Datos incompletos']);
    exit();
}

$emailOrPhone = $data['email'];
$password = $data['password'];

// Verificar si es correo electrónico o número de teléfono
if (filter_var($emailOrPhone, FILTER_VALIDATE_EMAIL)) {
    $query = "SELECT * FROM usuarios WHERE email = ?";
} else {
    $query = "SELECT * FROM usuarios WHERE phone = ?";
}

// Preparar la consulta SQL y verificar si tuvo éxito
if ($stmt = $conn->prepare($query)) {
    $stmt->bind_param("s", $emailOrPhone);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        $user = $result->fetch_assoc();

        // Verificar la contraseña
        if (password_verify($password, $user['password'])) {
            // Usar 'first_name' en lugar de 'name'
            $userName = isset($user['first_name']) ? $user['first_name'] : 'Usuario';
            echo json_encode(['success' => true, 'message' => 'Inicio de sesión exitoso', 'name' => $userName]);
        } else {
            echo json_encode(['success' => false, 'message' => 'Contraseña incorrecta']);
        }
    } else {
        echo json_encode(['success' => false, 'message' => 'Usuario no encontrado']);
    }

    // Cerrar la consulta
    $stmt->close();
} else {
    echo json_encode(['success' => false, 'message' => 'Error en la consulta: ' . $conn->error]);
}

// Cerrar la conexión
$conn->close();
?>
