<?php
// Conexión a la base de datos
$servername = "localhost";  // Cambia esto si tu servidor no es local
$username = "root";         // Cambia esto si tu usuario no es root
$password = "escuadron99";             // Cambia esto si tu base de datos tiene una contraseña
$dbname = "registroub";      // Nombre de la base de datos que estás usando

$conn = new mysqli($servername, $username, $password, $dbname);

// Verificar la conexión
if ($conn->connect_error) {
    die(json_encode(['error' => 'Conexión fallida a la base de datos: ' . $conn->connect_error]));
}

// Verificar que se haya recibido el ID del viaje
if (!isset($_GET['tripId'])) {
    echo json_encode(['error' => 'No se proporcionó un ID de viaje.']);
    exit();
}

$tripId = $_GET['tripId'];

// Consulta para obtener la ubicación del conductor asociada al viaje
$sql = "SELECT driver.lat, driver.lng, trip.status
        FROM trips AS trip
        JOIN drivers AS driver ON trip.driver_id = driver.id
        WHERE trip.id = ?";

$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $tripId);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    $data = $result->fetch_assoc();
    // Devolver la ubicación del conductor y el estado del viaje
    echo json_encode([
        'driverAccepted' => $data['status'] === 'accepted',
        'lat' => $data['lat'],
        'lng' => $data['lng']
    ]);
} else {
    echo json_encode(['error' => 'No se encontró el viaje o el conductor.']);
}

// Cerrar la conexión
$stmt->close();
$conn->close();
?>
