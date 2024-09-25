<?php
// Simular la aceptación de la solicitud del viaje y devolver la información del conductor
header('Content-Type: application/json');

// Recibir los datos del viaje (simulado)
$datosViaje = json_decode(file_get_contents('php://input'), true);

// Simular datos de un conductor que acepta el viaje
$datosConductor = [
    "nombreConductor" => "Carlos Rodríguez",
    "ubicacionConductor" => "Calle Flores 456"
];

// Devolver los datos del conductor al cliente
echo json_encode($datosConductor);
?>
